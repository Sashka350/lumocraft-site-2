const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const privacy = fs.readFileSync(path.join(root, 'privacy.html'), 'utf8');
const psychologistDemo = fs.readFileSync(path.join(root, 'examples', 'psychologist', 'index.html'), 'utf8');
const pavelDemo = fs.readFileSync(path.join(root, 'examples', 'pavel-pronin', 'index.html'), 'utf8');
const cafeDemo = fs.readFileSync(path.join(root, 'examples', 'cafe', 'index.html'), 'utf8');

test('HTML has one primary heading and semantic page regions', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<main[\s>]/);
  assert.match(html, /<footer[\s>]/);
});

test('SEO metadata points to the production domain', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/lumocraft\.ru\/">/);
  assert.match(html, /property="og:url" content="https:\/\/lumocraft\.ru\/"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /contact@lumocraft\.ru/);
  assert.match(html, /property="og:image:width" content="851"/);
  assert.match(html, /property="og:image:height" content="315"/);
  assert.match(html, /name="robots" content="max-image-preview:large"/);
  assert.match(html, /"@type": "ProfessionalService"/);
  assert.match(html, /"@type": "FAQPage"/);
  assert.match(html, /"priceCurrency": "RUB"/);
  assert.match(html, /max-image-preview:large/);
});

test('Both lead forms have required consent and server delivery logic', () => {
  assert.equal((html.match(/class="lead-form"/g) || []).length, 2);
  assert.equal((html.match(/class="consent"/g) || []).length, 2);
  assert.match(html, /fetch\('submit\.php'/);
  assert.match(html, /data-form-target="quick-form"/);
  assert.match(html, /data-form-target="brief-form"/);
  assert.match(html, /className = 'contact-method'/);
  assert.match(html, /data-method="Telegram"/);
  assert.match(html, /contactOptions/);
  assert.doesNotMatch(privacy, /mailto:contact@lumocraft\.ru/);
});

test('Motion is opt-out for reduced-motion users', () => {
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /animation: none !important/);
  assert.match(html, /IntersectionObserver/);
});

