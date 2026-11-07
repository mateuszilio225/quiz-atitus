# Arquitetura e operação

## Componentes e dependências

Website progressivamente aprimorado em HTML/CSS/JavaScript, sem framework ou build obrigatório. O CSS original foi preservado e ampliado; não depende mais de fontes ou scripts de CDN, evitando requisições de terceiros na demonstração.

Express 5 organiza rotas e validação de requisições; Helmet fornece cabeçalhos e CSP. São as únicas dependências de runtime. SQLite é o módulo nativo `node:sqlite` em Node 24 LTS. Playwright e axe-core são ferramentas exclusivamente de desenvolvimento. O lockfile fixa a árvore; use `npm ci`. Não foi introduzido um SPA ou desktop.

O catálogo inicial é versionado; cada banco recebe os 7 registros no primeiro uso por `INSERT OR IGNORE`. Após isso, o painel é a fonte do servidor. HTML estático permanece com fallback explicitamente demonstrativo. A API não recebe respostas do quiz: seu cálculo ocorre no navegador e pode ser testado pelas mesmas funções puras.

## Pontuação

12 questões, 4 opções cada, combinando 8 interesses. Cada alternativa atribui pesos 1–3 a vários interesses. Cada curso tem um perfil de pesos; sua pontuação é o produto escalar entre os interesses acumulados e o perfil. Normalizamos pelo máximo possível desse curso nas 12 questões e exibimos um índice inteiro 0–100, sem interpretação científica. As justificativas vêm dos interesses de maior contribuição.

O índice de área é a média dos índices de seus cursos, evitando favorecer áreas só por terem mais cursos. Empates mantêm mesmo índice; ordenação alfabética é apenas de apresentação e independe do cadastro. No limite dos três caminhos, um aviso explica que há outros empatados no catálogo. Pesos e textos são atualizáveis em `shared/domain.js` e perfis em `shared/catalog.js`; validar pedagogicamente antes de piloto.

## API pública (mesma origem)

- `GET /api/health`: prontidão do servidor, sem dados privados.
- `GET /api/bootstrap`: cursos, condições aprovadas, telefone se confirmado, CSRF e token anti-spam. Emite cookie essencial HttpOnly, SameSite Strict. Token precisa de 800ms a 2h antes do formulário.
- `GET /api/courses?search=&area=&campus=`: busca e filtros.
- `POST /api/simulate`: cálculo demo ou validação de condição autorizada.
- `POST /api/leads`: somente fictícios; nome, email reservado, telefone opcional DEMO, curso, campus pendente, consentimentos, honeypot e token. Deduplicação HMAC de e-mail+curso, resposta idempotente.
- `POST /api/events`: somente nomes padronizados, consentimento verdadeiro, sessão aleatória, curso e etapa válidos, UTM com caracteres restritos.
- `POST /api/events/forget`: exclui eventos observados da sessão conhecida, não os de apresentação.
- `POST /api/assistant`: FAQ local, sem chamadas externas. A interface estática tem a mesma base de fallback.

Toda mutação requer JSON e `X-CSRF-Token`, cookie válido e origem compatível. Frontend usa URLs relativas; backend é servido na raiz. Sem CORS aberto.

## API administrativa

`POST /api/admin/login`, `GET /api/admin/me`, `POST /api/admin/logout`; autenticação por senha scrypt e sessão opaca, rotacionada ao login. `admin`, `advisor`, `editor`, `viewer` são papéis suportados no servidor. O assistente de criação inicial cria `admin`; provisionamento adicional por operador local pode usar o parâmetro `--role=advisor|editor|viewer` do mesmo comando. A interface oculta ações conforme papel; o servidor sempre aplica permissão.

- Todos os papéis: métricas, lista de fictícios, consulta de catálogo.
- `admin` e `advisor`: situação do atendimento e exportação (com confirmação explícita).
- `admin` e `editor`: atualização de catálogo.
- Somente `admin`: exclusão, configuração, auditoria, retenção e ativar/limpar dados fictícios.

Status de inscrição é **informado**, sem valor de matrícula comprovada. Exportação respeita conjunto/período/filtros, até 1.000 registros; campos são escapados e fórmulas de planilha neutralizadas. Nenhuma inscrição é contada como concluída no funil.

## Condições financeiras

Demo é o padrão e os valores-base continuam fictícios. Uma condição autorizada precisa de `id`, `courseId`, `type`, `base`, `percent`, `entries`, `validFrom`, `validTo`, `minScore` (opcional), `campus`, `modality`, `campaign`, `source`, `conditions`, `updatedAt` e `approved`. Tipos: `scholarship`, `discount`, `financing`, `credit`. Configuração inicial: lista vazia.

