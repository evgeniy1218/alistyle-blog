/**
 * AliStyle Blog - Main Bilingual Client Controller
 * Dynamically renders index grid, detailed review pages, filters, search,
 * and handles language switching (Russian/Hebrew) with automatic RTL/LTR.
 */

// Shared State
let currentLang = localStorage.getItem('alistyle_lang') || 'ru';
let reviewsData = [];
let categoriesData = [];

// Translation Dictionary
const translations = {
    ru: {
        pageTitle: "AliStyle Blog — Честные обзоры товаров с AliExpress",
        logoSub: "Blog",
        navAll: "Все",
        navElectronics: "Гаджеты",
        navSmartHome: "Для дома",
        navCarTech: "Автотовары",
        searchPlaceholder: "Поиск обзоров...",
        heroTag: "Реальный тест-драйв находок",
        heroTitle: "Честные обзоры товаров с AliExpress",
        heroSubtitle: "Выбираем лучшее, отсеиваем хлам. Проверяем в реальной жизни и делимся ссылками на проверенных продавцов.",
        heroCta: "Смотреть топ-10 находок месяца",
        filterAll: "Все обзоры",
        filterElectronics: "Электроника и Гаджеты",
        filterSmartHome: "Товары для дома",
        filterCarTech: "Автотовары",
        discountBadge: "Скидка",
        ratingText: "Рейтинг:",
        priceAliText: "На Ali: ",
        priceLocalText: "В Израиле: ",
        prosTitle: "Плюсы:",
        readMoreBtn: "Обзор",
        messengerBadge: "Только для подписчиков",
        messengerTitle: "Секретные купоны и распродажи, которых нет на сайте!",
        messengerDesc: "Публикуем закрытые промокоды AliExpress, эксклюзивные скидки дня и моментальные подборки горящих товаров в наших мессенджерах. Подписывайся, чтобы экономить до 70%!",
        messengerTgBtn: "Вступить в Telegram-канал",
        messengerWaBtn: "Группа в WhatsApp",
        newsletterTitle: "🚀 Получай лучшие скидки недели на почту",
        newsletterDesc: "Раз в неделю присылаем подборку топ-10 самых крутых находок, прошедших нашу проверку.",
        newsletterPlaceholder: "Твой Email",
        newsletterBtn: "Подписаться",
        newsletterSuccess: "🎉 Успешно! Подписка оформлена.",
        footerDisclaimer: "Честные обзоры и тестирование гаджетов с AliExpress. Мы не продаем товары напрямую, а находим лучшие предложения и делимся ссылками по партнерской программе AliExpress.",
        footerNavTitle: "Навигация",
        footerLegalTitle: "Правовая информация",
        footerPrivacy: "Политика конфиденциальности",
        footerDisclosure: "Партнерский дисклеймер",
        footerCopy: "© 2026 AliStyle Blog. Все права защищены. Цены и информация действительны на момент публикации обзоров.",
        
        // Review Page strings
        breadcrumbHome: "Главная",
        editorRating: "Оценка редакции:",
        verdictTitle: "Особенности и преимущества:",
        buyBtnText: "Узнать цену на AliExpress",
        messengerTitleShort: "🔥 Скидки и Промокоды в Telegram",
        messengerDescShort: "Каждый день публикуем подборки крутых товаров с AliExpress, промокоды и секретные купоны продавцов.",
        messengerTgBtnShort: "Подписаться на Telegram",
        similarTitle: "Похожие обзоры",
        stickyBuyBtnText: "Купить",
        stickyDiscount: "Скидка на AliExpress",
        readReviewLink: "Читать обзор →",
        loadingText: "Загрузка обзоров...",
        noResults: "Ничего не найдено",
        errorNotFound: "Обзор не найден",
        savingsText: "Ваша выгода:",
        savingsCard: "Экономия ",
        couponLabel: "🔥 Промокод на скидку:",
        couponBtn: "Скопировать",
        couponCopied: "Скопировано!",
        editorChoice: "Выбор редакции",
        sponsoredReview: "Спонсорский блок",
        goToDeals: "Перейти к скидкам →",
        videoTitle: "Видеообзор и демонстрация работы"
    },
    he: {
        pageTitle: "AliStyle Blog — סקירות מוצרים אמיתיות מעליאקספרס",
        logoSub: "בלוג",
        navAll: "הכל",
        navElectronics: "גאדג'טים",
        navSmartHome: "לבית",
        navCarTech: "מוצרים לרכב",
        searchPlaceholder: "חיפוש סקירות...",
        heroTag: "מבחני דרך אמיתיים למוצרים",
        heroTitle: "סקירות חכמות מעליאקספרס",
        heroSubtitle: "בוחרים את הטוב ביותר ומסננים את השאר. בודקים בחיים האמיתיים ומשתפים קישורים למוכרים אמינים.",
        heroCta: "לכל המציאות של החודש",
        filterAll: "כל הסקירות",
        filterElectronics: "אלקטרוניקה וגאדג'טים",
        filterSmartHome: "מוצרים לבית",
        filterCarTech: "מוצרים לרכב",
        discountBadge: "הנחה",
        ratingText: "דירוג:",
        priceAliText: "באלי: ",
        priceLocalText: "בארץ: ",
        prosTitle: "יתרונות:",
        readMoreBtn: "לסקירה",
        messengerBadge: "לרשומים בלבד",
        messengerTitle: "קופונים סודיים ומבצעים שאין באתר!",
        messengerDesc: "אנחנו מפרסמים קודים סודיים של עליאקספרס, הנחות יומיות ומבצעים שווים בקבוצות שלנו. תצטרפו עכשיו ותחסכו עד 70%!",
        messengerTgBtn: "הצטרפו לערוץ הטלגרם",
        messengerWaBtn: "קבוצת וואטסאפ",
        newsletterTitle: "🚀 קבלו את הדילים השבועיים למייל",
        newsletterDesc: "פעם בשבוע נשלח לכם את 10 המציאות המובילות שעברו את הבדיקה שלנו.",
        newsletterPlaceholder: "האימייל שלך",
        newsletterBtn: "הרשמה",
        newsletterSuccess: "🎉 תודה! נרשמת בהצלחה.",
        footerDisclaimer: "סקירות אמיתיות ומבחני גאדג'טים מעליאקספרס. אנחנו לא מוכרים מוצרים ישירות אלא מוצאים את המבצעים הכי שווים ומשתפים קישורים במסגרת תוכנית השותפים של עליאקספרס.",
        footerNavTitle: "ניווט",
        footerLegalTitle: "מידע משפטי",
        footerPrivacy: "מדיניות פרטיות",
        footerDisclosure: "גילвой נאות שותפים",
        footerCopy: "© 2026 AliStyle Blog. כל הזכויות שמורות. המחירים והמידע נכונים ליום פרסום הסקירה.",
        
        // Review Page strings
        breadcrumbHome: "ראשי",
        editorRating: "דירוג המערכת:",
        verdictTitle: "תכונות ויתרונות עיקריים:",
        buyBtnText: "למחיר בעליאקספרס",
        messengerTitleShort: "🔥 הנחות וקופונים בטלגרם",
        messengerDescShort: "כל יום אנחנו מפרסמים מציאות מעליאקספרס, קופונים סודיים והנחות שוות.",
        messengerTgBtnShort: "להרשמה לערוץ הטלגרם",
        similarTitle: "סקירות דומות",
        stickyBuyBtnText: "לקנייה",
        stickyDiscount: "הנחה בעליאקספרס",
        readReviewLink: "לקרוא סקירה ←",
        loadingText: "טוען סקירות...",
        noResults: "לא נמצאו תוצאות",
        errorNotFound: "הסקירה לא נמצאה",
        savingsText: "החיסכון שלך:",
        savingsCard: "חיסכון ",
        couponLabel: "🔥 קוד קופון להנחה:",
        couponBtn: "העתק",
        couponCopied: "הועתק!",
        editorChoice: "בחירת המערכת",
        sponsoredReview: "תוכן ממומן",
        goToDeals: "לכל המבצעים ←",
        videoTitle: "סקירת וידאו והדגמת שימוש"
    }
};

