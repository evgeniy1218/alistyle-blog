let reviewsData = [];
let categoriesData = [];
let loadedReviewIds = [];
let loadedCategoryIds = [];

let editMode = false;
let currentReviewId = null;

// GitHub Config
let ghOwner = "";
let ghRepo = "";
let ghToken = "";
let ghFilePath = "reviews.json";

document.addEventListener("DOMContentLoaded", () => {
    initAdmin();
});

async function initAdmin() {
    loadSettings();
    setupEventListeners();
    await fetchReviews();
}

function loadSettings() {
    ghOwner = localStorage.getItem("gh_owner") || "";
    ghRepo = localStorage.getItem("gh_repo") || "";
    ghToken = localStorage.getItem("gh_token") || "";
    ghFilePath = localStorage.getItem("gh_path") || "reviews.json";

    document.getElementById("gh-owner").value = ghOwner;
    document.getElementById("gh-repo").value = ghRepo;
    document.getElementById("gh-token").value = ghToken;
    document.getElementById("gh-path").value = ghFilePath;

    if (ghOwner && ghRepo && ghToken) {
        document.getElementById("settings-body").classList.add("hidden");
        document.getElementById("settings-icon").innerText = "▼";
    } else {
        document.getElementById("settings-body").classList.remove("hidden");
        document.getElementById("settings-icon").innerText = "▲";
    }
}

