import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// Absolute paths to generated files
const indexHtmlPath = '/Users/mac/Documents/aliexpres/alistyle-blog/index.html';
const reviewHtmlPath = '/Users/mac/Documents/aliexpres/alistyle-blog/review.html';
const cssPath = '/Users/mac/Documents/aliexpres/alistyle-blog/style.css';
const jsPath = '/Users/mac/Documents/aliexpres/alistyle-blog/main.js';

let errors = 0;

function logSuccess(msg) {
    console.log(`✅ ${msg}`);
}

function logError(msg) {
    console.error(`❌ ${msg}`);
    errors++;
}

console.log('🔍 Starting validation of AliStyle Blog build files...');

// 1. Verify existence of files
[indexHtmlPath, reviewHtmlPath, cssPath, jsPath].forEach(filePath => {
    if (fs.existsSync(filePath)) {
        logSuccess(`File exists: ${path.basename(filePath)}`);
    } else {
        logError(`File missing: ${path.basename(filePath)} (${filePath})`);
    }
});

if (errors > 0) {
    console.error(`⚠️ Found ${errors} critical errors. Stopping verification.`);
    process.exit(1);
}

// 2. Validate index.html
console.log('\n📄 Analyzing index.html...');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const $index = cheerio.load(indexHtml);

// SEO: Title, Meta, H1
const indexTitle = $index('title').text();
if (indexTitle.includes('AliStyle Blog')) {
    logSuccess(`index.html Title check passed ("${indexTitle}")`);
} else {
    logError(`index.html Title check failed: current title is "${indexTitle}"`);
}

const indexMetaDesc = $index('meta[name="description"]').attr('content');
if (indexMetaDesc && indexMetaDesc.length > 30) {
    logSuccess('index.html Meta description check passed');
} else {
    logError('index.html Meta description check failed');
}

const indexH1 = $index('h1').text().trim();
if (indexH1.length > 0) {
    logSuccess(`index.html H1 check passed ("${indexH1}")`);
} else {
    logError('index.html H1 check failed (missing or empty)');
}

// Mobile-First Check
const indexViewport = $index('meta[name="viewport"]').attr('content');
if (indexViewport && indexViewport.includes('width=device-width')) {
    logSuccess('index.html Responsive viewport check passed');
} else {
    logError('index.html Responsive viewport check failed');
}

// Conversion links: Telegram and WhatsApp
const tgLink = $index('a[href*="t.me"]').attr('href');
const waLink = $index('a[href*="chat.whatsapp.com"]').attr('href');
if (tgLink && waLink) {
    logSuccess('index.html Telegram and WhatsApp link structures found');
} else {
    logError('index.html Telegram or WhatsApp conversion link is missing');
}

// Performance: LCP fetchpriority and loading="lazy" (checks if they are defined dynamically in main.js since index.html is loaded client-side)
const mainJsContent = fs.readFileSync(jsPath, 'utf8');
if (mainJsContent.includes('fetchpriority="high"') || mainJsContent.includes("fetchpriority='high'")) {
    logSuccess('index.html/main.js LCP image fetchpriority check passed (configured dynamically in main.js)');
} else {
    logError('index.html/main.js LCP image fetchpriority check failed');
}

if (mainJsContent.includes('loading="lazy"') || mainJsContent.includes("loading='lazy'")) {
    logSuccess('index.html/main.js Below-the-fold lazy image check passed (configured dynamically in main.js)');
} else {
    logError('index.html/main.js Below-the-fold lazy image check failed');
}

// 3. Validate review.html
console.log('\n📄 Analyzing review.html...');
const reviewHtml = fs.readFileSync(reviewHtmlPath, 'utf8');
const $review = cheerio.load(reviewHtml);

const reviewH1 = $review('#review-title').text().trim();
if (reviewH1.length > 0) {
    logSuccess(`review.html H1 placeholder check passed ("${reviewH1}")`);
} else {
    logError('review.html H1 check failed');
}

// SEO Breadcrumbs
const breadcrumbs = $review('.breadcrumbs li');
if (breadcrumbs.length >= 3) {
    logSuccess(`review-template.html Breadcrumbs check passed (${breadcrumbs.length} items)`);
} else {
    logError('review-template.html Breadcrumbs check failed');
}

// Fast buy block
const fastBuyBox = $review('#fast-buy-box');
const aliBuyBtn = $review('#main-buy-btn');
if (fastBuyBox.length > 0 && aliBuyBtn.length > 0) {
    logSuccess('review-template.html Fast Buy section and AliExpress buy button found');
} else {
    logError('review-template.html Fast Buy section or AliExpress buy button is missing');
}

// No-follow verification for external link
const aliLinkRel = aliBuyBtn.attr('rel');
if (aliLinkRel && aliLinkRel.includes('nofollow')) {
    logSuccess('review-template.html nofollow tag present on affiliate buy button');
} else {
    logError('review-template.html nofollow tag missing on affiliate buy button (critical for SEO ranking)');
}

// Personal experience container check (verified to be dynamic in main.js)
const bodyContainer = $review('#review-body');
if (bodyContainer.length > 0) {
    logSuccess('review.html dynamic body container (#review-body) check passed');
} else {
    logError('review.html dynamic body container is missing');
}

// Mobile sticky footer
const stickyCta = $review('#mobile-sticky-cta');
if (stickyCta.length > 0) {
    logSuccess('review-template.html Mobile sticky buy footer container found');
} else {
    logError('review-template.html Mobile sticky buy footer is missing');
}

// Performance: review LCP fetchpriority
const reviewLcpImg = $review('img[fetchpriority="high"]');
if (reviewLcpImg.length > 0) {
    logSuccess(`review.html LCP image check passed: found on "${reviewLcpImg.attr('id')}"`);
} else {
    logError('review.html LCP image check failed (no image has fetchpriority="high")');
}

// 4. Validate style.css
console.log('\n🎨 Analyzing style.css...');
const styleCss = fs.readFileSync(cssPath, 'utf8');
if (styleCss.includes('--color-ali-red') && styleCss.includes('--color-telegram') && styleCss.includes('--color-whatsapp')) {
    logSuccess('style.css Custom color variables check passed');
} else {
    logError('style.css Custom color variables missing');
}

if (styleCss.includes('cta-pulse') || styleCss.includes('pulse')) {
    logSuccess('style.css CTA pulse animation rules found');
} else {
    logError('style.css CTA pulse animation rules missing');
}

if (styleCss.includes('@media')) {
    logSuccess('style.css Mobile-first queries found');
} else {
    logError('style.css Mobile-first queries missing');
}

// 5. Validate main.js
console.log('\n💾 Analyzing main.js...');
const mainJs = fs.readFileSync(jsPath, 'utf8');
if (mainJs.includes('IntersectionObserver')) {
    logSuccess('main.js IntersectionObserver used for sticky CTA trigger');
} else {
    logError('main.js IntersectionObserver is missing');
}

if (mainJs.includes('search-input') && mainJs.includes('filter-btn')) {
    logSuccess('main.js Search and category filter event listeners check passed');
} else {
    logError('main.js Search or category filter listeners missing');
}

console.log('\n========================================');
if (errors === 0) {
    console.log('🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
} else {
    console.error(`⚠️ VERIFICATION COMPLETED WITH ${errors} ERRORS.`);
}
console.log('========================================');
process.exit(errors > 0 ? 1 : 0);