// Document Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initLanguage();
    await fetchDatabase();
    
    // Check page routing
    if (document.getElementById('reviews-grid')) {
        renderIndexPage();
        initCategoryFilters();
        initSearch();
    } else if (document.getElementById('review-body')) {
        renderReviewPage();
    }
    
    initNewsletterForm();
});

/**
 * Mobile Hamburger Menu Toggle
 */
function initNavigation() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            toggleBtn.classList.toggle('open');
            const expanded = toggleBtn.getAttribute('aria-expanded') === 'true' || false;
            toggleBtn.setAttribute('aria-expanded', !expanded);
        });
    }

    // Append mobile menu styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 70px;
                left: 0;
                width: 100%;
                background-color: var(--color-surface);
                border-bottom: 1px solid var(--color-border);
                padding: 20px;
                gap: 16px;
                box-shadow: var(--shadow-lg);
                z-index: 98;
            }
            .nav-menu.active {
                display: flex;
            }
            .menu-toggle {
                display: flex;
            }
            .menu-toggle.open .menu-bar:nth-child(1) {
                transform: translateY(7px) rotate(45deg);
            }
            .menu-toggle.open .menu-bar:nth-child(2) {
                opacity: 0;
            }
            .menu-toggle.open .menu-bar:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg);
            }
            /* Adjust navbar flow based on direction */
            html[dir="rtl"] .search-icon {
                left: auto;
                right: 12px;
            }
            html[dir="rtl"] .search-input {
                padding: 8px 36px 8px 16px;
            }
        }
    `;
    document.head.appendChild(styleEl);
}

/**
 * Setup and Sync Language configuration
 */
function initLanguage() {
    const langBtn = document.getElementById('lang-toggle');
    if (!langBtn) return;

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'he' : 'ru';
        localStorage.setItem('alistyle_lang', currentLang);
        applyLanguageSettings();
        
        // Re-render based on page
        if (document.getElementById('reviews-grid')) {
            renderIndexPage();
        } else if (document.getElementById('review-body')) {
            renderReviewPage();
        }
    });

    applyLanguageSettings();
}

function applyLanguageSettings() {
    const langBtn = document.getElementById('lang-toggle');
    
    // Set HTML tags
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
    
    if (langBtn) {
        langBtn.innerText = currentLang === 'he' ? 'RU' : 'HE';
    }

    // Apply translations to static elements using [data-translate]
    const translationSet = translations[currentLang];
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translationSet[key]) {
            el.innerText = translationSet[key];
        }
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translationSet[key]) {
            el.setAttribute('placeholder', translationSet[key]);
        }
    });
}

let siteSettingsData = {};

/**
 * Fetch Reviews JSON Data
 */
async function fetchDatabase() {
    try {
        let data = null;
        try {
            const response = await fetch(`./reviews.json?t=${new Date().getTime()}`);
            if (response.ok) {
                data = await response.json();
            }
        } catch (localErr) {
            console.warn('Local reviews.json fetch failed, trying GitHub fallback...', localErr);
        }

        // Fallback to raw GitHub repo if local fetch failed or returned no reviews
        if (!data || !data.reviews || data.reviews.length === 0) {
            console.log('Fetching reviews from GitHub fallback...');
            try {
                const ghResponse = await fetch(`https://raw.githubusercontent.com/evgeniy1218/alistyle-blog/main/alistyle-blog/reviews.json?t=${new Date().getTime()}`);
                if (ghResponse.ok) {
                    data = await ghResponse.json();
                }
            } catch (ghErr) {
                console.warn('GitHub fallback fetch failed too:', ghErr);
            }
        }

        if (data) {
            categoriesData = data.categories || [];
            const seenIds = new Set();
            reviewsData = (data.reviews || []).filter(r => {
                if (!r || !r.id || seenIds.has(r.id)) return false;
                seenIds.add(r.id);
                return true;
            });
            siteSettingsData = data.siteSettings || {};
            applySiteSettings();
        }
    } catch (e) {
        console.error('Error fetching reviews database:', e);
        reviewsData = [];
    }
}

/**
 * Apply Social Links to DOM elements dynamically
 */
function applySiteSettings() {
    if (!siteSettingsData) return;

    const tgLinks = document.querySelectorAll('a[href*="t.me"]');
    const waLinks = document.querySelectorAll('a[href*="chat.whatsapp.com"]');
    const ytLinks = document.querySelectorAll('a[aria-label="YouTube"]');

    if (siteSettingsData.telegramLink) {
        tgLinks.forEach(link => { link.href = siteSettingsData.telegramLink; });
    }
    if (siteSettingsData.whatsappLink) {
        waLinks.forEach(link => { link.href = siteSettingsData.whatsappLink; });
    }
    if (siteSettingsData.youtubeLink) {
        ytLinks.forEach(link => { link.href = siteSettingsData.youtubeLink; });
    }

    renderAdBanners();
}

/**
 * Render Ad Banners dynamically on pages
 */
