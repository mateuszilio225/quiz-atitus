'use strict';
const $=s=>document.querySelector(s), D=globalThis.Atitus, catalog=globalThis.AtitusCatalog;
const AREAS=catalog.areas, QUESTIONS=D.questions, CONFIG={courses:catalog.courses,whatsappNumber:''};
const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pending=catalog.pending;
let answers=Array(QUESTIONS.length).fill(null),currentStep=0,result=null,recommendation=null,quizStarted=false,apiReady=false,simulationTimer;
let csrf='',leadToken='',authorizedRules=[],simulationVersion=0,leadOpened=Date.now(),leadFormOpened=false,tracking=false,sessionId=crypto.randomUUID?.()||String(Math.random()).slice(2);
try{tracking=localStorage.getItem('atitus.metrics')==='yes';}catch{}
const utm={};for(const k of ['utm_source','utm_medium','utm_campaign']){const v=new URLSearchParams(location.search).get(k);if(v&&/^[a-zA-Z0-9_-]{1,32}$/.test(v))utm[k]=v;}
async function api(path,options={}) {
 const response=await fetch('api/'+path,{...options,headers:{'Content-Type':'application/json','X-CSRF-Token':csrf,...options.headers}});
 const data=await response.json();if(!response.ok)throw Error(data.error||'Não foi possível concluir.');return data;
}
function track(event,properties={}) {
 const detail={event,...properties};window.dispatchEvent(new CustomEvent('atitus:conversion',{detail}));
 if(tracking&&apiReady)api('events',{method:'POST',body:JSON.stringify({event,sessionId,courseId:properties.courseId,step:properties.step,utm,consent:true})}).catch(()=>{});
}
function coursesFor(id){return CONFIG.courses.filter(c=>c.area===id);}
function renderQuestion(focus=false) {
 const q=QUESTIONS[currentStep],count=QUESTIONS.length,percent=Math.round((currentStep+1)/count*100);
 $('#step-label').textContent=`PERGUNTA ${String(currentStep+1).padStart(2,'0')} DE ${count}`;
 $('#progress-label').textContent=percent+'%';$('#progress-fill').style.width=percent+'%';$('.progress-track').setAttribute('aria-valuenow',percent);
 $('#question-category').textContent='SEUS INTERESSES · EXPLORAÇÃO';$('#question-title').textContent=q.title;$('#question-counter').textContent=`${currentStep+1} / ${count}`;
 $('#quiz-options').innerHTML='<legend class="sr-only">Selecione uma resposta</legend>'+q.options.map((o,i)=>`<label class="answer"><input type="radio" name="answer" value="${i}" ${answers[currentStep]===i?'checked':''}><span class="answer-letter" aria-hidden="true">${'ABCD'[i]}</span><span>${esc(o.label)}</span><span class="answer-check" aria-hidden="true">✓</span></label>`).join('');
 $('#quiz-back').disabled=currentStep===0;$('#quiz-next').textContent=currentStep===count-1?'Ver meus caminhos ↗':'Continuar →';$('#quiz-error').textContent='';
 $('#question-content').classList.remove('animate');void $('#question-content').offsetWidth;$('#question-content').classList.add('animate');if(focus)$('#question-title').focus({preventScroll:true});
}
function courseCard(c,r=null){return `<article class="course-card"><div class="demo-pill">${esc(AREAS.find(a=>a.id===c.area)?.short||c.area)}</div><h3>${esc(c.name)}</h3>${r?`<p class="recommend-reason">Seus interesses em ${esc(r.reasons.join(', '))} se aproximam deste caminho.</p>`:''}<p>${esc(c.description)}</p><p><strong>Conteúdos típicos:</strong> ${esc(c.contents.join(' · '))}</p><p><strong>Possibilidades:</strong> ${esc(c.careers)}</p><details><summary>Dados da oferta <span>+</span></summary><dl><dt>Nome oficial / oferta</dt><dd>${esc(c.officialName||pending)} · ${c.availability==='verified'?'Verificada':'Pendente'}</dd>${['campus','modality','shift','duration'].map((key,i)=>`<dt>${['Campus','Modalidade','Turno','Duração'][i]}</dt><dd>${esc(c[key]||pending)}</dd>`).join('')}<dt>Diferenciais institucionais</dt><dd>${esc(c.differentials.join(' · ')||pending)}</dd><dt>Fonte e atualização</dt><dd>${esc(c.source||pending)} · ${esc(c.updatedAt||'Data não confirmada')}</dd></dl></details><div class="course-actions"><a href="${esc(c.officialUrl||'https://atitus.edu.br')}" target="_blank" rel="noopener noreferrer" data-view="${esc(c.id)}" class="text-link">${c.officialUrl?'Conhecer curso':'Consultar site oficial'} ↗</a><button class="text-button" data-compare="${esc(c.id)}">Comparar +</button><button class="button button-outline" data-explore="${esc(c.id)}">Simular ingresso ↗</button></div></article>`;}
function showResult(){
 recommendation=D.recommend(answers,CONFIG.courses);const r=recommendation;
 result=AREAS.find(a=>a.id===r.areaScores[0].id);
 const tiedAreas=r.areaScores.filter(a=>a.score===r.areaScores[0].score).map(a=>AREAS.find(x=>x.id===a.id).title);
 $('#result-content').innerHTML=`<h2>Sua área de maior afinidade:<br><em>${esc(result.title)}</em></h2><p class="result-lead">${esc(result.explanation)}</p>${tiedAreas.length>1?`<p class="result-tie">Interesses multidisciplinares: ${esc(tiedAreas.join(' e '))} tiveram o mesmo índice.</p>`:''}<div class="affinity-chart" aria-label="Índices exploratórios por área">${r.areaScores.map(a=>`<div><span>${esc(AREAS.find(x=>x.id===a.id).title)}</span><meter min="0" max="100" value="${a.score}" aria-label="${esc(AREAS.find(x=>x.id===a.id).title)}">${a.score}</meter><strong>${a.score}/100</strong></div>`).join('')}</div><p class="result-disclaimer">Índice de afinidade normalizado pelos pesos das respostas, não uma probabilidade de sucesso. Cada curso combina interesses com pesos próprios. Nenhuma resposta ou nota é enviada em analytics.</p><h3 class="result-subtitle">Três caminhos para explorar</h3><p class="result-disclaimer">Empates recebem a mesma relevância e são ordenados alfabeticamente, sem preferência por cadastro.${r.boundaryTies.length>1?' Há empate no limite da seleção; outros cursos empatados continuam disponíveis no catálogo.':''}</p><div class="recommendation-grid">${r.top.map(x=>courseCard(x.course,x)).join('')}</div><div class="result-cta"><button class="button button-primary" id="compare-recommended">Comparar os três caminhos ↗</button><button class="button button-outline lead-trigger">Consultar condições · demo</button></div>`;
 $('.quiz-layout').hidden=true;$('#quiz-result').hidden=false;$('#quiz-result').focus({preventScroll:true});$('#quiz').scrollIntoView({behavior:'smooth'});
 selectCourse(r.top[0].course.id,false);track('quiz_completed');track('quiz_result_viewed');
 $('#compare-recommended').onclick=()=>{['a','b','c'].forEach((key,i)=>$('#compare-'+key).value=r.top[i]?.course.id||'');showComparison();};
}
$('#quiz-options').addEventListener('change',e=>{answers[currentStep]=Number(e.target.value);$('#quiz-error').textContent='';if(!quizStarted){quizStarted=true;track('quiz_started');}});
$('#quiz-next').onclick=()=>{if(answers[currentStep]===null){$('#quiz-error').textContent='Escolha uma opção para continuar.';$('#quiz-options input').focus();return;}track('quiz_step_completed',{step:currentStep+1});if(currentStep===QUESTIONS.length-1){showResult();return;}currentStep++;renderQuestion(true);};
$('#quiz-back').onclick=()=>{if(currentStep>0){currentStep--;renderQuestion(true);}};
function resetQuiz(){answers=Array(QUESTIONS.length).fill(null);currentStep=0;result=null;recommendation=null;quizStarted=false;$('#quiz-result').hidden=true;$('.quiz-layout').hidden=false;renderQuestion(true);}
$('#retake').onclick=resetQuiz;
function options(courses,blank=false){return (blank?'<option value="">Sem terceiro curso</option>':'')+courses.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');}
function fillCatalog(){
 const old=$('#course').value;for(const key of ['course','lead-course','compare-a','compare-b'])$('#'+key).innerHTML=options(CONFIG.courses);$('#compare-c').innerHTML=options(CONFIG.courses,true);
 if(CONFIG.courses.some(c=>c.id===old))$('#course').value=old;$('#compare-b').value=CONFIG.courses.find(c=>c.id==='computacao')?.id||CONFIG.courses[1]?.id;$('#compare-c').value='';
 $('#area-filter').innerHTML='<option value="">Todas as áreas</option>'+AREAS.map(a=>`<option value="${esc(a.id)}">${esc(a.title)}</option>`).join('');
 const campuses=[...new Set(CONFIG.courses.map(c=>c.campus).filter(Boolean))];
 $('#campus-filter').innerHTML='<option value="">Todos</option><option value="pending">Pendente de validação</option>'+campuses.map(c=>`<option>${esc(c)}</option>`).join('');
 renderCatalog();
}
function renderCatalog(){const list=D.filterCourses(CONFIG.courses,{search:$('#course-search').value,area:$('#area-filter').value,campus:$('#campus-filter').value});$('#area-cards').innerHTML=list.map(c=>courseCard(c)).join('');$('#catalog-count').textContent=`${list.length} curso(s) para explorar · catálogo pendente de confirmação`;$('#catalog-empty').hidden=list.length>0;}
for(const id of ['course-search','area-filter','campus-filter'])$('#'+id).addEventListener('input',renderCatalog);
function showComparison(){
 try{const courses=D.compareCourses(CONFIG.courses,['a','b','c'].map(k=>$('#compare-'+k).value).filter(Boolean));$('#compare-error').textContent='';
 const labels=[['O que se estuda',c=>c.contents.join(' · ')],['Perfil de interesses',c=>Object.keys(c.profile).map(k=>D.dimensions[k]).join(', ')],['Duração',c=>c.duration||pending],['Modalidade',c=>c.modality||pending],['Campus',c=>c.campus||pending],['Possibilidades profissionais',c=>c.careers],['Fonte / atualização',c=>[c.source,c.updatedAt].filter(Boolean).join(' · ')||pending]];
 $('.comparison thead').innerHTML='<tr><th scope="col">Para explorar</th>'+courses.map(c=>`<th scope="col">${esc(c.name)}</th>`).join('')+'</tr>';
 $('#comparison-body').innerHTML=labels.map(([label,get])=>`<tr><th scope="row">${label}</th>${courses.map(c=>`<td>${esc(get(c))}</td>`).join('')}</tr>`).join('')+`<tr><th scope="row">Informações oficiais</th>${courses.map(c=>`<td><a class="text-link" href="${esc(c.officialUrl||'https://atitus.edu.br')}" target="_blank" rel="noopener noreferrer">${c.officialUrl?'Página do curso':'Site oficial (página pendente)'} ↗</a></td>`).join('')}</tr>`;
 $('#comparison').hidden=false;$('#comparison').scrollIntoView({behavior:'smooth'});track('course_compared');
 }catch(e){$('#compare-error').textContent=e.message;$('#comparison').hidden=true;}
}
$('#compare-button').onclick=showComparison;$('#close-comparison').onclick=()=>{$('#comparison').hidden=true;$('#compare-button').focus({preventScroll:true});};
function selectCourse(id,emit=true){$('#course').value=id;$('#lead-course').value=id;fillPrograms();updateSimulation(emit);}
function getInput(){return {courseId:$('#course').value,entry:$('#entry').value,score:$('#score').disabled?null:$('#score').value,discount:Number($('#discount').value),campus:$('#sim-campus').value,modality:$('#sim-modality').value,ruleId:$('#financial-program').value.startsWith('rule:')?$('#financial-program').value.slice(5):undefined,mode:$('#financial-program').value==='demo'?'demo':'authorized'};}
function getSimulation(){return D.simulate(CONFIG.courses,getInput(),authorizedRules);}
function validateScore(){const valid=!$('#score').willValidate||$('#score').validity.valid;$('#score-error').textContent=valid?'':`Informe uma nota entre 0 e ${$('#score').max}.`;$('#score').setAttribute('aria-invalid',String(!valid));return valid;}
function updateEntry(){const type=$('#entry').value,needed=type==='enem'||type==='vestibular';$('#score-wrapper').hidden=!needed;$('#score').disabled=!needed;$('#score').max=type==='vestibular'?'100':'1000';$('#score').placeholder=type==='vestibular'?'Ex.: 80':'Ex.: 650';$('#score-label').innerHTML=`Nota ${type==='vestibular'?'do vestibular':'do ENEM'} <span>(opcional)</span>`;$('#score').value='';validateScore();updateSimulation();}
function fillPrograms(){
 const select=$('#financial-program'),old=select.value;
 select.innerHTML='<option value="demo">Cenário fictício (não é programa oficial)</option><option value="authorized">Verificar condições institucionais</option>'+authorizedRules.filter(r=>r.courseId===$('#course').value).map(r=>`<option value="rule:${esc(r.id)}">${esc(r.campaign)} · ${esc({scholarship:'Bolsa',discount:'Desconto',financing:'Financiamento',credit:'Crédito'}[r.type])}</option>`).join('');
 select.value=[...select.options].some(o=>o.value===old)?old:'demo';
 const c=CONFIG.courses.find(c=>c.id===$('#course').value);
 $('#sim-campus').innerHTML=`<option value="${esc(c.campus||'pending')}">${esc(c.campus||pending)}</option>`;
 $('#sim-modality').innerHTML=`<option value="${esc(c.modality||'pending')}">${esc(c.modality||pending)}</option>`;
}
function paintSimulation(s){
 $('#discount-output').value=s.discount+'%';$('#discount').style.background=`linear-gradient(to right,var(--purple) ${s.discount*2}%,#eae3f0 ${s.discount*2}%)`;
 $('#price-course').textContent=CONFIG.courses.find(c=>c.id===$('#course').value).name;$('#original-price').textContent=money(s.base);$('#final-price').textContent=money(s.final);$('#savings').textContent=money(s.saving);
 $('.original-price').firstChild.textContent=s.mode==='demo'?'Valor-base fictício ':'Valor-base da condição ';
 $('.estimate-label').textContent=s.mode==='demo'?'MENSALIDADE ESTIMADA · DEMONSTRAÇÃO':'PRÉVIA CONDICIONADA · VERIFICAR ELEGIBILIDADE';
 $('.price-disclaimer').textContent=s.notice+(s.mode==='authorized'?' '+(s.conditions||'')+' Fonte: '+s.source+' · Atualização: '+s.updatedAt:'');
 $('#simulation-status').textContent=`Estimativa ${s.mode==='demo'?'fictícia':'condicionada'}: ${money(s.final)}. ${s.base} × (1 − ${s.discount}/100).`;
}
function unavailable(message){$('#final-price').textContent='Indisponível';$('#savings').textContent='—';$('#original-price').textContent='—';$('#simulator-error').textContent=message;}
function updateSimulation(emit=true){
 const version=++simulationVersion,authorized=$('#financial-program').value!=='demo';$('#authorized-empty').hidden=!authorized;$('#demo-slider').hidden=authorized;$('#simulator-error').textContent='';
 const rule=authorizedRules.find(r=>'rule:'+r.id===$('#financial-program').value);
 if(rule){$('#sim-campus').innerHTML=`<option>${esc(rule.campus)}</option>`;$('#sim-modality').innerHTML=`<option>${esc(rule.modality)}</option>`;$('#authorized-empty').textContent='Condição cadastrada com procedência. Verificando critérios no servidor; não representa garantia de concessão.';}
 else $('#authorized-empty').textContent='Nenhum programa autorizado selecionado. Consulte o atendimento oficial. Bolsas e descontos reduzem preço; financiamento e crédito possuem condições próprias.';
 try{
  if(authorized){
   if(!rule||!apiReady)throw Error('Nenhuma condição institucional autorizada para esta seleção.');
   $('#final-price').textContent='Consultando…';$('#savings').textContent='—';$('#original-price').textContent='—';
   api('simulate',{method:'POST',body:JSON.stringify(getInput())}).then(data=>{if(version===simulationVersion){paintSimulation(data);if(emit)track('simulator_used',{courseId:$('#course').value});}}).catch(e=>{if(version===simulationVersion)unavailable(e.message);});
  }else{paintSimulation(getSimulation());if(emit){clearTimeout(simulationTimer);simulationTimer=setTimeout(()=>{track('simulator_used',{courseId:$('#course').value});if(apiReady)api('simulate',{method:'POST',body:JSON.stringify(getInput())}).catch(()=>{});},450);}}
 }catch(e){unavailable(e.message);}
}
$('#simulator-form').onsubmit=e=>e.preventDefault();$('#course').onchange=()=>{fillPrograms();updateSimulation();};$('#discount').oninput=()=>updateSimulation();$('#entry').onchange=updateEntry;$('#score').oninput=()=>{if(validateScore()&&$('#financial-program').value!=='demo')updateSimulation();};$('#financial-program').onchange=()=>updateSimulation();
function openDialog(id){$('#'+id).showModal();document.body.classList.add('modal-open');}
function closeDialog(id){$('#'+id).close();document.body.classList.remove('modal-open');}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeDialog(b.dataset.close));document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',()=>document.body.classList.remove('modal-open'));d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d.id);}});});
function buildMessage(){const c=CONFIG.courses.find(c=>c.id===$('#course').value);return `Olá! Gostaria de consultar as condições oficiais de ingresso.\n\nCurso de interesse: ${c.name} (oferta a confirmar).\nCampus: ${$('#sim-campus').selectedOptions[0].textContent}.\nForma de ingresso: ${$('#entry').selectedOptions[0].textContent}.${$('#share-result').checked&&result?'\nÁrea de afinidade exploratória: '+result.title+'.':''}${$('#contact-question').value.trim()?'\nDúvida: '+$('#contact-question').value.trim():''}\n\nEsta conversa foi preparada em uma proposta independente. A simulação usa valores fictícios, sem oferta ou garantia de bolsa.`;}
function refreshContact(){const number=CONFIG.whatsappNumber,configured=/^\d{10,15}$/.test(number);$('#contact-message').value=buildMessage();$('#whatsapp-link').hidden=!configured;$('#official-contact').hidden=configured;const approved=$('#approve-message').checked;$('#whatsapp-link').setAttribute('aria-disabled',String(!approved));if(configured&&approved)$('#whatsapp-link').href=`https://wa.me/${number}?text=${encodeURIComponent($('#contact-message').value)}`;else $('#whatsapp-link').removeAttribute('href');}
function showContact(){if(!validateScore()){$('#score').focus();return;}$('#approve-message').checked=false;$('#share-result').checked=false;$('#contact-question').value='';$('#contact-feedback').textContent='';$('#contact-explanation').textContent=CONFIG.whatsappNumber?'Revise o resumo. Somente o conteúdo aprovado será incluído no link ao WhatsApp.':'WhatsApp institucional não configurado. Copie o resumo ou consulte os canais oficiais.';refreshContact();openDialog('contact-dialog');}
for(const id of ['share-result','contact-question','approve-message'])$('#'+id).addEventListener('input',()=>{if(id!=='approve-message')$('#approve-message').checked=false;refreshContact();});
$('#whatsapp-link').onclick=e=>{if(!$('#approve-message').checked||!CONFIG.whatsappNumber)e.preventDefault();else track('contact_clicked',{courseId:$('#course').value});};
$('#official-contact').onclick=()=>track('contact_clicked',{courseId:$('#course').value});
$('#copy-message').onclick=async()=>{try{await navigator.clipboard.writeText($('#contact-message').value);$('#contact-feedback').textContent='Resumo copiado.';}catch{$('#contact-message').focus();$('#contact-message').select();$('#contact-feedback').textContent='Use Ctrl+C ou a opção Copiar do seu celular.';}};
$('#privacy-open').onclick=$('#lead-privacy').onclick=()=>openDialog('privacy-dialog');
function reportLeadOpen(){if(!leadFormOpened){leadFormOpened=true;track('lead_form_opened');}}
$('#lead-form').addEventListener('focusin',reportLeadOpen);
function goLead(){reportLeadOpen();leadOpened=Date.now();$('#lead-course').value=$('#course').value;$('#interesse').scrollIntoView({behavior:'smooth'});$('#fill-demo').focus({preventScroll:true});}
document.addEventListener('click',e=>{const target=e.target.closest('button,a');if(!target)return;if(target.matches('.contact-trigger')){e.preventDefault();showContact();}if(target.matches('.lead-trigger'))goLead();if(target.dataset.explore){selectCourse(target.dataset.explore);track('course_viewed',{courseId:target.dataset.explore});$('#simulador').scrollIntoView({behavior:'smooth'});}if(target.dataset.view)track('course_viewed',{courseId:target.dataset.view});if(target.dataset.compare){const values=['a','b','c'].map(k=>$('#compare-'+k).value);if(!values.includes(target.dataset.compare)){const free=values.indexOf('');$('#compare-'+(free>=0?['a','b','c'][free]:'c')).value=target.dataset.compare;}$('.compare-controls').scrollIntoView({behavior:'smooth'});}});
$('#fill-demo').onclick=()=>{const suffix=String(Math.floor(Math.random()*9000)+1000);$('#lead-name').value='Estudante Demo '+suffix;$('#lead-email').value='estudante'+suffix+'@example.test';$('#lead-phone').value='';$('#lead-feedback').textContent='Identidade fictícia preenchida. Revise as confirmações antes de enviar.';};
$('#lead-form').onsubmit=async e=>{e.preventDefault();const data={name:$('#lead-name').value,email:$('#lead-email').value,phone:$('#lead-phone').value,courseId:$('#lead-course').value,campus:$('#lead-campus').value,consent:$('#lead-consent').checked,fictional:$('#lead-fictional').checked,marketing:$('#lead-marketing').checked,website:$('#lead-website').value};
 try{D.validateLead(data,CONFIG.courses);if(!apiReady)throw Error('Abra o projeto com npm start para persistir o registro fictício. A versão estática não salva interessados.');$('#lead-submit').disabled=true;$('#lead-feedback').textContent='Registrando solicitação fictícia…';const response=await api('leads',{method:'POST',body:JSON.stringify({...data,token:leadToken,source:tracking?(utm.utm_source||'direto'):'não coletada'})});$('#lead-feedback').textContent=response.duplicate?'Solicitação fictícia já registrada. Não criamos uma duplicata.':'Solicitação fictícia registrada no banco local. Nenhuma mensagem foi enviada.';$('#lead-consent').checked=false;$('#lead-fictional').checked=false;track('lead_submitted',{courseId:data.courseId});}catch(e){$('#lead-feedback').textContent=e.message;}finally{$('#lead-submit').disabled=false;}
};
function trackingUI(){$('#tracking-state').textContent=tracking?'Métricas opcionais ativadas nesta demonstração':'Métricas opcionais desativadas';$('#enable-tracking').hidden=tracking;}
$('#enable-tracking').onclick=()=>{tracking=true;try{localStorage.setItem('atitus.metrics','yes');}catch{}trackingUI();track('page_view');};
$('#disable-tracking').onclick=async()=>{tracking=false;try{localStorage.setItem('atitus.metrics','no');}catch{}trackingUI();if(apiReady){try{await api('events/forget',{method:'POST',body:JSON.stringify({sessionId})});$('#tracking-state').textContent='Métricas desativadas; eventos desta sessão excluídos.';}catch{$('#tracking-state').textContent='Métricas desativadas. Não foi possível excluir a sessão; tente novamente com o servidor disponível.';}}sessionId=crypto.randomUUID?.()||String(Math.random()).slice(2);};
$('#privacy-settings').onclick=()=>openDialog('privacy-dialog');
$('.menu-toggle').onclick=()=>{const open=$('.menu-toggle').getAttribute('aria-expanded')!=='true';$('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').setAttribute('aria-label',open?'Fechar menu':'Abrir menu');$('#main-nav').classList.toggle('open',open);};
function closeMenu(){$('#main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Abrir menu');}
$('#main-nav').querySelectorAll('a').forEach(a=>a.onclick=closeMenu);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
$('#logic-form').onsubmit=e=>{e.preventDefault();const value=Number($('#logic-answer').value);$('#logic-feedback').textContent=value===8?'Isso! 2 → 4 → 6 → 8. Você acompanhou três repetições de uma instrução.':'Vamos revisar: comece com 2 e some 2 três vezes: 4, 6, 8. O resultado é 8.';};
$('#management-form').onsubmit=e=>{e.preventDefault();const team=Number($('#team-budget').value),project=Number($('#project-budget').value),balance=1000-team-project;$('#management-feedback').textContent=balance>=0?`Plano dentro do orçamento. Reserva de ${money(balance)}. Um próximo passo seria avaliar riscos e prioridades.`:`O plano ultrapassa o orçamento em ${money(-balance)}. Reavalie prioridades e preserve uma reserva.`;};
$('#assistant-open').onclick=()=>openDialog('assistant-dialog');
$('#assistant-topics').innerHTML=AtitusKnowledge.map(k=>`<button class="button button-outline" type="button" data-topic="${k.id}">${esc(k.title)}</button>`).join('');
function answerFAQ(k){$('#assistant-answer').textContent=k?k.answer+' Fonte: '+k.source:'Essa informação não está disponível na base autorizada. Não posso confirmar preços, bolsas, prazos ou regras. Consulte os canais oficiais em atitus.edu.br.';}
$('#assistant-topics').onclick=e=>{const t=e.target.closest('[data-topic]');if(t)answerFAQ(AtitusKnowledge.find(k=>k.id===t.dataset.topic));};
$('#assistant-form').onsubmit=e=>{e.preventDefault();const query=$('#assistant-query').value.toLowerCase();answerFAQ(AtitusKnowledge.find(k=>k.keys.some(x=>query.includes(x))));};
$('#demo-tour').onclick=()=>{$('#quiz').scrollIntoView({behavior:'smooth'});$('#quiz-title')?.focus();$('#quiz-error').textContent='Roteiro: responda ao quiz, compare cursos, simule e registre um interesse fictício. Depois abra o painel autenticado para visualizar o registro.';};
$('#reset-journey').onclick=()=>{resetQuiz();$('#simulator-form').reset();updateEntry();$('#lead-form').reset();$('#lead-feedback').textContent='';$('#comparison').hidden=true;$('#logic-feedback').textContent='';$('#management-feedback').textContent='';$('#quiz').scrollIntoView({behavior:'smooth'});};
async function connect(){
 if(location.protocol==='file:'||document.documentElement.dataset.runtime==='static'){offline();return;}
 try{const config=await api('bootstrap');apiReady=true;csrf=config.csrf;leadToken=config.leadToken;CONFIG.whatsappNumber=config.whatsappNumber||'';CONFIG.courses=config.courses;authorizedRules=config.rules||[];fillCatalog();fillPrograms();updateSimulation(false);$('#api-status').textContent='Servidor local conectado · registros exclusivamente fictícios.';if(tracking)track('page_view');}
 catch{offline();}
}
function offline(){$('#api-status').textContent='Modo estático: quiz, catálogo, simulação e FAQ disponíveis. Para salvar interessados e acessar o painel, execute npm start.';}
fillCatalog();fillPrograms();renderQuestion();updateSimulation(false);trackingUI();connect();
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
