# Privacidade, segurança e limites antes de um piloto

Este projeto não é produto institucional aprovado nem certificação LGPD. O modo operacional atual só aceita dados fictícios. Não ativar coleta real alterando apenas o texto de um checkbox.

## Controles implementados

- Consultas SQL parametrizadas, PII fictícia em AES-256-GCM e dedupe por HMAC. Chave local aleatória criada com acesso restrito; em implantação, mover para cofre e planejar rotação.
- Senhas scrypt com salt individual; comparação em tempo constante; respostas de login genéricas; ausência de senha padrão; sessão opaca persistida como hash e rotacionada no login; validade 1 hora. HttpOnly + SameSite Strict, Secure e prefixo __Host em HTTPS/produção.
- CSRF em todas as mutações, origem exata, proteção de requisições cross-site, cookies públicos essenciais para formulários. Sem CORS permissivo.
- Limites persistidos no SQLite por HMAC de IP: geral 300/min, login 5/15min, fictícios 10/h, eventos 150/min, FAQ 30/min. Honeypot e token temporizado ajudam contra spam, sem equivaler a proteção completa contra ataques distribuídos.
- Payload JSON limitado a 32 KiB, erros internos genéricos, CSP sem scripts inline no backend, cabeçalhos Helmet. Dados do catálogo, CRM e tabelas são escapados antes de entrar em HTML; links institucionais são validados no servidor.
- Papéis com autorização no backend, trilha administrativa sem valores de credenciais/identidade, exportação autorizada e CSV protegido contra fórmula.
- Retenção inicial 30 dias, configurável 1–365, executada no startup, por hora e manualmente. Exclusão individual de fictícios no painel. `secure_delete` no SQLite; remanescentes em WAL/backups exigem política operacional separada.
- Métricas opcionais inativas por padrão, preferência local, sem notas/respostas/identidades; sessão temporária com identificador aleatório armazenado como HMAC no servidor; exclusão da sessão atual ao revogar. A preferência de recusa é mantida no localStorage; reset da jornada não a muda.
- Nenhum token de API no browser, nenhum CRM/modelo externo ativo. Sem fontes/CDN de terceiros na versão 2.0.

## Limites assumidos

O host com acesso à chave e banco pode decifrar os dados. A criptografia não substitui controle de acesso ao sistema/volume, backups cifrados, monitoramento e resposta a incidentes. Não há MFA, recuperação de senha por e-mail, SSO, segregação multi-instituição, testes de intrusão ou auditoria de produção. Provisão e recuperação de usuário dependem de operador autorizado no servidor. SQLite e rate limits locais não substituem infraestrutura distribuída.

Cookies sem Secure são usados somente para desenvolvimento HTTP local. Publicar com HTTPS, origem exata e modo production. O arquivo HTML independente não tem CSP de servidor, mas mantém renderização escapada e não incorpora credenciais. Dados públicos de contato colocados em texto livre podem acabar na URL do WhatsApp após aprovação; a interface orienta não fornecer dados pessoais e nunca inclui notas ou contatos automaticamente.

Os logs de proxy/hospedagem podem registrar IP, horário e rotas fora da aplicação. Este MVP não controla a retenção desses provedores. Definir política e contrato antes do piloto. A exclusão dos eventos desta sessão não apaga automaticamente registros de outros dispositivos ou logs da hospedagem.

## Decisões institucionais/jurídicas necessárias

1. Definir controlador, operadores, finalidade, base legal e responsável de privacidade.
2. Avaliar público menor de idade, acessibilidade, linguagem adequada e regras específicas de contato.
3. Determinar mínimos dados, consentimentos/base legal separados para atendimento e marketing; não condicionar quiz a cadastro.
4. Aprovar política de retenção, canal de direitos e procedimento de acesso, correção e exclusão. Nomear responsáveis e validar backups/prazos.
5. Revisar fonte e vigência de cursos, identidade e regras comerciais. Registrar evidências e autorização de contato.
6. Autorizar CRM/IA/analytics externos e fluxos de dados com contratos, segurança, minimização e teste em sandbox. Nunca usar leads reais em seed de apresentação.
7. Executar revisão manual de WCAG 2.2 AA, testes em dispositivos reais, auditoria de segurança e recuperação de desastres.

A aprovação destes itens é pré-requisito de um piloto com pessoas/dados reais, não uma etapa já concluída.