function renderAdBanners() {
    const ads = siteSettingsData.ads;
    if (!ads) return;

    // 1. Top Banner
    const topContainer = document.getElementById('ad-top-banner');
    if (topContainer) {
        topContainer.innerHTML = '';
        if (ads.topBanner && ads.topBanner.enabled) {
            topContainer.style.display = 'block';
            if (ads.topBanner.type === 'customHtml' && ads.topBanner.customHtml) {
                topContainer.innerHTML = `
                    <div style="margin: 20px auto; max-width: 1200px; padding: 0 16px; text-align: center;">
                        <div style="font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px;">${ads.topBanner.badgeText || 'Реклама'}</div>
                        <div style="display: inline-block; max-width: 100%; border: 1px solid var(--color-border); border-radius: var(--border-radius-md); padding: 8px; background: var(--color-surface);">${ads.topBanner.customHtml}</div>
                    </div>
                `;
            } else if (ads.topBanner.imageUrl && ads.topBanner.linkUrl) {
                topContainer.innerHTML = `
                    <div style="margin: 20px auto; max-width: 1200px; padding: 0 16px; text-align: center;">
                        <div style="font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">${ads.topBanner.badgeText || 'Реклама / Партнерский материал'}</div>
                        <a href="${ads.topBanner.linkUrl}" target="_blank" rel="sponsored nofollow noopener" style="display: block; border-radius: var(--border-radius-md); overflow: hidden; border: 1px solid var(--color-border);">
                            <img src="${ads.topBanner.imageUrl}" alt="${ads.topBanner.altText || 'Реклама'}" style="width: 100%; max-height: 180px; object-fit: cover; display: block;" loading="lazy">
                        </a>
                    </div>
                `;
            }
        } else {
            topContainer.style.display = 'none';
        }
    }

    // 2. Article / In-feed Banner
    const articleContainer = document.getElementById('ad-article-banner');
    if (articleContainer) {
        articleContainer.innerHTML = '';
        if (ads.inArticleBanner && ads.inArticleBanner.enabled) {
            articleContainer.style.display = 'block';
            if (ads.inArticleBanner.type === 'customHtml' && ads.inArticleBanner.customHtml) {
                articleContainer.innerHTML = `
                    <div style="margin: 30px 0; text-align: center;">
                        <div style="font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px;">${ads.inArticleBanner.badgeText || 'Спонсорский блок'}</div>
                        <div style="display: inline-block; max-width: 100%; border: 1px solid var(--color-border); border-radius: var(--border-radius-md); padding: 8px; background: var(--color-surface);">${ads.inArticleBanner.customHtml}</div>
                    </div>
                `;
            } else if (ads.inArticleBanner.imageUrl && ads.inArticleBanner.linkUrl) {
                articleContainer.innerHTML = `
                    <div style="margin: 30px 0; text-align: center;">
                        <div style="font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px;">${ads.inArticleBanner.badgeText || 'Спонсорский блок'}</div>
                        <a href="${ads.inArticleBanner.linkUrl}" target="_blank" rel="sponsored nofollow noopener" style="display: block; border-radius: var(--border-radius-md); overflow: hidden; border: 1px solid var(--color-border);">
                            <img src="${ads.inArticleBanner.imageUrl}" alt="${ads.inArticleBanner.altText || 'Реклама'}" style="width: 100%; max-height: 220px; object-fit: cover; display: block;" loading="lazy">
                        </a>
                    </div>
                `;
            }
        } else {
            articleContainer.style.display = 'none';
        }
    }
}

// Rating normalizer helper (handles 1-5, 5-10, and 0-100 scales)
function normalizeRating(rawRating) {
    let r = parseFloat(rawRating);
    if (isNaN(r) || r <= 0) return { outOf5: '4.8', outOf10: '9.6', numOutOf5: 4.8 };
    if (r > 10) {
        // e.g. 98.9 -> outOf10: 9.9, outOf5: 4.9
        const o10 = Math.min(10, Math.max(1, r / 10));
        const o5 = Math.min(5, Math.max(1, r / 20));
        return {
            outOf5: o5.toFixed(1),
            outOf10: o10.toFixed(1),
            numOutOf5: o5
        };
    }
    if (r > 5) {
        // e.g. 9.6 -> outOf10: 9.6, outOf5: 4.8
        const o10 = Math.min(10, Math.max(1, r));
        const o5 = Math.min(5, Math.max(1, r / 2));
        return {
            outOf5: o5.toFixed(1),
            outOf10: o10.toFixed(1),
            numOutOf5: o5
        };
    }
    // e.g. 4.8 -> outOf10: 9.6, outOf5: 4.8
    const o5 = Math.min(5, Math.max(1, r));
    const o10 = Math.min(10, Math.max(1, r * 2));
    return {
        outOf5: o5.toFixed(1),
        outOf10: o10.toFixed(1),
        numOutOf5: o5
    };
}
if (typeof window !== 'undefined') {
    window.normalizeRating = normalizeRating;
}

/**
 * Price Normalizer Helper
 * Standardizes prices across single reviews and collections.
 * Ensures AliExpress prices are displayed in ILS (₪) with optional USD reference ($),
 * Israeli retail comparison prices are in ILS (₪), and calculates realistic discounts & savings.
 */
function normalizePrices(item) {
    if (!item) {
        return {
            isCollection: false,
            priceAliIls: 0,
            priceAliUsd: null,
            priceLocal: 0,
            savings: 0,
            discountVal: 35,
            productsCount: 0
        };
    }

    const isCollection = !!(item.isCollection || (item.products && item.products.length > 0));

    // Handle Collections (Multi-product roundups)
    if (isCollection && Array.isArray(item.products) && item.products.length > 0) {
        let minPriceIls = Infinity;
        let minPriceUsd = Infinity;

        item.products.forEach(p => {
            let pIls = 0;
            let pUsd = 0;
            if (p.priceFormatted) {
                const m = p.priceFormatted.match(/[\d.]+/);
                if (m) pIls = parseFloat(m[0]);
            }
            if (p.priceAli) {
                const val = parseFloat(p.priceAli);
                if (val > 0) {
                    if (pIls > 0 && pIls > val * 2.5) {
                        pUsd = val;
                    } else if (!pIls) {
                        pUsd = val;
                        pIls = Math.round(val * 3.7);
                    }
                }
            }
            if (!pUsd && pIls > 0) {
                pUsd = Math.round((pIls / 3.7) * 10) / 10;
            }
            if (pIls > 0 && pIls < minPriceIls) minPriceIls = pIls;
            if (pUsd > 0 && pUsd < minPriceUsd) minPriceUsd = pUsd;
        });

        if (minPriceIls === Infinity) {
            minPriceIls = Number(item.priceAli) || 0;
        }

        return {
            isCollection: true,
            priceAliIls: Math.round(minPriceIls),
            priceAliUsd: minPriceUsd !== Infinity ? minPriceUsd : (item.priceAliUsd || null),
            priceLocal: 0,
            savings: 0,
            discountVal: 0,
            productsCount: item.products.length
        };
    }

    // Single Review
    let rawAli = Number(item.priceAli) || 0;
    let rawLocal = Number(item.priceLocal) || 0;
    let rawUsd = Number(item.priceAliUsd) || 0;

    let priceAliIls = rawAli;
    let priceLocalIls = rawLocal;

    // Detect if rawAli was stored in USD (e.g. legacy data before conversion or fresh scrapers)
    // Rule: rawLocal / rawAli >= 3.5 (e.g. 132 / 24 = 5.5) or both were USD (e.g. 68 / 30.99)
    if (rawLocal > 0 && rawAli > 0 && (rawLocal / rawAli >= 3.5 || (rawLocal <= 100 && rawAli < 50 && rawLocal / rawAli >= 2.0))) {
        if (rawLocal <= 100 && rawLocal / rawAli < 2.5) {
            rawUsd = rawAli;
            priceAliIls = Math.round(rawAli * 3.7);
            priceLocalIls = Math.round(rawLocal * 3.7);
        } else {
            rawUsd = rawAli;
            priceAliIls = Math.round(rawAli * 3.7);
        }
    } else if (rawUsd > 0) {
        priceAliIls = rawAli;
    } else if (rawAli > 0 && rawLocal === 0) {
        priceLocalIls = Math.round(rawAli * 1.5);
    }

    if (!rawUsd && priceAliIls > 0) {
        rawUsd = Math.round((priceAliIls / 3.7) * 10) / 10;
    }

    if (priceLocalIls <= priceAliIls && priceAliIls > 0) {
        priceLocalIls = Math.round(priceAliIls * 1.5);
    }

    const savings = priceLocalIls > priceAliIls ? (priceLocalIls - priceAliIls) : 0;
    const discountVal = priceLocalIls > 0 ? Math.round(((priceLocalIls - priceAliIls) / priceLocalIls) * 100) : 35;

    return {
        isCollection: false,
        priceAliIls,
        priceAliUsd: rawUsd,
        priceLocal: priceLocalIls,
        savings,
        discountVal,
        productsCount: 0
    };
}
if (typeof window !== 'undefined') {
    window.normalizePrices = normalizePrices;
}

