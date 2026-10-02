# FlowChat AI — React + Node + Langflow

Interface moderna de chat para um fluxo Langflow, com React/Vite no frontend e Node/Express no backend.

## Recursos
- Nova conversa e histórico persistente em localStorage
- session_id independente por conversa
- Markdown/GFM nas respostas
- tema claro/escuro
- copiar respostas
- layout responsivo
- backend proxy para não expor a chave do Langflow no navegador

## 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Edite `.env` e informe `LANGFLOW_URL` e `LANGFLOW_API_KEY`.

## 2. Frontend
Em outro terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Abra http://localhost:5173.

## Langflow
O payload enviado é:
```json
{"input_value":"mensagem","output_type":"chat","input_type":"chat","session_id":"uuid-da-conversa"}
```
Se a estrutura de retorno do seu fluxo for diferente, ajuste `backend/src/services/langflow.service.js`.

## Segurança
Nunca coloque a API key no React/Vite. Variáveis `VITE_*` ficam disponíveis ao navegador. A chave deve permanecer no `.env` do backend.