Estrutura ilustrativa, **não cadastrar como oferta sem documento**:

```json
{
  "id": "identificador-do-edital",
  "courseId": "computacao",
  "type": "discount",
  "base": 0,
  "percent": 0,
  "entries": ["enem"],
  "validFrom": "AAAA-MM-DD",
  "validTo": "AAAA-MM-DD",
  "minScore": null,
  "campus": "Dado oficial a confirmar",
  "modality": "Dado oficial a confirmar",
  "campaign": "Identificação do documento aprovado",
  "source": "https://atitus.edu.br/URL-DO-DOCUMENTO",
  "conditions": "Condições e restrições aprovadas",
  "updatedAt": "AAAA-MM-DD",
  "approved": false
}
```

O modelo acima tem preço zero e datas incompletas, portanto é rejeitado até preenchimento legítimo. O servidor exige preço positivo, vigência, campanha, fonte e critérios. Para bolsa/desconto, mensalidade = base × (1 − percentual/100); crédito e financiamento não reduzem a mensalidade por percentual e exigem consulta de seus contratos. Não calcula parcelas, juros ou CET. Regras reais retornam prévia condicionada, jamais garantia. Nenhum preço vem do cliente; ele só seleciona a regra. A nota não é persistida.

## Analytics

Eventos: `page_view`, `quiz_started`, `quiz_step_completed`, `quiz_completed`, `quiz_result_viewed`, `course_viewed`, `course_compared`, `simulator_used`, `lead_form_opened`, `lead_submitted`, `contact_clicked`. O evento local `atitus:conversion` foi preservado. Não confundir eventos locais com coleta: a API só recebe após opt-in. `page_view`, início e conclusão são deduplicados por sessão. Visitantes são sessões autorizadas, não usuários únicos. Aba “Coletados com permissão” contém eventos efetivamente coletados nesta demonstração; “Fictícios para apresentação” contém seed separado.

UTM é limitada a source/medium/campaign com letras, números, hífen e sublinhado, máximo 32 caracteres, sem conteúdo livre ou URL completa. Não usar identificadores pessoais em nomes de campanhas. Abandono é inferência provisória por etapa sem conclusão posterior no período, não uma certeza de desistência. Funil agregado não atribui causalidade; não inclui matrícula ou inscrição não verificadas.

## IA e CRM

`server/integrations.js` documenta adaptadores desativados. Nenhum CRM externo recebe leads e nenhum modelo é chamado. IA futura exige provedor no servidor, segredos em ambiente, contexto institucional autorizado, políticas de resposta, limites e revisão de privacidade; a FAQ continua o fallback. A base atual verifica apenas comportamento do próprio produto e seus limites; não confirma fatos institucionais inacessíveis.

## Hospedagem e backups

Node 24 LTS com volume persistente, TLS no proxy e origem única. `NODE_ENV=production`, `APP_ORIGIN=https://dominio-aprovado`, `HOST=0.0.0.0` se necessário no contêiner. Habilitar `TRUST_PROXY=true` apenas atrás de exatamente um proxy confiável. Fora disso, IP para rate limit pode ser falsificado. Segredos ficam apenas no servidor. Produção ainda permanece **demo-only**: este MVP não habilita coleta de leads reais.

Para backup consistente: parar o processo ou usar a API de backup do SQLite; copiar banco e chave de criptografia para armazenamento cifrado com controle de acesso e retenção. Não copiar somente `.sqlite` durante escrita em WAL. Testar recuperação em diretório isolado. Arquivos WAL/SHM podem conter estado necessário. Proteger também backups do volume, que não são apagados automaticamente quando um registro é excluído no banco ativo.

SQLite atende a um processo local/piloto pequeno; não compartilhar o arquivo entre contêineres concorrentes em rede. Para PostgreSQL, versionar migrações de schema, substituir consultas/prepared statements, usar pool, TLS, cofre de chaves e sessões/rate limits compartilhados. Ajustar transações, dedupe, seed, backup/restauração e reexecutar todos os testes. Não é uma migração já realizada.

O GitHub Pages serve somente os arquivos estáticos; API/admin exigem hospedagem separada com Node. Não configurar credenciais privadas em workflows de frontend. O exportador HTML não inclui o painel, dados do SQLite ou chave. Mudanças do painel não são materializadas no HTML exportado automaticamente.
