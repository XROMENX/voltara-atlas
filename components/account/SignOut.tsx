"use client";
import {useState} from 'react';
export default function SignOut(){const [error,setError]=useState('');return <><button onClick={async()=>{try{const response=await fetch('/api/auth/sign-out',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!response.ok)throw Error();location.assign('/login');}catch{setError('خروج انجام نشد؛ دوباره تلاش کنید.');}}}>خروج از حساب</button><p role="alert">{error}</p></>;}
