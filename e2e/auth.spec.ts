import { test, expect } from '@playwright/test';

const LOCALES = ['en', 'es'];

LOCALES.forEach((locale) => {
  test.describe(`Auth Flow - ${locale.toUpperCase()}`, () => {

    test.describe('Login (/login)', () => {
      test('Login con credenciales inválidas muestra error', async ({ page }, testInfo) => {
        // Con sesión activa el middleware redirige fuera del login → skip
        test.skip(testInfo.project.name === 'as-admin', 'Usuario ya autenticado, no puede ver el formulario de login');

        await page.goto(`/${locale}/login`);
        await page.fill('input[name="email"]', 'usuariofalso@example.com');
        await page.fill('input[name="password"]', 'claveincorrecta9999');
        await page.click('button[type="submit"]');

        await expect(page.locator('.bg-red-50').first()).toBeVisible({ timeout: 15000 });
      });

      test('Usuario autenticado es redirigido fuera del /login', async ({ page }, testInfo) => {
        // Solo tiene sentido verificar la redirección en el proyecto con sesión
        test.skip(testInfo.project.name === 'no-auth', 'Requiere sesión activa para activar la redirección del middleware');

        await page.goto(`/${locale}/login`);
        // El middleware debe redirigir al home
        await page.waitForURL((url) => !url.href.includes('/login'), { timeout: 10000 });
        expect(page.url()).not.toContain('/login');
      });
    });

    test.describe('Register (/register)', () => {
      test('Registro con correo ya existente muestra error', async ({ page }, testInfo) => {
        // Con sesión activa el middleware redirige fuera del register → skip
        test.skip(testInfo.project.name === 'as-admin', 'Usuario ya autenticado, no puede ver el formulario de registro');

        await page.goto(`/${locale}/register`);

        await page.fill('input[name="email"]', 'mdamax79@hotmail.com');
        await page.fill('input[name="password"]', 'CualquierClave123!');
        await page.fill('input[name="confirmPassword"]', 'CualquierClave123!');
        await page.click('button[type="submit"]');

        // Esperar el mensaje de error (párrafo rojo dentro del contenedor)
        await expect(page.locator('p.text-red-800, p.text-red-200').first()).toBeVisible({ timeout: 15000 });
      });

      test('Contraseñas que no coinciden muestran error antes de enviar', async ({ page }, testInfo) => {
        // Con sesión activa el middleware redirige fuera del register → skip
        test.skip(testInfo.project.name === 'as-admin', 'Usuario ya autenticado, no puede ver el formulario de registro');

        await page.goto(`/${locale}/register`);

        await page.fill('input[name="email"]', 'test-unique@example.com');
        await page.fill('input[name="password"]', 'Clave1234!');
        await page.fill('input[name="confirmPassword"]', 'OtraClave456!');
        await page.click('button[type="submit"]');

        await expect(page.locator('p.text-red-800, p.text-red-200').first()).toBeVisible({ timeout: 5000 });
      });

      test('Usuario autenticado es redirigido fuera del /register', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name === 'no-auth', 'Requiere sesión activa para activar la redirección del middleware');

        await page.goto(`/${locale}/register`);
        await page.waitForURL((url) => !url.href.includes('/register'), { timeout: 10000 });
        expect(page.url()).not.toContain('/register');
      });
    });

  });
});
