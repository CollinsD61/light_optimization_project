const BasePage = require('./BasePage');

/**
 * DashboardPage - Page Object for Dashboard page
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators - Based on actual findings
    this.sidebar = '.bg-gray-800.text-white';
    this.header = 'header';
    this.pageTitle = 'h1:has-text("Dashboard")';
    
    // Main headings found
    this.titleMain = 'h1:has-text("Dashboard IoT Monitoring")';
    this.titleFilter = 'h2:has-text("Bộ lọc dữ liệu thông minh")';
    this.titleOverview = 'h2:has-text("Tổng quan tất cả cảm biến")';
    
    // Charts - Found by h2 headings
    this.lightChart = 'h2:has-text("Ánh sáng")';
    this.temperatureChart = 'h2:has-text("Nhiệt độ")';
    this.humidityChart = 'h2:has-text("Độ ẩm")';
    
    // Filters - 2 date inputs found
    this.startDateInput = 'input[type="date"]';
    this.endDateInput = 'input[type="date"]';
    this.btnFilter = 'button:has-text("Tìm")'; // "Tìm kiếmTìm" button
    this.btnReset = 'button:has-text("Đặt lại")';
    
    // Quick filters - Found with emoji icons
    this.btn1Day = 'button:has-text("📅1 ngày")';
    this.btn7Days = 'button:has-text("📊7 ngày")';
    this.btn15Days = 'button:has-text("📈15 ngày")';
    this.btn30Days = 'button:has-text("📆30 ngày")';
    this.btn2Months = 'button:has-text("🗓️2 tháng")';
    
    // Export button - Found as "Tải CSV"
    this.btnExport = 'button:has-text("Tải CSV")';
    
    // Navigation - Exact hrefs found
    this.linkHome = 'a[href="/mainlayout/home"]';
    this.linkDashboard = 'a[href="/mainlayout/Dashboard"]';
    this.linkMap = 'a[href="/mainlayout/map"]';
    this.linkAlarms = 'a[href="/mainlayout/alarms"]';
    this.linkSettings = 'a[href="/mainlayout/settings"]';
    
    // Header buttons found
    this.btnSearch = 'button.search-button';
    this.btnTheme = 'button:has-text("Chuyển giao diện")';
    this.btnNotification = 'button:has-text("Thông báo")';
    this.btnProfile = 'button:has-text("haichu321@gmail.com")';
  }

  /**
   * Navigate to dashboard page
   */
  async navigate() {
    await this.goto('/mainlayout/Dashboard'); // Capital D!
    await this.waitForElement('#root > *'); // Wait for React to mount
    await this.wait(2000); // Wait for data to load
  }

  /**
   * Check if dashboard is displayed
   * @returns {Promise<boolean>}
   */
  async isDashboardDisplayed() {
    return await this.isVisible(this.titleMain) &&
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

