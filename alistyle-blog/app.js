let reviewsData = [];
let categoriesData = [];

const translations = {
    ru: {
        pageTitle: "AliStyle — Умные Обзоры",
        pageSubtitle: "Честные тесты полезных гаджетов с AliExpress под израильский быт",
        searchPlaceholder: "Поиск обзоров...",
        filterAll: "Все",
        filterSmartHome: "Умный дом",
        filterCarTech: "Автотовары",
        filterElectronics: "Электроника",
        ratingText: "Рейтинг:",
        priceAliText: "На Ali: ",
        priceLocalText: "В Израиле: ",
        prosTitle: "Плюсы:",
        readReview: "Читать обзор",
        noResults: "Ничего не найдено",
        copyright: "© 2026 AliStyle Israel. Все права защищены.",
        newsletterTitle: "🚀 Получай секретные купоны и скидки!",
        newsletterDesc: "Подпишись на нашу рассылку лучших предложений с AliExpress для Израиля.",
        newsletterEmail: "Твой Email",
        newsletterBtn: "Подписаться",
        subscribeSuccess: "🎉 Спасибо! Вы успешно подписались на купоны.",
        subscribeError: "Упс! Что-то пошло не так. Попробуйте еще раз."
    },
    he: {
        pageTitle: "AliStyle — סקירות חכמות",
        pageSubtitle: "מבחנים אמיתיים לגאדג'טים מעליאקספרס שמתאימים לחיים בישראל",
        searchPlaceholder: "חיפוש סקירות...",
        filterAll: "הכל",
        filterSmartHome: "בית חכם",
        filterCarTech: "מוצרים לרכב",
        filterElectronics: "אלקטרוניקה",
        ratingText: "דירוג:",
        priceAliText: "באליאקספרס: ",
        priceLocalText: "בארץ: ",
        prosTitle: "יתרונות:",
        readReview: "לקרוא סקירה",
        noResults: "לא נמצאו תוצאות",
        copyright: "© 2026 AliStyle Israel. כל הזכויות שמורות.",
        newsletterTitle: "🚀 קבלו קופונים סודיים והנחות!",
        newsletterDesc: "הירשמו לניוזלטר לקבלת הדילים הכי שווים מעליאקספרס לישראל.",
        newsletterEmail: "האימייל שלך",
        newsletterBtn: "הרשמה",
        subscribeSuccess: "🎉 תודה! נרשמת בהצלחה לקבלת קופונים.",
        subscribeError: "אופס! משהו השתבש. נסה שוב."
    }
};