/**
 * Dynamic Category Filters with Auto-discovery of all published categories
 */
let currentActiveFilter = 'all';

function renderCategoryFilters() {
    const container = document.getElementById('filter-container');
    if (!container) return;

    const t = translations[currentLang];
    container.innerHTML = '';

    // Count reviews per category
    const counts = { all: reviewsData.length };
    reviewsData.forEach(r => {
        if (r.category) {
            counts[r.category] = (counts[r.category] || 0) + 1;
        }
    });

    // 1. All reviews button
    const allBtn = document.createElement('button');
    allBtn.className = `filter-btn ${currentActiveFilter === 'all' ? 'active' : ''}`;
    allBtn.setAttribute('data-filter', 'all');
    allBtn.innerHTML = `<span>${t.filterAll}</span><span class="filter-count">(${counts.all})</span>`;
    container.appendChild(allBtn);

    // Fallbacks dictionary for category names
    const catNameFallbacks = {
        electronics: { ru: 'Электроника и Гаджеты', he: 'אלקטרוניקה וגאדג\'טים' },
        smarthome: { ru: 'Товары для дома', he: 'מוצרים לבית' },
        cartech: { ru: 'Автотовары', he: 'מוצרים לרכב' },
        tools: { ru: 'Инструменты', he: 'כלי עבודה' },
        aliexpress: { ru: 'Подборки AliExpress', he: 'אוספי AliExpress' },
        other: { ru: 'Другие товары', he: 'מוצרים נוספים' }
    };

    const addedIds = new Set(['all']);

    // First add from categoriesData
    categoriesData.forEach(c => {
        if (counts[c.id] && counts[c.id] > 0 && !addedIds.has(c.id)) {
            addedIds.add(c.id);
            const label = c[currentLang] || c['ru'] || (catNameFallbacks[c.id] ? catNameFallbacks[c.id][currentLang] : c.id);
            const btn = document.createElement('button');
            btn.className = `filter-btn ${currentActiveFilter === c.id ? 'active' : ''}`;
            btn.setAttribute('data-filter', c.id);
            btn.innerHTML = `<span>${label}</span><span class="filter-count">(${counts[c.id]})</span>`;
            container.appendChild(btn);
        }
    });

    // Any remaining categories in reviewsData
    Object.keys(counts).forEach(catId => {
        if (!addedIds.has(catId) && counts[catId] > 0) {
            addedIds.add(catId);
            const fb = catNameFallbacks[catId];
            const label = fb ? fb[currentLang] : (catId.charAt(0).toUpperCase() + catId.slice(1));
            const btn = document.createElement('button');
            btn.className = `filter-btn ${currentActiveFilter === catId ? 'active' : ''}`;
            btn.setAttribute('data-filter', catId);
            btn.innerHTML = `<span>${label}</span><span class="filter-count">(${counts[catId]})</span>`;
            container.appendChild(btn);
        }
    });

    // Bind event listeners
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterVal = btn.getAttribute('data-filter') || 'all';
            applyCategoryFilter(filterVal);
        });
    });
}

