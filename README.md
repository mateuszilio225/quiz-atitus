# Atitus · Seu próximo capítulo

Landing page estática de demonstração independente, em português, com HTML5, Tailwind via CDN, CSS e JavaScript puro. Não exige Node.js, instalação, banco de dados ou backend.

## Abrir e demonstrar

Abra `index.html` no navegador, mantendo `style.css` e `script.js` na mesma pasta. O CSS próprio mantém o layout mesmo sem CDN ou fontes externas; fontes de sistema são o fallback. Internet é necessária para o Tailwind CDN e canais externos.

Opcionalmente, use um servidor estático, útil para testar a área de transferência:

```sh
cd /workspace/quiz-atitus
python3 -m http.server 8000 --bind 0.0.0.0
```

Abra a porta 8000 no seu navegador pelo mecanismo de acesso da sua hospedagem/ambiente. Para uso local, abra `http://localhost:8000`. O servidor Python é apenas uma ferramenta de desenvolvimento.

## Funcionalidades

- Quiz de quatro perguntas, respostas editáveis, voltar e refazer.
- Cada alternativa soma um ponto à área de mesmo índice. Ordenação por pontuação; empate resolvido pela primeira preferência entre as empatadas, com explicação visível. Sem resultados aleatórios.
- Resultado com explicação, carreiras e alternativas; seleciona um curso no simulador.
- Comparação entre dois cursos, com foco, possibilidades profissionais e valores-base fictícios. Catálogo demonstrativo pendente de confirmação.
- Simulador com curso, ingresso, nota opcional e desconto de 0–50% exclusivamente ilustrativo. Nota ENEM 0–1000; vestibular 0–100, sem relação com a concessão de desconto. Outras formas de ingresso não solicitam nota.
- Resumo personalizado, cópia e WhatsApp quando houver um número oficial configurado.
- Menu mobile, FAQ, avisos de privacidade, teclado, foco visível, movimento reduzido e modais com Escape.
- Nenhum dado persistido e nenhuma integração de analytics ativa.

## Configurar dados

Edite `CONFIG` no início de `script.js`:

- `whatsappNumber`: vazio por padrão. Preencha somente com número oficial confirmado, DDI + DDD + telefone, apenas dígitos. Não há número fictício publicado. O link usa `https://wa.me/` e `encodeURIComponent()`. Até configurar, o CTA abre o resumo com opção de copiar e link ao site oficial.
- `courses`: nomes, área e `base` (valor mensal fictício, em reais). Todos os valores atuais são de demonstração.
- `officialUrl`: referência do site oficial. Links institucionais também estão no HTML.
- `catalogVerified`: marcador de revisão; não remove avisos automaticamente. Altere os textos da página somente após validação documental.
- Paleta, tipografia e dimensões: variáveis e regras em `style.css`.

## Validação institucional pendente

A tentativa de consulta a `https://atitus.edu.br` e `https://www.atitus.edu.br` em 07/11/2026 recebeu bloqueio HTTP 403 do proxy do ambiente, antes de chegar ao site. Não houve verificação de cursos, logotipo, cores, campanhas, preços, regras ou telefone. A paleta e a marca tipográfica são uma proposta visual, não uma reprodução validada da identidade oficial. Não foram usadas imagens externas nem logotipo oficial.

Os nomes Direito, Administração, Agronomia, Psicologia, Odontologia, Ciência da Computação e Engenharia Civil compõem apenas o catálogo ilustrativo desta entrega, sem afirmação de oferta vigente pela Atitus. Antes da apresentação como material aprovado/publicação institucional:

1. Consultar o catálogo oficial e confirmar curso, campus, modalidade e disponibilidade, registrando os URLs e a data.
2. Substituir a marca tipográfica pela identidade autorizada e validar cores/fontes.
3. Confirmar o WhatsApp e as condições comerciais. Não converter o slider em promessa de bolsa. O limite de 50% não representa campanha oficial.
4. Revisar textos legais e privacidade com a instituição. Esta página permanece identificada como proposta independente.

## Eventos para analytics

```js
window.addEventListener('atitus:conversion', ({ detail }) => {
  // Enviar para a ferramenta escolhida somente após revisão de privacidade.
  console.log(detail.event);
});
```

Eventos: `quiz_start`, `quiz_step_complete`, `quiz_result`, `quiz_restart`, `simulation_change` (com debounce), `contact_summary_open` e `whatsapp_click`. O último só ocorre no link efetivo ao WhatsApp. Não incluem nota nem respostas individuais. Os eventos não são contagens únicas por visitante e não são armazenados.

## Publicar em hospedagem comum

Envie `index.html`, `style.css` e `script.js` à pasta pública da hospedagem (por exemplo, `public_html`), sem alterar os nomes relativos. Não há build. Funciona em hospedagem estática, GitHub Pages, Netlify, Vercel ou servidor convencional. Ative HTTPS. Para GitHub Pages, publique o conteúdo na raiz do branch escolhido e configure Pages para esse branch. Nenhuma publicação foi realizada nesta entrega.

O Tailwind browser CDN atende à exigência desta demonstração; para publicação com maior controle de desempenho e política de conteúdo, considere gerar e hospedar o CSS estático em uma etapa separada. O site já tem CSS próprio como fallback.

## Testes executados

Chromium/Playwright, sem dependência de teste adicionada ao site:

- Quatro resultados homogêneos, todos os 16 botões de resposta, voltar preservando seleção e empate explicado.
- Todas as 256 combinações verificadas quanto à maior pontuação e resultado determinístico.
- Progresso 25/50/75/100%, resposta obrigatória e refazer.
- R$ 2.000 com 40% = R$ 1.200; economia R$ 800; limites 0 e 50%.
- Validação de notas, troca de ingresso, resumo e codificação de URL WhatsApp com número de teste injetado apenas no navegador e removido, sem envio externo.
- Comparação, FAQ, privacidade e menu mobile.
- Sem overflow horizontal em 320, 375, 390, 768, 1024 e 1440 px. Sem exceções JavaScript nos fluxos testados.

Contato real e dados oficiais não foram validados. Recursos externos podem ser bloqueados pela rede; o fluxo central foi validado com os recursos externos bloqueados via HTTP. A abertura file:// foi impedida pela política administrativa do Chromium gerenciado; não foi validada nesse navegador.

Verificação adicional: axe-core (regras WCAG 2 A/AA e 2.1 AA) executado em mobile, desktop, resultado e modal de contato. Problemas de contraste encontrados foram corrigidos. Isso não substitui auditoria manual completa com tecnologias assistivas.
