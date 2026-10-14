'use strict';
/* KayraPOS Patron · web (iPhone / tarayıcı) köprüsü: Android uygulamasındaki Kayra.cloud işlevinin tarayıcı karşılığı.
   Oturum anahtarı yalnız bu sekmede (sessionStorage) tutulur. */
(() => {
  const CLOUD = window.KAYRA_CLOUD || 'https://kayra-patron-merkez.sukrutek19.chatgpt.site/api/patron';
  let token = ''; try { token = sessionStorage.getItem('kp_t') || ''; } catch { }
  const keep = t => { token = t || ''; try { t ? sessionStorage.setItem('kp_t', t) : sessionStorage.removeItem('kp_t'); } catch { } };
  const reply = (id, r) => setTimeout(() => window.nativeReply && window.nativeReply(id, r), 0);
  window.Kayra = {
    cloud(id, method, path, body) {
      if (!/^\/[a-z/-]+(?:\?[a-zA-Z0-9_=&%.:-]*)?$/.test(path || '')) { reply(id, { ok: false, error: 'İstek geçersiz.' }); return; }
      const post = method === 'POST', ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 30000);
      const headers = { Accept: 'application/json' }; if (token) headers.Authorization = 'Bearer ' + token; if (post) headers['Content-Type'] = 'application/json; charset=utf-8';
      fetch(CLOUD + path, { method: post ? 'POST' : 'GET', headers, body: post ? (body || '{}') : undefined, cache: 'no-store', redirect: 'error', signal: ctl.signal, credentials: 'omit' })
        .then(async res => {
          let r; try { r = await res.json(); } catch { r = { ok: false, error: 'Patron bağlantı hizmetine erişilemiyor. İnterneti kontrol edin.' }; }
          r.status = res.status; if (res.status >= 400 && r.ok) r.ok = false;
          if (r.ok && (path === '/login' || path === '/register')) { if (!/^[A-Za-z0-9._-]{16,256}$/.test(r.token || '')) { reply(id, { ok: false, error: 'Oturum anahtarı geçersiz.' }); return; } keep(r.token); delete r.token; }
          if (path === '/logout' || res.status === 401) keep('');
          reply(id, r);
        })
        .catch(e => reply(id, { ok: false, error: e && e.name === 'AbortError' ? 'Bağlantı zaman aşımına uğradı.' : 'Patron bağlantı hizmetine tarayıcıdan ulaşılamadı. İnterneti kontrol edin.' }))
        .finally(() => clearTimeout(timer));
    },
    cloudLock() { keep(''); },
    minimize() { },
    scan() { setTimeout(() => window.nativeScan && window.nativeScan(null), 0); }
  };
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
})();
