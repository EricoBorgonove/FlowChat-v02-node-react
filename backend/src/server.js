import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (_req,res)=>res.json({ok:true,service:'langflow-chat-backend'}));
app.use('/api/chat', chatRoutes);
app.use((err,_req,res,_next)=>{ console.error(err); res.status(err.status||500).json({error:err.message||'Erro interno.'}); });
app.listen(PORT,()=>console.log(`Backend em http://localhost:${PORT}`));
