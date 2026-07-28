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
        errorNotFound: "Обзор не найден"
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
        filterElectronics: "אלקטרוניקה וגאдג'טים",
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
        footerDisclosure: "גילוי נאות שותפים",
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
        errorNotFound: "הסקירה לא נמצאה"
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

/**
 * Fetch Reviews JSON Data
 */
async function fetchDatabase() {
    try {
        const response = await fetch(`./reviews.json?t=${new Date().getTime()}`);
        const data = await response.json();
        categoriesData = data.categories || [];
        reviewsData = data.reviews || [];
    } catch (e) {
        console.error('Error fetching reviews database:', e);
        reviewsData = [];
    }
}

/**
 * Render Landing Page Cards Grid
 */
function renderIndexPage() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = translations[currentLang];

    if (reviewsData.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary); padding: 40px 0;">${t.noResults}</div>`;
        return;
    }

    reviewsData.forEach((item, index) => {
        const langData = item[currentLang] || item['ru'] || item['he'];
        if (!langData) return;

        // Calculate discount percentage if not custom tagged
        const discountVal = item.priceLocal ? Math.round(((item.priceLocal - item.priceAli) / item.priceLocal) * 100) : 35;

        // Map Category Label
        const categoryObj = categoriesData.find(c => c.id === item.category);
        const categoryLabel = categoryObj ? (categoryObj[currentLang] || categoryObj['ru']) : item.category;

        // Build Star Ratings
        let starsHTML = '';
        const fullStars = Math.floor(item.rating);
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML += `<svg class="star" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            } else {
                starsHTML += `<svg class="star empty" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            }
        }

        const card = document.createElement('article');
        card.className = 'article-card';
        card.setAttribute('data-category', item.category);

        // SEO/Performance: fetchpriority for first LCP image card
        const imgPriority = index === 0 ? 'fetchpriority="high"' : 'loading="lazy"';

        card.innerHTML = `
            <div class="article-img-wrapper">
                <span class="discount-badge">${t.discountBadge} ${discountVal}%</span>
                <img class="article-img" src="${item.image || 'logo.png'}" alt="${langData.title}" ${imgPriority} width="350" height="220" onerror="this.src='logo.png'">
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${categoryLabel}</span>
                </div>
                <h2 class="article-title">
                    <a href="review.html?id=${item.id}">${langData.title}</a>
                </h2>
                <p class="article-excerpt">${langData.excerpt || ''}</p>
                <div class="article-footer">
                    <div class="rating-stars" aria-label="Рейтинг: ${item.rating} из 5">
                        ${starsHTML}
                        <span class="rating-value">${item.rating}</span>
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
    });
}

/**
 * Filter Cards by Category Click
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articles = () => document.querySelectorAll('.article-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filterValue = button.getAttribute('data-filter') || 'all';

            // Sync buttons
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === filterValue) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Toggle cards with visual fade
            articles().forEach(article => {
                const category = article.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    article.style.display = 'flex';
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        article.style.display = 'none';
                    }, 200);
                }
            });
        });
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

    // Gallery Thumbnails
    const thumbsContainer = document.getElementById('fast-buy-thumbnails');
    if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        const imageList = review.images || (review.image ? [review.image] : []);
        
        if (imageList.length > 1) {
            imageList.forEach((imgUrl, idx) => {
                const thumb = document.createElement('img');
                thumb.className = `fast-buy-thumbnail ${imgUrl === (review.image || 'logo.png') ? 'active' : ''}`;
                thumb.src = imgUrl;
                thumb.alt = `Product view ${idx + 1}`;
                thumb.onerror = () => { thumb.style.display = 'none'; };
                
                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.fast-buy-thumbnail').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    
                    if (imgEl) {
                        imgEl.style.opacity = '0.2';
                        setTimeout(() => {
                            imgEl.src = imgUrl;
                            imgEl.style.opacity = '1';
                        }, 200);
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
        const fullStars = Math.floor(review.rating);
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsContainer.innerHTML += `<svg class="star" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            } else {
                starsContainer.innerHTML += `<svg class="star empty" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            }
        }
        starsContainer.innerHTML += `<span class="rating-value">${review.rating}</span>`;
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

    // Buy link
    const buyBtn = document.getElementById('main-buy-btn');
    if (buyBtn) {
        buyBtn.href = langData.aliLink || '#';
    }

    // 5. Render Markdown Body
    const bodyContainer = document.getElementById('review-body');
    if (bodyContainer) {
        const markdownBody = langData.body || langData.excerpt || '';
        bodyContainer.innerHTML = parseMarkdown(markdownBody);
    }

    // 6. Mobile sticky panel
    const stickyPanel = document.getElementById('mobile-sticky-cta');
    const stickyTitle = document.getElementById('sticky-title');
    const stickyPrice = document.getElementById('sticky-price');
    const stickyBuyBtn = document.getElementById('sticky-buy-btn');

    if (stickyTitle) stickyTitle.innerText = langData.title;
    if (stickyPrice) {
        const discountVal = review.priceLocal ? Math.round(((review.priceLocal - review.priceAli) / review.priceLocal) * 100) : 35;
        stickyPrice.innerText = `${t.stickyDiscount} -${discountVal}%`;
    }
    if (stickyBuyBtn) {
        stickyBuyBtn.href = langData.aliLink || '#';
    }

    // Trigger Mobile sticky visibility Observer
    initStickyPurchaseTrigger();

    // 7. Load Similar reviews
    renderSimilarReviews(review);
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