async function fetchReviews() {
    try {
        let data = null;
        
        // If GitHub integration is configured, fetch directly from GitHub to bypass caching/delay
        if (ghOwner && ghRepo && ghToken) {
            console.log("Fetching reviews.json directly from GitHub to avoid cache...");
            const getUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${ghFilePath}?t=${new Date().getTime()}`;
            const getResponse = await fetch(getUrl, {
                headers: {
                    "Authorization": `token ${ghToken}`,
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                const rawContent = atob(fileData.content.replace(/\s/g, ''));
                const decodedContent = decodeURIComponent(escape(rawContent));
                data = JSON.parse(decodedContent);
            }
        }
        
        // Fallback to local file if GitHub fetch failed or wasn't configured
        if (!data) {
            console.log("Fetching reviews.json from local Netlify URL...");
            const response = await fetch(`./reviews.json?t=${new Date().getTime()}`);
            data = await response.json();
        }
        
        categoriesData = data.categories || [];
        reviewsData = data.reviews || [];
        
        loadedReviewIds = reviewsData.map(r => r.id);
        loadedCategoryIds = categoriesData.map(c => typeof c === 'object' ? c.id : c);
        
        renderReviewsList();
        renderCategoriesList();
        populateCategoryDropdown();
    } catch (e) {
        console.error("Error fetching reviews:", e);
        categoriesData = [];
        reviewsData = [];
        loadedReviewIds = [];
        loadedCategoryIds = [];
        renderReviewsList();
        renderCategoriesList();
        populateCategoryDropdown();
    }
}


function renderReviewsList(searchFilter = "") {
    const listContainer = document.getElementById("admin-reviews-list");
    listContainer.innerHTML = "";

    const filtered = reviewsData.filter(item => {
        const titleRu = item.ru?.title.toLowerCase() || "";
        const titleHe = item.he?.title.toLowerCase() || "";
        return titleRu.includes(searchFilter.toLowerCase()) || titleHe.includes(searchFilter.toLowerCase());
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 30px;">Обзоры не найдены</div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "review-item";
        card.innerHTML = `
            <div class="review-info">
                <img class="review-thumb" src="${item.image}" alt="Thumbnail" onerror="this.src='logo.png'">
                <div class="review-meta">
                    <h3>${item.ru?.title || item.he?.title}</h3>
                    <p>Категория: ${item.category} | Рейтинг: ★ ${item.rating} | Цена: ₪ ${item.priceAli}</p>
                </div>
            </div>
            <div class="review-actions">
                <button class="btn btn-secondary btn-edit" data-id="${item.id}">Редактировать</button>
                <button class="btn btn-danger btn-delete" data-id="${item.id}">Удалить</button>
            </div>
        `;
        listContainer.appendChild(card);
    });

    // Add Action Event Listeners
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", (e) => openModal(e.target.dataset.id));
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => deleteReview(e.target.dataset.id));
    });
}

function setupEventListeners() {
    // Settings toggle
    document.getElementById("settings-toggle").addEventListener("click", () => {
        const body = document.getElementById("settings-body");
        body.classList.toggle("hidden");
        document.getElementById("settings-icon").innerText = body.classList.contains("hidden") ? "▼" : "▲";
    });

    // Save Settings
    document.getElementById("btn-save-settings").addEventListener("click", () => {
        ghOwner = document.getElementById("gh-owner").value.trim();
        ghRepo = document.getElementById("gh-repo").value.trim();
        ghToken = document.getElementById("gh-token").value.trim();
        ghFilePath = document.getElementById("gh-path").value.trim() || "reviews.json";

        localStorage.setItem("gh_owner", ghOwner);
        localStorage.setItem("gh_repo", ghRepo);
        localStorage.setItem("gh_token", ghToken);
        localStorage.setItem("gh_path", ghFilePath);

        alert("Настройки GitHub успешно сохранены локально в браузере!");
        document.getElementById("settings-body").classList.add("hidden");
        document.getElementById("settings-icon").innerText = "▼";
    });

    // Global Save and Deploy to GitHub
    document.getElementById("btn-save-deploy").addEventListener("click", () => {
        deployToGitHub();
    });

    // Add Review Modal Open
    document.getElementById("btn-add-review").addEventListener("click", () => {
        openModal();
    });

    // Close Modal
    document.getElementById("btn-close-modal").addEventListener("click", closeModal);
    document.getElementById("btn-cancel").addEventListener("click", closeModal);

    // Categories Panel toggle
    document.getElementById("categories-toggle").addEventListener("click", () => {
        const body = document.getElementById("categories-body");
        body.classList.toggle("hidden");
        document.getElementById("categories-icon").innerText = body.classList.contains("hidden") ? "▼" : "▲";
    });

    // Add Category button
    document.getElementById("btn-add-category").addEventListener("click", addCategory);
    document.getElementById("btn-cancel-cat-edit").addEventListener("click", resetCategoryForm);

    // Search bar
    document.getElementById("admin-search").addEventListener("input", (e) => {
        renderReviewsList(e.target.value);
    });


    // Modal Tabs logic
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            tabBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const tabId = e.target.dataset.tab;
            document.querySelectorAll(".tab-pane").forEach(pane => {
                pane.classList.add("hidden");
            });
            document.getElementById(tabId).classList.remove("hidden");
        });
    });

    // Form submit
    document.getElementById("review-form").addEventListener("submit", (e) => {
        e.preventDefault();
        saveFormValues();
    });

    // Pros lists actions
    document.getElementById("btn-add-ru-pro").addEventListener("click", () => addProInput("ru"));
    document.getElementById("btn-add-he-pro").addEventListener("click", () => addProInput("he"));
}

function openModal(reviewId = null) {
    const modal = document.getElementById("review-modal");
    modal.classList.remove("hidden");
    
    // Reset Form
    document.getElementById("review-form").reset();
    document.getElementById("ru-pros-container").innerHTML = "";
    document.getElementById("he-pros-container").innerHTML = "";

    // Set first tab as active
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.add("hidden"));
    document.querySelector("[data-tab='tab-general']").classList.add("active");
    document.getElementById("tab-general").classList.remove("hidden");

    if (reviewId) {
        // Edit Mode
        editMode = true;
        currentReviewId = reviewId;
        document.getElementById("modal-title").innerText = "Редактировать обзор";
        
        const review = reviewsData.find(item => item.id === reviewId);
        if (review) {
            document.getElementById("form-id-hidden").value = review.id;
            document.getElementById("form-id").value = review.id;
            document.getElementById("form-id").disabled = true; // Block ID change on edit
            document.getElementById("form-category").value = review.category;
            document.getElementById("form-rating").value = review.rating;
            document.getElementById("form-price-ali").value = review.priceAli;
            document.getElementById("form-price-local").value = review.priceLocal;
            document.getElementById("form-image").value = review.image;

            // RU Data
            document.getElementById("form-ru-title").value = review.ru?.title || "";
            document.getElementById("form-ru-excerpt").value = review.ru?.excerpt || "";
            document.getElementById("form-ru-body").value = review.ru?.body || "";
            document.getElementById("form-ru-btn-text").value = review.ru?.linkText || "Купить на AliExpress";
            document.getElementById("form-ru-link").value = review.ru?.aliLink || "";
            
            if (review.ru?.pros) {
                review.ru.pros.forEach(pro => addProInput("ru", pro));
            }

            // HE Data
            document.getElementById("form-he-title").value = review.he?.title || "";
            document.getElementById("form-he-excerpt").value = review.he?.excerpt || "";
            document.getElementById("form-he-body").value = review.he?.body || "";
            document.getElementById("form-he-btn-text").value = review.he?.linkText || "לקנייה בעליаקספרס";
            document.getElementById("form-he-link").value = review.he?.aliLink || "";

            if (review.he?.pros) {
                review.he.pros.forEach(pro => addProInput("he", pro));
            }
        }
    } else {
        // Add Mode
        editMode = false;
        currentReviewId = null;
        document.getElementById("modal-title").innerText = "Добавить новый обзор";
        document.getElementById("form-id").disabled = false;
        document.getElementById("form-id-hidden").value = "";
        
        // Add one default pro input for convenience
        addProInput("ru");
        addProInput("he");
    }
}

function closeModal() {
    document.getElementById("review-modal").classList.add("hidden");
}

function addProInput(lang, val = "") {
    const container = document.getElementById(`${lang}-pros-container`);
    const row = document.createElement("div");
    row.className = "pro-input-row";
    row.innerHTML = `
        <input type="text" class="${lang}-pro-input" value="${val}" placeholder="Плюс товара..." required>
        <button type="button" class="btn btn-secondary btn-del-pro">✕</button>
    `;
    container.appendChild(row);

    row.querySelector(".btn-del-pro").addEventListener("click", () => {
        row.remove();
    });
}

function saveFormValues() {
    // Get Pros Lists
    const ruPros = [];
    document.querySelectorAll(".ru-pro-input").forEach(inp => {
        if (inp.value.trim()) ruPros.push(inp.value.trim());
    });

    const hePros = [];
    document.querySelectorAll(".he-pro-input").forEach(inp => {
        if (inp.value.trim()) hePros.push(inp.value.trim());
    });

    const formId = document.getElementById("form-id").value.trim();

    const newReview = {
        id: formId,
        category: document.getElementById("form-category").value,
        rating: parseFloat(document.getElementById("form-rating").value),
        priceAli: parseInt(document.getElementById("form-price-ali").value),
        priceLocal: parseInt(document.getElementById("form-price-local").value),
        image: document.getElementById("form-image").value.trim(),
        ru: {
            title: document.getElementById("form-ru-title").value.trim(),
            excerpt: document.getElementById("form-ru-excerpt").value.trim(),
            body: document.getElementById("form-ru-body").value.trim(),
            pros: ruPros,
            linkText: document.getElementById("form-ru-btn-text").value.trim(),
            aliLink: document.getElementById("form-ru-link").value.trim()
        },
        he: {
            title: document.getElementById("form-he-title").value.trim(),
            excerpt: document.getElementById("form-he-excerpt").value.trim(),
            body: document.getElementById("form-he-body").value.trim(),
            pros: hePros,
            linkText: document.getElementById("form-he-btn-text").value.trim(),
            aliLink: document.getElementById("form-he-link").value.trim()
        }
    };

    if (editMode) {
        // Replace in array
        const idx = reviewsData.findIndex(item => item.id === currentReviewId);
        if (idx !== -1) {
            reviewsData[idx] = newReview;
        }
    } else {
        // Check uniqueness of ID
        if (reviewsData.some(item => item.id === formId)) {
            alert(`Ошибка: Обзор с ID "${formId}" уже существует!`);
            return;
        }
        // Add to the beginning of the list
        reviewsData.unshift(newReview);
    }

    renderReviewsList();
    closeModal();
    alert("Обзор успешно сохранен в локальный список! Пожалуйста, нажмите желтую кнопку 'Опубликовать в сеть 🚀' для отправки изменений на хостинг.");
}

function deleteReview(reviewId) {
    if (confirm("Вы действительно хотите удалить этот обзор?")) {
        reviewsData = reviewsData.filter(item => item.id !== reviewId);
        renderReviewsList();
        alert("Обзор удален из локального списка! Не забудьте нажать 'Опубликовать в сеть 🚀'.");
    }
}

// GitHub API Committing Deployment
async function deployToGitHub() {
    if (!ghOwner || !ghRepo || !ghToken) {
        alert("Сначала разверните Настройки интеграции и введите GitHub Username, Repo Name и Personal Token!");
        // Backup: offer download reviews.json
        downloadJsonBackup();
        return;
    }

    const btn = document.getElementById("btn-save-deploy");
    btn.disabled = true;
    btn.innerText = "Публикация... ⏳";

    try {
        // 1. Get SHA and Content of existing reviews.json from GitHub to prevent overwriting
        const getUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${ghFilePath}?t=${new Date().getTime()}`;
        const putUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${ghFilePath}`;
        const getResponse = await fetch(getUrl, {
            headers: {
                "Authorization": `token ${ghToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        let sha = null;
        let githubReviews = [];
        let githubCategories = [];
        if (getResponse.status === 200) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
            try {
                // Base64 decode taking care of utf-8
                const rawContent = atob(fileData.content.replace(/\s/g, ''));
                const decodedContent = decodeURIComponent(escape(rawContent));
                const parsed = JSON.parse(decodedContent);
                if (parsed) {
                    if (parsed.reviews && Array.isArray(parsed.reviews)) {
                        githubReviews = parsed.reviews;
                    }
                    if (parsed.categories && Array.isArray(parsed.categories)) {
                        githubCategories = parsed.categories;
                    }
                }
            } catch (e) {
                console.error("Error parsing remote reviews.json:", e);
            }
        } else if (getResponse.status !== 404) {
            throw new Error(`Ошибка получения файла с GitHub: ${getResponse.statusText}`);
        }

        // Merge categories: keep local ones, but add any remote ones that don't exist locally unless they were deleted locally
        const mergedCategories = [...categoriesData];
        githubCategories.forEach(remoteCat => {
            const catId = typeof remoteCat === 'object' ? remoteCat.id : remoteCat;
            if (!mergedCategories.some(localCat => (typeof localCat === 'object' ? localCat.id : localCat) === catId)) {
                // If it wasn't loaded when page opened, it's new from SaaS, so bring it in.
                // Otherwise, the user loaded it and explicitly deleted it, so do not restore it.
                if (!loadedCategoryIds.includes(catId)) {
                    mergedCategories.push(remoteCat);
                }
            }
        });
        categoriesData = mergedCategories;
        loadedCategoryIds = categoriesData.map(c => typeof c === 'object' ? c.id : c);

        // Merge reviews: keep local edits and deletions, but bring in any new reviews published by SaaS
        const mergedReviews = [...reviewsData];
        githubReviews.forEach(remoteReview => {
            if (!mergedReviews.some(localReview => localReview.id === remoteReview.id)) {
                // If it wasn't loaded when page opened, it's new from SaaS, so bring it in.
                // Otherwise, the user loaded it and explicitly deleted it, so do not restore it.
                if (!loadedReviewIds.includes(remoteReview.id)) {
                    mergedReviews.push(remoteReview);
                }
            }
        });
        reviewsData = mergedReviews;
        loadedReviewIds = reviewsData.map(r => r.id);

        // Re-render updated lists locally so the UI stays in sync
        renderReviewsList();
        renderCategoriesList();
        populateCategoryDropdown();

        // 2. Encode config (categories & reviews) in Base64
        const payloadData = {
            categories: categoriesData,
            reviews: reviewsData
        };
        const updatedJsonStr = JSON.stringify(payloadData, null, 4);
        const encodedContent = btoa(unescape(encodeURIComponent(updatedJsonStr)));

        // 3. Put request to update/create reviews.json on GitHub
        const payload = {
            message: `Publish changes via AliStyle CMS: ${new Date().toISOString()}`,
            content: encodedContent,
            branch: "main"
        };
        if (sha) {
            payload.sha = sha;
        }

        const putResponse = await fetch(putUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${ghToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (putResponse.ok) {
            alert("Поздравляем! Публикация прошла успешно! 🎉\nGitHub принял изменения. Netlify автоматически обновит сайт в течение 15 секунд.");
        } else {
            const errData = await putResponse.json();
            throw new Error(errData.message || "Ошибка записи на GitHub");
        }
    } catch (e) {
        alert(`Ошибка публикации: ${e.message}\n\nФайл скачан локально на твой компьютер как бэкап.`);
        downloadJsonBackup();
    } finally {
        btn.disabled = false;
        btn.innerText = "Опубликовать в сеть 🚀";
    }
}

// Backup: local download of reviews.json
function downloadJsonBackup() {
    const payloadData = {
        categories: categoriesData,
        reviews: reviewsData
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payloadData, null, 4));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "reviews.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Category Management Functions
function renderCategoriesList() {
    const container = document.getElementById("admin-categories-list");
    container.innerHTML = "";

    if (categoriesData.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 15px;">Категории отсутствуют</div>`;
        return;
    }

    categoriesData.forEach(cat => {
        const row = document.createElement("div");
        row.className = "review-item";
        row.style.padding = "10px 14px";
        row.innerHTML = `
            <div class="review-info">
                <div class="review-meta">
                    <h3>${cat.ru} / ${cat.he}</h3>
                    <p>ID: ${cat.id}</p>
                </div>
            </div>
            <div class="review-actions">
                <button class="btn btn-secondary btn-edit-cat" data-id="${cat.id}" style="padding: 6px 12px; font-size: 12px;">Редактировать</button>
                <button class="btn btn-danger btn-del-cat" data-id="${cat.id}" style="padding: 6px 12px; font-size: 12px;">Удалить</button>
            </div>
        `;
        container.appendChild(row);
    });

    document.querySelectorAll(".btn-edit-cat").forEach(btn => {
        btn.addEventListener("click", (e) => {
            startEditCategory(e.target.dataset.id);
        });
    });

    document.querySelectorAll(".btn-del-cat").forEach(btn => {
        btn.addEventListener("click", (e) => {
            deleteCategory(e.target.dataset.id);
        });
    });
}

function startEditCategory(catId) {
    const cat = categoriesData.find(c => c.id === catId);
    if (!cat) return;

    document.getElementById("cat-edit-mode").value = "true";
    document.getElementById("cat-edit-old-id").value = catId;
    
    document.getElementById("new-cat-id").value = cat.id;
    document.getElementById("new-cat-ru").value = cat.ru;
    document.getElementById("new-cat-he").value = cat.he;

    document.getElementById("cat-id-label").innerText = "ID категории (латиницей)";
    document.getElementById("btn-add-category").innerText = "Сохранить изменения";
    document.getElementById("btn-cancel-cat-edit").classList.remove("hidden");
}

function resetCategoryForm() {
    document.getElementById("cat-edit-mode").value = "false";
    document.getElementById("cat-edit-old-id").value = "";
    
    document.getElementById("new-cat-id").value = "";
    document.getElementById("new-cat-ru").value = "";
    document.getElementById("new-cat-he").value = "";

    document.getElementById("cat-id-label").innerText = "ID новой категории (латиницей)";
    document.getElementById("btn-add-category").innerText = "+ Добавить категорию";
    document.getElementById("btn-cancel-cat-edit").classList.add("hidden");
}

function addCategory() {
    const idInput = document.getElementById("new-cat-id");
    const ruInput = document.getElementById("new-cat-ru");
    const heInput = document.getElementById("new-cat-he");

    const id = idInput.value.trim().toLowerCase();
    const ru = ruInput.value.trim();
    const he = heInput.value.trim();

    if (!id || !ru || !he) {
        alert("Пожалуйста, заполните все поля категории!");
        return;
    }

    const isEdit = document.getElementById("cat-edit-mode").value === "true";
    const oldId = document.getElementById("cat-edit-old-id").value;

    if (isEdit) {
        const catIndex = categoriesData.findIndex(c => c.id === oldId);
        if (catIndex === -1) return;

        if (id !== oldId && categoriesData.some(c => c.id === id)) {
            alert(`Ошибка: Категория с ID "${id}" уже существует!`);
            return;
        }

        categoriesData[catIndex] = { id, ru, he };

        if (id !== oldId) {
            reviewsData.forEach(review => {
                if (review.category === oldId) {
                    review.category = id;
                }
            });
            renderReviewsList();
        }

        resetCategoryForm();
        alert("Категория успешно обновлена в списке! Пожалуйста, нажмите желтую кнопку 'Опубликовать в сеть 🚀', чтобы сохранить её.");
    } else {
        if (categoriesData.some(c => c.id === id)) {
            alert(`Ошибка: Категория с ID "${id}" уже существует!`);
            return;
        }

        categoriesData.push({ id, ru, he });
        
        idInput.value = "";
        ruInput.value = "";
        heInput.value = "";
        
        alert("Категория успешно добавлена в список! Пожалуйста, нажмите желтую кнопку 'Опубликовать в сеть 🚀', чтобы сохранить её.");
    }

    renderCategoriesList();
    populateCategoryDropdown();
}

function deleteCategory(catId) {
    const count = reviewsData.filter(r => r.category === catId).length;
    if (count > 0) {
        alert(`Нельзя удалить категорию "${catId}", так как к ней привязано ${count} обзоров! Сначала измените категорию у этих обзоров.`);
        return;
    }

    if (confirm(`Вы действительно хотите удалить категорию "${catId}"?`)) {
        categoriesData = categoriesData.filter(c => c.id !== catId);
        renderCategoriesList();
        populateCategoryDropdown();
        alert("Категория удалена из списка! Не забудьте нажать кнопку 'Опубликовать в сеть 🚀' для сохранения.");
    }
}

function populateCategoryDropdown() {
    const dropdown = document.getElementById("form-category");
    dropdown.innerHTML = "";

    categoriesData.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.innerText = `${cat.ru} / ${cat.he}`;
        dropdown.appendChild(opt);
    });
}

