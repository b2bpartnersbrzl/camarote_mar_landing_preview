const REQUIRED_PROPERTIES = [
  "MAILCHIMP_API_KEY",
  "MAILCHIMP_SERVER_PREFIX",
  "MAILCHIMP_LIST_ID",
  "SHEET_ID",
  "DOUBLE_OPT_IN"
];

const TAG_NAME = "Camarote Mar 2027 - SAPUCAÍ";

function doPost(e) {
  var payload = {};
  var response = {
    ok: false,
    status: "error",
    user_message: "Não foi possível concluir o envio agora. Tente novamente em instantes."
  };

  try {
    payload = parsePayload_(e);
    payload.email = normalizeEmail_(payload.email);
    payload.nome = cleanText_(payload.nome);
    payload.tag = TAG_NAME;

    var validationError = validatePayload_(payload);
    if (validationError) {
      response = {
        ok: false,
        status: "validation_error",
        user_message: validationError
      };
      appendLog_("warn", "validacao", payload.email, validationError, "", summarizePayload_(payload));
      appendSubmission_(payload, "not_sent", "validation_error", response.status, response.user_message);
      return json_(response);
    }

    var mailchimpResult = upsertMailchimpContact_(payload);
    response = buildSuccessResponse_(mailchimpResult.action);

    appendSubmission_(
      payload,
      mailchimpResult.mailchimp_status,
      mailchimpResult.action,
      response.status,
      response.user_message
    );

    return json_(response);
  } catch (error) {
    var detail = safeError_(error);
    appendLog_("error", "inesperado", payload.email || "", "Erro inesperado", detail, summarizePayload_(payload));

    try {
      appendSubmission_(payload, "error", "error", "error", response.user_message);
    } catch (sheetError) {
      appendLog_("error", "planilha", payload.email || "", "Falha ao registrar envio", safeError_(sheetError), summarizePayload_(payload));
    }

    return json_(response);
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("POST vazio");
  }

  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  if (!payload.nome || payload.nome.length < 3) {
    return "Informe seu nome completo.";
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Informe um e-mail válido.";
  }

  return "";
}

function upsertMailchimpContact_(payload) {
  var props = getConfig_();
  var listId = props.MAILCHIMP_LIST_ID;
  var server = props.MAILCHIMP_SERVER_PREFIX;
  var apiKey = props.MAILCHIMP_API_KEY;
  var doubleOptIn = String(props.DOUBLE_OPT_IN).toLowerCase() === "true";
  var emailHash = md5_(payload.email);
  var baseUrl = "https://" + server + ".api.mailchimp.com/3.0/lists/" + encodeURIComponent(listId);
  var memberUrl = baseUrl + "/members/" + emailHash;
  var existing = getMailchimpMember_(memberUrl, apiKey);
  var action = existing.exists ? "updated" : "created";
  var status = existing.exists ? existing.status : (doubleOptIn ? "pending" : "subscribed");
  var memberPayload = {
    email_address: payload.email,
    status_if_new: doubleOptIn ? "pending" : "subscribed",
    merge_fields: buildMergeFields_(payload)
  };

  if (existing.exists && status) {
    memberPayload.status = status;
  }

  var updateResponse = mailchimpRequest_(memberUrl, apiKey, "put", memberPayload);
  if (updateResponse.code < 200 || updateResponse.code >= 300) {
    appendLog_("error", "mailchimp", payload.email, "Falha ao criar/atualizar contato", updateResponse.body, summarizePayload_(payload));
    throw new Error("mailchimp_upsert_error");
  }

  var tagResponse = mailchimpRequest_(memberUrl + "/tags", apiKey, "post", {
    tags: [
      {
        name: TAG_NAME,
        status: "active"
      }
    ]
  });

  if (tagResponse.code < 200 || tagResponse.code >= 300) {
    appendLog_("error", "mailchimp", payload.email, "Falha ao aplicar tag", tagResponse.body, summarizePayload_(payload));
    throw new Error("mailchimp_tag_error");
  }

  return {
    action: action,
    mailchimp_status: status
  };
}

function getMailchimpMember_(memberUrl, apiKey) {
  var response = UrlFetchApp.fetch(memberUrl, {
    method: "get",
    muteHttpExceptions: true,
    headers: {
      Authorization: "apikey " + apiKey
    }
  });

  var code = response.getResponseCode();
  if (code === 404) {
    return {
      exists: false,
      status: ""
    };
  }

  if (code >= 200 && code < 300) {
    var body = JSON.parse(response.getContentText() || "{}");
    return {
      exists: true,
      status: body.status || "subscribed"
    };
  }

  throw new Error("mailchimp_lookup_error: " + response.getContentText());
}

