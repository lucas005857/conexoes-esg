/* CONEXÕES ESG · função da Netlify que fala com a IA
   As chaves ficam nas variáveis de ambiente da Netlify (nunca no navegador):
     GEMINI_API_KEY   e   GROQ_API_KEY
   Cada uma aceita várias chaves separadas por vírgula; se a primeira estourar
   a cota (429) ou o servidor falhar, a próxima é tentada.
   Opcionais: GEMINI_MODEL e GROQ_MODEL (senão usa os padrões abaixo).

   O navegador manda { motor: 'gemini' | 'groq', corpo: {...} } com o pedido
   no formato de cada serviço, SEM chave e SEM modelo. Aqui a chave e o modelo
   são acrescentados, e a resposta volta como veio. */

const PADRAO_GEMINI = 'gemini-flash-latest';
const PADRAO_GROQ = 'openai/gpt-oss-120b';
const LIMITE_CORPO = 20000;   // bytes que o navegador pode mandar
const MAX_SAIDA = 1200;       // teto de tokens de resposta

function resposta(status, obj) {
  return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
}

function chavesDe(nome) {
  return String(process.env[nome] || '').split(',').map(s => s.trim()).filter(Boolean);
}

// Só aceita pedidos vindos do próprio site (quem chama de outro endereço é recusado)
function origemValida(headers) {
  const origem = headers.origin || headers.Origin;
  const host = headers.host || headers.Host;
  if (!origem || !host) return true; // chamadas sem Origin (teste local) passam
  try { return new URL(origem).host === host; } catch (e) { return false; }
}

async function chamar(motor, corpo, chave) {
  if (motor === 'gemini') {
    const modelo = process.env.GEMINI_MODEL || PADRAO_GEMINI;
    const cfg = Object.assign({}, corpo.generationConfig);
    cfg.maxOutputTokens = Math.min(Number(cfg.maxOutputTokens) || MAX_SAIDA, MAX_SAIDA);
    const final = Object.assign({}, corpo, { generationConfig: cfg });
    return fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(modelo) + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': chave },
      body: JSON.stringify(final)
    });
  }
  const final = Object.assign({}, corpo, {
    model: process.env.GROQ_MODEL || PADRAO_GROQ,
    max_tokens: Math.min(Number(corpo.max_tokens) || MAX_SAIDA, MAX_SAIDA)
  });
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + chave },
    body: JSON.stringify(final)
  });
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return resposta(405, { erro: 'use POST' });
  if (!origemValida(event.headers || {})) return resposta(403, { erro: 'origem não permitida' });
  if (Buffer.byteLength(event.body || '', 'utf8') > LIMITE_CORPO) return resposta(413, { erro: 'pedido grande demais' });

  let pedido;
  try { pedido = JSON.parse(event.body || '{}'); } catch (e) { return resposta(400, { erro: 'JSON inválido' }); }
  const motor = pedido.motor;
  const corpo = pedido.corpo;
  if (motor !== 'gemini' && motor !== 'groq') return resposta(400, { erro: 'motor desconhecido' });
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return resposta(400, { erro: 'corpo inválido' });

  const chaves = chavesDe(motor === 'gemini' ? 'GEMINI_API_KEY' : 'GROQ_API_KEY');
  if (!chaves.length) return resposta(503, { erro: 'sem chave configurada para ' + motor });

  let ultimo = null;
  for (const chave of chaves) {
    try {
      const r = await chamar(motor, corpo, chave);
      if (r.status === 429 || r.status >= 500) { ultimo = r; continue; } // tenta a próxima chave
      return { statusCode: r.status, headers: { 'Content-Type': 'application/json' }, body: await r.text() };
    } catch (e) {
      ultimo = null;
    }
  }
  if (ultimo) return { statusCode: ultimo.status, headers: { 'Content-Type': 'application/json' }, body: await ultimo.text() };
  return resposta(502, { erro: 'falha ao falar com ' + motor });
};
