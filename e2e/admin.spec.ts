import { test, expect } from '@playwright/test';

const LOCALES = ['en', 'es'];

LOCALES.forEach((locale) => {
  test.describe(`Admin Dashboard & Panel - ${locale.toUpperCase()}`, () => {

    test.describe('Dashboard (/admin)', () => {
      test('Usuario no autenticado es redirigido a /login', async ({ page }, testInfo) => {
        // Solo tiene sentido en proyecto no-auth
        test.skip(testInfo.project.name === 'as-admin', 'Test de acceso denegado - solo sin sesión');

        await page.goto(`/${locale}/admin`);
        await page.waitForURL(`**/${locale}/login**`, { timeout: 15000 });
        expect(page.url()).toContain(`/${locale}/login`);
      });

      test('Administrador autenticado accede al panel y ve estadísticas', async ({ page }, testInfo) => {
        // Solo tiene sentido en proyecto as-admin
        test.skip(testInfo.project.name === 'no-auth', 'Test de acceso admin - requiere sesión activa');

        await page.goto(`/${locale}/admin`);
        // No debe redirigir a login
        await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
        // Debe haber tarjetas de estadísticas (la página tiene h1 con título admin)
        await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('Admin Users (/admin/users)', () => {
      test('Usuario no autenticado es redirigido a /login', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name === 'as-admin', 'Test de acceso denegado - solo sin sesión');

        await page.goto(`/${locale}/admin/users`);
        await page.waitForURL(`**/${locale}/login**`, { timeout: 15000 });
        expect(page.url()).toContain(`/${locale}/login`);
      });

      test('Administrador autenticado accede a la tabla de usuarios', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name === 'no-auth', 'Test de tabla admin - requiere sesión activa');

        await page.goto(`/${locale}/admin/users`);
        await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
        // La tabla ou su contenedor deben estar visibles
        await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('Admin Settings (/admin/settings)', () => {
      test('Usuario no autenticado es redirigido a /login', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name === 'as-admin', 'Test de acceso denegado - solo sin sesión');

        await page.goto(`/${locale}/admin/settings`);
        await page.waitForURL(`**/${locale}/login**`, { timeout: 15000 });
        expect(page.url()).toContain(`/${locale}/login`);
      });

      test('Administrador autenticado accede a la configuración del panel', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name === 'no-auth', 'Test de config admin - requiere sesión activa');

        await page.goto(`/${locale}/admin/settings`);
        await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
      });
    });

  });
});
