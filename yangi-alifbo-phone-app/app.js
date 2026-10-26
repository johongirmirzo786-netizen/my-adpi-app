const $ = id => document.getElementById(id);
const input = $('inputText'), result = $('resultText'), standard = $('standardText');
const resultPanel = $('resultPanel'), count = $('count'), convertBtn = $('convertBtn');
const historyItems = [];
const commonFixes = [
  [/\boqituvchi\b/gi, 'o‘qituvchi'],
  [/\boqituvchilar\b/gi, 'o‘qituvchilar'],
  [/\buniversetet\b/gi, 'universitet'],
  [/\buniversiteta\b/gi, 'universitetga'],
  [/\bozbek\b/gi, 'o‘zbek']
];
function simpleSpellcheck(text) {
  // Conservative sample dictionary only; not a complete Uzbek spellchecker.
  return commonFixes.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);
}
function convertAlphabet(text) {
  let out = text.replace(/[oO](['’‘ʻʼ`´])/g, m => m[0] === 'O' ? 'Ö' : 'ö')
                .replace(/[gG](['’‘ʻʼ`´])/g, m => m[0] === 'G' ? 'Ğ' : 'ğ');
  out = out.replace(/sh/gi, m => m === 'SH' ? 'Ş' : (m[0] === 'S' ? 'Ş' : 'ş'));
  out = out.replace(/ch/gi, m => m === 'CH' ? 'Ç' : (m[0] === 'C' ? 'Ç' : 'ç'));
  return out;
}
function getApiUrl() { return localStorage.getItem('yangiAlifboApiUrl') || ''; }
async function convert() {
  const raw = input.value.trim();
  if (!raw) { input.focus(); alert('Avval matn kiriting.'); return; }
  convertBtn.disabled = true; convertBtn.textContent = 'Tekshirilmoqda...';
  try {
    let corrected = raw, converted = raw;
    const wantsSpell = $('spellcheck').checked, wantsConvert = $('convert').checked;
    const apiUrl = getApiUrl();
    if (wantsSpell && apiUrl) {
      const response = await fetch(apiUrl, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:raw})});
      if (!response.ok) throw new Error('API javobi xato');
      const data = await response.json();
      corrected = data.corrected_standard || raw;
      converted = data.converted || convertAlphabet(corrected);
      if (!wantsConvert) converted = corrected;
    } else {
      if (wantsSpell) corrected = simpleSpellcheck(raw);
      converted = wantsConvert ? convertAlphabet(corrected) : corrected;
    }
    standard.value = corrected; result.value = converted;
    $('status').textContent = wantsSpell && !apiUrl ? 'Asosiy tekshiruv' : 'Tayyor';
    resultPanel.classList.remove('hidden');
    historyItems.unshift({output:converted,date:new Date().toLocaleString()});
    if (historyItems.length > 10) historyItems.pop();
  } catch (_) {
    alert('Imlo serveriga ulanib bo‘lmadi. API manzilini tekshiring.');
  } finally {
    convertBtn.disabled = false; convertBtn.textContent = '✦ Matnni tekshirish';
  }
}
input.addEventListener('input', () => count.textContent = input.value.length);
convertBtn.addEventListener('click', convert);
$('copyBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(result.value); }
  catch { result.select(); document.execCommand('copy'); }
  $('copyBtn').textContent = '✓ Nusxalandi';
  setTimeout(() => $('copyBtn').textContent = '▢ Nusxalash', 1400);
});
$('shareBtn').addEventListener('click', async () => {
  if (navigator.share) { try { await navigator.share({title:'YangiAlifbo',text:result.value}); } catch (_) {} }
  else { try { await navigator.clipboard.writeText(result.value); alert('Matn nusxalandi.'); } catch (_) { alert('Ulashish bu brauzerda qo‘llanmaydi.'); } }
});
$('settingsNav').addEventListener('click', () => { $('apiUrl').value = getApiUrl(); $('settingsDialog').showModal(); });
$('saveSettings').addEventListener('click', e => {
  e.preventDefault(); const value = $('apiUrl').value.trim();
  if (value) localStorage.setItem('yangiAlifboApiUrl', value); else localStorage.removeItem('yangiAlifboApiUrl');
  $('settingsDialog').close();
});
$('historyNav').addEventListener('click', () => {
  const list = $('historyList'); list.replaceChildren();
  if (!historyItems.length) list.textContent = 'Hozircha tarix bo‘sh.';
  historyItems.forEach(item => { const card = document.createElement('div'); card.className='history-item'; card.textContent = item.date + '\n' + item.output; list.appendChild(card); });
  $('historyDialog').showModal();
});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}