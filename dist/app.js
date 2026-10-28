import { modules } from './modules.js';
const container = document.querySelector('#future');
for (const item of modules.filter(module => module.id !== 'power-transformer')) {
  const available = item.status === 'available' && item.url;
  const card = document.createElement(available ? 'a' : 'article');
  card.className = 'future-card';
  if (available) card.href = item.url;
  const top = document.createElement('div'); top.className = 'top';
  const icon = document.createElement('span'); icon.className = 'symbol'; icon.textContent = item.symbol || 'ϟ'; icon.setAttribute('aria-hidden', 'true');
  const badge = document.createElement('span'); badge.className = 'planned'; badge.textContent = available ? 'آماده کاوش' : 'ماژول آینده';
  const title = document.createElement('h4'); title.textContent = item.title;
  const english = document.createElement('p'); english.dir = 'ltr'; english.textContent = item.english;
  top.append(icon, badge); card.append(top, title, english); container.append(card);
}
const liveCount = modules.filter(module => module.status === 'available' && module.url).length;
document.querySelector('.count').textContent = `${liveCount.toLocaleString('fa-IR')} ماژول فعال / در حال گسترش`;
document.querySelector('.feature').href = modules.find(module => module.id === 'power-transformer').url;
