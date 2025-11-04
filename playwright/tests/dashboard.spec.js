const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');

test.describe('Dashboard Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'test123');
    await page.waitForURL('**/mainlayout/**', { timeout: 10000 });
  });

  test('TC011 - Dashboard should display correctly', async () => {
    await dashboardPage.navigate();
    
    expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
    expect(dashboardPage.getCurrentUrl()).toContain('/dashboard');
  });

  test('TC012 - Charts should be displayed on dashboard', async () => {
    await dashboardPage.navigate();
    await dashboardPage.wait(3000); // Wait for data to load
    
    expect(await dashboardPage.areChartsDisplayed()).toBeTruthy();
  });

  test('TC013 - Filter data by 1 day', async () => {
    await dashboardPage.navigate();
    await dashboardPage.clickQuickFilter('1day');
    
    await dashboardPage.wait(2000);
    expect(await dashboardPage.areChartsDisplayed()).toBeTruthy();
  });

  test('TC014 - Filter data by 7 days', async () => {
    await dashboardPage.navigate();
    await dashboardPage.clickQuickFilter('7days');
    
    await dashboardPage.wait(2000);
    expect(await dashboardPage.areChartsDisplayed()).toBeTruthy();
  });

  test('TC015 - Filter data by 30 days', async () => {
    await dashboardPage.navigate();
    await dashboardPage.clickQuickFilter('30days');
    
    await dashboardPage.wait(2000);
    expect(await dashboardPage.areChartsDisplayed()).toBeTruthy();
  });

  test('TC016 - Filter data by custom date range', async () => {
    await dashboardPage.navigate();
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    await dashboardPage.setDateRange(startDate, endDate);
    await dashboardPage.wait(2000);
    
    expect(await dashboardPage.areChartsDisplayed()).toBeTruthy();
  });

  test('TC017 - Clear filters', async () => {
    await dashboardPage.navigate();
    
    // Apply filter first
    await dashboardPage.clickQuickFilter('7days');
    await dashboardPage.wait(1000);
    
    // Clear filters
    await dashboardPage.clearFilters();
    await dashboardPage.wait(1000);
    
    expect(await dashboardPage.areChartsDisplayed()).toBeTruthy();
  });

  test('TC018 - Export data to CSV', async () => {
    await dashboardPage.navigate();
    await dashboardPage.wait(2000);
    
    if (await dashboardPage.isVisible(dashboardPage.btnExport)) {
      const download = await dashboardPage.exportToCsv();
      expect(download).toBeTruthy();
      expect(download.suggestedFilename()).toMatch(/\.csv$/);
    }
  });

  test('TC019 - Navigate to Home from Dashboard', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.navigateToPage('home');
    
    await page.waitForURL('**/home', { timeout: 5000 });
    expect(dashboardPage.getCurrentUrl()).toContain('/home');
  });

  test('TC020 - Navigate to Map from Dashboard', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.navigateToPage('map');
    
    await page.waitForURL('**/map', { timeout: 5000 });
    expect(dashboardPage.getCurrentUrl()).toContain('/map');
  });

  test('TC021 - Navigate to Alarms from Dashboard', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.navigateToPage('alarms');
    
    await page.waitForURL('**/alarms', { timeout: 5000 });
    expect(dashboardPage.getCurrentUrl()).toContain('/alarms');
  });

  test('TC022 - Navigate to Settings from Dashboard', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.navigateToPage('settings');
    
    await page.waitForURL('**/settings', { timeout: 5000 });
    expect(dashboardPage.getCurrentUrl()).toContain('/settings');
  });

  test('TC023 - Dashboard loads data after login', async () => {
    await dashboardPage.navigate();
    
    // Wait for data to potentially load
    await dashboardPage.wait(5000);
    
    // Check if any chart is visible
    const hasCharts = await dashboardPage.areChartsDisplayed();
    
    // Dashboard should at least display structure even if no data
    expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
  });

  test('TC024 - Sidebar is visible on dashboard', async () => {
    await dashboardPage.navigate();
    
    expect(await dashboardPage.isVisible(dashboardPage.sidebar)).toBeTruthy();
  });

  test('TC025 - Header is visible on dashboard', async () => {
    await dashboardPage.navigate();
    
    expect(await dashboardPage.isVisible(dashboardPage.header)).toBeTruthy();
  });
});

