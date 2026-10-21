/* Spanish presentation only. The existing Brasil/Exterior registration contract is unchanged. */
(() => {
 'use strict';
 const phrases={
 'PERGUNTAS FREQUENTES':'PREGUNTAS FRECUENTES','FREQUENTLY ASKED QUESTIONS':'PREGUNTAS FRECUENTES','FREQUENTLY ASKED':'PREGUNTAS','QUESTIONS':'FRECUENTES','O VERDADEIRO CAMAROTE':'EL VERDADERO CAMAROTE','SINCE 2020':'DESDE 2020',
 'CARNIVAL 2027':'CARNAVAL 2027','February 5, 6, 7, 8, 9 and 13':'5, 6, 7, 8, 9 y 13 de febrero','5, 6, 7, 8, 9, e 13 de fevereiro':'5, 6, 7, 8, 9 y 13 de febrero',
 'LINEUP COMPLETO':'PROGRAMACIÓN COMPLETA','FRIDAY':'VIERNES','SATURDAY':'SÁBADO','SUNDAY':'DOMINGO','MONDAY':'LUNES','TUESDAY':'MARTES',"CHAMPIONS' SATURDAY":'SÁBADO DE CAMPEONAS',
 'SEXTA':'VIERNES','SEXTA-FEIRA':'VIERNES','SEGUNDA':'LUNES','SEGUNDA-FEIRA':'LUNES','TERÇA':'MARTES','TERÇA-FEIRA':'MARTES','SÁBADO DAS CAMPEÃS':'SÁBADO DE CAMPEONAS',
 'PARADE ORDER':'ORDEN DE LOS DESFILES','PARADE LINEUP':'ORDEN DE LOS DESFILES','ORDEM DOS DESFILES':'ORDEN DE LOS DESFILES','BUY TICKETS':'COMPRAR ENTRADAS','COMPRAR INGRESSO':'COMPRAR ENTRADAS','COMPRAR INGRESSOS 2027':'COMPRAR ENTRADAS 2027',
 'From the very first moment to':'Desde el primer momento hasta','the last, MAR is an experience':'el último, MAR es una experiencia','meant to be lived to the fullest.':'para vivirla por completo.',
 'Because the best Carnival is the one you dream of, look':'Porque el mejor Carnaval es el que sueñas, esperas','forward to and finally experience. It begins the moment you':'y por fin vives. Comienza en el momento en que','choose to experience something extraordinary.':'eliges vivir algo extraordinario.',
 'At the Sambadrome, location is part of the experience.':'En Sapucaí, la ubicación es parte de la experiencia.',
 'THE PARADE COMES TO MAR.':'¡LA AVENIDA DESFILA PARA MAR!','THE PARADE COMES':'LA AVENIDA DESFILA','TO MAR.':'PARA MAR.',
 'Located in Sector 6, right beside the judges,':'En el Sector 6, junto a los jueces,','MAR sits at the heart of the Sambadrome, where':'MAR está en el corazón de Sapucaí, donde','every samba school parades right before you.':'todas las escuelas desfilan delante de ti.',
 'A prime location, with safe and convenient arrival':'Una ubicación privilegiada, con llegada segura','near the Sambadrome, an expansive front-row':'cerca del Sambódromo, una amplia zona de primera','viewing area and the largest balcony overlooking':'fila y el mayor balcón con vistas','the parade.':'al desfile.',
 'WANT TO BE AMONG THE FIRST TO BUY':'¿QUIERES ESTAR ENTRE LOS PRIMEROS EN COMPRAR',"AND STAY UPDATED ON WHAT'S NEW?":'Y ENTERARTE DE TODAS LAS NOVEDADES?','SIGN UP':'REGÍSTRATE',
 'SÉRIE OURO':'SERIE ORO','GRUPO ESPECIAL':'GRUPO ESPECIAL','FEV DE 2027':'FEB DE 2027','8, 9 E 13':'8, 9 Y 13',
 'A MAIOR VARANDA DA SAPUCAÍ':'EL MAYOR BALCÓN DE SAPUCAÍ','NO SETOR DOS JURADOS':'EN EL SECTOR DE LOS JUECES','ESPAÇO BEAUTY':'ESPACIO BEAUTY','SHOWS A NOITE TODA':'SHOWS TODA LA NOCHE','TRANSFER EXCLUSIVO':'TRASLADO EXCLUSIVO'
 };
 ['05','06','07','08','09','13'].forEach(day=>phrases[day+' FEV']=day+' FEB');
 const faq=[
 ['¿Qué es CAMAROTE MAR?','CAMAROTE MAR es una experiencia premium de Carnaval en el Sambódromo. Con más de 3.500 m², ofrece servicio todo incluido, climatización completa, una acústica excelente y el mayor balcón de la Avenida, con una vista privilegiada de los desfiles de las escuelas de samba, junto a los jueces. Más que un camarote, MAR reúne comodidad, emoción y autenticidad, donde el corazón de Río late al ritmo de la samba.'],
 ['¿Qué incluye la entrada?','Tu entrada te da acceso a CAMAROTE MAR en la fecha elegida al comprar. También disfrutarás de barra libre premium y buffet libre con una excelente selección gastronómica, además de shows en vivo, espacio beauty, experiencias exclusivas, espacios para fotografiar y servicio de traslado, todo pensado para que tu noche sea inolvidable.'],
 ['¿Habrá barra libre y buffet libre?','Sí. Todos los días en CAMAROTE MAR incluyen un buffet completo sin límite de consumo y barra libre de manera continua.'],
 ['¿Dónde está el Meeting Point y cómo funciona el traslado?','El Meeting Point oficial de CAMAROTE MAR está en Othon Palace Copacabana Rio, ubicado en Avenida Atlântica, 3264, Copacabana, Río de Janeiro. Allí también se realiza el embarque del traslado oficial. Los horarios se anunciarán con antelación a través de nuestros canales oficiales.'],
 ['¿Cómo puedo comprar una entrada?','Las entradas se venden exclusivamente en línea a través del sitio de Ticketmaster.'],
 ['¿Qué medios de pago se aceptan?','Tarjeta de crédito y PIX.'],
 ['¿Puedo cambiar o cancelar mi entrada?','Puedes cancelar una compra en línea dentro del plazo legal de siete días corridos después de la compra. No se permiten cancelaciones después de ese plazo. Las entradas no se pueden cambiar después de la compra.'],
 ['¿Se puede realizar la acreditación anticipadamente?','Sí. La acreditación anticipada se realizará en un lugar y fecha que se anunciarán próximamente. También puedes acreditarte en el meeting point el día del evento.'],
 ['¿CAMAROTE MAR es accesible?','Sí. Las instalaciones de CAMAROTE MAR son accesibles para personas con movilidad reducida.'],
 ['¿Puedo hacer fotos y vídeos?','Sí. Animamos a los asistentes a registrar y compartir su experiencia en las redes sociales. No se permiten equipos profesionales de fotografía y filmación.'],
 ['¿La entrada es digital?','Sí. La entrada es digital y tiene un código QR. Como medida de seguridad para grandes eventos, tu entrada digital estará disponible más cerca de la fecha del evento. Después de la compra, recibirás un correo con la información necesaria para acceder a ella.'],
 ['¿Cuál es el horario de CAMAROTE MAR?','LIESA determina los horarios de apertura y cierre, pero garantizamos que nuestro show continuará hasta la última samba.'],
 ['¿Cuál es la edad mínima para entrar?','La edad mínima es de 18 años. Es obligatorio presentar un documento con foto durante la acreditación y al entrar. Está prohibida la venta de entradas y el acceso a menores de edad, aunque estén emancipados o acompañados por sus padres o tutores.'],
 ['¿Cómo puedo contactar con el equipo de CAMAROTE MAR?','Nuestros canales oficiales de atención están disponibles por WhatsApp, correo electrónico y redes sociales. Encontrarás la información de contacto al pie de la página.'],
 ['¿Hay un lugar para guardar disfraces, mochilas y bolsos?','CAMAROTE MAR ofrecerá guardarropa para objetos personales de hasta 20 cm × 20 cm. No habrá espacio para disfraces ni objetos más grandes. Para estos artículos, el Sambódromo dispone de un área específica para guardar disfraces.'],
 ['¿Cuántas entradas de CAMAROTE MAR puedo comprar?','Puedes comprar hasta cuatro entradas por CPF.'],
 ['¿Puedo cambiar mi entrada por otro día?','No. La fecha del evento no se puede cambiar después de comprar la entrada.'],
 ['¿Puedo transferir una entrada de CAMAROTE MAR a otra persona o recibir la de alguien más?','Sí. Cada entrada se puede transferir una vez. La transferencia no se puede deshacer, a menos que el destinatario devuelva la entrada.'],
 ['Compré varias entradas para mí y mis amigos. ¿Cómo funciona la acreditación?','Lo ideal es que cada asistente conserve su entrada en su propia billetera de Quentro. Si todas las entradas están en una sola billetera, el grupo debe permanecer junto en todas las etapas, desde la acreditación hasta la entrada al Sambódromo y a CAMAROTE MAR. Cada entrada debe contener los datos personales y el registro facial de quien la utilizará.'],
 ['¿Qué necesito llevar para acreditarme?','Lleva un documento oficial original con foto y una entrada válida en la aplicación Quentro. El único documento de identificación digital aceptado es la licencia de conducir digital brasileña (CNH).'],
 ['¿Puedo recoger la entrada un día y personalizar mi camiseta otro?','No. No se puede recoger la entrada un día y personalizar la camiseta en otra fecha. Después de recoger la camiseta, CAMAROTE MAR no se responsabiliza por pérdidas ni cambios.'],
 ['¿Puedo comprar la entrada en el meeting point?','No se venderán entradas en el meeting point. Las entradas se venden exclusivamente en línea a través del sitio de Ticketmaster.'],
 ['¿Es obligatorio llevar la camiseta oficial?','Sí. Junto al reconocimiento facial y una entrada válida en Quentro, la camiseta oficial es uno de los controles de acceso. Cualquier modificación no autorizada o elemento añadido a la camiseta puede impedir la entrada.'],
 ['¿Qué necesito presentar para usar el traslado?','El traslado es gratuito y exclusivo para asistentes con una entrada válida para ese día. Para utilizarlo, debes llevar la camiseta oficial del día y completar el reconocimiento facial. El traslado deja a los pasajeros cerca del Sambódromo, donde está CAMAROTE MAR. Nuestro equipo estará disponible para orientar a los asistentes y facilitar su experiencia desde la llegada.']
 ];
 function translateArt(){
  document.querySelectorAll('svg[data-text-art] text[aria-label]').forEach(text=>{
   const old=text.getAttribute('aria-label'),translation=phrases[old];if(!translation)return;
   const spans=Array.from(text.querySelectorAll('tspan'));if(!spans.length)return;
   const first=spans[0],font=Number(first.getAttribute('font-size'))||20;
   let left=Infinity,right=-Infinity;
   spans.forEach(s=>{const xs=(s.getAttribute('x')||'0').trim().split(/[ ,]+/).map(Number);const size=Number(s.getAttribute('font-size'))||font;left=Math.min(left,...xs);right=Math.max(right,...xs.map(x=>x+size*.65));if(s.hasAttribute('textLength'))right=Math.max(right,xs[0]+Number(s.getAttribute('textLength')))});
   let width=right-left;try{const box=text.getBBox();if(box.width>0){left=box.x;width=box.width}}catch{}
   const t=document.createElementNS('http://www.w3.org/2000/svg','tspan');
   for(const attr of ['fill','stroke','font-family','font-weight','font-style','style'])if(first.hasAttribute(attr))t.setAttribute(attr,first.getAttribute(attr));
   t.setAttribute('x',String(left));t.setAttribute('y',(first.getAttribute('y')||'0').split(/[ ,]+/)[0]);t.setAttribute('font-size',String(font*Math.min(1,old.length/translation.length*1.2)));t.setAttribute('class',first.getAttribute('class')||'web-Regular');
   translation.split(/(CAMAROTE MAR|\bMAR\b)/g).forEach(part=>{if(/^(CAMAROTE MAR|MAR)$/.test(part)){const brand=document.createElementNS('http://www.w3.org/2000/svg','tspan');brand.setAttribute('class',(first.getAttribute('class')||'').includes('Italic')?'web-BoldItalic':'web-Bold');brand.textContent=part;t.append(brand)}else t.append(document.createTextNode(part))});
   text.replaceChildren(t);text.setAttribute('aria-label',translation);if(width>0){text.setAttribute('textLength',String(width));text.setAttribute('lengthAdjust','spacingAndGlyphs')}
  });
 }
 function setText(selector,value){const el=document.querySelector(selector);if(el)el.textContent=value}
 function emphasizeSpanishBrand(root){
  const nodes=[],walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const node=walker.currentNode;
   if(/\bMAR\b/.test(node.nodeValue)&&!node.parentElement.closest('script,style,textarea,select,svg,.brand-name'))nodes.push(node);
  }
  nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.nodeValue.split(/(CAMAROTE MAR|\bMAR\b)/g).forEach(part=>{if(/^(CAMAROTE MAR|MAR)$/.test(part)){const strong=document.createElement('strong');strong.className='brand-name';strong.textContent=part;fragment.append(strong)}else fragment.append(document.createTextNode(part))});node.replaceWith(fragment)});
 }
 // Apenas os dicionários de apresentação: validações, valores e envio seguem o contrato original.
 const spanishForm=document.getElementById('lead-form');
 if(spanishForm){
  residenceCopy.exterior={
   ...residenceCopy.exterior,
   residenceLegend:'¿Dónde vives?',steps:['Datos','Contacto','Dirección'],stepTitles:['Tus datos','Contacto','Dirección'],
   labels:{nome:'Nombre completo',data_nascimento:'Fecha de nacimiento',sexo:'Sexo',email:'Correo electrónico',telefone:'Teléfono',pais:'País',cep:'Código postal',endereco:'Dirección',numero:'Número',complemento:'Complemento',bairro:'Barrio / Distrito',cidade:'Ciudad',uf:'Estado / Provincia / Región',optional:'Opcional'},
   genderOptions:['Selecciona','Femenino','Masculino','Prefiero no informar'],
   buttons:{back:'Volver',next:'Continuar',submit:'Enviar'},buttonStates:{sending:'Enviando',validating:'Validando',sent:'Enviado',error:'Error'},
   consentBefore:'Autorizo el uso de mis datos para recibir comunicaciones oficiales de CAMAROTE MAR y acepto la ',privacyPolicy:'Política de Privacidad',consentAfter:'.',
   privacy:'Utilizamos tus datos únicamente para la comunicación oficial de CAMAROTE MAR.',
   heading:['¡Regístrate para la','preventa de 2027!'],subheading:'Acceso anticipado a la preventa, novedades oficiales y descuentos de CAMAROTE MAR en Sapucaí.',
   placeholders:{date:'dd/mm/aaaa',phone:'Ej.: +1 212 555 0100',postalCode:'Ej.: SW1A 1AA',region:'Estado, provincia o región'},hints:{number:'',district:''},
   validation:{fieldFallback:'campo',required:field=>`Completa el campo ${field}.`,consent:'Acepta la Política de Privacidad para continuar.',birthDate:'Introduce una fecha de nacimiento válida en formato dd/mm/aaaa.',email:'Introduce un correo electrónico válido.',internationalPhone:'Introduce un teléfono internacional válido.',internationalPostalCode:'Introduce un código postal válido.',internationalRegion:'Introduce un estado, provincia o región válido.'},
   status:{sending:'Enviando registro...',success:'Enviado correctamente.',pending:'Registro enviado. Esperando la confirmación del estado.',failure:'No se pudo completar el envío. Inténtalo de nuevo en unos instantes.'}
  };
  consentV2Copy.exterior={privacyPrefix:'He leído y acepto la ',privacyLink:'Política de Privacidad',privacySuffix:' (obligatorio).',email:'Quiero recibir comunicaciones oficiales por correo electrónico.',whatsapp:'QUIERO RECIBIR POR WHATSAPP AVISOS IMPORTANTES Y NOVEDADES DE PRIMERA MANO.',whatsappHelper:'Es el canal más rápido para recibir información oficial de CAMAROTE MAR. Puedes darte de baja cuando quieras.',privacyRequired:'Acepta la Política de Privacidad para continuar.'};
  const applySpanishFormPresentation=()=>{
   // El adaptador de marca puede haber dividido los nodos que lee el formulario original.
   spanishForm.querySelectorAll('.brand-name').forEach(el=>{const parent=el.parentNode;el.replaceWith(document.createTextNode(el.textContent));parent.normalize()});
   updateResidenceCopy();
   spanishForm.querySelector('.form-steps')?.setAttribute('aria-label','Etapas del registro');
   spanishForm.querySelector('.form-nav')?.setAttribute('aria-label','Navegación del formulario');
   spanishForm.querySelector('[data-consent-v2-policy-link]')?.setAttribute('href','/camarote_mar_landing_preview/es/politica-de-privacidade.html');
   spanishForm.querySelectorAll('[data-address-optional]').forEach(el=>el.textContent=' (Opcional)');
   emphasizeSpanishBrand(spanishForm);
  };
  applySpanishFormPresentation();
  spanishForm.addEventListener('reset',()=>setTimeout(applySpanishFormPresentation,0));
 }
 document.documentElement.lang='es';
 setText('.footer__label','Organización');setText('.faq-preview__intro','¿Todo listo para vivir CAMAROTE MAR?');setText('.faq-preview__link','VER TODAS LAS PREGUNTAS');
 document.querySelectorAll('.faq-preview details,.faq__list details').forEach((item,i)=>{const index=item.closest('.faq-preview')?Number(item.dataset.faqIndex):i;const copy=faq[index];if(!copy)return;item.querySelector('summary').textContent=copy[0];item.querySelector('p').textContent=copy[1]});
 document.querySelectorAll('.faq-preview__intro,.faq-preview details p,.faq-preview details summary,.faq__list details p,.faq__list details summary').forEach(el=>{const value=el.textContent;el.replaceChildren();value.split(/(CAMAROTE MAR|\bMAR\b)/g).forEach(part=>{if(/^(CAMAROTE MAR|MAR)$/.test(part)){const brand=document.createElement('strong');brand.className='brand-name';brand.textContent=part;el.append(brand)}else el.append(document.createTextNode(part))})});
 document.querySelectorAll('.faq__heading').forEach(el=>{el.alt='Preguntas frecuentes'});
 document.querySelector('[data-desktop-section-nav]')?.setAttribute('aria-label','Navegación entre secciones');
 document.querySelector('[data-section-nav-up]')?.setAttribute('aria-label','Ir a la sección anterior');document.querySelector('[data-section-nav-down]')?.setAttribute('aria-label','Ir a la siguiente sección');
 document.querySelector('.social')?.setAttribute('aria-label','Redes sociales');
 document.querySelector('.social a[href^="mailto:"]')?.setAttribute('aria-label','Correo electrónico');
 document.querySelector('.social a[href$="faq.html"]')?.setAttribute('aria-label','Preguntas frecuentes');
 const spanishLabels={'#pos-video':'Balcón de CAMAROTE MAR','.post-video-section__cta':'Comprar entradas para CAMAROTE MAR 2027','#social':'CAMAROTE MAR en las redes sociales','#cadastro':'Registro para la preventa de CAMAROTE MAR 2027','.parade-grid':'Días de desfile','.popup-confirmation':'Confirmación del registro','.dialog-close-button':'Cerrar','.faq__list':'Preguntas frecuentes','[data-lineup-mobile-carousel]':'Programación por día'};
 Object.entries(spanishLabels).forEach(([selector,label])=>document.querySelectorAll(selector).forEach(el=>el.setAttribute('aria-label',label)));
 const spanishAlts={'.after-othon-section__map':'Mapa 3D de CAMAROTE MAR','.post-video-section__varanda-image':'Balcón de CAMAROTE MAR','.post-video-section__carnaval-image':'Carnaval desde el balcón de CAMAROTE MAR','.section-heading__art':'Regístrate para la preventa de CAMAROTE MAR 2027','.parade-order-mark':'Orden de los desfiles'};
 Object.entries(spanishAlts).forEach(([selector,label])=>document.querySelectorAll(selector).forEach(el=>el.setAttribute('alt',label)));
 const confirmationImage=document.querySelector('.popup-confirmation img[data-created-src-en]');
 if(confirmationImage){
  const describeConfirmation=()=>{
   const updated=confirmationImage.getAttribute('src')===confirmationImage.dataset.updatedSrcEn;
   confirmationImage.alt=updated?'Registro actualizado. Tu correo electrónico ya forma parte de nuestra base. Hemos actualizado tus datos correctamente. Cuando haya novedades sobre CAMAROTE MAR, seguirás recibiendo nuestras comunicaciones por los canales registrados.':'Inscripción completada. Tu inscripción se ha realizado con éxito. Ahora formas parte de la comunidad de CAMAROTE MAR. Pronto recibirás novedades, información exclusiva y contenidos especiales. ¡Bienvenido!';
  };
  describeConfirmation();new MutationObserver(describeConfirmation).observe(confirmationImage,{attributes:true,attributeFilter:['src']});
 }
 const lineup=document.getElementById('lineup');if(lineup){lineup.setAttribute('aria-label','Programación de CAMAROTE MAR');const translateLabels=()=>lineup.querySelectorAll('[aria-label]').forEach(el=>{const label=el.getAttribute('aria-label');const fixed={'Daily lineup':'Programación por día','Previous day':'Día anterior','Next day':'Día siguiente'};const m=label.match(/^(?:View February |Ver dia )(\d+)/),b=label.match(/^Buy tickets for February (\d+)/);if(fixed[label])el.setAttribute('aria-label',fixed[label]);if(m)el.setAttribute('aria-label','Ver el día '+m[1]+' de febrero');if(b)el.setAttribute('aria-label','Comprar entradas para el '+b[1]+' de febrero en Ticketmaster')});translateLabels();new MutationObserver(translateLabels).observe(lineup,{subtree:true,attributes:true,attributeFilter:['aria-label']})}
 document.querySelector('.privacy__back')?.setAttribute('href','/camarote_mar_landing_preview/es/#cadastro');setText('.privacy__back','Volver al registro');
 const wa=document.querySelector('.site-whatsapp');if(wa){wa.setAttribute('aria-label','Hablar con CAMAROTE MAR por WhatsApp');wa.href='https://wa.me/5521993676741?text='+encodeURIComponent('¡Hola! Me gustaría recibir más información sobre CAMAROTE MAR.')}
 document.fonts.ready.then(translateArt);
 // Day switches keep the existing artwork, with its translated real-text counterpart.
 window.addEventListener('camarote:textartready',translateArt);
 if(document.body.classList.contains('privacy-page')&&!document.body.classList.contains('faq-page')){
  document.title='Política de Privacidad | CAMAROTE MAR 2027';
  document.querySelectorAll('[data-language-content]').forEach(section=>section.hidden=section.dataset.languageContent!=='es');
  setText('.privacy__updated','Actualizada el 28 de julio de 2026.');
  emphasizeSpanishBrand(document.querySelector('[data-language-content="es"]'));
 }
 if(document.body.classList.contains('faq-page'))document.querySelector('meta[name="description"]')?.setAttribute('content','Preguntas frecuentes sobre CAMAROTE MAR 2027.');
})();
