/** Contratos de extensão. Nenhum endpoint externo nem segredo é enviado no MVP. */
export function createCRMAdapter(){return {enabled:false,async send(){throw Error('CRM externo não autorizado/configurado. Nenhum lead foi transferido.');}};}
export function createAIAdapter({provider}={}){return {enabled:!!provider,async answer(question,authorizedContext){if(!provider)throw Error('IA externa não configurada; use FAQ local.');if(!authorizedContext?.length)throw Error('Sem contexto autorizado. Encaminhe ao atendimento.');return provider.answer({question,context:authorizedContext});}};}