function applyCategoryFilter(filterValue) {
    currentActiveFilter = filterValue;

    // Sync filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === filterValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Sync nav menu links
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-filter') === filterValue) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Toggle articles with smooth transition
    const articles = document.querySelectorAll('.article-card');
    articles.forEach(article => {
        const cat = article.getAttribute('data-category');
        if (filterValue === 'all' || cat === filterValue) {
            article.style.display = 'flex';
            setTimeout(() => {
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, 30);
        } else {
            article.style.opacity = '0';
            article.style.transform = 'translateY(10px)';
            setTimeout(() => {
                article.style.display = 'none';
            }, 200);
        }
    });
}

function initCategoryFilters() {
    renderCategoryFilters();

    // Nav-bar filter links
    document.querySelectorAll('.nav-link[data-filter]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterVal = link.getAttribute('data-filter') || 'all';
            applyCategoryFilter(filterVal);
            const grid = document.getElementById('reviews-grid');
            if (grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Render Landing Page Cards Grid
 */
function renderIndexPage() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = translations[currentLang];
    renderCategoryFilters();

    if (reviewsData.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary); padding: 40px 0;">${t.noResults}</div>`;
        return;
    }

    const ads = siteSettingsData?.ads;

    reviewsData.forEach((item, index) => {
        const langData = item[currentLang] || item['ru'] || item['he'];
        if (!langData) return;

        // Calculate normalized prices and savings
        const prices = normalizePrices(item);

        // Map Category Label
        const categoryObj = categoriesData.find(c => c.id === item.category);
        const categoryLabel = categoryObj ? (categoryObj[currentLang] || categoryObj['ru']) : item.category;

        // Build Star Ratings
        const itemRatingObj = normalizeRating(item.rating);
        let starsHTML = '';
        const fullStars = Math.round(itemRatingObj.numOutOf5);
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML += `<svg class="star" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            } else {
                starsHTML += `<svg class="star empty" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            }
        }

        const badgeHtml = prices.isCollection
            ? `<span class="discount-badge" style="background: linear-gradient(135deg, #FF6F00, #FF8F00);">${currentLang === 'he' ? `אוסף (${prices.productsCount})` : `Подборка (${prices.productsCount})`}</span>`
            : `<span class="discount-badge">-${prices.discountVal}%</span>`;

        const priceAliDisplay = prices.isCollection
            ? (currentLang === 'he' ? `החל מ-₪${prices.priceAliIls}` : `от ₪${prices.priceAliIls}`)
            : `₪${prices.priceAliIls}`;

        const priceUsdBadge = (!prices.isCollection && prices.priceAliUsd)
            ? `<span class="card-price-usd">($${prices.priceAliUsd})</span>`
            : '';

        const savingsBadgeHtml = prices.isCollection
            ? `<span class="card-savings-badge" style="background: rgba(46, 125, 50, 0.1); color: var(--color-success);">${currentLang === 'he' ? `${prices.productsCount} מוצרים` : `${prices.productsCount} товаров`}</span>`
            : (prices.savings > 0 ? `<span class="card-savings-badge">${t.savingsCard}₪${prices.savings}</span>` : '');

        const card = document.createElement('article');
        card.className = 'article-card';
        card.setAttribute('data-category', item.category);

        // SEO/Performance: fetchpriority for first LCP image card
        const imgPriority = index === 0 ? 'fetchpriority="high"' : 'loading="lazy"';

        card.innerHTML = `
            <div class="article-img-wrapper">
                ${badgeHtml}
                <img class="article-img" src="${item.image || 'logo.png'}" alt="${langData.title}" ${imgPriority} decoding="async" width="350" height="220" onerror="this.src='logo.png'">
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${categoryLabel}</span>
                </div>
                <h2 class="article-title">
                    <a href="review.html?id=${item.id}">${langData.title}</a>
                </h2>
                <div class="card-prices">
                    <span class="card-price-ali">${priceAliDisplay}${priceUsdBadge}</span>
                    ${prices.priceLocal && !prices.isCollection ? `<span class="card-price-local">₪${prices.priceLocal}</span>` : ''}
                    ${savingsBadgeHtml}
                </div>
                <p class="article-excerpt">${langData.excerpt || ''}</p>
                <div class="article-footer">
                    <div class="rating-stars" aria-label="Рейтинг: ${itemRatingObj.outOf5} из 5">
                        ${starsHTML}
                        <span class="rating-value">${itemRatingObj.outOf5}</span>
                    </div>
                    <a href="review.html?id=${item.id}" class="read-more-link">
                        ${t.readMoreBtn} 
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="transform: ${currentLang === 'he' ? 'scaleX(-1)' : 'none'}">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);

        // Insert native In-Feed Ad Banner card after the 3rd card
        if (index === 2 && ads && ads.inArticleBanner && ads.inArticleBanner.enabled && ads.inArticleBanner.imageUrl) {
            const adCard = document.createElement('article');
            adCard.className = 'article-card sponsored-card';
            adCard.setAttribute('data-category', 'all');
            adCard.innerHTML = `
                <div class="article-img-wrapper">
                    <span class="discount-badge sponsored-tag">${ads.inArticleBanner.badgeText || t.sponsoredReview}</span>
                    <a href="${ads.inArticleBanner.linkUrl}" target="_blank" rel="sponsored nofollow noopener">
                        <img class="article-img" src="${ads.inArticleBanner.imageUrl}" alt="${ads.inArticleBanner.altText || 'Реклама'}" loading="lazy" decoding="async" width="350" height="220">
                    </a>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="article-category" style="color: var(--color-ali-orange);">${t.sponsoredReview}</span>
                    </div>
                    <h2 class="article-title">
                        <a href="${ads.inArticleBanner.linkUrl}" target="_blank" rel="sponsored nofollow noopener">${ads.inArticleBanner.altText || 'Эксклюзивные предложения дня на AliExpress'}</a>
                    </h2>
                    <p class="article-excerpt">${currentLang === 'he' ? 'מבצעים בלעדיים וקופונים יומיים מעליאקספרס לחברי הבלוג.' : 'Эксклюзивные скидки, проверенные продавцы и моментальные купоны AliExpress.'}</p>
                    <div class="article-footer">
                        <a href="${ads.inArticleBanner.linkUrl}" target="_blank" rel="sponsored nofollow noopener" class="read-more-link" style="color: var(--color-ali-red); font-weight: 700;">
                            ${t.goToDeals}
                        </a>
                    </div>
                </div>
            `;
            grid.appendChild(adCard);
        }
    });
}

/**
 * Header Search
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const articles = () => document.querySelectorAll('.article-card');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

        articles().forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            const category = article.getAttribute('data-category');
            
            const matchesSearch = title.includes(query) || excerpt.includes(query);
            const matchesCategory = activeFilter === 'all' || category === activeFilter;

            if (matchesSearch && matchesCategory) {
                article.style.display = 'flex';
                article.style.opacity = '1';
            } else {
                article.style.opacity = '0';
                article.style.display = 'none';
            }
        });
    });
}

/**
 * Render Dynamic Review Page Details (`review.html?id=xxx`)
 */
function renderReviewPage() {
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');
    const t = translations[currentLang];

    if (!reviewId) {
        renderErrorPage(t.errorNotFound);
        return;
    }

    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) {
        renderErrorPage(t.errorNotFound);
        return;
    }

    const langData = review[currentLang] || review['ru'] || review['he'];
    if (!langData) return;

    // 1. Page Title & Meta
    document.title = `${langData.title} — AliStyle Blog`;
    const pageHeadTitle = document.getElementById('page-head-title');
    if (pageHeadTitle) pageHeadTitle.innerText = `${langData.title} — AliStyle Blog`;

    // 2. Category mapping
    const categoryObj = categoriesData.find(c => c.id === review.category);
    const categoryLabel = categoryObj ? (categoryObj[currentLang] || categoryObj['ru']) : review.category;
    
    const metaCategory = document.getElementById('review-meta-category');
    if (metaCategory) {
        metaCategory.innerText = categoryLabel;
        metaCategory.setAttribute('href', `index.html`); // Can redirect filters if configured
    }

    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    if (breadcrumbCategory) {
        breadcrumbCategory.innerText = categoryLabel;
    }
    
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    if (breadcrumbTitle) {
        breadcrumbTitle.innerText = langData.title;
    }

    // 3. Header title
    document.getElementById('review-title').innerText = langData.title;

    // 4. Fast Buy Box values
    const imgEl = document.getElementById('review-image');
    if (imgEl) {
        imgEl.src = review.image || 'logo.png';
        imgEl.alt = langData.title;
    }

    // Normalized rating
    const ratingObj = normalizeRating(review.rating);

    // Product Title inside the fast buy box
    const cardTitleEl = document.getElementById('fast-buy-product-title');
    if (cardTitleEl) {
        cardTitleEl.innerText = langData.title;
    }

    // Verdict Score Badge
    const verdictScoreEl = document.getElementById('verdict-score');
    if (verdictScoreEl) {
        verdictScoreEl.innerHTML = `⭐ ${ratingObj.outOf10} / 10 &nbsp; ${t.editorChoice}`;
    }

    // Prices and savings
    const prices = normalizePrices(review);
    const priceAli = prices.priceAliIls;
    const discountVal = prices.discountVal;

    const priceAliEl = document.getElementById('fast-buy-price-ali');
    const priceLocalEl = document.getElementById('fast-buy-price-local');
    const savingsEl = document.getElementById('fast-buy-savings');

    if (priceAliEl) {
        if (prices.isCollection) {
            priceAliEl.innerText = currentLang === 'he' ? `החל מ-₪${prices.priceAliIls}` : `от ₪${prices.priceAliIls}`;
        } else {
            const usdSpan = prices.priceAliUsd ? `<span class="usd-hint" style="font-size: 0.6em; font-weight: 600; color: var(--color-text-muted); margin-inline-start: 6px;">($${prices.priceAliUsd})</span>` : '';
            priceAliEl.innerHTML = `₪${prices.priceAliIls}${usdSpan}`;
        }
    }
    if (priceLocalEl) {
        const localLabel = document.querySelector('.price-label-local');
        if (prices.isCollection) {
            priceLocalEl.innerText = currentLang === 'he' ? `${prices.productsCount} מוצרים` : `${prices.productsCount} товаров`;
            if (localLabel) localLabel.innerText = currentLang === 'he' ? 'באוסף זה:' : 'В этой подборке:';
        } else {
            priceLocalEl.innerText = `₪${prices.priceLocal}`;
            if (localLabel) localLabel.innerText = currentLang === 'he' ? 'בארץ:' : 'В Израиле:';
        }
    }
    if (savingsEl) {
        savingsEl.innerText = prices.isCollection
            ? (currentLang === 'he' ? 'מבחר מוצרים מומלצים לבחירתכם' : 'Проверенные товары с отзывами')
            : `${t.savingsCard || 'Экономия '}₪${prices.savings} (-${prices.discountVal}%)`;
    }

    // 1-Click Copy Coupon Code
    const couponBox = document.getElementById('fast-buy-coupon');
    const couponCodeText = document.getElementById('coupon-code-text');
    const couponCopyBtn = document.getElementById('coupon-copy-btn');

    const promoCode = review.coupon || review.promoCode || 'ALI2026';
    if (couponBox && couponCodeText && couponCopyBtn) {
        couponBox.style.display = 'flex';
        couponCodeText.innerText = promoCode;
        couponCopyBtn.onclick = () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(promoCode).then(() => {
                    couponCopyBtn.innerText = t.couponCopied;
                    couponCopyBtn.classList.add('copied');
                    setTimeout(() => {
                        couponCopyBtn.innerText = t.couponBtn;
                        couponCopyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(() => {
                    prompt('Copy coupon code:', promoCode);
                });
            } else {
                prompt('Copy coupon code:', promoCode);
            }
        };
    }

    // Gallery Thumbnails (supports unlimited photos)
    const thumbsContainer = document.getElementById('fast-buy-thumbnails');
    if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        const rawImages = review.images && review.images.length > 0 ? review.images : (review.image ? [review.image] : []);
        // Remove empty items and duplicates
        const imageList = [...new Set(rawImages.filter(url => url && typeof url === 'string' && url.trim().length > 0))];
        
        if (imageList.length > 1) {
            imageList.forEach((imgUrl, idx) => {
                const thumb = document.createElement('img');
                thumb.className = `fast-buy-thumbnail ${idx === 0 ? 'active' : ''}`;
                thumb.src = imgUrl;
                thumb.alt = `Product view ${idx + 1}`;
                thumb.loading = 'lazy';
                thumb.onerror = () => { thumb.style.display = 'none'; };
                
                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.fast-buy-thumbnail').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    
                    if (imgEl) {
                        imgEl.style.opacity = '0.2';
                        setTimeout(() => {
                            imgEl.src = imgUrl;
                            imgEl.style.opacity = '1';
                        }, 150);
                    }
                });
                thumbsContainer.appendChild(thumb);
            });
            thumbsContainer.style.display = 'flex';
        } else {
            thumbsContainer.style.display = 'none';
        }
    }

    // Stars
    const starsContainer = document.getElementById('review-rating-stars');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        const fullStars = Math.round(ratingObj.numOutOf5);
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML = `<svg class="star" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            } else {
                starsHTML = `<svg class="star empty" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            }
            starsContainer.innerHTML += starsHTML;
        }
        starsContainer.innerHTML += `<span class="rating-value">${ratingObj.outOf5}</span>`;
    }

    // Pros list
    const prosContainer = document.getElementById('review-pros-list');
    if (prosContainer) {
        prosContainer.innerHTML = '';
        if (Array.isArray(langData.pros)) {
            langData.pros.forEach(pro => {
                prosContainer.innerHTML += `<li class="fast-buy-list-item pro">${pro}</li>`;
            });
        }
    }

    // Buy link / Collection link
    const buyBtn = document.getElementById('main-buy-btn');
    const buyBtnText = document.getElementById('buy-btn-text');
    if (buyBtn) {
        if (prices.isCollection && review.products && review.products.length > 0) {
            buyBtn.href = '#collection-products-section';
            if (buyBtnText) buyBtnText.innerText = currentLang === 'he' ? 'לצפייה בכל מוצרי האוסף' : 'Смотреть все товары подборки';
        } else {
            buyBtn.href = langData.aliLink || '#';
            if (buyBtnText) buyBtnText.innerText = t.buyBtnText;
        }
    }

    // 5. Render Markdown Body
    const bodyContainer = document.getElementById('review-body');
    if (bodyContainer) {
        const markdownBody = langData.body || langData.excerpt || '';
        bodyContainer.innerHTML = parseMarkdown(markdownBody);
    }

    // Render Collection Products Section
    const existingColSection = document.getElementById('collection-products-section');
    if (existingColSection) existingColSection.remove();

    if (prices.isCollection && Array.isArray(review.products) && review.products.length > 0) {
        const colSection = document.createElement('section');
        colSection.id = 'collection-products-section';
        colSection.className = 'collection-products-section';

        let productsHtml = '';
        review.products.forEach((prod, pIdx) => {
            let prodIls = 0;
            let prodUsd = 0;
            if (prod.priceFormatted) {
                const m = prod.priceFormatted.match(/[\d.]+/);
                if (m) prodIls = Math.round(parseFloat(m[0]));
            }
            if (prod.priceAli) {
                const val = parseFloat(prod.priceAli);
                if (val > 0) {
                    if (prodIls > 0 && prodIls > val * 2.5) {
                        prodUsd = val;
                    } else if (!prodIls) {
                        prodUsd = val;
                        prodIls = Math.round(val * 3.7);
                    }
                }
            }
            if (!prodUsd && prodIls > 0) {
                prodUsd = Math.round((prodIls / 3.7) * 10) / 10;
            }

            const usdNote = prodUsd > 0 ? `<span class="col-usd-hint" style="font-size:0.82em;opacity:0.75;font-weight:500;margin-inline-start:4px;">($${prodUsd})</span>` : '';
            const prodPrice = prodIls > 0 ? `₪${prodIls}${usdNote}` : (prod.priceFormatted || '');
            const prodRating = prod.rating ? `⭐ ${prod.rating}` : '⭐ 5.0';
            const buyText = currentLang === 'he' ? 'לקנייה בעליאקספרס' : 'Купить на AliExpress';
            const prodLink = prod.aliLink || langData.aliLink || '#';

            productsHtml += `
                <div class="col-product-card">
                    <div class="col-product-num">#${pIdx + 1}</div>
                    <div class="col-product-img-wrap">
                        <img src="${prod.image || 'logo.png'}" alt="${prod.title}" loading="lazy" onerror="this.src='logo.png'">
                    </div>
                    <div class="col-product-details">
                        <div class="col-product-meta">
                            <span class="col-product-rating">${prodRating}</span>
                            ${prodPrice ? `<span class="col-product-price">${prodPrice}</span>` : ''}
                        </div>
                        <h4 class="col-product-title">${prod.title}</h4>
                        <a href="${prodLink}" target="_blank" rel="sponsored nofollow noopener" class="col-product-buy-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.21 9l-4.38-6.56a1 1 0 0 0-.83-.44 1 1 0 0 0-.83.44L6.79 9H2a1 1 0 0 0-1 1v1a1 1 0 0 0 .88 1L3 21a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2l1.12-9a1 1 0 0 0 .88-1v-1a1 1 0 0 0-1-1h-4.79zM9.38 9l2.62-3.93L14.62 9H9.38zM19 21H5l-1-8h16l-1 8z"/></svg>
                            <span>${buyText}</span>
                        </a>
                    </div>
                </div>
            `;
        });

        colSection.innerHTML = `
            <h3 class="col-section-title">
                <span>📦</span> <span>${currentLang === 'he' ? `מוצרים באוסף זה (${review.products.length})` : `Товары из этой подборки (${review.products.length})`}</span>
            </h3>
            <div class="col-products-grid">
                ${productsHtml}
            </div>
        `;

        if (bodyContainer && bodyContainer.parentNode) {
            bodyContainer.parentNode.insertBefore(colSection, bodyContainer.nextSibling);
        }
    }

    // 6. Mobile sticky panel
    const stickyPanel = document.getElementById('mobile-sticky-cta');
    const stickyThumb = document.getElementById('sticky-thumb');
    const stickyTitle = document.getElementById('sticky-title');
    const stickyPrice = document.getElementById('sticky-price');
    const stickyBuyBtn = document.getElementById('sticky-buy-btn');

    if (stickyThumb) stickyThumb.src = review.image || 'logo.png';
    if (stickyTitle) stickyTitle.innerText = langData.title;
    if (stickyPrice) {
        stickyPrice.innerText = prices.isCollection
            ? (currentLang === 'he' ? `החל מ-₪${prices.priceAliIls}` : `от ₪${prices.priceAliIls}`)
            : `₪${prices.priceAliIls} (-${prices.discountVal}%)`;
    }
    if (stickyBuyBtn) {
        stickyBuyBtn.href = langData.aliLink || '#';
    }

    // Trigger Mobile sticky visibility Observer
    initStickyPurchaseTrigger();

    // Video Review Section (YouTube / Shorts / MP4)
    const videoSection = document.getElementById('review-video-section');
    const videoContainer = document.getElementById('review-video-container');
    const videoHeading = document.getElementById('video-heading-text');
    const videoUrl = review.video || review.videoUrl || langData.video || '';

    if (videoHeading && t.videoTitle) {
        videoHeading.innerText = t.videoTitle;
    }

    if (videoSection && videoContainer) {
        if (videoUrl && videoUrl.trim()) {
            videoContainer.innerHTML = renderVideoEmbedHtml(videoUrl);
            videoSection.style.display = 'block';
        } else {
            videoSection.style.display = 'none';
            videoContainer.innerHTML = '';
        }
    }

    // SEO Schema.org JSON-LD
    injectJsonLd(review, langData, priceAli, discountVal);

    // 7. Load Similar reviews
    renderSimilarReviews(review);
}

/**
 * Render Responsive Video Embed for YouTube, Shorts or MP4
 */
function renderVideoEmbedHtml(videoUrl) {
    if (!videoUrl) return '';
    const trimmed = videoUrl.trim();

    // 1. YouTube (watch, shorts, youtu.be, embed)
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
        const videoId = ytMatch[1];
        return `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: var(--border-radius-md);"></iframe>`;
    }

    // 2. Direct MP4 / WebM / Video file
    if (trimmed.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
        return `<video controls playsinline preload="metadata" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; border-radius: var(--border-radius-md); background: #000;">
            <source src="${trimmed}" type="video/mp4">
            Ваш браузер не поддерживает встроенное видео.
        </video>`;
    }

    // 3. Generic Embed URL
    return `<iframe src="${trimmed}" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: var(--border-radius-md);"></iframe>`;
}

function renderErrorPage(msg) {
    const main = document.querySelector('.review-main');
    if (main) {
        main.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 20px;">⚠️</h1>
                <p style="font-size: 1.2rem; color: var(--color-text-secondary);">${msg}</p>
                <a href="index.html" class="hero-cta" style="margin-top: 30px; display: inline-block;">На главную / Home</a>
            </div>
        `;
    }
}

/**
 * Dynamic injection of Schema.org Product & Review JSON-LD
 */
function injectJsonLd(review, langData, priceAli, discountVal) {
    try {
        let script = document.getElementById('schema-jsonld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'schema-jsonld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Review",
            "name": langData.title,
            "reviewBody": langData.excerpt || langData.title,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating || 5,
                "bestRating": 5,
                "worstRating": 1
            },
            "author": {
                "@type": "Organization",
                "name": "AliStyle Blog"
            },
            "itemReviewed": {
                "@type": "Product",
                "name": langData.title,
                "image": review.image || "",
                "description": langData.excerpt || "",
                "offers": {
                    "@type": "Offer",
                    "price": String(priceAli || 0),
                    "priceCurrency": "ILS",
                    "availability": "https://schema.org/InStock",
                    "url": langData.aliLink || window.location.href
                }
            }
        };

        script.text = JSON.stringify(jsonLd);
    } catch (e) {
        console.warn('Could not inject JSON-LD schema:', e);
    }
}

/**
 * Dynamic Render of Similar Reviews link list
 */
function renderSimilarReviews(currentReview) {
    const container = document.getElementById('similar-reviews-grid');
    if (!container) return;
    container.innerHTML = '';

    const t = translations[currentLang];

    // Filter reviews in same category, exclude current review
    const similar = reviewsData
        .filter(r => r.category === currentReview.category && r.id !== currentReview.id)
        .slice(0, 2);

    if (similar.length === 0) {
        // Fallback to any latest reviews if category doesn't have more
        reviewsData
            .filter(r => r.id !== currentReview.id)
            .slice(0, 2)
            .forEach(r => similar.push(r));
    }

    similar.forEach(item => {
        const langData = item[currentLang] || item['ru'] || item['he'];
        if (!langData) return;

        const categoryObj = categoriesData.find(c => c.id === item.category);
        const categoryLabel = categoryObj ? (categoryObj[currentLang] || categoryObj['ru']) : item.category;

        const card = document.createElement('article');
        card.className = 'similar-card';
        card.innerHTML = `
            <div class="similar-image-wrapper">
                <img class="similar-image" src="${item.image || 'logo.png'}" alt="${langData.title}" loading="lazy" width="90" height="90" onerror="this.src='logo.png'">
            </div>
            <div class="similar-info">
                <span class="similar-card-category">${categoryLabel}</span>
                <h4 class="similar-card-title">${langData.title}</h4>
                <a href="review.html?id=${item.id}" class="similar-card-link">${t.readReviewLink}</a>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Reading Progress Tracker (Review Pages)
 */
function initProgressTracker() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }
    });
}

