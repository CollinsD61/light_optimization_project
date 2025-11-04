const BasePage = require('./BasePage');

/**
 * MapPage - Page Object for Map page
 */
class MapPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.pageTitle = 'h1:has-text("Bản đồ")';
    this.mapContainer = '[class*="map"], #map, .leaflet-container';
    this.sensorMarker = '[class*="marker"]';
    this.sensorInfo = '[class*="sensor-info"], [class*="popup"]';
    
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
    await this.waitForElement(this.mapContainer, 15000);
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

