import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  // Asegurarse de que la carpeta de auth existe
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('\n🔐 [Global Setup] Iniciando sesión como Administrador...');

  await page.goto(`${baseURL}/en/login`);

  // Completar el formulario de login
  await page.fill('input[name="email"]', 'mdamax79@hotmail.com');
  await page.fill('input[name="password"]', '3710Mateo');
  await page.click('button[type="submit"]');

  // Esperar a que la sesión esté activa (salir de la página de login)
  await page.waitForURL((url) => !url.href.includes('/login') && !url.href.includes('/register'), {
    timeout: 20000,
  });

  console.log(`✅ [Global Setup] Login exitoso. URL actual: ${page.url()}`);

  // Guardar el estado de la sesión (cookies + localStorage)
  await page.context().storageState({ path: path.join(authDir, 'admin.json') });
  console.log('💾 [Global Setup] Sesión guardada en e2e/.auth/admin.json');

  await browser.close();
}

export default globalSetup;
