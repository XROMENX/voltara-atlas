export interface Equipment {id:string; title:string; english:string; category:string; status:'available'|'planned'; url?:string; voltage?:string; description?:string; features?:string[]; revision?:string; reference?:string; review?:string;}
/** The catalogue is the single source for equipment metadata. Stable IDs must not change. */
export const equipment: Equipment[] = [
  { id: 'power-transformer', title: 'ترانسفورماتور قدرت', english: 'Power Transformer', category: 'سیستم‌های قدرت', voltage: '230 / 132 kV', status: 'available', url: '/transformer/index.html', description: 'ساختار ترانسفورماتور را در سه‌بعد بررسی کنید، اجزا را بشناسید و نقش هر بخش را با مرجع فنی بخوانید.', features: ['مدل سه‌بعدی تعاملی', 'نمای انفجاری', 'برش داخلی و ایکس‌ری'], revision: 'v14', reference: 'Raychem RPG', review: 'مدل آموزشی؛ جانمایی نماینده و بدون مقیاس' },
  { id: 'switchgear', title: 'کلیدها و تجهیزات قطع', english: 'Switchgear', category: 'سیستم‌های قدرت', status: 'planned' },
  { id: 'electric-machines', title: 'ماشین‌های الکتریکی', english: 'Electric Machines', category: 'تبدیل انرژی', status: 'planned' },
  { id: 'protection', title: 'حفاظت و کنترل', english: 'Protection & Control', category: 'حفاظت', status: 'planned' },
];
