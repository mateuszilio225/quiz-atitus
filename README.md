# Atitus Experience 2.0

Website de orientação exploratória e captação em **demonstração independente**, sem vínculo ou aprovação oficial da Atitus. Preserva o site anterior, a paleta roxa e quente, ilustração SVG, navegação e componentes. A cópia integral original está em `backups/atitus-site.original.html` (SHA256 `85625918357b2de4cff4f212910cb980e7c26d221a8daf421db35a03658f5813`).

## Executar no Windows / VS Code

Instale **Node.js 24 LTS**, abra a pasta no VS Code e use o terminal:

```powershell
npm ci
Copy-Item .env.example .env
npm run admin:create
npm start
```

O comando de criação solicita usuário e senha de pelo menos 14 caracteres, sem exibir a senha. Não existem credenciais padrão. Não coloque credenciais no HTML, no Git ou em capturas de apresentação.

Abra **http://localhost:3000** e **http://localhost:3000/admin/**. Mantenha o terminal aberto. `npm run dev` reinicia o servidor ao editar código. No Linux/macOS, substitua `Copy-Item` por `cp`. Não é necessário SQLite instalado à parte: usamos `node:sqlite` do Node 24, evitando compilação de módulos nativos no Windows.

Sem arquivo `.env`, o servidor usa o mesmo padrão local. Caso altere a porta, ajuste também `APP_ORIGIN`. O valor deve coincidir exatamente com o endereço aberto no navegador (incluindo protocolo e porta). Não use `127.0.0.1` no navegador com `APP_ORIGIN=http://localhost:3000`.

## Abrir somente o site, sem servidor

Abra `index.html` com as pastas/arquivos juntos ou execute `npm run export:html` para gerar `artifacts/atitus-experience-2.html`, um HTML independente com todos os estilos e scripts públicos incorporados. Quiz, catálogo demonstrativo, comparação, simulador, FAQ e experiências funcionam sem API e sem serviços pagos. **Formulários não persistem nem fingem sucesso no modo estático; administração exige backend.**

O botão WhatsApp continua desativado até configuração institucional confirmada. O resumo pode ser copiado. Se configurado, resultado é opcional e a abertura exige aprovação do texto; nenhuma nota é incluída. Texto livre não deve conter dados pessoais.

## O que funciona

- Quiz de 12 perguntas com pesos por interesse e perfis multidimensionais; até 3 cursos, justificativas, índices exploratórios e empates explícitos. Não é avaliação psicológica.
- Busca sem acentos, filtros de área/campus, comparação de 2 ou 3 cursos e catálogo com campos de procedência/atualização. Dados não confirmados ficam pendentes, sem campus ou duração inventados.
- Simulador fictício em tempo real e cálculo autorizado no servidor quando houver regras cadastradas, aprovadas e vigentes. Bolsas/descontos são distintos de crédito/financiamento. Nenhuma regra institucional vem ativada. O telefone/flag do .env só inicializam um banco novo; depois use Configurações no painel.
- Formulário opcional que aceita **somente** nomes `Estudante Demo 01`, e-mails reservados `@example.test`/`@example.com` e telefone vazio ou `DEMO`. Não recebe leads reais. Persistência SQLite, criptografia de identidade, deduplicação por e-mail+curso e retenção configurável.
- Administração autenticada, métricas agregadas, filtros de período, gestão de status, exclusão, exportação autorizada, edição de catálogo, regras financeiras e auditoria.
- Dados de apresentação separados: 24 sessões fictícias e 8 interessados. Ativar é idempotente; limpar não apaga registros do formulário.
- FAQ interativo, fallback sem IA, duas experiências (lógica e gestão) e contratos de extensão CRM/IA desativados.
- Métricas opcionais opt-in, revogação e exclusão dos eventos da sessão atual. Sem terceiros de analytics, nomes, notas, respostas ou contatos em eventos.

## Organização

- `index.html`, `style.css`, `script.js`: site existente, aprimorado.
- `shared/catalog.js`: catálogo de fallback demonstrativo e perfis.
- `shared/domain.js`: regras do quiz, filtros, comparação, simulação e validação.
- `shared/knowledge.js`: FAQ com fontes sobre o funcionamento local e limites.
- `server/`: Express, SQLite, sessões, APIs e contratos de integrações.
- `admin/`: dashboard independente, sem credenciais embutidas.
- `scripts/`: inicialização administrativa e exportação HTML.
- `tests/`: regras, APIs, segurança e jornada automatizada no navegador.
- `.data/`: dados locais e chave, gerados e **ignorados pelo Git**.

## Testes

```powershell
npm test
npx playwright install chromium
npm run test:browser
```

Para Chromium já instalado no Linux: `CHROMIUM_PATH=/usr/bin/chromium npm run test:browser`. O teste de navegador usa a porta 4177 e um banco temporário isolado; não cria credenciais no banco de apresentação. Capturas ficam em `artifacts/`. Testes de API usam senhas aleatórias temporárias e removem os dados ao terminar.

Consulte [docs/VALIDACAO.md](docs/VALIDACAO.md) para resultados executados e limites. Verificações automáticas de acessibilidade não substituem teste manual com leitor de tela.

## Configuração e publicação

`DATA_DIR` guarda SQLite e a chave AES-256-GCM. Preserve ambos em backups protegidos; perder a chave impede recuperar os registros. Não exponha essa pasta por HTTP ou Git. Retenção padrão 30 dias (variável RETENTION_DAYS usada apenas na criação do banco), ajustável depois em `/admin`; limpeza no início, a cada hora e manualmente. Os cookies HttpOnly são essenciais para CSRF e autenticação. Sessões administrativas duram até 1 hora; não há compartilhamento de senhas.

Catálogo editado no painel fica no SQLite. O fallback do HTML estático é o catálogo demonstrativo versionado. Alterações do painel não sincronizam automaticamente com GitHub Pages nem com o HTML exportado.

**GitHub Pages não executa Node, SQLite ou autenticação.** O workflow existente publica somente o site público estático. Para API e painel, hospede em um serviço com Node 24, HTTPS e disco persistente. Veja [docs/ARQUITETURA.md](docs/ARQUITETURA.md) e [docs/PRIVACIDADE-SEGURANCA.md](docs/PRIVACIDADE-SEGURANCA.md) para operação, backups, migração e revisão antes de produção. Nenhum serviço de backend foi implantado externamente nesta entrega.

## Informações institucionais pendentes

A consulta HTTPS a `atitus.edu.br` permaneceu bloqueada pelo proxy do ambiente (403), em 07/11/2026. Não houve confirmação de identidade, catálogo, oferta, campus, modalidade, duração, telefone, campanhas ou preços. Os sete nomes de cursos são herdados da demonstração original, e não afirmações de oferta vigente. Não há logotipo oficial: a marca tipográfica é **Experience · proposta para Atitus**. Links gerais levam ao site institucional; links específicos só são exibidos após cadastro de fonte validada. Conteúdos e carreiras são referências gerais, não a grade oficial.

Uma adoção real exige validação institucional e jurídica, definição de controlador e operadores, canais de direitos, critérios comerciais autorizados, aviso de privacidade final e hospedagem adequada. Não afirmamos conformidade certificada com LGPD, resultados de conversão ou integração a sistemas privados.

Apresentação: [DEMO-COORDENADOR.md](DEMO-COORDENADOR.md). Proposta: [PROPOSTA-COMERCIAL.md](PROPOSTA-COMERCIAL.md).
