# Conexões ESG

MVP do **InovaHACK SENAI Porto 2026** (10 a 13/08/2026), desafio "Copiloto ESG" da AEVO: um chatbot que recebe ideias de colaboradores, classifica entre Ambiental, Social e Governança e devolve um plano de ação com indicadores, riscos e ROI.

**Demo online:** https://aevosenai.netlify.app/

## O problema
A AEVO recebe mais ideias de melhoria de colaboradores do que a equipe consegue analisar à mão. A solução automatiza a triagem: indica se a ideia é viável e se está dentro dos parâmetros ESG, economizando tempo da empresa.

## Como funciona
1. `filtro.js` barra textos ofensivos, aleatórios ou perguntas sobre o sistema antes de qualquer envio.
2. `app.js` tenta a IA pela função da Netlify (Groq e depois Gemini, nessa ordem).
3. Se a IA falhar ou demorar, `motor-local.js` faz uma triagem local no navegador.

## Como publicar na Netlify (recomendado)
As chaves ficam no servidor, e o navegador nunca as vê. A função `netlify/functions/ia.js` lê as chaves das variáveis de ambiente e fala com o Gemini e a Groq.

1. Publique este repositório na Netlify (o `netlify.toml` já aponta a pasta e as funções).
2. Em **Site configuration > Environment variables**, crie:
   - `GEMINI_API_KEY`: a chave do Gemini (aistudio.google.com/apikey);
   - `GROQ_API_KEY`: a chave da Groq (console.groq.com/keys).
   Para usar mais de uma chave, separe por vírgula; se a primeira estourar a cota, a próxima assume.
3. Opcional: `GEMINI_MODEL` e `GROQ_MODEL`, para trocar os modelos (os padrões são `gemini-flash-latest` e `openai/gpt-oss-120b`).
4. Publique de novo (**Deploys > Trigger deploy**) depois de criar ou mudar as variáveis.

**Importante:** as variáveis só funcionam com a função. Se você publicar apenas os arquivos soltos (arrastando uma pasta, sem o `netlify/functions`), a função não existe e o app usa só a triagem local.

## Como rodar na sua máquina
- Abrir o `index.html` direto no navegador funciona só com a triagem local (sem internet e sem IA).
- Para testar com IA localmente, copie `config.example.js` para `config.js` e cole as suas chaves. O arquivo `config.js` é opcional, está no `.gitignore`, e chama o Gemini e a Groq direto do navegador, então use só no seu computador.

## Chaves de API: cuidado
- As chaves **não estão neste repositório**.
- Durante o hackathon as chaves ficaram no código de um site público, então **as antigas devem ser revogadas** nos painéis do Gemini e da Groq. Use chaves novas.
- Com a função, a chave não chega ao navegador. A função recusa pedidos de outros sites, limita o tamanho do pedido e da resposta e fixa os modelos. Mas qualquer pessoa que abra o seu site ainda consegue usar a IA por ele, então use chaves com cota baixa e acompanhe o uso nos painéis.

## Arquivos
| Arquivo | Para que serve |
|---|---|
| `index.html`, `style.css` | A página e o visual |
| `app.js` | A aplicação: chama a IA (pela função) e monta o plano de ação |
| `filtro.js` | Filtro de textos antes do envio |
| `motor-local.js` | Triagem local, sem internet |
| `netlify/functions/ia.js` | Função da Netlify: guarda as chaves no servidor e chama a IA |
| `config.example.js` | Modelo de configuração para testar localmente (copie para `config.js`) |
| `netlify.toml` | Publicação na Netlify e cabeçalhos de segurança básicos |
| `logo.svg` | Logotipo |

## Hospedagem
`netlify.toml` publica a pasta diretamente e adiciona cabeçalhos de segurança básicos.
