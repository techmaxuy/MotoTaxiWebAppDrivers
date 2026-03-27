import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, 'e2e/.auth/admin.json');

export default defineConfig({
  testDir: './e2e',
  // Aumentamos timeout global para dar tiempo al login
  timeout: 45000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false, // Sequential para que globalSetup termine antes de los tests
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Un worker para evitar condiciones de carrera con la sesión
  reporter: 'html',

  // Script que hace login UNA VEZ y guarda la sesión
  globalSetup: './e2e/global-setup.ts',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Proyecto SIN autenticación (para tests de redirección / acceso denegado)
    {
      name: 'no-auth',
      testMatch: ['**/admin.spec.ts', '**/auth.spec.ts', '**/profile.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        // Sin storageState → usuario anónimo
      },
    },

    // Proyecto CON autenticación de Admin (carga la sesión guardada)
    {
      name: 'as-admin',
      testMatch: ['**/admin.spec.ts', '**/auth.spec.ts', '**/profile.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
    },
  ],
});
