# Validação executada — 07/11/2026

Ambiente Linux, Node v24.22.1, Chromium do sistema. O código e os comandos estão preparados para Node 24 LTS no Windows, mas não houve execução em Windows nesta sessão.

## Resultados

- `npm ci`: instalação pelo lockfile concluída.
- `npm test`: **21 testes passaram, 0 falhas**, contando o agrupamento de API e seus 12 subtestes, mais 8 testes de domínio. Sem testes ignorados.
- `CHROMIUM_PATH=/usr/bin/chromium npm run test:browser`: jornada pública e administrativa passou integralmente com banco temporário, usuário/senha aleatórios e sem contatos externos.
- `npm audit --omit=dev`: 0 vulnerabilidades reportadas para as dependências de runtime na execução. Isso não é auditoria de segurança do produto nem garantia de ausência de vulnerabilidades futuras.
- `npm run export:html`: HTML independente gerado e exercitado em modo estático no navegador, incluindo as 12 perguntas. O formulário mostrou explicitamente a necessidade de servidor e não fingiu persistência.
- CLI de criação de usuários validado em terminal PTY: senha não exibida, usuário `advisor` persistido no banco temporário e depois removido.
- `git diff --check`: sem erros de whitespace.
- Backup original preservado e hash conferido: `85625918357b2de4cff4f212910cb980e7c26d221a8daf421db35a03658f5813`.

## Cobertura de domínio e API

Pesos multidimensionais, índices normalizados, empates independentes da ordem de cadastro, interesses multidisciplinares, justificativas, busca sem acentos, filtros, comparação de 2/3, descontos fictícios e limites, regras aprovadas/vigentes e elegibilidade, distinção de financiamento/crédito, rejeição de dados pessoais reais, consentimento e honeypot.

Bootstrap e arquivos públicos, bloqueio de arquivos de servidor/banco via HTTP, CSRF, origem indevida, login inválido, rotação e revogação de sessão, autorização por papel, persistência no SQLite, cifragem e dedupe, métricas opcionais sem campos pessoais, exclusão da sessão, filtros, exportação autorizada, catálogo com procedência, configurações, auditoria, seed idempotente/separado, reset seguro, FAQ desconhecida, retenção, limite de autenticação e payload.

## Cobertura no navegador

- Quiz completo, voltar e preservar seleção, três recomendações e gráfico.
- Comparar os três caminhos, busca/filtros e estado vazio.
- R$ 2.000 fictícios com 40% = R$ 1.200, economia R$ 800. Sem regras oficiais por padrão.
- Motor autorizado exercitado somente com **fixture explicitamente fictícia** em banco temporário; critérios de nota aplicados no backend. Essa fixture não existe no banco entregue nem é oferta.
- Mensagem de WhatsApp sem nota, resultado opcional, revisão e nova aprovação após editar; URL validada com número sintático de teste somente em memória efêmera. Nenhuma conversa foi aberta ou mensagem enviada.
- Experiências de lógica e orçamento, FAQ local e formulário fictício persistido.
- Métricas ausentes antes de opt-in, coleta após opt-in e exclusão ao revogar.
- Painel autenticado, seed rotulado, situação de atendimento, download CSV autorizado, separação de fontes e edição de catálogo com conteúdo hostil tratado como texto, sem XSS.
- Menu móvel e ausência de overflow horizontal em site e painel a 320, 390, 768 e 1440 px.
- axe-core: sem violações reportadas pelos conjuntos WCAG 2 A/AA, 2.1 AA e 2.2 AA nos estados público e dashboard móvel avaliados. Navegação de teclado usa HTML nativo, foco visível e tabs com setas. Não é certificação de conformidade completa.
- Sem exceções JavaScript nos fluxos exercitados; logout encerrou acesso.

## Limitações e não executados

Não foram testados navegador Windows, Safari, leitor de tela humano, conectividade móvel real, carga de produção, SSO/MFA, recuperação de backup em infraestrutura externa, CRM institucional, API de IA real ou WhatsApp real. A navegação `file://` é bloqueada administrativamente pelo Chromium gerenciado; testamos o HTML independente incorporado no navegador em modo estático, sem requerer rede ou API. Recomenda-se conferir o arquivo baixado também no navegador usado na apresentação.

Pesquisa institucional bloqueada por proxy (403): catálogo, logo, identidade, ofertas, campi, modalidades, duração, contatos e preços permanecem pendentes. Nada foi publicado como condição oficial nem medido como resultado comercial efetivo. Backend não implantado em hospedagem externa; GitHub Pages serve apenas estáticos.

## Arquivos alterados e adicionados

Modificados: `index.html`, `style.css`, `script.js`, `README.md` e o workflow de Pages (inclui os novos arquivos públicos). Adicionados: `shared/` (catálogo/regras/FAQ), `server/` (API/SQLite/contratos), `admin/` (painel), `scripts/` (usuários/exportação), `tests/`, `docs/`, `backups/`, `package.json`, lockfile, `.env.example`, `.gitignore`, `PROPOSTA-COMERCIAL.md` e `DEMO-COORDENADOR.md`. Dados de execução, chave, `.env`, node_modules e capturas não são versionados.
