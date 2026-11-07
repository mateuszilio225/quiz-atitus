'use strict';
/* Configure somente com dados autorizados. O catálogo abaixo NÃO foi validado
   no site oficial nesta entrega. Não habilite alegações oficiais sem revisão. */
const CONFIG = {
  whatsappNumber: '', // DDI + DDD + número, somente dígitos; preencher após confirmação oficial.
  catalogVerified: false,
  officialUrl: 'https://atitus.edu.br',
  courses: [
    { id: 'direito', name: 'Direito', area: 'direito', base: 2000, focus:'Leis, direitos e resolução de conflitos.', careers:'Advocacia e consultoria jurídica; exercício sujeito aos requisitos legais e da OAB.' },
    { id: 'administracao', name: 'Administração', area: 'negocios', base: 1500, focus:'Organizações, estratégia e gestão de recursos.', careers:'Gestão de operações, finanças, pessoas e empreendedorismo.' },
    { id: 'agronomia', name: 'Agronomia', area: 'negocios', base: 2200, focus:'Produção agrícola, solo e sistemas sustentáveis.', careers:'Consultoria agrícola e gestão de produção, conforme atribuições profissionais.' },
    { id: 'psicologia', name: 'Psicologia', area: 'saude', base: 2100, focus:'Comportamento humano, subjetividade e saúde mental.', careers:'Psicologia clínica, organizacional ou social, com registro e habilitações pertinentes.' },
    { id: 'odontologia', name: 'Odontologia', area: 'saude', base: 3200, focus:'Saúde bucal, prevenção e cuidado odontológico.', careers:'Atendimento odontológico e promoção da saúde bucal, com registro profissional.' },
    { id: 'computacao', name: 'Ciência da Computação', area: 'tecnologia', base: 1800, focus:'Algoritmos, programação e sistemas computacionais.', careers:'Desenvolvimento de software, pesquisa e análise de sistemas.' },
    { id: 'engenharia', name: 'Engenharia Civil', area: 'tecnologia', base: 2300, focus:'Estruturas, construções e infraestrutura.', careers:'Projetos e gestão de obras, conforme registro e atribuições profissionais.' }
  ] // TODOS os valores são FICTÍCIOS, sem relação com preços oficiais.
};
const AREAS = [
  { id:'direito', title:'Direito e Sociedade', short:'Direito & sociedade', description:'Para quem vê na argumentação uma forma de transformar realidades.', explanation:'Suas escolhas se aproximam de debates, defesa de causas e negociação. Você pode gostar de investigar perspectivas, construir argumentos e participar de decisões.', careers:'Advocacia, mediação de conflitos, consultoria jurídica e carreiras públicas, conforme formação e requisitos profissionais.', activities:'Debates, pesquisa, interpretação e argumentação.', icon:'<path d="M12 3v17M5 20h14M4 7h16M6 7 2 14h8L6 7Zm12 0-4 7h8l-4-7Z"/>', motive:'defender pessoas e causas' },
  { id:'negocios', title:'Negócios e Agronegócio', short:'Negócios & agro', description:'Para quem transforma ideias em projetos e novas oportunidades.', explanation:'Suas escolhas valorizam liderança, visão de negócios e melhoria de processos. Você pode se identificar com planejamento, gestão e projetos ligados a empresas e ao campo.', careers:'Gestão de negócios, empreendedorismo, operações e projetos no agronegócio, conforme a formação escolhida.', activities:'Planejamento, análise de processos e projetos de negócios.', icon:'<path d="M12 21V9M12 15C4 15 3 10 3 5c5 0 9 2 9 7m0 0c0-6 4-8 9-8 0 6-3 10-9 10M7 21h10"/>', motive:'desenvolver negócios e melhorar processos' },
  { id:'saude', title:'Saúde e Cuidado', short:'Saúde & cuidado', description:'Para quem encontra propósito em cuidar e se conectar com pessoas.', explanation:'Suas escolhas destacam empatia, comunicação e cuidado. Você pode se interessar por compreender pessoas e contribuir para a saúde e o bem-estar.', careers:'Atendimento clínico, promoção da saúde, pesquisa e atuação em equipes de cuidado, respeitando habilitações de cada profissão.', activities:'Escuta, estudo de casos e práticas de cuidado supervisionadas.', icon:'<path d="M8 3v6a4 4 0 0 0 8 0V3M6 3h4m4 0h4M12 13v2a5 5 0 0 0 10 0v-3"/><circle cx="21" cy="9" r="2"/>', motive:'cuidar de pessoas' },
  { id:'tecnologia', title:'Tecnologia e Inovação', short:'Tecnologia & inovação', description:'Para quem faz perguntas e cria soluções para o que vem a seguir.', explanation:'Suas escolhas apontam para lógica, inovação e resolução de problemas. Você pode gostar de experimentar, construir sistemas e transformar ideias em soluções.', careers:'Desenvolvimento de software, análise de sistemas, projetos de engenharia e soluções digitais, conforme formação e requisitos.', activities:'Lógica, experimentação, programação e projetos técnicos.', icon:'<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 9h6v6H9zM9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4"/>', motive:'criar soluções tecnológicas' }
];
const QUESTIONS = [
  {category:'01 — SEU AMBIENTE', title:'Em qual ambiente você se imagina trabalhando?', options:['Escritórios, tribunais e negociações.','Campo, empresas e agronegócio.','Hospitais e ambientes de saúde.','Tecnologia, engenharia e inovação.']},
  {category:'02 — SUA MOTIVAÇÃO', title:'O que mais motiva você?', options:['Defender pessoas e causas.','Desenvolver negócios e melhorar processos.','Cuidar de pessoas.','Criar soluções tecnológicas.']},
  {category:'03 — SEUS PONTOS FORTES', title:'Qual habilidade mais combina com você?', options:['Oratória e argumentação.','Liderança e visão de negócios.','Empatia e comunicação.','Lógica e resolução de problemas.']},
  {category:'04 — SEU JEITO DE APRENDER', title:'Como você prefere aprender?', options:['Debates e estudos de caso.','Projetos de negócios.','Atividades práticas com pessoas.','Laboratórios e projetos tecnológicos.']}
];
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
let answers = [null,null,null,null], currentStep = 0, result = null, quizStarted = false, simulationTimer;
// Integração futura: window.addEventListener('atitus:conversion', e => ...).
// Não envia rede nem inclui nota, respostas individuais ou qualquer dado pessoal.
function track(name, properties = {}) {
  window.dispatchEvent(new CustomEvent('atitus:conversion',{detail:{event:name,...properties}}));
}
function coursesFor(id) { return CONFIG.courses.filter(c => c.area === id); }
function renderQuestion(focus = false) {
  const q = QUESTIONS[currentStep];
  $('#step-label').textContent = `PERGUNTA 0${currentStep+1} DE 04`;
  const percent = (currentStep+1)*25;
  $('#progress-label').textContent = `${percent}%`;
  $('#progress-fill').style.width = `${percent}%`;
  $('.progress-track').setAttribute('aria-valuenow',percent);
  $('#question-category').textContent = q.category;
  $('#question-title').textContent = q.title;
  $('#question-counter').textContent = `0${currentStep+1} / 04`;
  $('#quiz-options').innerHTML = '<legend class="sr-only">Selecione uma resposta</legend>' + q.options.map((option,i)=>`<label class="answer"><input type="radio" name="answer" value="${i}" ${answers[currentStep]===i?'checked':''}><span class="answer-letter" aria-hidden="true">${'ABCD'[i]}</span><span>${option}</span><span class="answer-check" aria-hidden="true">✓</span></label>`).join('');
  $('#quiz-back').disabled = currentStep===0;
  $('#quiz-next').innerHTML = currentStep===3 ? 'Ver meu resultado <span aria-hidden="true">↗</span>' : 'Continuar <span aria-hidden="true">→</span>';
  $('#quiz-error').textContent = '';
  $('#question-content').classList.remove('animate');
  void $('#question-content').offsetWidth;
  $('#question-content').classList.add('animate');
  if(focus) $('#question-title').focus({preventScroll:true});
}
function rankAreas(selected) {
  const scores = AREAS.map((area,index)=>({area,index,score:selected.filter(a=>a===index).length,first:selected.indexOf(index)}));
  return scores.sort((a,b)=>b.score-a.score || (a.first<0?99:a.first)-(b.first<0?99:b.first) || a.index-b.index);
}
function showResult() {
  const ranked = rankAreas(answers);
  result = ranked[0].area;
  const tied = ranked.filter(r=>r.score===ranked[0].score);
  const selectedMotivation = AREAS[answers[1]].motive;
  const alternatives = ranked.slice(1).filter(r=>r.score>0);
  $('#result-content').innerHTML = `<h2>Seu perfil combina com<br><em>${result.title}.</em></h2><p class="result-lead">${result.explanation} Você indicou que se motiva por ${selectedMotivation}.</p>${tied.length>1?`<p class="result-tie">Seus interesses são diversos: houve empate entre ${tied.map(t=>t.area.title).join(', ')}. Destacamos sua primeira preferência entre as áreas empatadas.</p>`:''}<div class="result-columns"><div><h3>Caminhos de formação</h3><p>${coursesFor(result.id).map(c=>c.name).join(' · ')}</p><p>Catálogo demonstrativo, pendente de confirmação oficial.</p></div><div><h3>Possibilidades profissionais</h3><p>${result.careers}</p></div><div><h3>Outras possibilidades</h3><p>${alternatives.length?alternatives.map(r=>r.area.title).join(' · '):'Explore também '+ranked[1].area.title+' e '+ranked[2].area.title+'.'}</p><p>Compare as áreas abaixo e descubra o que desperta sua curiosidade.</p></div></div>`;
  $('.quiz-layout').hidden = true;
  $('#quiz-result').hidden = false;
  $('#quiz-result').focus({preventScroll:true});
  $('#quiz').scrollIntoView({behavior:'smooth'});
  $('#course').value = coursesFor(result.id)[0].id;
  updateSimulation(false);
  track('quiz_result',{area:result.id,tied_areas:tied.length});
}
$('#quiz-options').addEventListener('change',event=>{
  answers[currentStep] = Number(event.target.value);
  $('#quiz-error').textContent = '';
  if(!quizStarted){quizStarted=true;track('quiz_start');}
});
$('#quiz-next').addEventListener('click',()=>{
  if(answers[currentStep]===null){$('#quiz-error').textContent='Escolha uma opção para continuar.';$('#quiz-options input').focus();return;}
  track('quiz_step_complete',{step:currentStep+1});
  if(currentStep===3){showResult();return;}
  currentStep++;renderQuestion(true);
});
$('#quiz-back').addEventListener('click',()=>{if(currentStep>0){currentStep--;renderQuestion(true);}});
$('#retake').addEventListener('click',()=>{
  answers=[null,null,null,null];currentStep=0;result=null;quizStarted=false;
  $('#quiz-result').hidden=true;$('.quiz-layout').hidden=false;renderQuestion(true);$('#quiz').scrollIntoView({behavior:'smooth'});
  track('quiz_restart');
});
function renderAreas() {
  $('#area-cards').innerHTML = AREAS.map((a,i)=>`<article class="area-card"><div class="area-visual"><span class="area-number">0${i+1} / EXPLORE</span><svg viewBox="0 0 24 24" aria-hidden="true">${a.icon}</svg></div><div class="area-body"><h3>${a.short}</h3><p>${a.description}</p><div class="course-tags">${coursesFor(a.id).map(c=>`<span>${c.name}</span>`).join('')}</div><button data-explore="${a.id}">Explorar no simulador <span aria-hidden="true">↗</span></button></div></article>`).join('');
  for(const id of ['compare-a','compare-b']) $('#'+id).innerHTML=CONFIG.courses.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  $('#compare-b').value='computacao';
  $('#course').innerHTML=AREAS.map(a=>`<optgroup label="${a.title}">${coursesFor(a.id).map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</optgroup>`).join('');
}
$('#area-cards').addEventListener('click',event=>{
  const button=event.target.closest('[data-explore]');if(!button)return;
  $('#course').value=coursesFor(button.dataset.explore)[0].id;updateSimulation();$('#simulador').scrollIntoView({behavior:'smooth'});$('#course').focus({preventScroll:true});
});
$('#compare-button').addEventListener('click',()=>{
  const ca=CONFIG.courses.find(c=>c.id===$('#compare-a').value), cb=CONFIG.courses.find(c=>c.id===$('#compare-b').value);
  const a=AREAS.find(a=>a.id===ca.area), b=AREAS.find(a=>a.id===cb.area);
  if(ca.id===cb.id){$('#compare-error').textContent='Escolha dois cursos diferentes para comparar.';$('#comparison').hidden=true;return;}
  $('#compare-error').textContent='';$('#compare-title-a').textContent=ca.name;$('#compare-title-b').textContent=cb.name;
  const rows=[['Área relacionada',a.title,b.title],['Foco do curso',ca.focus,cb.focus],['Possibilidades na profissão',ca.careers,cb.careers],['Valor-base fictício',money(ca.base),money(cb.base)],['Oferta e requisitos','Confirmar campus, modalidade, currículo e habilitações com a Atitus.','Confirmar campus, modalidade, currículo e habilitações com a Atitus.']];
  $('#comparison-body').innerHTML=rows.map(row=>`<tr><th scope="row">${row[0]}</th><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('');
  $('#comparison').hidden=false;$('#comparison').scrollIntoView({behavior:'smooth'});
});
$('#close-comparison').addEventListener('click',()=>{$('#comparison').hidden=true;$('#compare-button').focus({preventScroll:true});});
function getSimulation() {
  const course=CONFIG.courses.find(c=>c.id===$('#course').value);
  const discount=Number($('#discount').value);
  const final=course.base*(1-discount/100);
  return {course,discount,final,saving:course.base-final};
}
function validateScore() {
  const input=$('#score');
  const valid=!input.willValidate || input.validity.valid;
  $('#score-error').textContent=valid?'':`Informe uma nota entre 0 e ${input.max}, com até duas casas decimais.`;
  input.setAttribute('aria-invalid',String(!valid));
  return valid;
}
function updateEntry() {
  const type=$('#entry').value;
  const needed=type==='enem'||type==='vestibular';
  $('#score-wrapper').hidden=!needed;
  $('#score').disabled=!needed;
  $('#score').max=type==='vestibular'?'100':'1000';
  $('#score').placeholder=type==='vestibular'?'Ex.: 80':'Ex.: 650';
  $('#score-label').innerHTML=`Nota ${type==='vestibular'?'do vestibular':'do ENEM'} <span>(opcional)</span>`;
  $('#score').value='';validateScore();updateSimulation();
}
function updateSimulation(emit=true) {
  const s=getSimulation();
  $('#discount-output').value=`${s.discount}%`;
  $('#discount').style.background=`linear-gradient(to right,var(--purple) ${s.discount*2}%,#eae3f0 ${s.discount*2}%)`;
  $('#price-course').textContent=s.course.name;
  $('#original-price').textContent=money(s.course.base);
  $('#final-price').textContent=money(s.final);
  $('#savings').textContent=money(s.saving);
  $('#simulation-status').textContent=`Mensalidade ilustrativa de ${money(s.final)}, com desconto simulado de ${s.discount}%.`;
  if(emit){clearTimeout(simulationTimer);simulationTimer=setTimeout(()=>track('simulation_change',{course:s.course.id,discount:s.discount}),450);}
}
$('#simulator-form').addEventListener('submit',e=>e.preventDefault());
$('#course').addEventListener('change',()=>updateSimulation());
$('#discount').addEventListener('input',()=>updateSimulation());
$('#entry').addEventListener('change',updateEntry);
$('#score').addEventListener('input',validateScore);
function buildMessage() {
  const s=getSimulation();const isScore=!$('#score').disabled;
  const score=isScore&&$('#score').value!==''?$('#score').value:'Não informada';
  return `Olá! Explorei o quiz de interesses da demonstração para a Atitus.\n\nÁrea recomendada: ${result?result.title:'Quiz ainda não concluído'}.\nCurso de interesse: ${s.course.name} (a confirmar no catálogo oficial).\nForma de ingresso: ${$('#entry').selectedOptions[0].textContent}.\nNota: ${isScore?score:'Não se aplica'}.\nDesconto simulado: ${s.discount}%.\nMensalidade estimada: ${money(s.final)}.\n\nOs valores são fictícios e a simulação não constitui oferta nem garantia de bolsa. Gostaria de consultar as condições oficiais de ingresso e bolsas disponíveis.`;
}
function openDialog(id){$('#'+id).showModal();document.body.classList.add('modal-open');}
function closeDialog(id){$('#'+id).close();document.body.classList.remove('modal-open');}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.dataset.close)));
document.querySelectorAll('dialog').forEach(d=>{
  d.addEventListener('close',()=>document.body.classList.remove('modal-open'));
  d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d.id);}});
});
document.querySelectorAll('.contact-trigger').forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();
  if(!validateScore()){$('#simulador').scrollIntoView({behavior:'smooth'});$('#score').focus({preventScroll:true});return;}
  $('#contact-message').value=buildMessage();$('#contact-feedback').textContent='';
  const number=CONFIG.whatsappNumber.trim();
  const configured=/^\d{10,15}$/.test(number);
  $('#whatsapp-link').hidden=!configured;$('#official-contact').hidden=configured;
  $('#whatsapp-link').href=configured?`https://wa.me/${number}?text=${encodeURIComponent(buildMessage())}`:'#';
  $('#contact-explanation').textContent=configured?'Confira o resumo antes de continuar. Ao abrir o WhatsApp, as informações abaixo serão compartilhadas com o serviço.':'O WhatsApp oficial ainda não foi configurado nesta demonstração. Copie seu resumo e consulte os canais da instituição.';
  openDialog('contact-dialog');track('contact_summary_open');
}));
$('#whatsapp-link').addEventListener('click',()=>{if(!$('#whatsapp-link').hidden)track('whatsapp_click',{course:getSimulation().course.id});});
$('#copy-message').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('#contact-message').value);$('#contact-feedback').textContent='Resumo copiado. Agora você pode compartilhar com o atendimento.';}
  catch{ $('#contact-message').focus();$('#contact-message').select();$('#contact-feedback').textContent='Selecione e copie o resumo com Ctrl+C ou use a opção Copiar do seu celular.'; }
});
$('#privacy-open').addEventListener('click',()=>openDialog('privacy-dialog'));
$('.menu-toggle').addEventListener('click',()=>{
  const open=$('.menu-toggle').getAttribute('aria-expanded')!=='true';
  $('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').setAttribute('aria-label',open?'Fechar menu':'Abrir menu');$('#main-nav').classList.toggle('open',open);
});
$('#main-nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ $('#main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Abrir menu');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Abrir menu');}});
renderAreas();renderQuestion();updateSimulation(false);
// Substitui símbolos de decoração por SVG para evitar emojis e glifos ausentes.
function vectorizeSymbols(root) {
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode()){const n=walker.currentNode;if(/[↗✳]/.test(n.textContent)&&!n.parentElement.closest('script,style,textarea,option'))nodes.push(n);}
  nodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    node.textContent.split(/([↗✳])/).forEach(part=>{
      if(part==='↗'||part==='✳'){
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add(part==='↗'?'inline-arrow':'inline-spark');
        const path=document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d',part==='↗'?'M5 19 19 5M5 5h14v14':'M12 1v22M1 12h22M4 4l16 16M4 20 20 4');svg.append(path);fragment.append(svg);
      }else fragment.append(document.createTextNode(part));
    });node.replaceWith(fragment);
  });
}
vectorizeSymbols(document.body);
new MutationObserver(records=>{records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1&&n.tagName!=='svg'&&n.tagName!=='path')vectorizeSymbols(n);else if(n.nodeType===3&&/[↗✳]/.test(n.textContent)&&n.parentElement)vectorizeSymbols(n.parentElement);}));}).observe(document.body,{childList:true,subtree:true});
