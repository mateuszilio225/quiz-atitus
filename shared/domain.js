/* Regras puras compartilhadas pelo navegador, API e testes. Sem persistência. */
(() => {
  const dimensions={justice:'argumentação e direitos',management:'gestão e organização',nature:'natureza e sustentabilidade',care:'cuidado e prevenção',empathy:'escuta e relações humanas',logic:'lógica e tecnologia',building:'construção e projetos',research:'investigação e pesquisa'};
  const option=(label,weights)=>({label,weights});
  const questions=[
    ['Em qual ambiente você gostaria de desenvolver um projeto?',[
      option('Em espaços de debate e resolução de conflitos.',{justice:3,empathy:1}),option('Em empresas ou projetos ligados ao campo.',{management:2,nature:2}),option('Em espaços de cuidado e acolhimento.',{care:2,empathy:2}),option('Em laboratórios e projetos de tecnologia.',{logic:2,building:2,research:1})]],
    ['Que transformação mais desperta seu interesse?',[
      option('Ampliar direitos e ajudar a mediar diferenças.',{justice:3,empathy:2}),option('Melhorar como uma organização funciona.',{management:3,logic:1}),option('Contribuir para o bem-estar das pessoas.',{care:3,empathy:2}),option('Criar soluções com tecnologia e pesquisa.',{logic:3,research:2})]],
    ['Qual atividade você gostaria de experimentar?',[
      option('Construir um argumento a partir de evidências.',{justice:3,research:2}),option('Planejar um negócio sustentável.',{management:3,nature:2}),option('Ouvir alguém e compreender sua perspectiva.',{empathy:3,research:1}),option('Montar e testar uma solução prática.',{building:3,logic:2})]],
    ['Como você prefere aprender algo novo?',[
      option('Debatendo casos e diferentes pontos de vista.',{justice:2,empathy:2}),option('Organizando um projeto com objetivos claros.',{management:3,building:1}),option('Observando pessoas e praticando o cuidado.',{care:2,empathy:3}),option('Experimentando, errando e investigando.',{logic:2,research:3})]],
    ['Em uma equipe, o que você costuma querer fazer?',[
      option('Facilitar o diálogo e buscar um acordo.',{justice:2,empathy:3}),option('Organizar recursos e dividir tarefas.',{management:3,building:1}),option('Perceber dificuldades e apoiar as pessoas.',{empathy:3,care:2}),option('Investigar o problema e desenhar alternativas.',{research:3,logic:2})]],
    ['Que tema faria você pesquisar por conta própria?',[
      option('Justiça, sociedade e decisões públicas.',{justice:3,research:2}),option('Produção de alimentos e meio ambiente.',{nature:3,research:2}),option('Comportamento humano e saúde.',{empathy:2,care:2,research:1}),option('Sistemas digitais e automação.',{logic:3,building:1})]],
    ['Que tipo de desafio parece mais interessante?',[
      option('Analisar um conflito sem tirar conclusões rápidas.',{justice:3,research:1,empathy:1}),option('Decidir como usar um orçamento limitado.',{management:3,logic:2}),option('Planejar uma ação educativa de prevenção.',{care:3,empathy:1}),option('Projetar algo seguro e funcional.',{building:3,logic:2})]],
    ['Qual resultado de um projeto seria mais gratificante?',[
      option('Uma solução justa para diferentes pessoas.',{justice:3,empathy:2}),option('Menos desperdício e uso responsável da natureza.',{nature:3,management:1}),option('Uma comunicação mais acolhedora e clara.',{empathy:3,care:1}),option('Uma ferramenta que resolve um problema real.',{logic:3,building:2})]],
    ['Com quais materiais você gostaria de trabalhar?',[
      option('Textos, documentos e narrativas.',{justice:2,research:2}),option('Planilhas, planos e indicadores.',{management:3,logic:1}),option('Instrumentos e práticas de cuidado supervisionadas.',{care:3,building:2}),option('Modelos, estruturas e protótipos.',{building:3,logic:2})]],
    ['Qual pergunta você faria primeiro em um projeto?',[
      option('Quais direitos e perspectivas estão envolvidos?',{justice:3,empathy:1}),option('Como isso pode ser viável e sustentável?',{management:2,nature:2}),option('Como as pessoas se sentem e do que precisam?',{empathy:3,care:2}),option('Como isso funciona e como podemos testar?',{research:3,logic:2})]],
    ['Que atividade você escolheria em uma visita acadêmica?',[
      option('Uma simulação de mediação.',{justice:3,empathy:1}),option('Uma visita técnica a um projeto agrícola.',{nature:3,management:1}),option('Uma oficina de comunicação e promoção de saúde.',{care:2,empathy:3}),option('Um laboratório de programação e projetos.',{logic:3,building:2})]],
    ['Qual combinação melhor descreve sua curiosidade hoje?',[
      option('Sociedade, leitura crítica e argumentação.',{justice:3,research:2}),option('Empreender, organizar e produzir com responsabilidade.',{management:2,nature:2}),option('Compreender pessoas e promover cuidado.',{empathy:3,care:2}),option('Investigar, calcular e construir soluções.',{research:2,logic:2,building:2})]]
  ].map(([title,options],i)=>({id:`q${i+1}`,title,options}));
  const dot=(a,b)=>Object.entries(a).reduce((s,[k,v])=>s+v*(b[k]||0),0);
  function recommend(answers,courses) {
    if(answers.length!==questions.length||answers.some((a,i)=>!Number.isInteger(a)||!questions[i].options[a]))throw Error('Responda às 12 perguntas.');
    const traits={};answers.forEach((a,i)=>Object.entries(questions[i].options[a].weights).forEach(([k,v])=>traits[k]=(traits[k]||0)+v));
    const ranked=courses.map(course=>{
      const maximum=questions.reduce((s,q)=>s+Math.max(...q.options.map(o=>dot(o.weights,course.profile))),0);
      const points=dot(traits,course.profile);const score=maximum?Math.round(points/maximum*100):0;
      const reasons=Object.keys(course.profile).map(k=>({key:k,value:(traits[k]||0)*course.profile[k]})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value||a.key.localeCompare(b.key));
      return {course,score,points,maximum,reasons:reasons.slice(0,3).map(x=>dimensions[x.key])};
    }).sort((a,b)=>b.score-a.score||a.course.name.localeCompare(b.course.name,'pt-BR'));
    const areaScores=[...new Set(courses.map(c=>c.area))].map(id=>({id,score:Math.round(ranked.filter(r=>r.course.area===id).reduce((s,r)=>s+r.score,0)/ranked.filter(r=>r.course.area===id).length)})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
    return {ranked,top:ranked.slice(0,3),areaScores,tied:ranked.filter(r=>r.score===ranked[0].score).map(r=>r.course.id),boundaryTies:ranked.filter(r=>r.score===ranked[Math.min(2,ranked.length-1)].score).map(r=>r.course.id)};
  }
  const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function filterCourses(courses,{search='',area='',campus=''}={}) {return courses.filter(c=>(!search||normalize(c.name).includes(normalize(search)))&&(!area||c.area===area)&&(!campus||(campus==='pending'?!c.campus:c.campus===campus)));}
  function compareCourses(courses,ids) {if(!Array.isArray(ids)||ids.length<2||ids.length>3||new Set(ids).size!==ids.length)throw Error('Escolha dois ou três cursos diferentes.');const selected=ids.map(id=>courses.find(c=>c.id===id));if(selected.some(c=>!c))throw Error('Curso não encontrado.');return selected;}
  function simulate(courses,input,rules=[],now=new Date()) {
    const course=courses.find(c=>c.id===input.courseId);if(!course)throw Error('Selecione um curso válido.');
    if(!['enem','vestibular','transferencia','diploma'].includes(input.entry))throw Error('Forma de ingresso inválida.');
    if(input.score!==undefined&&input.score!==null&&input.score!==''&&(!Number.isFinite(Number(input.score))||Number(input.score)<0||Number(input.score)>(input.entry==='vestibular'?100:1000)))throw Error('Nota fora do intervalo permitido.');
    if(input.mode==='authorized') {
      const rule=rules.find(r=>r.id===input.ruleId&&r.courseId===course.id&&r.approved===true&&r.source&&r.campaign&&r.campus===input.campus&&r.modality===input.modality&&r.entries.includes(input.entry)&&r.validFrom<=now.toISOString().slice(0,10)&&r.validTo>=now.toISOString().slice(0,10));
      if(!rule)throw Error('Nenhuma condição institucional autorizada para esta seleção.');
      if(rule.minScore!=null&&(input.score==null||input.score===''||Number(input.score)<rule.minScore))throw Error('Critério de nota não atendido.');
      if(!['scholarship','discount','financing','credit'].includes(rule.type)||!Number.isFinite(rule.base)||rule.base<=0||!Number.isFinite(rule.percent)||rule.percent<0||rule.percent>100)throw Error('Regra financeira inválida.');
      const reduction=['scholarship','discount'].includes(rule.type)?rule.percent:0;
      return {mode:'authorized',base:rule.base,discount:reduction,final:Math.round(rule.base*(1-reduction/100)*100)/100,saving:Math.round(rule.base*reduction)/100,ruleId:rule.id,type:rule.type,conditions:rule.conditions,campaign:rule.campaign,source:rule.source,updatedAt:rule.updatedAt,notice:'Prévia condicionada à elegibilidade e confirmação institucional. Financiamento e crédito não são descontos.'};
    }
    const discount=Number(input.discount??0);if(!Number.isFinite(discount)||discount<0||discount>50)throw Error('Desconto demonstrativo deve estar entre 0 e 50%.');
    return {mode:'demo',base:course.base,discount,final:Math.round(course.base*(1-discount/100)*100)/100,saving:Math.round(course.base*discount)/100,type:'illustration',notice:'Valores fictícios. Não constitui oferta nem garantia de bolsa.'};
  }
  function validateLead(data,courses) {
    if(typeof data!=='object'||!data)throw Error('Formulário inválido.');
    const name=String(data.name||'').trim(),email=String(data.email||'').trim().toLowerCase(),phone=String(data.phone||'').trim();
    if(!/^Estudante Demo [\p{L}\d -]{1,45}$/u.test(name))throw Error('Use somente nome fictício no formato Estudante Demo 01.');
    if(!/^[a-z0-9._+-]{1,45}@example\.(test|com)$/.test(email))throw Error('Use um e-mail fictício @example.test ou @example.com.');
    if(phone&&phone!=='DEMO')throw Error('Não informe telefone real: deixe vazio ou use DEMO.');
    if(!courses.some(c=>c.id===data.courseId))throw Error('Selecione um curso válido.');
    if(data.campus!=='pending')throw Error('Campus pendente de validação institucional.');
    if(data.consent!==true||data.fictional!==true)throw Error('Confirme a finalidade e que os dados são fictícios.');
    if(data.website)throw Error('Solicitação inválida.');
    return {name,email,phone,courseId:data.courseId,campus:'pending',marketing:data.marketing===true,consentVersion:'demo-v2-2026-11',fictional:true};
  }
  globalThis.Atitus={dimensions,questions,recommend,filterCourses,compareCourses,simulate,validateLead};
})();
