/*
 * AliStyle Blog — feature layer (loaded after main.js)
 * Theme toggle, favorites, compare, smart filters + search suggestions, hot strip,
 * scroll reveal, floating messengers, reader vote/feedback, reading progress, PWA.
 * Uses globals from main.js: reviewsData, siteSettingsData, currentLang, normalizePrices, normalizeRating.
 */
(function () {
    'use strict';

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const lang = () => (typeof currentLang !== 'undefined' ? currentLang : 'ru');
    const reviews = () => (typeof reviewsData !== 'undefined' ? reviewsData : []);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const store = {
        get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
    };

    const T = {
        ru: {
            sort: 'Сортировка', sortNew: 'Сначала новые', sortPriceAsc: 'Цена: по возрастанию', sortPriceDesc: 'Цена: по убыванию',
            sortRating: 'По рейтингу', sortDiscount: 'По выгоде', maxPrice: 'Цена до', favOnly: '♥ Избранное', found: 'Найдено',
            hot: '🔥 Максимальная выгода', save: 'выгода', compare: 'Сравнить', compareTitle: 'Сравнение товаров', clear: 'Очистить',
            image: 'Фото', price: 'Цена на Ali', local: 'В Израиле', savings: 'Экономия', rating: 'Рейтинг', pros: 'Плюсы', buy: 'Купить',
            selected: 'выбрано', favEmpty: 'В избранном пока пусто — нажмите ♥ на карточке', noMatch: 'Ничего не найдено — измените фильтры',
            voteTitle: 'Стоит ли покупать этот товар?', voteUp: '👍 Да, стоит', voteDown: '👎 Нет, не стоит',
            voteThanks: 'Спасибо! Ваш голос сохранён на этом устройстве.', fbTitle: 'Ваш отзыв о товаре', fbName: 'Ваше имя', fbMsg: 'Расскажите, покупали ли вы этот товар и что думаете…',
            fbSend: 'Отправить отзыв', fbOk: '✅ Спасибо! Отзыв отправлен на модерацию.', fbErr: '⚠️ Не удалось отправить. Попробуйте позже.', theme: 'Тема', favs: 'Избранное'
        },
        he: {
            sort: 'מיון', sortNew: 'החדשים ראשונים', sortPriceAsc: 'מחיר: מהנמוך לגבוה', sortPriceDesc: 'מחיר: מהגבוה לנמוך',
            sortRating: 'לפי דירוג', sortDiscount: 'לפי חיסכון', maxPrice: 'מחיר עד', favOnly: '♥ מועדפים', found: 'נמצאו',
            hot: '🔥 החיסכון הגדול ביותר', save: 'חיסכון', compare: 'השוואה', compareTitle: 'השוואת מוצרים', clear: 'ניקוי',
            image: 'תמונה', price: 'מחיר באלי', local: 'בארץ', savings: 'חיסכון', rating: 'דירוג', pros: 'יתרונות', buy: 'לקנייה',
            selected: 'נבחרו', favEmpty: 'אין עדיין מועדפים — לחצו ♥ על הכרטיס', noMatch: 'לא נמצאו תוצאות — שנו את הסינון',
            voteTitle: 'האם כדאי לקנות את המוצר?', voteUp: '👍 כן, כדאי', voteDown: '👎 לא, לא כדאי',
            voteThanks: 'תודה! ההצבעה נשמרה במכשיר זה.', fbTitle: 'חוות הדעת שלך על המוצר', fbName: 'השם שלך', fbMsg: 'ספרו אם קניתם את המוצר ומה דעתכם…',
            fbSend: 'שליחת חוות דעת', fbOk: '✅ תודה! חוות הדעת נשלחה לאישור.', fbErr: '⚠️ השליחה נכשלה. נסו שוב מאוחר יותר.', theme: 'ערכת נושא', favs: 'מועדפים'
        }
    };
    const t = k => (T[lang()] || T.ru)[k] || k;

    const ICON = {
        heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
        cmp: '<svg viewBox="0 0 24 24"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
        sun: '<svg class="theme-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
        moon: '<svg class="theme-moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
    };

    /* ================= Theme ================= */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const meta = $('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#07070d' : '#FCFCFD');
    }
    function initTheme() {
        const actions = $('.nav-actions');
        if (!actions || $('#nx-theme-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'nx-theme-btn';
        btn.className = 'nx-icon-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Theme');
        btn.innerHTML = ICON.sun + ICON.moon;
        btn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            store.set('alistyle_theme', next);
        });
        const langBtn = $('#lang-toggle');
        actions.insertBefore(btn, langBtn || null);

        if ($('#reviews-grid')) {
            const fav = document.createElement('button');
            fav.id = 'nx-fav-btn';
            fav.className = 'nx-icon-btn';
            fav.type = 'button';
            fav.setAttribute('aria-label', 'Favorites');
            fav.innerHTML = ICON.heart + '<span class="nx-badge" id="nx-fav-count"></span>';
            fav.addEventListener('click', () => { state.fav = !state.fav; syncFavUi(); apply(); if (state.fav) { const g = $('#reviews-grid'); g && g.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
            actions.insertBefore(fav, btn);
        }
    }

    /* ================= Shared helpers ================= */
    const getReview = id => reviews().find(r => r.id === id);
    const langData = r => r[lang()] || r.ru || r.he || {};
    const priceInfo = r => (typeof normalizePrices === 'function' ? normalizePrices(r) : { priceAliIls: Number(r.priceAli) || 0, priceAliUsd: null, priceLocal: Number(r.priceLocal) || 0, savings: 0, discountVal: 0, isCollection: !!r.isCollection });
    const ratingOf = r => (typeof normalizeRating === 'function' ? parseFloat(normalizeRating(r.rating).outOf5) : Number(r.rating) || 0);

    /* ================= Index page ================= */
    const state = { fav: false, sort: 'new', max: null };
    let favs = store.get('alistyle_fav', []);
    let cmp = [];
    let maxAll = 0;
    let gridTimer = null;

    function syncFavUi() {
        const c = $('#nx-fav-count');
        if (c) c.textContent = favs.length ? String(favs.length) : '';
        const b = $('#nx-fav-btn');
        if (b) b.classList.toggle('active', state.fav);
        $$('.nx-chip[data-nx="fav"]').forEach(x => x.classList.toggle('on', state.fav));
    }

    function enhanceCards() {
        const grid = $('#reviews-grid');
        if (!grid) return;
        const cards = $$('.article-card', grid);
        let max = 0;
        cards.forEach((card, idx) => {
            const link = card.querySelector('a[href*="review.html?id="]');
            if (!link) { card.dataset.nxIdx = idx; return; }
            const id = decodeURIComponent((link.getAttribute('href').split('id=')[1] || '').split('&')[0]);
            const r = getReview(id);
            if (!r) return;
            const p = priceInfo(r);
            card.dataset.nxId = id;
            card.dataset.nxIdx = idx;
            card.dataset.nxPrice = p.priceAliIls;
            card.dataset.nxDiscount = p.isCollection ? 0 : p.discountVal;
            card.dataset.nxRating = ratingOf(r);
            card.dataset.nxCol = p.isCollection ? '1' : '';
            max = Math.max(max, p.priceAliIls);
            if (!card.classList.contains('nx-reveal')) { card.classList.add('nx-reveal'); card.style.transitionDelay = ((idx % 3) * 80) + 'ms'; observeReveal(card); }
            if (card.querySelector('.card-actions')) return;
            const wrap = card.querySelector('.article-img-wrapper');
            if (!wrap) return;
            const box = document.createElement('div');
            box.className = 'card-actions';
            const f = document.createElement('button');
            f.type = 'button'; f.className = 'card-act-btn fav' + (favs.includes(id) ? ' on' : ''); f.setAttribute('aria-label', t('favs')); f.innerHTML = ICON.heart;
            f.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                favs = favs.includes(id) ? favs.filter(x => x !== id) : favs.concat(id);
                store.set('alistyle_fav', favs);
                f.classList.toggle('on', favs.includes(id));
                f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop');
                syncFavUi();
                if (state.fav) apply();
            });
            box.appendChild(f);
            if (!p.isCollection) {
                const c = document.createElement('button');
                c.type = 'button'; c.className = 'card-act-btn cmp' + (cmp.includes(id) ? ' on' : ''); c.setAttribute('aria-label', t('compare')); c.innerHTML = ICON.cmp;
                c.addEventListener('click', e => {
                    e.preventDefault(); e.stopPropagation();
                    if (cmp.includes(id)) cmp = cmp.filter(x => x !== id);
                    else { cmp.push(id); if (cmp.length > 3) cmp.shift(); }
                    syncCmpUi();
                });
                box.appendChild(c);
            }
            wrap.appendChild(box);
        });
        maxAll = Math.max(50, Math.ceil(max / 50) * 50);
        if (state.max == null || state.max > maxAll) state.max = maxAll;
    }

    let revealIO = null;
    function observeReveal(el) {
        if (!('IntersectionObserver' in window)) { el.classList.add('nx-in'); return; }
        if (!revealIO) {
            revealIO = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('nx-in'); revealIO.unobserve(en.target); } }), { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
        }
        revealIO.observe(el);
    }

    function ensureTop() {
        const grid = $('#reviews-grid');
        if (!grid) return null;
        let top = $('#nx-top');
        if (!top) {
            top = document.createElement('div');
            top.id = 'nx-top';
            grid.parentNode.insertBefore(top, grid);
        }
        return top;
    }

    function buildHot() {
        const top = ensureTop();
        if (!top) return;
        let hot = $('#nx-hot', top);
        const items = reviews().map(r => ({ r, p: priceInfo(r) })).filter(x => !x.p.isCollection && x.p.savings > 0 && x.r.image)
            .sort((a, b) => b.p.discountVal - a.p.discountVal || b.p.savings - a.p.savings).slice(0, 8);
        if (!items.length) { if (hot) hot.remove(); return; }
        if (!hot) { hot = document.createElement('section'); hot.id = 'nx-hot'; hot.className = 'nx-hot'; top.prepend(hot); }
        hot.innerHTML = '<div class="nx-hot-title">' + esc(t('hot')) + '</div><div class="nx-hot-row">' + items.map(({ r, p }) =>
            '<a class="nx-hot-item" href="review.html?id=' + encodeURIComponent(r.id) + '"><img loading="lazy" src="' + esc(r.image) + '" alt="" onerror="this.src=\'logo.png\'"><div class="nx-hot-meta"><div class="nx-hot-name">' + esc(langData(r).title) + '</div><div class="nx-hot-price">₪' + p.priceAliIls + '<span class="nx-hot-save">' + esc(t('save')) + ' ₪' + p.savings + '</span></div></div></a>').join('') + '</div>';
    }

    function buildToolbar() {
        const top = ensureTop();
        if (!top) return;
        let tb = $('#nx-toolbar', top);
        if (!tb) { tb = document.createElement('div'); tb.id = 'nx-toolbar'; tb.className = 'nx-toolbar'; top.appendChild(tb); }
        const opts = [['new', 'sortNew'], ['priceAsc', 'sortPriceAsc'], ['priceDesc', 'sortPriceDesc'], ['rating', 'sortRating'], ['discount', 'sortDiscount']];
        tb.innerHTML =
            '<label class="nx-tb-group">' + esc(t('sort')) + '<select class="nx-select" id="nx-sort">' + opts.map(o => '<option value="' + o[0] + '"' + (state.sort === o[0] ? ' selected' : '') + '>' + esc(t(o[1])) + '</option>').join('') + '</select></label>' +
            '<label class="nx-tb-group">' + esc(t('maxPrice')) + '<input class="nx-range" id="nx-max" type="range" min="50" max="' + maxAll + '" step="10" value="' + state.max + '"><span class="nx-range-val" id="nx-max-val">₪' + state.max + '</span></label>' +
            '<button type="button" class="nx-chip' + (state.fav ? ' on' : '') + '" data-nx="fav">' + esc(t('favOnly')) + '</button>' +
            '<span class="nx-tb-count" id="nx-count"></span>';
        $('#nx-sort', tb).addEventListener('change', e => { state.sort = e.target.value; apply(); });
        $('#nx-max', tb).addEventListener('input', e => { state.max = Number(e.target.value); $('#nx-max-val').textContent = '₪' + state.max; apply(); });
        $('.nx-chip', tb).addEventListener('click', () => { state.fav = !state.fav; syncFavUi(); apply(); });
    }

    function apply() {
        const grid = $('#reviews-grid');
        if (!grid) return;
        const cards = $$('.article-card', grid);
        const key = {
            new: c => Number(c.dataset.nxIdx),
            priceAsc: c => Number(c.dataset.nxPrice),
            priceDesc: c => -Number(c.dataset.nxPrice),
            rating: c => -Number(c.dataset.nxRating),
            discount: c => -Number(c.dataset.nxDiscount)
        }[state.sort] || (c => Number(c.dataset.nxIdx));
        const real = cards.filter(c => c.dataset.nxId);
        const ads = cards.filter(c => !c.dataset.nxId);
        real.sort((a, b) => key(a) - key(b) || Number(a.dataset.nxIdx) - Number(b.dataset.nxIdx));
        let shown = 0;
        real.forEach((c, i) => {
            c.style.order = i;
            const hide = (state.fav && !favs.includes(c.dataset.nxId)) || Number(c.dataset.nxPrice) > state.max;
            c.classList.toggle('nx-hidden', hide);
            if (!hide) shown++;
        });
        ads.forEach(c => { c.style.order = state.sort === 'new' ? Number(c.dataset.nxIdx) : 9999; c.classList.toggle('nx-hidden', state.fav); });
        const cnt = $('#nx-count');
        if (cnt) cnt.textContent = t('found') + ': ' + shown;
        let empty = $('#nx-empty');
        if (shown === 0 && real.length) {
            if (!empty) { empty = document.createElement('div'); empty.id = 'nx-empty'; empty.style.cssText = 'grid-column:1/-1;text-align:center;color:var(--color-text-secondary);padding:40px 0;order:10000'; grid.appendChild(empty); }
            empty.textContent = state.fav && !favs.length ? t('favEmpty') : t('noMatch');
        } else if (empty) { empty.remove(); }
    }

    /* ---- Compare ---- */
    function syncCmpUi() {
        $$('.card-act-btn.cmp').forEach(b => { const c = b.closest('.article-card'); b.classList.toggle('on', !!(c && cmp.includes(c.dataset.nxId))); });
        let bar = $('#nx-cmp-bar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'nx-cmp-bar'; bar.className = 'nx-cmp-bar';
            document.body.appendChild(bar);
        }
        bar.innerHTML = '<span><b>' + cmp.length + '</b>/3 ' + esc(t('selected')) + '</span><button class="nx-btn" type="button" id="nx-cmp-go">' + esc(t('compare')) + '</button><button class="nx-btn ghost" type="button" id="nx-cmp-clr">' + esc(t('clear')) + '</button>';
        $('#nx-cmp-go', bar).addEventListener('click', openCompare);
        $('#nx-cmp-clr', bar).addEventListener('click', () => { cmp = []; syncCmpUi(); });
        bar.classList.toggle('show', cmp.length > 0);
    }

    function openCompare() {
        const list = cmp.map(getReview).filter(Boolean);
        if (!list.length) return;
        const infos = list.map(r => priceInfo(r));
        const minP = Math.min.apply(null, infos.map(p => p.priceAliIls));
        const maxR = Math.max.apply(null, list.map(ratingOf));
        const maxS = Math.max.apply(null, infos.map(p => p.savings));
        const row = (label, cell) => '<tr><th>' + esc(label) + '</th>' + list.map((r, i) => '<td>' + cell(r, infos[i], i) + '</td>').join('') + '</tr>';
        const html = '<table class="nx-table">' +
            row(t('image'), r => '<img src="' + esc(r.image) + '" alt="" onerror="this.src=\'logo.png\'">') +
            row('', r => '<a href="review.html?id=' + encodeURIComponent(r.id) + '"><b>' + esc(langData(r).title) + '</b></a>') +
            row(t('price'), (r, p) => '<div class="big' + (p.priceAliIls === minP ? ' best' : '') + '">₪' + p.priceAliIls + '</div>' + (p.priceAliUsd ? '<div class="sub">$' + p.priceAliUsd + '</div>' : '')) +
            row(t('local'), (r, p) => '₪' + p.priceLocal) +
            row(t('savings'), (r, p) => '<span class="' + (p.savings === maxS && maxS > 0 ? 'best' : '') + '">₪' + p.savings + ' (-' + p.discountVal + '%)</span>') +
            row(t('rating'), r => '<span class="' + (ratingOf(r) === maxR ? 'best' : '') + '">⭐ ' + ratingOf(r).toFixed(1) + '</span>') +
            row(t('pros'), r => '<ul>' + (langData(r).pros || []).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>') +
            row('', r => '<a class="nx-btn" style="display:inline-block" target="_blank" rel="sponsored nofollow noopener" href="' + esc(langData(r).aliLink || '#') + '">' + esc(t('buy')) + '</a>') +
            '</table>';
        let m = $('#nx-modal');
        if (!m) { m = document.createElement('div'); m.id = 'nx-modal'; m.className = 'nx-modal'; document.body.appendChild(m); m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }); }
        m.innerHTML = '<div class="nx-modal-card"><div class="nx-modal-head"><h3>' + esc(t('compareTitle')) + '</h3><button class="nx-icon-btn" type="button" id="nx-modal-x" aria-label="Close">✕</button></div>' + html + '</div>';
        $('#nx-modal-x', m).addEventListener('click', () => m.classList.remove('open'));
        m.classList.add('open');
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { const m = $('#nx-modal'); if (m) m.classList.remove('open'); const s = $('#nx-suggest'); if (s) s.classList.remove('open'); } });

    /* ---- Search suggestions ---- */
    function initSuggest() {
        const input = $('#search-input');
        const box = input && input.closest('.search-container');
        if (!input || !box || $('#nx-suggest')) return;
        const dd = document.createElement('div');
        dd.id = 'nx-suggest'; dd.className = 'nx-suggest';
        box.appendChild(dd);
        let timer;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const q = input.value.toLowerCase().trim();
                if (q.length < 2) { dd.classList.remove('open'); return; }
                const hits = reviews().filter(r => (langData(r).title || '').toLowerCase().includes(q)).slice(0, 5);
                if (!hits.length) { dd.classList.remove('open'); return; }
                dd.innerHTML = hits.map(r => '<a href="review.html?id=' + encodeURIComponent(r.id) + '"><img src="' + esc(r.image) + '" alt="" onerror="this.src=\'logo.png\'"><span>' + esc(langData(r).title) + '</span><small>₪' + priceInfo(r).priceAliIls + '</small></a>').join('');
                dd.classList.add('open');
            }, 120);
        });
        document.addEventListener('click', e => { if (!box.contains(e.target)) dd.classList.remove('open'); });
    }

    function onGrid() {
        clearTimeout(gridTimer);
        gridTimer = setTimeout(() => {
            const grid = $('#reviews-grid');
            if (!grid || !$('.article-card', grid)) return;
            enhanceCards();
            buildHot();
            buildToolbar();
            syncFavUi();
            syncCmpUi();
            apply();
        }, 40);
    }

    function initIndex() {
        const grid = $('#reviews-grid');
        if (!grid) return;
        new MutationObserver(onGrid).observe(grid, { childList: true });
        initSuggest();
        onGrid();
    }

    /* ================= Floating messengers ================= */
    function initFab() {
        if ($('#nx-fab')) return;
        const s = (typeof siteSettingsData !== 'undefined' && siteSettingsData) || {};
        const tg = (s.telegramLink || '').replace('t.me/@', 't.me/');
        const wa = s.whatsappLink || '';
        const okTg = tg && !/your_channel|your_group/.test(tg);
        const okWa = wa && !/your_channel|your_group/.test(wa);
        if (!okTg && !okWa) return;
        const fab = document.createElement('div');
        fab.id = 'nx-fab'; fab.className = 'nx-fab';
        if (okWa) fab.innerHTML += '<a class="wa" href="' + esc(wa) + '" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M19.05 4.91A9.8 9.8 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.1 8.1 0 0 1-1.24-4.38c0-4.49 3.65-8.15 8.14-8.15 2.18 0 4.22.85 5.76 2.39a8.1 8.1 0 0 1 2.38 5.77c0 4.49-3.66 8.15-8.14 8.15z"/></svg></a>';
        if (okTg) fab.innerHTML += '<a class="tg" href="' + esc(tg) + '" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.28 7.68-7c.34-.3-.07-.46-.52-.16L7.74 12.06l-4.13-1.3c-.9-.28-.92-.9.19-1.33L19.92 3.1c.74-.27 1.39.18 1.15 1.25l-2.74 13.06c-.2.98-.78 1.22-1.58.77l-4.18-3.09-2 1.95c-.22.22-.4.4-.79.4z"/></svg></a>';
        document.body.appendChild(fab);
    }

    /* ================= Review page ================= */
    function initProgress() {
        if (!$('#review-body') || $('#nx-progress')) return;
        const bar = document.createElement('div');
        bar.id = 'nx-progress'; bar.className = 'nx-progress';
        document.body.appendChild(bar);
        const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + '%'; };
        addEventListener('scroll', upd, { passive: true });
        upd();
    }

    function buildReviewExtras() {
        const body = $('#review-body');
        if (!body || !body.children.length) return false;
        const id = new URLSearchParams(location.search).get('id');
        if (!id) return true;
        const old = $('#nx-review-extra');
        if (old) old.remove();
        const votes = store.get('alistyle_votes', {});
        const wrap = document.createElement('section');
        wrap.id = 'nx-review-extra';
        wrap.innerHTML =
            '<div class="nx-vote"><h3>' + esc(t('voteTitle')) + '</h3><div class="nx-vote-btns">' +
            '<button type="button" class="nx-vote-btn up' + (votes[id] === 'up' ? ' on' : '') + '" data-v="up">' + esc(t('voteUp')) + '</button>' +
            '<button type="button" class="nx-vote-btn down' + (votes[id] === 'down' ? ' on' : '') + '" data-v="down">' + esc(t('voteDown')) + '</button></div>' +
            '<div class="nx-vote-note">' + (votes[id] ? esc(t('voteThanks')) : '') + '</div></div>' +
            '<form class="nx-feedback nx-form" name="reader-review" method="POST" data-netlify="true"><h3>' + esc(t('fbTitle')) + '</h3>' +
            '<input type="hidden" name="form-name" value="reader-review"><input type="hidden" name="review-id" value="' + esc(id) + '">' +
            '<div class="row"><input name="name" required maxlength="60" placeholder="' + esc(t('fbName')) + '">' +
            '<div class="nx-stars">' + [5, 4, 3, 2, 1].map(n => '<input type="radio" id="nx-s' + n + '" name="rating" value="' + n + '"' + (n === 5 ? ' checked' : '') + '><label for="nx-s' + n + '">★</label>').join('') + '</div></div>' +
            '<textarea name="message" required rows="4" maxlength="1000" placeholder="' + esc(t('fbMsg')) + '"></textarea>' +
            '<button class="nx-btn" type="submit">' + esc(t('fbSend')) + '</button><div class="nx-vote-note" id="nx-fb-note"></div></form>';
        const anchor = $('#collection-products-section') || body;
        anchor.after(wrap);
        $$('.nx-vote-btn', wrap).forEach(b => b.addEventListener('click', () => {
            const v = store.get('alistyle_votes', {});
            v[id] = b.dataset.v;
            store.set('alistyle_votes', v);
            $$('.nx-vote-btn', wrap).forEach(x => x.classList.toggle('on', x === b));
            $('.nx-vote .nx-vote-note', wrap).textContent = t('voteThanks');
        }));
        const form = $('form', wrap);
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const note = $('#nx-fb-note', form);
            try {
                const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
                if (!res.ok) throw new Error(res.status);
                note.textContent = t('fbOk'); form.reset();
            } catch (err) { note.textContent = t('fbErr'); }
        });
        return true;
    }

    function initLightbox() {
        const mainImg = $('#review-image');
        if (!mainImg) return;
        mainImg.addEventListener('click', () => {
            const thumbs = $$('.fast-buy-thumbnail');
            const urls = thumbs.length ? thumbs.map(t => t.src) : [mainImg.src];
            let idx = thumbs.findIndex(t => t.classList.contains('active'));
            if (idx < 0) idx = urls.indexOf(mainImg.src);
            if (idx < 0) idx = 0;
            openLightbox(urls, idx);
        });
    }

    function openLightbox(urls, initialIdx) {
        if (!urls || !urls.length) return;
        let cur = initialIdx;
        let box = $('#nx-lightbox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'nx-lightbox';
            box.className = 'nx-lightbox';
            document.body.appendChild(box);
        }

        const render = () => {
            box.innerHTML = `
                <button class="nx-lightbox-close" type="button" aria-label="Close">✕</button>
                ${urls.length > 1 ? '<button class="nx-lightbox-nav nx-lightbox-prev" type="button" aria-label="Previous">‹</button>' : ''}
                <img class="nx-lightbox-img" src="${esc(urls[cur])}" alt="">
                ${urls.length > 1 ? '<button class="nx-lightbox-nav nx-lightbox-next" type="button" aria-label="Next">›</button>' : ''}
                ${urls.length > 1 ? `<div class="nx-lightbox-counter">${cur + 1} / ${urls.length}</div>` : ''}
            `;
            $('.nx-lightbox-close', box).addEventListener('click', close);
            const prev = $('.nx-lightbox-prev', box);
            const next = $('.nx-lightbox-next', box);
            if (prev) prev.addEventListener('click', e => { e.stopPropagation(); cur = (cur - 1 + urls.length) % urls.length; render(); });
            if (next) next.addEventListener('click', e => { e.stopPropagation(); cur = (cur + 1) % urls.length; render(); });
        };

        const onKey = e => {
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') { cur = (cur - 1 + urls.length) % urls.length; render(); }
            else if (e.key === 'ArrowRight') { cur = (cur + 1) % urls.length; render(); }
        };

        const close = () => {
            box.classList.remove('open');
            box.remove();
            window.removeEventListener('keydown', onKey);
        };

        box.addEventListener('click', e => {
            if (e.target === box) close();
        });

        window.addEventListener('keydown', onKey);
        render();
        box.classList.add('open');
    }

    function initReview() {
        if (!$('#review-body')) return;
        if ($('#mobile-sticky-cta')) document.body.classList.add('has-sticky');
        initProgress();
        initLightbox();
        let tries = 0;
        const poll = setInterval(() => {
            if (buildReviewExtras() || ++tries > 40) clearInterval(poll);
        }, 150);
        const lb = $('#lang-toggle');
        if (lb) lb.addEventListener('click', () => setTimeout(buildReviewExtras, 80));
    }

    /* ================= PWA ================= */
    function initPwa() {
        if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
            addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
        }
    }

    /* ================= Boot ================= */
    function boot() {
        initTheme();
        initIndex();
        initReview();
        initPwa();
        let n = 0;
        const fabPoll = setInterval(() => { initFab(); if ($('#nx-fab') || ++n > 25) clearInterval(fabPoll); }, 200);
        const lb = $('#lang-toggle');
        if (lb) lb.addEventListener('click', () => setTimeout(() => { const f = $('#nx-suggest'); if (f) f.classList.remove('open'); }, 0));
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
