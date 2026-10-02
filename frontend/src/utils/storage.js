const KEY='flowchat.conversations.v1';
export const loadConversations=()=>{ try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]} };
export const saveConversations=(items)=>localStorage.setItem(KEY,JSON.stringify(items));
export const newConversation=()=>({id:crypto.randomUUID(),sessionId:crypto.randomUUID(),title:'Nova conversa',createdAt:Date.now(),updatedAt:Date.now(),messages:[]});
