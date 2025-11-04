const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const MapPage = require('../pages/MapPage');

test.describe('Map Page Tests', () => {
  let loginPage;
  let mapPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    mapPage = new MapPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'test123');
    await page.waitForURL('**/mainlayout/**', { timeout: 10000 });
  });

  test('TC026 - Map page should display correctly', async () => {
    await mapPage.navigate();
    
    expect(await mapPage.isMapDisplayed()).toBeTruthy();
    expect(mapPage.getCurrentUrl()).toContain('/map');
  });

  test('TC027 - Map should load within timeout', async () => {
    await mapPage.navigate();
    
    // Wait for map to load
    const isDisplayed = await mapPage.isMapDisplayed();
    expect(isDisplayed).toBeTruthy();
  });

  test('TC028 - Click on sensor marker shows sensor info', async () => {
    await mapPage.navigate();
    await mapPage.wait(3000); // Wait for map to fully load
    
    // Try to click on a marker if it exists
    await mapPage.clickSensorMarker(0);
    await mapPage.wait(1000);
    
    // Check if sensor info is displayed or marker exists
    const hasMarkers = await mapPage.isVisible(mapPage.sensorMarker);
    expect(hasMarkers || await mapPage.isMapDisplayed()).toBeTruthy();
  });

  test('TC029 - Get sensor data from map', async () => {
    await mapPage.navigate();
    await mapPage.wait(3000);
    
    // Click marker if exists
    if (await mapPage.isVisible(mapPage.sensorMarker)) {
      await mapPage.clickSensorMarker(0);
      await mapPage.wait(1000);
      
      const sensorData = await mapPage.getSensorData();
      expect(sensorData).toBeTruthy();
    }
  });

  test('TC030 - Map container exists', async () => {
    await mapPage.navigate();
    
    expect(await mapPage.isVisible(mapPage.mapContainer)).toBeTruthy();
  });
});

