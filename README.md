# Conexões ESG

MVP do **InovaHACK SENAI Porto 2026** (10 a 13/08/2026), desafio "Copiloto ESG" da AEVO: um chatbot que recebe ideias de colaboradores, classifica entre Ambiental, Social e Governança e devolve um plano de ação com indicadores, riscos e ROI.

**Demo online:** https://aevosenai.netlify.app/ (fora do ar no momento; em correção)

## O problema
A AEVO recebe mais ideias de melhoria de colaboradores do que a equipe consegue analisar à mão. A solução automatiza a triagem: indica se a ideia é viável e se está dentro dos parâmetros ESG, economizando tempo da empresa.

## Como funciona
1. `filtro.js` barra textos ofensivos, aleatórios ou perguntas sobre o sistema antes de qualquer envio.
2. `app.js` tenta a IA (Groq e depois Gemini, nessa ordem, configurável em `config.js`).
3. Se a IA falhar ou demorar, `motor-local.js` faz uma triagem local no navegador.

## Como rodar
1. Copie `config.example.js` para `config.js`, na mesma pasta. **O `index.html` carrega esse arquivo**, então ele precisa existir, mesmo sem chaves.
2. Se quiser usar a IA, cole as suas chaves nas listas do `config.js`. Com as listas vazias, o app usa só a triagem local.
3. Abra o `index.html` no navegador.

## Chaves de API: cuidado
- As chaves **não estão neste repositório**. O `config.js` está no `.gitignore`, para não ir ao GitHub por engano.
- Durante o hackathon as chaves ficaram no código, por ser uma demonstração rápida. Depois do evento elas foram retiradas daqui, e **as antigas devem ser revogadas** nos painéis do Gemini e da Groq.
- O app chama as APIs direto do navegador. Por isso, qualquer chave colocada no `config.js` de um site publicado **fica visível para quem abrir o código da página**. Para publicar de verdade, use uma chave com cota baixa, ou leve a chamada para um servidor.

## Arquivos
| Arquivo | Para que serve |
|---|---|
| `index.html`, `style.css` | A página e o visual |
| `app.js` | A aplicação: chama a IA e monta o plano de ação |
| `filtro.js` | Filtro de textos antes do envio |
| `motor-local.js` | Triagem local, sem internet |
| `config.example.js` | Modelo de configuração (copie para `config.js`) |
| `netlify.toml` | Publicação na Netlify e cabeçalhos de segurança básicos |
| `logo.svg` | Logotipo |

## Hospedagem
`netlify.toml` publica a pasta diretamente e adiciona cabeçalhos de segurança básicos.
