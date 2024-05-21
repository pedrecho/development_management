const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const myEmail = '215800@edu.fa.ru';
const myPassword = '*dWUsG36Hgu5Kfq';

async function loginToNotion() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.get('https://www.notion.so/login');
        await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
        await driver.findElement(By.css('input[type="email"]')).sendKeys(myEmail);
        await driver.findElement(By.xpath("//div[text()='Continue']")).click();
        await driver.wait(until.elementLocated(By.css('input[type="password"]')), 10000);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(myPassword);
        await driver.findElement(By.xpath("//div[text()='Continue']")).click();
        await driver.wait(until.urlContains('https://www.notion.so'), 10000);

        console.log('Login successful');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await driver.quit();
    }
}

loginToNotion();
