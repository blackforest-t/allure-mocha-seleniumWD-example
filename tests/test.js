const assert = require('chai').assert;
require('mocha-allure-reporter');
const Browser = require(`../modules/browser`);
const b = new Browser();
const timeoutTime = 20000;

describe('A simple repositories check', async function () {
  this.timeout(timeoutTime * 1.5);
  beforeEach(async () => {
    await b.init();
    await b.driver
      .get('https://github.com/blackforest-t')
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    let title = await b.driver.getTitle();
    await assert.equal(title, `blackforest-t · GitHub`, `Cannot get page`);
  });
  afterEach(async () => {
    await b.driver.quit();
  });
  after(async () => {
    for (key in b.capabilities) {
      await allure.addEnvironment(`${key}`, `${b.capabilities[key]}`);
    }
  });

  it('clicked on the repositories tab', async () => {
    let button = await b.driver
      .wait(
        b.until.elementLocated(
          b.By.css(`a[href="/blackforest-t?tab=repositories"]`)
        ),
        timeoutTime
      )
      .catch(() => {
        return false;
      });
    await assert.notEqual(button, false, `Cannot find repositories button`);
    await button.click();
  });

  it('there are 2 or more repositories in tab', async () => {
    let button = await b.driver
      .wait(
        b.until.elementLocated(
          b.By.css(`a[href="/blackforest-t?tab=repositories"]`)
        ),
        timeoutTime
      )
      .catch(() => {
        return false;
      });
    await assert.notEqual(button, false, `Cannot find repositories button`);
    await button.click();
    let repCount = await b.driver.wait(
      b.until.elementsLocated(b.By.css(`div#user-repositories-list li`)),
      timeoutTime
    );
    await assert.isAtLeast(
      repCount.length,
      1,
      `Count of repositories are less than expected, curent: ${repCount.length}`
    );
  });
  it(`there is "allure-mocha-seleniumWD-example" repo in list`, async () => {
    let button = await b.driver
      .wait(
        b.until.elementLocated(
          b.By.css(`a[href="/blackforest-t?tab=repositories"]`)
        ),
        timeoutTime
      )
      .catch(() => {
        return false;
      });
    await assert.notEqual(button, false, `Cannot find repositories button`);
    await button.click();
    await b.driver.sleep(1000);
    let necessaryRepo = await b.driver
      .wait(
        b.until.elementLocated(
          b.By.css(`a[href="/blackforest-t/allure-mocha-seleniumWD-example"]`)
        ),
        timeoutTime
      )
      .catch(() => {
        return false;
      });
    await assert.notEqual(
      necessaryRepo,
      false,
      `Cannot find repository with name "allure-mocha-seleniumWD-example"`
    );
    await necessaryRepo.click();
  });
  it(`LICENSE file is exist in repository`, async () => {
    await b.driver.get(
      'https://github.com/blackforest-t/allure-mocha-seleniumWD-example'
    );
    let licenseFile = await b.driver
      .wait(b.until.elementLocated(b.By.css(`a[title="LICENSE"]`)), timeoutTime)
      .catch(() => {
        return false;
      });
    await assert.notEqual(licenseFile, false, `Cannot find license file`);
  });
  it(`[Star] button clicked`, async () => {
    await b.driver.get(
      'https://github.com/blackforest-t/allure-mocha-seleniumWD-example'
    );
    let starButton = await b.driver
      .wait(
        b.until.elementLocated(
          b.By.css(
            `#repository-details-container .tooltipped.tooltipped-s.btn-sm.btn.BtnGroup-item`
          )
        ),
        timeoutTime
      )
      .then(async (elem) => {
        await elem.click();
        return true;
      })
      .catch(() => {
        return false;
      });
    await assert.equal(starButton, true, `Cannot click [star] button`);
  });
});
