module.exports = class Browser {
  constructor() {
    this.path = require(`path`);
    this.process = require(`process`);
    this.By = require('selenium-webdriver').By;
    this.Key = require('selenium-webdriver').Key;
    this.until = require('selenium-webdriver').until;
    this.Builder = require('selenium-webdriver').Builder;
    this.Capabilities = require('selenium-webdriver').Capabilities;
    this.driver = { init: false };
    this.capabilities = {};
  }
  async init() {
    const chrome = require('selenium-webdriver/chrome');
    let driverPath =
      this.process.platform == `linux`
        ? this.path.resolve(
            this.process.env.PWD,
            `modules/chromedriver/chromedriver`
          )
        : this.process.platform == `win32`
        ? this.path.resolve(`modules/chromedriver/chromedriver.exe`)
        : false;

    if (!driverPath) {
      throw new Error(`unsupported platform: ${this.process.platform}`);
    }
    let service = new chrome.ServiceBuilder(driverPath).build();
    chrome.setDefaultService(service);

    this.driver = new this.Builder().forBrowser('chrome').build();

    let bc = await this.driver.getCapabilities();
    this.capabilities = {
      browser: await bc.get('browserName'),
      browserVersion: await bc.get('browserVersion'),
      chromedriverVersion: await bc.get('chrome').chromedriverVersion,
      platform: this.process.platform
    };
  }
};
