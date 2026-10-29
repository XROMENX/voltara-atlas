"use client";
import {useState, type FormEvent} from 'react';
import {safeReturnTo} from '../../lib/return-to';
type Mode='login'|'register'|'forgot'|'reset';
export default function AuthForm({mode,returnTo,token,error:initialError}:{mode:Mode;returnTo?:string;token?:string;error?:string}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(initialError?'پیوند معتبر نیست یا منقضی شده است. دوباره درخواست بدهید.':''),[done,setDone]=useState(false);
 const target=safeReturnTo(returnTo);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage('');const data=new FormData(e.currentTarget);const email=String(data.get('email')||'').trim();const password=String(data.get('password')||'');
 let endpoint='',body:Record<string,unknown>={};
 if(mode==='login'){endpoint='sign-in/email';body={email,password,callbackURL:target};}
 if(mode==='register'){endpoint='sign-up/email';body={email,password,name:String(data.get('name')||'').trim(),callbackURL:'/login?verified=1'};}
 if(mode==='forgot'){endpoint='request-password-reset';body={email,redirectTo:'/reset-password'};}
 if(mode==='reset'){endpoint='reset-password';body={token,newPassword:password};}
 try{const response=await fetch('/api/auth/'+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json() as {code?:string};if(!response.ok){setMessage(result.code==='EMAIL_NOT_VERIFIED'?'ابتدا ایمیل خود را تأیید کنید.':'درخواست انجام نشد. اطلاعات را بررسی کنید؛ در صورت نیاز پیوند بازیابی یا تأیید جدید بخواهید.');return;}
 if(mode==='login'){location.assign(target);return;}setDone(true);setMessage(mode==='register'?'پیوند تأیید به ایمیل شما ارسال شد. پس از تأیید وارد شوید.':mode==='forgot'?'اگر حسابی با این ایمیل وجود داشته باشد، پیوند بازیابی ارسال می‌شود.':'گذرواژه تغییر کرد. اکنون وارد شوید.');
 }catch{setMessage('ارتباط برقرار نشد. دوباره تلاش کنید.');}finally{setBusy(false);}}
 async function resend(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);try{await fetch('/api/auth/send-verification-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:new FormData(e.currentTarget).get('email'),callbackURL:'/login?verified=1'})});setMessage('اگر حساب نیاز به تأیید داشته باشد، ایمیل تأیید ارسال می‌شود.');}catch{setMessage('ارتباط برقرار نشد.');}finally{setBusy(false);}}
 return <><p>{mode==='login'?'برای مشاهده مدل سه‌بعدی و استفاده از یادداشت‌ها وارد شوید.':mode==='register'?'حساب شخصی ولتارا بسازید.':mode==='forgot'?'ایمیل حساب را وارد کنید تا پیوند بازیابی ارسال شود.':'گذرواژه جدید را وارد کنید.'}</p>{!done&&<form onSubmit={submit}>
 {mode==='register'&&<label>نام<input name="name" required maxLength={100} autoComplete="name"/></label>}
 {mode!=='reset'&&<label>ایمیل<input name="email" type="email" dir="ltr" required autoComplete="email" maxLength={254}/></label>}
 {mode!=='forgot'&&<label>گذرواژه<input name="password" type="password" dir="ltr" required minLength={mode==='login'?1:12} maxLength={128} autoComplete={mode==='login'?'current-password':'new-password'}/>{mode!=='login'&&<small>حداقل ۱۲ نویسه</small>}</label>}
 <button disabled={busy||(mode==='reset'&&!token)}>{busy?'در حال انجام…':({login:'ورود',register:'ساخت حساب',forgot:'ارسال پیوند بازیابی',reset:'ذخیره گذرواژه'})[mode]}</button></form>}
 <p role="status" aria-live="polite">{message}</p><nav><a href={'/login?returnTo='+encodeURIComponent(target)}>ورود</a><a href={'/register?returnTo='+encodeURIComponent(target)}>ساخت حساب</a><a href="/forgot-password">فراموشی گذرواژه</a></nav>
 {mode==='login'&&<details><summary>دریافت دوباره ایمیل تأیید</summary><form onSubmit={resend}><label>ایمیل<input name="email" type="email" required dir="ltr" autoComplete="email"/></label><button disabled={busy}>ارسال دوباره</button></form></details>}</>;
}
