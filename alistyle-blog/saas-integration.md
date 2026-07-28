# Руководство по интеграции SaaS-продукта с AliStyle Blog через GitHub API

Этот документ содержит инструкции и примеры кода для интеграции внешнего SaaS-продукта с блогом AliStyle через REST API GitHub.

## Принцип работы

1. **База данных блога** — это один статический файл [reviews.json](reviews.json), который лежит в корне репозитория.
2. Ваш SaaS генерирует обзор на русском и иврите.
3. SaaS обращается к GitHub API, забирает текущую версию `reviews.json`, добавляет туда новый обзор и записывает файл обратно.
4. Netlify видит коммит в ветку `main` и запускает автодеплой. Через 10–15 секунд новый обзор уже отображается на сайте.

---

## Шаг 1. Получение GitHub Personal Access Token (PAT)

Для авторизации запросов вашему SaaS-продукту нужен токен.
1. Зайдите в ваш аккаунт GitHub в **Settings -> Developer Settings -> Personal access tokens (classic)**.
2. Сгенерируйте новый токен с правами **`repo`** (доступ к репозиториям).
3. Скопируйте токен.

---

## Шаг 2. Формат JSON обзора

Каждая публикация должна добавляться в массив `reviews` в следующем формате:

```json
{
  "id": "prod_unique_id", 
  "category": "electronics", 
  "rating": 4.8, 
  "priceAli": 150, 
  "priceLocal": 300, 
  "image": "https://ссылка_на_главное_фото.jpg", 
  "ru": {
    "title": "Название товара (RU)",
    "excerpt": "Краткий анонс для карточки (RU)",
    "body": "# Заголовок\n\nТекст обзора в формате Markdown...",
    "pros": [
      "Плюс 1",
      "Плюс 2"
    ],
    "linkText": "Купить на AliExpress",
    "aliLink": "https://s.click.aliexpress.com/e/..."
  },
  "he": {
    "title": "כותרת המוצר (HE)",
    "excerpt": "תקציר קצר לכרטיסייה (HE)",
    "body": "# כותרת\n\nטקסט מלא בפורמט Markdown...",
    "pros": [
      "יתרון 1",
      "יתרון 2"
    ],
    "linkText": "לקנייה בעליאקספרס",
    "aliLink": "https://s.click.aliexpress.com/e/..."
  }
}
```

---

## Шаг 3. Реализация на стороне вашего SaaS (Пример на Node.js)

Ниже представлен готовый JS-код для интеграции, который ваш SaaS может использовать для отправки обзоров:

```javascript
import fetch from 'node-fetch';

const GH_TOKEN = 'ghp_ваш_персональный_токен_доступа';
const GH_OWNER = 'имя_аккаунта_github';
const GH_REPO = 'имя_репозитория_блога';
const FILE_PATH = 'reviews.json';

/**
 * Публикация нового обзора в блог AliStyle через GitHub API
 * @param {Object} newReview - Объект обзора в правильном JSON-формате
 */
async function publishReviewToBlog(newReview) {
    const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${FILE_PATH}`;
    const headers = {
        'Authorization': `token ${GH_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SaaS-AliStyle-Connector'
    };

    try {
        console.log('🔄 Шаг 1: Получение текущего состояния базы данных...');
        let sha = null;
        let dbData = { categories: [], reviews: [] };

        const getRes = await fetch(url, { headers });
        
        if (getRes.status === 200) {
            const fileData = await getRes.json();
            sha = fileData.sha; // Запоминаем SHA текущего коммита (обязательно для PUT)
            
            // Декодируем base64 содержимое
            const rawContent = Buffer.from(fileData.content, 'base64').toString('utf8');
            dbData = JSON.parse(rawContent);
        } else if (getRes.status !== 404) {
            throw new Error(`Ошибка получения файла: ${getRes.statusText}`);
        }

        console.log('🔄 Шаг 2: Вставка нового обзора в базу данных...');
        // Исключаем дубли по ID
        dbData.reviews = dbData.reviews.filter(r => r.id !== newReview.id);
        
        // Вставляем новый обзор в самое начало (чтобы он был первым на главной)
        dbData.reviews.unshift(newReview);

        // Переводим обновленную базу в строку JSON
        const updatedContentStr = JSON.stringify(dbData, null, 4);
        const base64Content = Buffer.from(updatedContentStr, 'utf8').toString('base64');

        console.log('🔄 Шаг 3: Сохранение обновленного файла на GitHub...');
        const payload = {
            message: `SaaS Auto-Publish Review: ${newReview.id}`,
            content: base64Content,
            branch: 'main'
        };
        if (sha) payload.sha = sha;

        const putRes = await fetch(url, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (putRes.ok) {
            console.log(`🎉 Обзор ${newReview.id} успешно опубликован! Netlify обновит сайт в течение 10 секунд.`);
            return { success: true };
        } else {
            const errData = await putRes.json();
            throw new Error(`Ошибка записи на GitHub: ${errData.message}`);
        }

    } catch (error) {
        console.error('❌ Ошибка интеграции с блогом:', error.message);
        return { success: false, error: error.message };
    }
}
