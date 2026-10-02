import {useEffect,useMemo,useState} from 'react'; import {loadConversations,newConversation,saveConversations} from '../utils/storage'; import {sendToAI} from '../services/api';
export function useChat(){
 const [conversations,setConversations]=useState(()=>loadConversations()); const [activeId,setActiveId]=useState(()=>loadConversations()[0]?.id||null); const [loading,setLoading]=useState(false);
 useEffect(()=>{saveConversations(conversations);},[conversations]);
 const active=useMemo(()=>conversations.find(c=>c.id===activeId)||null,[conversations,activeId]);
 const create=()=>{const c=newConversation();setConversations(v=>[c,...v]);setActiveId(c.id)};
 const remove=(id)=>{const rest=conversations.filter(c=>c.id!==id);setConversations(rest);if(activeId===id)setActiveId(rest[0]?.id||null)};
 const rename=(id,title)=>setConversations(v=>v.map(c=>c.id===id?{...c,title:title.trim()||'Nova conversa'}:c));
 const clear=()=>{setConversations([]);setActiveId(null)};
 const send=async(text)=>{let c=active;if(!c){c=newConversation();setConversations(v=>[c,...v]);setActiveId(c.id)} const user={id:crypto.randomUUID(),role:'user',content:text,createdAt:Date.now()}; const id=c.id; setConversations(v=>v.map(x=>x.id===id?{...x,title:x.messages.length?x.title:text.slice(0,42),updatedAt:Date.now(),messages:[...x.messages,user]}:x)); setLoading(true); try{const answer=await sendToAI(text,c.sessionId);const bot={id:crypto.randomUUID(),role:'assistant',content:answer,createdAt:Date.now()};setConversations(v=>v.map(x=>x.id===id?{...x,updatedAt:Date.now(),messages:[...x.messages,bot]}:x));}catch(e){const bot={id:crypto.randomUUID(),role:'assistant',error:true,content:`Não consegui obter a resposta. ${e.message}`,createdAt:Date.now()};setConversations(v=>v.map(x=>x.id===id?{...x,messages:[...x.messages,bot]}:x));}finally{setLoading(false)}};
 return {conversations,active,activeId,setActiveId,loading,create,remove,rename,clear,send};
}