// Progress tracker runner
initProgressTracker();

/**
 * Mobile Sticky buy panel Observer
 */
function initStickyPurchaseTrigger() {
    const stickyPanel = document.getElementById('mobile-sticky-cta');
    const triggerTarget = document.getElementById('fast-buy-box') || document.getElementById('main-buy-btn');

    if (!stickyPanel || !triggerTarget) return;

    const observerOptions = {
        root: null,
        threshold: 0,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                stickyPanel.classList.add('active');
            } else {
                stickyPanel.classList.remove('active');
            }
        });
    }, observerOptions);

    observer.observe(triggerTarget);
}

/**
 * Newsletter subscription handler
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const statusText = document.getElementById('newsletter-status');

    if (!form || !statusText) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button');

        if (!emailInput || !emailInput.value) return;

        const originalText = btn.textContent;
        btn.textContent = currentLang === 'he' ? 'שולח...' : 'Отправка...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            statusText.textContent = translations[currentLang].newsletterSuccess;
            statusText.className = 'newsletter-status success';
            emailInput.value = '';
            setTimeout(() => {
                statusText.className = 'newsletter-status hidden';
            }, 5000);
        }, 1000);
    });
}

/**
 * Lightweight Client Side Markdown Parser
 * Supports headers, bold, bullet points, blockquotes (Alerts), tables, and paragraphs.
 */
