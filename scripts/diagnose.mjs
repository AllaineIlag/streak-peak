import puppeteer from 'puppeteer';

const PAGES = [
  '/dashboard',
  '/finance',
  '/mood',
  '/review',
  '/habits',
  '/tasks',
  '/calendar',
  '/pomodoro',
  '/clocks',
  '/notes',
  '/profile'
];

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  let hasErrors = false;

  for (const path of PAGES) {
    console.log(`Checking ${path}...`);
    
    // Capture errors
    const errors = [];
    const handlePageError = (err) => errors.push(err.message);
    const handleConsole = (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    };
    
    page.on('pageerror', handlePageError);
    page.on('console', handleConsole);
    
    try {
      await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle0', timeout: 10000 });
    } catch (e) {
      console.log(`  Timeout or navigation error: ${e.message}`);
    }
    
    page.off('pageerror', handlePageError);
    page.off('console', handleConsole);
    
    const hydrationErrors = errors.filter(e => e.includes('Hydration failed') || e.includes('Text content does not match server-rendered HTML'));
    
    if (hydrationErrors.length > 0) {
      console.log(`  [!] Hydration mismatch found!`);
      console.log(`      ${hydrationErrors[0].substring(0, 150)}...`);
      hasErrors = true;
    } else if (errors.length > 0) {
      console.log(`  [x] Other errors found:`);
      errors.forEach(e => console.log(`      - ${e.substring(0, 100)}`));
      hasErrors = true;
    } else {
      console.log(`  [ok] Clean`);
    }
  }

  await browser.close();
  
  if (hasErrors) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch(console.error);
