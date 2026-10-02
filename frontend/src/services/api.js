const BASE=import.meta.env.VITE_API_URL || 'http://localhost:3001';
export async function sendToAI(message,sessionId){
 const r=await fetch(`${BASE}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,sessionId})});
 const data=await r.json().catch(()=>({})); if(!r.ok) throw new Error(data.message||data.error||'Falha ao consultar a IA.'); return data.message ?? data.answer;
}
