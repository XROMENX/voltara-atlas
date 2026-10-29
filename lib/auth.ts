import { env } from 'cloudflare:workers';
import { createVoltaraAuth } from './auth-options';
export function getAuth() {
 if (!env.DB || !env.BETTER_AUTH_SECRET || !env.BETTER_AUTH_URL) throw new Error('Independent authentication is not configured');
 return createVoltaraAuth({database:env.DB,secret:env.BETTER_AUTH_SECRET,baseURL:env.BETTER_AUTH_URL,sendEmail:sendMail});
}

async function sendMail(to: string, subject: string, url: string) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) throw new Error('Email delivery is not configured');
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({from: env.EMAIL_FROM, to: [to], subject, text: `${subject}\n\n${url}\n\nاگر این درخواست را ثبت نکرده‌اید، این ایمیل را نادیده بگیرید.`}),
  });
  if (!result.ok) throw new Error('Email delivery failed');
}