function parseMarkdown(mdText) {
    if (!mdText) return '';

    let html = mdText;

    // Safety escaping
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Restoring blockquote symbol for markdown parsing
    html = html.replace(/&gt;\s?/g, '> ');

    // 1. Parse Tables
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        if (line.startsWith('|') && line.endsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableHtml = '<div style="overflow-x: auto; margin: 30px 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--color-border); font-size: 0.95rem;">';
                
                // Header row
                const cols = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
                tableHtml += '<thead><tr style="background-color: var(--color-surface-soft); border-bottom: 2px solid var(--color-border);">';
                cols.forEach(col => {
                    tableHtml += `<th style="padding: 12px 16px; font-weight: 700; text-align: ${currentLang === 'he' ? 'right' : 'left'};">${col}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';
            } else if (line.includes('---')) {
                // Divider row - skip
                continue;
            } else {
                // Body row
                const cols = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
                tableHtml += '<tr style="border-bottom: 1px solid var(--color-border);">';
                cols.forEach(col => {
                    tableHtml += `<td style="padding: 12px 16px; color: var(--color-text-secondary);">${col}</td>`;
                });
                tableHtml += '</tr>';
            }
        } else {
            if (inTable) {
                inTable = false;
                tableHtml += '</tbody></table></div>';
                processedLines.push(tableHtml);
            }
            processedLines.push(lines[i]);
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table></div>';
        processedLines.push(tableHtml);
    }
    html = processedLines.join('\n');

    // 2. Parse Headers
    html = html.replace(/^### (.*?)$/gm, '<h3 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; margin: 30px 0 12px; line-height: 1.3;">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; margin: 40px 0 16px; line-height: 1.3;">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; margin: 40px 0 20px; line-height: 1.2;">$1</h1>');

    // 3. Parse Alerts & Personal Experience Quote Blocks
    // Supports: > [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION] and simple blockquotes
    const blockquoteRegex = /(?:^&gt;.*\n?)+/gm;
    html = html.replace(blockquoteRegex, (match) => {
        let quoteText = match.replace(/^> ?/gm, '').trim();
        let borderClass = 'var(--color-ali-orange)';
        let titleText = currentLang === 'he' ? 'חוויה אישית' : 'Личный опыт';
        let background = 'linear-gradient(135deg, rgba(255, 149, 0, 0.04) 0%, rgba(255, 59, 48, 0.04) 100%)';
        let svgIcon = '<svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: var(--color-ali-orange);"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';

        if (quoteText.includes('[!TIP]')) {
            borderClass = '#2db742';
            titleText = currentLang === 'he' ? 'טיפ שימושי' : 'Полезный совет';
            background = 'rgba(45, 183, 66, 0.04)';
            svgIcon = '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:#2db742;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            quoteText = quoteText.replace('[!TIP]', '').trim();
        } else if (quoteText.includes('[!WARNING]') || quoteText.includes('[!CAUTION]')) {
            borderClass = 'var(--color-ali-red)';
            titleText = currentLang === 'he' ? 'אזהרה' : 'Внимание / Минус';
            background = 'rgba(255, 59, 48, 0.04)';
            svgIcon = '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:var(--color-ali-red);"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
            quoteText = quoteText.replace(/\[!WARNING\]|\[!CAUTION\]/g, '').trim();
        } else if (quoteText.includes('[!NOTE]')) {
            quoteText = quoteText.replace('[!NOTE]', '').trim();
        }

        const borderDirection = currentLang === 'he' ? 'border-right' : 'border-left';
        const borderRadius = currentLang === 'he' ? 'var(--border-radius-md) 0 0 var(--border-radius-md)' : '0 var(--border-radius-md) var(--border-radius-md) 0';

        return `
            <blockquote style="background: ${background}; ${borderDirection}: 4px solid ${borderClass}; border-radius: ${borderRadius}; padding: 24px 30px; margin: 36px 0;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    ${svgIcon}
                    <span style="font-weight: 700; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">${titleText}</span>
                </div>
                <div style="font-style: italic; font-size: 1.05rem; line-height: 1.65; color: var(--color-text-secondary);">${quoteText}</div>
            </blockquote>
        `;
    });

    // 4. Parse Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="body-image-wrapper"><img src="$2" alt="$1" class="body-image" loading="lazy"><div class="body-image-caption">$1</div></div>');

    // 5. Parse Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 5. Parse Lists
    html = html.replace(/^\s*-\s+(.*?)$/gm, '<li style="margin-bottom: 8px; position: relative; padding-left: ${currentLang === \'he\' ? \'0\' : \'20px\'}; padding-right: ${currentLang === \'he\' ? \'20px\' : \'0\'};">$1</li>');
    html = html.replace(/^\s*\*\s+(.*?)$/gm, '<li style="margin-bottom: 8px; position: relative; padding-left: ${currentLang === \'he\' ? \'0\' : \'20px\'}; padding-right: ${currentLang === \'he\' ? \'20px\' : \'0\'};">$1</li>');
    
    // Wrap lists in ul
    html = html.replace(/((?:<li.*?>.*?<\/li>\s*)+)/g, '<ul style="list-style: none; margin: 20px 0; padding: 0;">$1</ul>');

    // Add list indicator classes for dynamic styling (checkmark/cross)
    // Custom check/cross logic can also be inserted dynamically if needed

    // 6. Parse Paragraphs (split by double newlines)
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        const trimmed = block.trim();
        // Skip block elements
        if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<div') || trimmed.startsWith('<ul') || trimmed.startsWith('<table') || trimmed.startsWith('<li')) {
            return trimmed;
        }
        if (trimmed.length === 0) return '';
        return `<p style="margin-bottom: 24px;">${trimmed}</p>`;
    }).join('\n');

    return html;
}
