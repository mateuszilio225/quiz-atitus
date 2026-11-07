# Apresentação de cinco minutos

## Preparação (antes da reunião)

1. Instalar Node 24 LTS; executar `npm ci`, copiar `.env.example` para `.env`, `npm run admin:create` e `npm start`.
2. Abrir http://localhost:3000 e /admin/ em abas separadas. Entrar privadamente no painel, sem mostrar ou compartilhar senha.
3. No painel, ativar “Dados fictícios” e selecionar o conjunto de apresentação. Se quiser recomeçar, usar “Limpar dados de apresentação”; não elimina registros do formulário.
4. Conferir que o WhatsApp não configurado apresenta resumo e canal oficial. Não demonstrar envio a telefone pessoal.
5. Usar somente o botão “Preencher identidade fictícia”; nenhum dado de aluno real. A demonstração básica não precisa de internet, conta institucional, CRM ou API paga.

## Roteiro

**0:00–0:40 — Problema e independência.** Mostrar a primeira dobra. “Esta é uma proposta independente, sem aprovação da Atitus. O objetivo é ajudar candidatos a organizar dúvidas e levar um contato mais contextualizado à equipe.” Não afirmar que cores, oferta ou preços foram validados.

**0:40–1:50 — Descoberta.** Responder às 12 perguntas (pode escolher opções que expressem curiosidade tecnológica), voltar uma vez e alterar. Mostrar até três cursos, explicações e índices. “Não é teste psicológico: os pesos só organizam interesses, e empates são reconhecidos.”

**1:50–2:30 — Comparação e planejamento.** Comparar os três caminhos. Mostrar informações pendentes em campus/duração em vez de inventar detalhes. Mover o slider do simulador e escolher “Verificar condições institucionais”: nenhuma condição vem cadastrada. “Dados reais só entram com fonte e regra aprovada; crédito não é bolsa.”

**2:30–3:10 — Interesse e contato.** Ir ao formulário, preencher identidade fictícia e marcar conscientemente as duas confirmações. Enviar e mostrar que a solicitação foi persistida localmente. Abrir o resumo de contato, optar por incluir ou não o resultado e conferir que nota não é compartilhada. Sem telefone oficial, copiar texto ou abrir site institucional. Não criar falsa inscrição/matrícula.

**3:10–4:10 — Gestão operacional.** Na aba autenticada, mostrar o conjunto “Coletados com permissão · demo” e o registro criado pelo formulário. Alterar para “Em acompanhamento”. Depois selecionar “Fictícios para apresentação” e mostrar funil, 24 sessões e 8 interessados explicitamente fictícios. Explicar opt-in, amostra e que sessões não equivalem a pessoas únicas. Catálogo é editável com fonte/data; nada confirma automaticamente oferta institucional.

**4:10–4:35 — Diferenciais.** Abrir o assistente e perguntar por bolsa: ele explica limites, sem inventar valores. Mostrar o desafio de lógica ou orçamento, breve e educativo.

**4:35–5:00 — Convite para piloto.** Abrir “Sobre o projeto”. Propor validar com coordenação, captação, TI e privacidade: um curso/campus confirmado, catálogo oficial, canais autorizados e métricas de um piloto limitado. “Queremos testar utilidade e processo, sem prometer conversão antes de medir.”

## Perguntas esperadas

- **É oficial?** Não; depende de aprovação e validação institucional.
- **Já tem alunos ou resultados?** Não. Os registros usados são fictícios; não há taxa de conversão comprovada.
- **Funciona no GitHub Pages?** O site público sim. Banco, API e painel precisam de servidor Node com volume persistente e HTTPS.
- **Pode coletar dados reais agora?** Não. Esta versão aceita somente dados fictícios; requer revisão institucional/jurídica antes de qualquer piloto real.
- **A IA está integrada?** Não. A FAQ local é operacional; um adaptador de IA opcional foi preparado, sem provedor ou chave ativa.
- **Quanto custa?** Demonstrar localmente não exige serviços pagos. Usar faixas ilustrativas e escopo em PROPOSTA-COMERCIAL.md para discutir implantação.

## Reiniciar

No site, “Reiniciar jornada local” limpa respostas e formulários em memória, sem apagar preferências de privacidade nem dados do banco. No painel, “Limpar dados de apresentação” remove só o seed. Para excluir um registro fictício do formulário, use a ação administrativa explícita. Não remova `.data` indiscriminadamente: contém banco, chave e usuários.