test('Direct contact block and mobile nav are present, portfolio is gone', () => {
  assert.doesNotMatch(html, /id="work"/);
  assert.doesNotMatch(html, /href="#work"/);
  assert.doesNotMatch(html, /class="case-preview"|case-hero\.jpg|\.case \{/);
  assert.doesNotMatch(html, /portrait-[1235]|portrait-bw/);
  assert.match(html, /id="direct"/);
  assert.match(html, /<h2>Контакты<\/h2>/);
  assert.match(html, /class="direct-copy">Форма необязательна\. Напишите в Telegram или на почту: отвечаем в течение рабочего дня\.</);
  assert.match(html, /class="direct-cards"/);
  assert.match(html, /class="direct-card-icon" aria-hidden="true"><svg/);
  assert.equal((html.match(/class="direct-card"/g) || []).length, 2);
  assert.match(html, /data-copy-email/);
  assert.match(html, /class="direct-card-value">contact@lumocraft\.ru</);
  assert.match(html, /class="direct-card-value">@sassha_at</);
  assert.doesNotMatch(html, /\.direct-actions|\.direct-email\b/);
  assert.match(html, /footer \{[^}]*background: var\(--panel\)/);
  assert.match(html, /class="mobile-nav"/);
  assert.match(html, /grid-template-columns: repeat\(3, 1fr\); gap: 0; border-top: 1px solid var\(--line\); background: rgba\(16,17,16/);
  assert.doesNotMatch(html, /\.contact-actions|\.button\.ghost.*11140d !important/);
});

test('Header shows three identical links in the agreed order', () => {
  const body = html.match(/<body>[\s\S]*?<script>/)?.[0] || '';
  assert.doesNotMatch(body, />Работа<\/a>/);
  assert.doesNotMatch(html, /class="nav-cta"/);
  assert.match(html, /<a class="nav-link" href="#services">Услуги<\/a>\s*<a class="nav-link" href="#contact">Оставить заявку<\/a>\s*<a class="nav-link" href="#direct">Контакты<\/a>\s*<div class="lang"/);
  assert.equal((body.match(/class="nav-link"/g) || []).length, 3);
  assert.doesNotMatch(html, /nav-btn/);
  assert.match(html, /class="mobile-nav"[^>]*><a href="#services">Услуги<\/a><a href="#contact">Заявка<\/a><a href="#direct">Контакты<\/a><\/nav>/);
  assert.match(html, /@keyframes brand-pulse/);
  assert.match(html, /\.brand-dot \{[^}]*animation: brand-pulse/);
  assert.match(html, /input\[type="checkbox"\] \{ -webkit-appearance: none; appearance: none;/);
  assert.match(html, /input\[type="checkbox"\]:checked::after/);
  assert.equal((body.match(/Посмотреть пример/g) || []).length, 3);
  assert.match(body, /href="examples\/psychologist\/"/);
  assert.match(body, /href="examples\/pavel-pronin\/"/);
  assert.equal((body.match(/href="404\.html"/g) || []).length, 0);
  assert.match(body, /href="examples\/cafe\/"/);
  assert.doesNotMatch(body, /sashka350\.github\.io\/example-/);
});

test('Psychologist example is responsive, clearly fictional and never sends form data', () => {
  assert.match(psychologistDemo, /<meta name="robots" content="noindex, follow">/);
  assert.match(psychologistDemo, /Демо-концепт · специалист вымышлен · фото стоковое/);
  assert.match(psychologistDemo, /assets\/pexels-nele-holemans-28806780\.jpg/);
  assert.match(psychologistDemo, /Nele Holemans \/ Pexels/);
  assert.match(psychologistDemo, /<div class="hero-art">[\s\S]*?<\/div>\s*<figcaption class="photo-credit">/);
  assert.doesNotMatch(psychologistDemo, /class="art-credit"/);
  assert.match(psychologistDemo, /модели у окна; это не реальный специалист проекта/);
  assert.match(psychologistDemo, /Консультация не заменяет экстренную или медицинскую помощь/);
  assert.match(psychologistDemo, /@media \(max-width: 680px\)/);
  const hero = psychologistDemo.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || '';
  assert.doesNotMatch(hero, /class="actions"|class="hero-meta"|В удобном темпе/);
  assert.match(psychologistDemo, /<section class="section" id="format">[\s\S]*?<div class="section-head">/);
  assert.match(psychologistDemo, /<h3>Онлайн<\/h3>[\s\S]*?<h3>Очно<\/h3>/);
  assert.match(psychologistDemo, /4 000 ₽/);
  assert.match(psychologistDemo, /г\. Примерск, ул\. Тисовая, д\. 0/);
  assert.match(psychologistDemo, /Вымышленный адрес, указан только для демонстрации/);
  assert.doesNotMatch(psychologistDemo, /class="format-panel"/);
  assert.doesNotMatch(psychologistDemo, /id="faq"|Частые вопросы|class="faq-list"/);
  assert.doesNotMatch(psychologistDemo, /id="process"|href="#process"|Как проходят встречи|\.step\b|class="steps"/);
  assert.match(psychologistDemo, /Поддерживающая психоаналитическая терапия/);
  assert.match(psychologistDemo, /Терапия, сфокусированная на переносе \(ТФП\)/);
  assert.match(psychologistDemo, /1–2 встречи в неделю/);
  assert.match(psychologistDemo, /Отношения/);
  assert.match(psychologistDemo, /Работа и самореализация/);
  assert.doesNotMatch(psychologistDemo, /В описании референса|В референсе указаны/);
  assert.match(psychologistDemo, /данные никуда не отправляются и не сохраняются/);
  assert.match(psychologistDemo, /event\.preventDefault\(\)/);
  assert.doesNotMatch(psychologistDemo, /action=|fetch\(|submit\.php|mailto:/i);
  const demoScript = psychologistDemo.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(demoScript);
  assert.doesNotThrow(() => new Function(demoScript));
  const demoPhoto = fs.readFileSync(path.join(root, 'examples', 'psychologist', 'assets', 'pexels-nele-holemans-28806780.jpg'));
  assert.equal(demoPhoto.slice(0, 3).toString('hex'), 'ffd8ff');
  assert.ok(demoPhoto.length < 700 * 1024, 'demo portrait should be optimized under 700 KB');
});

test('Pavel example is a complete noindex copy with links scoped to its Pages folder', () => {
  const demoRoot = path.join(root, 'examples', 'pavel-pronin');
  const base = '/lumocraft-site-2/examples/pavel-pronin/';
  const htmlFiles = [];
  const collectHtml = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) collectHtml(file);
      else if (entry.name.endsWith('.html')) htmlFiles.push(file);
    }
  };
  collectHtml(demoRoot);

  assert.ok(htmlFiles.length >= 90, 'the multi-page example should include the complete page set');
  assert.match(pavelDemo, /<meta name="robots" content="noindex, follow" \/>/);
  assert.match(pavelDemo, /href="https:\/\/pavelpronin\.art\/"/);
  assert.match(pavelDemo, new RegExp(`src="${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}assets\/main-[^"]+\\.js"`));
  assert.match(pavelDemo, /src="images\/hero-bg\.webp"/);

  for (const file of htmlFiles) {
    const page = fs.readFileSync(file, 'utf8');
    assert.match(page, /<meta name="robots" content="noindex, follow" \/>/, `${path.relative(demoRoot, file)} should not be indexed`);
    assert.doesNotMatch(page, /\/pavel-pronin-site2\//, `${path.relative(demoRoot, file)} should not link to the source repo path`);
    for (const [, url] of page.matchAll(/\b(?:href|src)=["'](\/(?!\/)[^"']*)["']/g)) {
      assert.ok(url.startsWith(base), `${path.relative(demoRoot, file)} has an unscoped link: ${url}`);
    }
  }
});

test('Cafe example is a four-page noindex showcase with real menu content and a safe demo form', () => {
  const demoRoot = path.join(root, 'examples', 'cafe');
  const pages = ['index.html', 'menu.html', 'about.html', 'contacts.html'];

  assert.match(html, /href="examples\/cafe\/" target="_blank"/);
  assert.match(cafeDemo, /Демо-концепт/);
  assert.match(cafeDemo, /кофейня вымышлена · фото стоковые/);

  for (const pageName of pages) {
    const file = path.join(demoRoot, pageName);
    const page = fs.readFileSync(file, 'utf8');
    assert.match(page, /<meta name="robots" content="noindex, follow">/, `${pageName} should not be indexed`);
    assert.match(page, /Демо-концепт/, `${pageName} should be visibly marked as a concept`);
    assert.equal((page.match(/<h1\b/g) || []).length, 1, `${pageName} should have one main heading`);

    for (const [, url] of page.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|tel:|#)/i.test(url)) continue;
      const relative = url.split(/[?#]/, 1)[0];
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), relative)), `${pageName} has a missing local link or asset: ${url}`);
    }
  }

  const cafePages = pages.map((pageName) => fs.readFileSync(path.join(demoRoot, pageName), 'utf8'));
  for (const destination of ['index.html', 'menu.html', 'about.html', 'contacts.html']) {
    assert.ok(cafePages.every((page) => page.includes(`href="${destination}"`)), `all cafe pages should link to ${destination}`);
  }
  assert.match(cafePages[1], /Капучино/);
  assert.match(cafePages[1], /\d[\d ]* ₽/);
  assert.match(cafePages[1], /молоко/i);
  assert.match(cafePages[2], /2021/);
  assert.match(cafePages[3], /Покровский бульвар/);
  assert.match(cafePages[3], /8:00–22:00/);

  const form = cafePages[3].match(/<form\b[\s\S]*?<\/form>/)?.[0] || '';
  assert.match(form, /data-demo-form/);
  assert.doesNotMatch(form, /\bname="/);
  assert.doesNotMatch(form, /\baction=|\bmethod=/i);
  assert.match(cafePages[3], /данные не отправляются и не сохраняются/);
  assert.doesNotMatch(cafePages.join('\n'), /submit\.php|mailto:|fetch\s*\(/i);

  const script = fs.readFileSync(path.join(demoRoot, 'assets', 'cafe.js'), 'utf8');
  assert.match(script, /event\.preventDefault\(\)/);
  assert.doesNotThrow(() => new Function(script));
  const css = fs.readFileSync(path.join(demoRoot, 'assets', 'cafe.css'), 'utf8');
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /prefers-reduced-motion/);

  for (const asset of ['hero-bar.jpg', 'friends.jpg', 'interior.jpg', 'interior-dark.jpg', 'terrace.jpg', 'cafe-sign.jpg', 'brewing.jpg', 'portafilter.jpg', 'beans.jpg', 'cappuccino.jpg', 'latte-pour.jpg', 'coldbrew.jpg', 'matcha.jpg', 'iced-tea.jpg', 'toast.jpg', 'pancakes.jpg', 'cheesecake.jpg']) {
    const image = fs.readFileSync(path.join(demoRoot, 'assets', asset));
    assert.equal(image.slice(0, 3).toString('hex'), 'ffd8ff', `${asset} should be a valid JPEG`);
    assert.ok(image.length < 350 * 1024, `${asset} should be optimized`);
  }
});

test('Separate prices and news pages and their navigation links are removed', () => {
  assert.equal(fs.existsSync(path.join(root, 'services.html')), false);
  assert.equal(fs.existsSync(path.join(root, 'news.html')), false);
  assert.doesNotMatch(html, /href="services\.html"|href="news\.html"/);
  assert.doesNotMatch(html, /'Цены': 'Prices'|'Новости': 'News'/);
  assert.match(html, /'Заявка': 'Enquiry'/);
  assert.match(html, /grid-template-columns: repeat\(3, 1fr\)/);
  assert.doesNotMatch(html, /nav-pages|nav-page-link|Темы и услуги/);
});

test('About block keeps the original artwork and moves the two balls along the orbit', () => {
  assert.match(html, /\.about-portrait \{[^}]*background: linear-gradient\(145deg, #252b25, #111311 68%\)/);
  assert.doesNotMatch(html, /radial-gradient\(circle at 65% 25%|radial-gradient\(circle at 35% 70%/);
  assert.match(html, /\.about-portrait::after \{ position: absolute; inset: 16%; border: 1px solid rgba\(244,242,237,\.35\); border-radius: 50%; transform: rotate\(-24deg\); content: ""; \}/);
  assert.match(html, /\.about-orbit \{ position: absolute; inset: 16%; transform: rotate\(-24deg\); \}/);
  assert.match(html, /offset-path: ellipse\(50% 50% at 50% 50%\); offset-rotate: 0deg;/);
  assert.match(html, /@keyframes orbit-run \{ from \{ offset-distance: 0%; \} to \{ offset-distance: 100%; \} \}/);
  assert.match(html, /class="orbit-runner coral"/);
  assert.match(html, /class="orbit-runner lime"/);
  assert.match(html, /\.orbit-runner\.lime \{ animation-direction: reverse;/);
  assert.match(html, /\.orbit-dot \{[^}]*width: 16cqw; height: 16cqw;/);
  assert.match(html, /\.orbit-runner\.lime \.orbit-dot \{ width: 24cqw; height: 24cqw;/);
  assert.doesNotMatch(html, /box-shadow: 0 0 54px|box-shadow: 0 0 42px|about-ring|orbit-spin/);
});

test('Form choices use package names and custom chips instead of native selects', () => {
  const body = html.match(/<body>[\s\S]*?<script>/)?.[0] || '';
  assert.doesNotMatch(html, /<select/);
  assert.doesNotMatch(html, /Одностраничник|Выберите вариант|Выберите задачу/);
  assert.match(html, /<legend>Какой формат\?<\/legend>/);
  assert.equal((body.match(/name="Объём" value="Одностраничный сайт"/g) || []).length, 2);
  assert.equal((body.match(/name="Объём" value="Сайт-витрина"/g) || []).length, 2);
  assert.equal((body.match(/name="Объём" value="Многостраничный сайт"/g) || []).length, 2);
  assert.match(html, /\.choice input:checked \+ span \{ border-color: #11140d; background: #11140d; color: var\(--lime\); \}/);
  assert.match(html, /\.choice input \{ position: absolute; width: 1px; height: 1px;/);
  assert.match(html, /type="radio" name="Срок"/);
  assert.match(html, /<legend>Срок<\/legend>/);
});

test('Error page matches the site style and is not indexed', () => {
  const notFound = fs.readFileSync(path.join(root, '404.html'), 'utf8');
  assert.match(notFound, /<meta name="robots" content="noindex, follow">/);
  assert.match(notFound, /<b>404<\/b>/);
  assert.match(notFound, /class="brand-dot"/);
  assert.match(notFound, /@keyframes brand-pulse/);
  assert.match(notFound, /href="https:\/\/lumocraft\.ru\/"/);
  assert.doesNotMatch(notFound, /href="\/"/);
  assert.match(notFound, /https:\/\/t\.me\/sassha_at/);
  assert.match(notFound, /href="privacy\.html"/);
  assert.match(notFound, /--lime: #c8e86b/);
  assert.match(notFound, /--coral: #ff765d/);
  assert.match(notFound, /prefers-reduced-motion/);
  assert.doesNotMatch(notFound, /mailto:/);
  assert.doesNotMatch(notFound, /mc\.yandex\.ru/);
});

test('Analytics integration is opt-in and tracks meaningful actions', () => {
  assert.match(html, /data-metrika-id="113030902"/);
  assert.match(html, /mc\.yandex\.ru\/metrika\/tag\.js/);
  assert.match(html, /lumocraft-analytics-consent/);
  assert.match(html, /Разрешить аналитику/);
  assert.match(html, /Только необходимые/);
  assert.match(html, /lead_form_submit/);
  assert.match(html, /telegram_click/);
});

test('Privacy page covers forms, cookies, withdrawal and operator details', () => {
  assert.match(html, /href="privacy\.html"/);
  assert.match(privacy, /Политика обработки персональных данных и cookies/);
  assert.match(privacy, /113030902/);
  assert.match(privacy, /отозвать согласие/);
  assert.match(privacy, /Оператор/);
});

test('Brand assets and conversion helpers are wired into the page', () => {
  assert.match(html, /href="lumocraft-mark\.png"/);
  assert.doesNotMatch(html, /src="logo\.svg"/);
  assert.match(html, /og-image\.png/);
  assert.doesNotMatch(html, /id="calculator-total"/);
  assert.match(html, /success-screen/);
  assert.match(html, /#about/);
  assert.match(html, /Частые вопросы/);
  assert.match(html, /Lumocraft%20logo\.mp4/);
  assert.match(html, /Lumocraft%20logo\.png/);
});

test('Navigation, static facts and FAQ match the redesigned structure', () => {
  const visible = html.match(/<body>[\s\S]*?<script>/)?.[0] || '';
  assert.match(html, />Услуги<\/a>/);
  assert.match(html, />Контакты<\/a>/);
  assert.doesNotMatch(html, /class="marquee|data-marquee|marquee-group|@keyframes marquee|buildMarquee/);
  assert.equal((visible.match(/class="hero-facts"/g) || []).length, 1);
  assert.match(visible, /от 40 000 ₽/);
  assert.match(visible, /1–7 недель/);
  assert.match(visible, /1 рабочий день/);
  assert.equal((visible.match(/<summary>/g) || []).length, 6);
  assert.match(html, /font-family: "Space Grotesk"/);
  assert.match(html, /class="brand-dot"/);
  assert.doesNotMatch(html, /class="brand-logo"/);
});

test('Live work gallery links to three examples with local optimized previews', () => {
  assert.equal((html.match(/class="work-item(?: |")/g) || []).length, 3);
  for (const example of ['pavel-pronin', 'psychologist', 'cafe']) {
    assert.match(html, new RegExp(`class="work-item[^>]*href="examples/${example}/" target="_blank"`));
  }
  for (const image of ['work-pavel.webp', 'work-psychologist.webp', 'work-cafe.webp']) {
    const file = path.join(root, 'assets', image);
    assert.match(html, new RegExp(`src="assets/${image}"`));
    const buffer = fs.readFileSync(file);
    assert.equal(buffer.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(buffer.subarray(8, 12).toString('ascii'), 'WEBP');
    assert.ok(buffer.length < 120 * 1024, `${image} should stay below 120 KB`);
  }
});

test('Process is a six-step ordered list with concrete client touchpoints', () => {
  const process = html.match(/<section id="process">([\s\S]*?)<\/section>/)?.[1] || '';
  assert.match(process, /<ol class="process-list">/);
  assert.equal((process.match(/class="process-step"/g) || []).length, 6);
  for (const text of ['Обсуждаем задачу', 'Подписываем договор', 'Согласуем структуру и дизайн', 'Показываем рабочую версию', 'Вносим правки', 'Передаём готовый сайт']) {
    assert.match(process, new RegExp(text));
  }
  assert.match(process, /100% предоплаты/);
  assert.match(process, /промежуточный результат/);
  assert.doesNotMatch(process, /три понятных этапа|class="steps"/);
});

test('UI helpers stay available without intrusive pointer effects', () => {
  assert.match(html, /id="preloader"/);
  assert.match(html, /preloader-video/);
  assert.match(html, /class="grain"/);
  assert.match(html, /class="to-top"/);
  assert.match(html, /is-active/);
  assert.match(html, /data-copy-email/);
  assert.match(html, /id="lang-prompt"/);
  assert.match(html, /data-lang-go="en"/);
  assert.match(html, /autocomplete="name"/);
  assert.match(html, /autocomplete="tel"/);
  assert.match(html, /@keyframes shake/);
  assert.match(html, /hero-video-wrap/);
  assert.doesNotMatch(html, /perspective\(900px\)|finePointer|hero-art:hover \.device|screen-title|stamp strong/);
});

test('Inline browser script has valid JavaScript syntax', () => {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  assert.doesNotThrow(() => new Function(script));
});

test('Copy uses concrete language and includes translations for the new sections', () => {
  const visible = html.match(/<body>[\s\S]*?<script>/)?.[0] || '';
  assert.doesNotMatch(html, /Я сам предложу|Я превращаю|Выбрать Start|Выбрать Signal|Обсудить Full|Сайт-витрина до 5 экранов|setup-note|\.extras\b/);
  assert.doesNotMatch(visible, /собираем сайты/i);
  assert.match(visible, /Сайты для специалистов и малого бизнеса/);
  assert.match(html, />Одностраничный сайт</);
  assert.match(html, />Сайт-витрина</);
  assert.match(html, />Многостраничный сайт</);
  assert.doesNotMatch(visible, /Ознакомиться с работами|Красивый сайт — это не декор|Сначала доверие\. Потом разговор\.|Сначала смысл\.|Без тёмного леса из согласований\.|case-preview|Мы превращаем первое впечатление/);
  assert.match(html, /See the websites live/);
  assert.match(html, /How we will work together/);
  assert.match(html, /See an example/);
  assert.doesNotMatch(html, /applyTeamVoice|const teamVoice =/);
});

test('Homepage story leads with work, then value, audience, process, packages and FAQ', () => {
  const sectionIds = ['id="examples"', 'id="why"', 'id="about"', 'id="process"', 'id="services"', 'id="faq"'];
  const positions = sectionIds.map((id) => html.indexOf(id));
  assert.ok(positions.every((position) => position >= 0), 'all narrative sections should be present');
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(html, /class="eyebrow">Кому подойдёт<\/div>/);
  assert.match(html, /Работаем с психологами, репетиторами и небольшими компаниями/);
});

test('Pricing matches the approved 40/90/170 ladder and describes package scope and estimates', () => {
  const body = html.match(/<body>[\s\S]*?<script>/)?.[0] || '';
  const services = html.match(/<section id="services">[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(html, /"priceRange": "от 40 000 ₽"/);
  assert.match(html, /"priceSpecification": \{"@type": "PriceSpecification", "priceCurrency": "RUB", "minPrice": 40000\}/);
  assert.match(html, /"priceSpecification": \{"@type": "PriceSpecification", "priceCurrency": "RUB", "minPrice": 90000\}/);
  assert.match(html, /"priceSpecification": \{"@type": "PriceSpecification", "priceCurrency": "RUB", "minPrice": 170000\}/);
  assert.doesNotMatch(html, /"price": "|"minPrice"[^}]*"maxPrice"/);
  assert.doesNotMatch(html, /<div class="price">10 000|<div class="price">25 000|<div class="price">от 50 000|"price": "10000"|"price": "25000"|"price": "50000"/);
  assert.doesNotMatch(html, />Лендинг</);
  assert.doesNotMatch(html, /Запуск за 2–3 дня|Запуск за 7 дней|2–3 недели на сборку|Неделя на правки|3 дня на правки|Поддержка после запуска/);
  assert.match(services, /<h2>Как формируется <em>цена<\/em><\/h2>/);
  assert.match(services, /Одна страница с 4–5 блоками/);
  assert.match(services, /До 5 информационных страниц, без каталога/);
  assert.match(services, /От 6 страниц или сайт с каталогом/);
  assert.match(services, /Ориентир: 1–2 недели/);
  assert.match(services, /Ориентир: 3–4 недели/);
  assert.match(services, /Ориентир: 5–7 недель/);
  assert.match(services, /простая форма заявки/);
  assert.match(services, /один раунд правок/i);
  assert.doesNotMatch(services, /Бла-бла-бла/);
  assert.equal((html.match(/<div class="price">/g) || []).length, 3);
  assert.equal((body.match(/<div class="price">от /g) || []).length, 3);
  assert.equal((html.match(/class="card-actions"/g) || []).length, 3);
});

test('Infrastructure files use the production domain', () => {
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/lumocraft\.ru\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/lumocraft\.ru\/</);
  assert.doesNotMatch(sitemap, /404\.html/);
});

test('Main page copy has no placeholders and FAQ structured data matches visible text', () => {
  assert.doesNotMatch(html, /Бла-бла-бла|Placeholder copy\./i);

  const faqSection = html.match(/<section id="faq">([\s\S]*?)<\/section>/)?.[1] || '';
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, contents]) => JSON.parse(contents));
  const faqSchema = jsonLd.find((schema) => schema['@type'] === 'FAQPage');
  const visibleQuestions = [...faqSection.matchAll(/<summary>([\s\S]*?)<\/summary>/g)]
    .map(([, text]) => text.replace(/<[^>]*>/g, '').trim());
  const visibleAnswers = [...faqSection.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map(([, text]) => text.replace(/<[^>]*>/g, '').trim());

  assert.ok(faqSchema, 'FAQPage JSON-LD should be present');
  assert.equal(faqSchema.mainEntity.length, 6);
  assert.deepEqual(faqSchema.mainEntity.map((item) => item.name), visibleQuestions);
  assert.deepEqual(faqSchema.mainEntity.map((item) => item.acceptedAnswer.text), visibleAnswers);
});

test('Lead endpoint keeps bot credentials outside the public site directory', () => {
  const endpoint = fs.readFileSync(path.join(root, 'submit.php'), 'utf8');
  assert.match(endpoint, /dirname\(__DIR__, 2\).*lumocraft-config\.php/);
  assert.match(endpoint, /api\.telegram\.org\/bot/);
  assert.doesNotMatch(endpoint, /\d{8,}:[A-Za-z0-9_-]{20,}/);
});

test('Shared image assets are valid and reasonably sized', () => {
  for (const file of ['og-image.png', 'og-image-en.png', 'Lumocraft logo.png', 'lumocraft-mark.png']) {
    const buf = fs.readFileSync(path.join(root, file));
    assert.equal(buf.slice(0, 8).toString('hex'), '89504e470d0a1a0a', `${file} must be a clean PNG`);
  }
  const poster = fs.readFileSync(path.join(root, 'Lumocraft logo.png'));
  assert.ok(poster.length < 400 * 1024, 'poster should be optimised under 400 KB');
  const mark = fs.readFileSync(path.join(root, 'lumocraft-mark.png'));
  assert.ok(mark.length < 100 * 1024, 'favicon mark should be under 100 KB');
});