let currentLang = "he"; // Default language
let currentCategory = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    setupModalListeners();
    setupNewsletterForm();
    try {
        let response;
        try {
            response = await fetch(`https://raw.githubusercontent.com/evgeniy1218/alistyle-blog/main/reviews.json?t=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Private repo or raw URL not ready");
        } catch (err) {
            console.warn("Falling back to local reviews.json:", err);
            response = await fetch(`./reviews.json?t=${new Date().getTime()}`);
        }
        const data = await response.json();
        categoriesData = data.categories || [];
        reviewsData = data.reviews || [];
        renderApp();
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
}

function setupEventListeners() {
    // Language Toggle
    const langBtn = document.getElementById("lang-toggle");
    langBtn.addEventListener("click", () => {
        currentLang = currentLang === "he" ? "ru" : "he";
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";
        renderApp();
    });

    // Search Input
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderReviews();
    });
}

function renderApp() {
    const t = translations[currentLang];
    
    // Update static texts
    document.getElementById("logo-title").innerText = t.pageTitle;
    document.getElementById("logo-subtitle").innerText = t.pageSubtitle;
    document.getElementById("search-input").placeholder = t.searchPlaceholder;
    document.getElementById("lang-toggle").innerText = currentLang === "he" ? "RU" : "עב";
    document.getElementById("footer-copy").innerText = t.copyright;

    // Update Newsletter Texts
    document.getElementById("newsletter-title").innerText = t.newsletterTitle;
    document.getElementById("newsletter-desc").innerText = t.newsletterDesc;
    document.getElementById("newsletter-email").placeholder = t.newsletterEmail;
    document.getElementById("newsletter-btn").innerText = t.newsletterBtn;

    renderFilters();
    renderReviews();
}

function renderFilters() {
    const container = document.getElementById("filters-container");
    container.innerHTML = "";

    const t = translations[currentLang];

    // All Category Button
    const allBtn = document.createElement("button");
    allBtn.className = `filter-btn ${currentCategory === 'all' ? 'active' : ''}`;
    allBtn.dataset.category = "all";
    allBtn.innerText = t.filterAll;
    container.appendChild(allBtn);

    // Dynamic Category Buttons
    categoriesData.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `filter-btn ${currentCategory === cat.id ? 'active' : ''}`;
        btn.dataset.category = cat.id;
        btn.innerText = currentLang === 'he' ? cat.he : cat.ru;
        container.appendChild(btn);
    });

    // Re-bind Event Listeners to dynamic buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentCategory = e.target.dataset.category;
            renderReviews();
        });
    });
}

function renderReviews() {
    const t = translations[currentLang];
    const grid = document.getElementById("reviews-grid");
    grid.innerHTML = "";

    const filtered = reviewsData.filter(item => {
        const matchesCategory = currentCategory === "all" || item.category === currentCategory;
        const langData = item[currentLang];
        if (!langData) return false;
        const matchesSearch = (langData.title || "").toLowerCase().includes(searchQuery) || 
                              (langData.excerpt || "").toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results">${t.noResults}</div>`;
        return;
    }

    filtered.forEach(item => {
        const langData = item[currentLang];
        if (!langData) return;
        
        // Generate pros HTML
        let prosHTML = "";
        if (Array.isArray(langData.pros)) {
            langData.pros.slice(0, 3).forEach(pro => {
                prosHTML += `<li>${pro}</li>`;
            });
        }

        const card = document.createElement("article");
        card.className = "review-card";
        card.innerHTML = `
            <div class="card-image-wrapper">
                <img class="card-image" src="${item.image}" alt="${langData.title}" onerror="this.src='logo.png'">
                <span class="card-rating">★ ${item.rating}</span>
            </div>
            <div class="card-content">
                <h2 class="card-title">${langData.title}</h2>
                <p class="card-excerpt">${langData.excerpt}</p>
                <div class="card-pros">
                    <span class="pros-title">${t.prosTitle}</span>
                    <ul>${prosHTML}</ul>
                </div>
                <div class="card-pricing">
                    <div class="price-ali">${t.priceAliText}<span>$ ${item.priceAli}</span></div>
                    <div class="price-local">${t.priceLocalText}<span>₪ ${item.priceLocal}</span></div>
                </div>
                <div class="card-actions-wrapper">
                    <button class="card-btn card-btn-secondary btn-read-review" data-id="${item.id}">${t.readReview}</button>
                    <a href="${langData.aliLink}" class="card-btn" style="flex: 1.2;" target="_blank">${langData.linkText}</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Add click event to "Read review" buttons
    document.querySelectorAll(".btn-read-review").forEach(btn => {
        btn.addEventListener("click", (e) => {
            openDetailModal(e.target.dataset.id);
        });
    });
}

function setupModalListeners() {
    const modal = document.getElementById("detail-modal");
    const overlay = document.getElementById("detail-modal-overlay");
    const closeBtn = document.getElementById("btn-close-detail");

    overlay.addEventListener("click", closeDetailModal);
    closeBtn.addEventListener("click", closeDetailModal);

    // Escape key closes modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeDetailModal();
        }
    });
}

function openDetailModal(reviewId) {
    const item = reviewsData.find(r => r.id === reviewId);
    if (!item) return;

    const langData = item[currentLang];
    if (!langData) return;

    const modal = document.getElementById("detail-modal");
    
    // Fill in modal details
    const mainImg = document.getElementById("detail-image");
    mainImg.src = item.image;
    mainImg.style.opacity = "1";
    
    document.getElementById("detail-title").innerText = langData.title;
    document.getElementById("detail-rating").innerText = `★ ${item.rating}`;
    
    // Render thumbnails
    const thumbnailsContainer = document.getElementById("detail-thumbnails-container");
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = "";
        
        const imageList = item.images || (item.image ? [item.image] : []);
        if (imageList.length > 1) {
            imageList.forEach((imgUrl, index) => {
                const thumb = document.createElement("img");
                thumb.className = `detail-thumb ${imgUrl === item.image ? 'active' : ''}`;
                thumb.src = imgUrl;
                thumb.alt = `Thumbnail ${index + 1}`;
                thumb.onerror = () => { thumb.style.display = "none"; };
                
                thumb.addEventListener("click", () => {
                    document.querySelectorAll(".detail-thumb").forEach(t => t.classList.remove("active"));
                    thumb.classList.add("active");
                    
                    mainImg.style.opacity = "0.3";
                    setTimeout(() => {
                        mainImg.src = imgUrl;
                        mainImg.style.opacity = "1";
                    }, 150);
                });
                thumbnailsContainer.appendChild(thumb);
            });
            thumbnailsContainer.style.display = "flex";
        } else {
            thumbnailsContainer.style.display = "none";
        }
    }
    
    const t = translations[currentLang];
    document.getElementById("detail-price-ali").innerText = `${t.priceAliText} $ ${item.priceAli}`;
    document.getElementById("detail-price-local").innerText = `${t.priceLocalText} ₪ ${item.priceLocal}`;
    
    // Detailed Body text - fallback to excerpt if body is empty
    const bodyContent = langData.body || langData.excerpt || "";
    document.getElementById("detail-body-text").innerText = bodyContent;
    
    // Pros list
    document.getElementById("detail-pros-title").innerText = t.prosTitle;
    const prosList = document.getElementById("detail-pros-list");
    prosList.innerHTML = "";
    if (Array.isArray(langData.pros)) {
        langData.pros.forEach(pro => {
            const li = document.createElement("li");
            li.innerText = pro;
            prosList.appendChild(li);
        });
    }

    // Buy Button
    const buyBtn = document.getElementById("detail-buy-btn");
    buyBtn.href = langData.aliLink;
    buyBtn.innerText = langData.linkText;

    // Show modal
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeDetailModal() {
    const modal = document.getElementById("detail-modal");
    modal.classList.add("hidden");
    document.body.style.overflow = ""; // Restore scroll
}

function setupNewsletterForm() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("newsletter-email");
        const statusText = document.getElementById("newsletter-status");
        const t = translations[currentLang];

        const email = emailInput.value.trim();
        if (!email) return;

        statusText.className = "newsletter-status"; // Reset
        statusText.innerText = currentLang === "he" ? "...נרשם" : "Подписка...";
        statusText.classList.remove("hidden");

        try {
            const response = await fetch("http://localhost:3001/api/leads/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, lang: currentLang })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                statusText.classList.add("success");
                statusText.innerText = t.subscribeSuccess;
                emailInput.value = "";
            } else {
                throw new Error(result.error || "Subscription failed");
            }
        } catch (err) {
            statusText.classList.add("error");
            statusText.innerText = t.subscribeError;
            console.error("Subscription error:", err);
        }
    });
}

