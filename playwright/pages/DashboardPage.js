const BasePage = require('./BasePage');

/**
 * DashboardPage - Page Object for Dashboard page
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.sidebar = '[class*="sidebar"]';
    this.header = 'header';
    this.pageTitle = 'h1:has-text("Dashboard")';
    
    // Charts
    this.lightChart = '[class*="chart"]:has-text("Ánh sáng")';
    this.temperatureChart = '[class*="chart"]:has-text("Nhiệt độ")';
    this.humidityChart = '[class*="chart"]:has-text("Độ ẩm")';
    
    // Filters
    this.startDateInput = 'input[type="date"]:first-of-type';
    this.endDateInput = 'input[type="date"]:last-of-type';
    this.btnFilter = 'button:has-text("Lọc")';
    this.btnClearFilter = 'button:has-text("Xóa")';
    
    // Quick filters
    this.btn1Day = 'button:has-text("1 ngày")';
    this.btn7Days = 'button:has-text("7 ngày")';
    this.btn30Days = 'button:has-text("30 ngày")';
    
    // Export button
    this.btnExport = 'button:has-text("Xuất CSV"), button:has-text("Export")';
    
    // Navigation
    this.linkHome = 'a[href*="/home"]';
    this.linkMap = 'a[href*="/map"]';
    this.linkAlarms = 'a[href*="/alarms"]';
    this.linkSettings = 'a[href*="/settings"]';
  }

  /**
   * Navigate to dashboard page
   */
  async navigate() {
    await this.goto('/mainlayout/dashboard');
    await this.waitForElement(this.pageTitle);
  }

  /**
   * Check if dashboard is displayed
   * @returns {Promise<boolean>}
   */
  async isDashboardDisplayed() {
    return await this.isVisible(this.pageTitle) &&
           await this.isVisible(this.sidebar);
  }

  /**
   * Set date range filter
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  async setDateRange(startDate, endDate) {
    await this.fill(this.startDateInput, startDate);
    await this.fill(this.endDateInput, endDate);
  }

  /**
   * Click quick filter button
   * @param {string} filter - Filter type: '1day', '7days', '30days'
   */
  async clickQuickFilter(filter) {
    const filterMap = {
      '1day': this.btn1Day,
      '7days': this.btn7Days,
      '30days': this.btn30Days
    };
    
    const selector = filterMap[filter];
    if (selector) {
      await this.click(selector);
      await this.wait(1000); // Wait for data to load
    }
  }

  /**
   * Clear filters
   */
  async clearFilters() {
    if (await this.isVisible(this.btnClearFilter)) {
      await this.click(this.btnClearFilter);
    }
  }

  /**
   * Export data to CSV
   */
  async exportToCsv() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.click(this.btnExport);
    const download = await downloadPromise;
    return download;
  }

  /**
   * Check if charts are displayed
   * @returns {Promise<boolean>}
   */
  async areChartsDisplayed() {
    return await this.isVisible(this.lightChart) ||
           await this.isVisible(this.temperatureChart) ||
           await this.isVisible(this.humidityChart);
  }

  /**
   * Navigate to another page using sidebar
   * @param {string} pageName - Page name: 'home', 'map', 'alarms', 'settings'
   */
  async navigateToPage(pageName) {
    const pageMap = {
      'home': this.linkHome,
      'map': this.linkMap,
      'alarms': this.linkAlarms,
      'settings': this.linkSettings
    };
    
    const selector = pageMap[pageName];
    if (selector) {
      await this.click(selector);
      await this.waitForNavigation();
    }
  }
}

module.exports = DashboardPage;