function mailchimpRequest_(url, apiKey, method, payload) {
  var response = UrlFetchApp.fetch(url, {
    method: method,
    muteHttpExceptions: true,
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {
      Authorization: "apikey " + apiKey
    }
  });

  return {
    code: response.getResponseCode(),
    body: response.getContentText()
  };
}

function buildMergeFields_(payload) {
  var nameParts = String(payload.nome || "").trim().split(/\s+/);
  var firstName = nameParts.shift() || "";
  var lastName = nameParts.join(" ");
  var fields = {
    FNAME: firstName,
    LNAME: lastName,
    PHONE: cleanText_(payload.telefone)
  };

  return fields;
}

function buildSuccessResponse_(action) {
  if (action === "created") {
    return {
      ok: true,
      status: "created",
      user_message: "Cadastro recebido. Verifique seu e-mail para confirmar sua inscrição."
    };
  }

  if (action === "updated") {
    return {
      ok: true,
      status: "updated",
      user_message: "Cadastro recebido. Caso este e-mail já esteja em nossa base, seus dados foram atualizados."
    };
  }

  return {
    ok: true,
    status: "received",
    user_message: "Cadastro recebido. Aguarde as próximas comunicações do Camarote Mar."
  };
}

function appendSubmission_(payload, mailchimpStatus, mailchimpAction, responseStatus, userMessage) {
  var sheet = getSheet_("envios", [
    "timestamp",
    "nome",
    "email",
    "telefone",
    "data_nascimento",
    "sexo",
    "cep",
    "endereco",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "uf",
    "consentimento",
    "origem",
    "formulario",
    "tag",
    "mailchimp_status",
    "mailchimp_action",
    "response_status",
    "user_message"
  ]);

  sheet.appendRow([
    new Date(),
    cleanText_(payload.nome),
    normalizeEmail_(payload.email),
    cleanText_(payload.telefone),
    cleanText_(payload.data_nascimento),
    cleanText_(payload.sexo),
    cleanText_(payload.cep),
    cleanText_(payload.endereco),
    cleanText_(payload.numero),
    cleanText_(payload.complemento),
    cleanText_(payload.bairro),
    cleanText_(payload.cidade),
    cleanText_(payload.uf),
    payload.consentimento === true,
    cleanText_(payload.origem),
    cleanText_(payload.formulario),
    TAG_NAME,
    mailchimpStatus,
    mailchimpAction,
    responseStatus,
    userMessage
  ]);
}

function appendLog_(level, etapa, email, erro, detalhe, payloadResumido) {
  try {
    var sheet = getSheet_("logs", [
      "timestamp",
      "level",
      "etapa",
      "email",
      "erro",
      "detalhe",
      "payload_resumido"
    ]);

    sheet.appendRow([
      new Date(),
      level,
      etapa,
      normalizeEmail_(email),
      erro,
      detalhe,
      payloadResumido
    ]);
  } catch (error) {
    console.error("Falha ao gravar log", error);
  }
}

function getSheet_(name, headers) {
  var sheetId = getConfig_().SHEET_ID;
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  return sheet;
}

function getConfig_() {
  var properties = PropertiesService.getScriptProperties();
  var config = {};
  var missing = [];

  REQUIRED_PROPERTIES.forEach(function (key) {
    var value = properties.getProperty(key);
    if (value === null || value === "") {
      missing.push(key);
    }
    config[key] = value;
  });

  if (missing.length) {
    throw new Error("Propriedades ausentes: " + missing.join(", "));
  }

  return config;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeEmail_(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanText_(value) {
  return String(value || "").trim();
}

function summarizePayload_(payload) {
  return JSON.stringify({
    nome: cleanText_(payload.nome),
    email: normalizeEmail_(payload.email),
    origem: cleanText_(payload.origem),
    formulario: cleanText_(payload.formulario),
    tag: TAG_NAME
  });
}

function safeError_(error) {
  if (!error) {
    return "";
  }

  return String(error.stack || error.message || error);
}

function md5_(value) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, value, Utilities.Charset.UTF_8);
  return bytes.map(function (byte) {
    var normalized = byte < 0 ? byte + 256 : byte;
    return ("0" + normalized.toString(16)).slice(-2);
  }).join("");
}
