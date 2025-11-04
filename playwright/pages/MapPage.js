const BasePage = require('./BasePage');

/**
 * MapPage - Page Object for Map page
 */
class MapPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators - Based on actual findings
    this.pageTitle = 'h1:has-text("Bản đồ")';
    this.mapContainer = '.leaflet-container'; // Leaflet map found
    this.sensorMarker = '[class*="marker"]';
    this.sensorInfo = '[class*="sensor-info"], [class*="popup"], .leaflet-popup';
    
    // Map controls found
    this.btnFilter = 'button:has-text("Lọc")';
    this.btnStyleStandard = 'button:has-text("Standard")';
    this.btnStyleDark = 'button:has-text("Dark")';
    this.btnStyleSatellite = 'button:has-text("Satellite")';
    this.btnStyleNight = 'button:has-text("Night")';
    this.btnRefresh = 'button:has-text("Làm mới")';
    this.btnSyncPin = 'button:has-text("Đồng bộ pin")';
    this.btnAddSensor = 'button:has-text("Thêm cảm biến")';
    
    // Sensor details
    this.sensorName = '[class*="sensor-name"]';
    this.sensorLocation = '[class*="location"]';
    this.sensorTemperature = '[class*="temperature"]';
    this.sensorHumidity = '[class*="humidity"]';
    this.sensorLight = '[class*="light"]';
    this.sensorBattery = '[class*="battery"]';
  }

  /**
   * Navigate to map page
   */
  async navigate() {
    await this.goto('/mainlayout/map');
    await this.waitForElement('#root > *'); // Wait for React
    await this.waitForElement(this.mapContainer, 15000);
    await this.wait(2000); // Wait for map to fully load
  }

  /**
   * Check if map is displayed
   * @returns {Promise<boolean>}
   */
  async isMapDisplayed() {
    return await this.isVisible(this.mapContainer);
  }

  /**
   * Click on sensor marker
   * @param {number} index - Marker index (0-based)
   */
  async clickSensorMarker(index = 0) {
    const markers = await this.page.$$(this.sensorMarker);
    if (markers.length > index) {
      await markers[index].click();
      await this.wait(1000);
    }
  }

  /**
   * Check if sensor info is displayed
   * @returns {Promise<boolean>}
   */
  async isSensorInfoDisplayed() {
    return await this.isVisible(this.sensorInfo);
  }

  /**
   * Get sensor data from info popup
   * @returns {Promise<Object>}
   */
  async getSensorData() {
    const data = {};
    
    if (await this.isVisible(this.sensorTemperature)) {
      data.temperature = await this.getText(this.sensorTemperature);
    }
    
    if (await this.isVisible(this.sensorHumidity)) {
      data.humidity = await this.getText(this.sensorHumidity);
    }
    
    if (await this.isVisible(this.sensorLight)) {
      data.light = await this.getText(this.sensorLight);
    }
    
    if (await this.isVisible(this.sensorBattery)) {
      data.battery = await this.getText(this.sensorBattery);
    }
    
    return data;
  }
}

module.exports = MapPage;

