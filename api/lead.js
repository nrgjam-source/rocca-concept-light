const {createHash}=require('node:crypto');
module.exports = async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false});}
 const origin=req.headers.origin;const allowed=new Set(['https://rocca-concept-light.vercel.app',process.env.VERCEL_URL&&'https://'+process.env.VERCEL_URL]);
 if(!origin||!allowed.has(origin))return res.status(403).json({ok:false,message:'Отправьте заявку с сайта ROCCA.'});
 if(!process.env.RESEND_API_KEY||!process.env.ROCCA_FORM_FROM)return res.status(503).json({ok:false,message:'Онлайн-отправка пока недоступна. Напишите на info@granit47spb.ru или позвоните нам.'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({ok:false});
 if(Number(req.headers['content-length'])>4.3*1024*1024)return res.status(413).json({ok:false,message:'Материалы превышают допустимый размер.'});
 const b=req.body;
 if(!b||typeof b!=='object'||b.website||!Number.isFinite(b.elapsed)||b.elapsed<1500)return res.status(400).json({ok:false,message:'Проверьте поля формы и повторите отправку.'});
 const productSet=new Set(['Столешница','Лестница','Камин','Подоконники','Ванная','Входная группа','Кухонный остров','Панно','Индивидуальное изделие','Другое']);
 if(typeof b.name!=='string'||!b.name.trim()||b.name.length>100||typeof b.contact!=='string'||!b.contact.trim()||b.contact.length>150||!productSet.has(b.product)||typeof b.task!=='string'||b.task.length>4000||!/^[a-f0-9-]{36}$/i.test(b.requestId||''))return res.status(400).json({ok:false,message:'Укажите имя, контакт и изделие.'});
 const attachments=b.attachments||[];if(!Array.isArray(attachments)||attachments.length>5)return res.status(400).json({ok:false,message:'Можно прикрепить до 5 файлов.'});
 let total=0;
 for(const f of attachments){if(typeof f.filename!=='string'||f.filename.length>180||/[\/\\\r\n]/.test(f.filename)||!/^.+\.(pdf|dwg|dxf|jpe?g|png)$/i.test(f.filename)||typeof f.content!=='string'||(f.content.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(f.content)))return res.status(400).json({ok:false,message:'Поддерживаются PDF, DWG, DXF, JPG и PNG.'});total+=Buffer.byteLength(f.content,'base64');}
 if(total>3*1024*1024)return res.status(413).json({ok:false,message:'Общий размер файлов — до 3 МБ.'});
 const text=['ROCCA — заявка на расчёт','Имя: '+b.name.trim(),'Контакт: '+b.contact.trim(),'Изделие: '+b.product,'Комментарий: '+(b.task.trim()||'Без комментария')].join('\n\n');
 const fingerprint=createHash('sha256').update(JSON.stringify({text,attachments})).digest('hex');
 try{const r=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(15000),headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'rocca-private/'+b.requestId+'/'+fingerprint.slice(0,24)},body:JSON.stringify({from:process.env.ROCCA_FORM_FROM,to:['info@granit47spb.ru'],subject:'ROCCA — '+b.product,text,attachments})});const data=await r.json();if(!r.ok||!data.id){console.error('ROCCA mail provider rejected request',r.status);return res.status(502).json({ok:false,message:'Не удалось отправить материалы. Попробуйте ещё раз или свяжитесь с нами.'});}return res.status(200).json({ok:true});}catch{console.error('ROCCA mail provider unavailable');return res.status(502).json({ok:false,message:'Не удалось отправить материалы. Попробуйте ещё раз или свяжитесь с нами.'});}
};
