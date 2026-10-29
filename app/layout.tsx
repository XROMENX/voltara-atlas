import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Voltara Atlas | ولتارا',description:'اطلس تعاملی تجهیزات برق، مدل سه‌بعدی و منابع فنی',icons:{icon:'/icon.svg'}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="fa" dir="rtl"><body><a className="skip" href="#main">رفتن به محتوای اصلی</a>{children}</body></html>}
