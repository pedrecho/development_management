const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

const myEmail = '';
const myPassword = '';

let driver;

describe('Notion Test Suite', function () {
    this.timeout(30000);

    before(async function () {
        let options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        // Login
        await driver.get('https://www.notion.so/login');
        await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
        await driver.findElement(By.css('input[type="email"]')).sendKeys(myEmail);
        await driver.findElement(By.xpath("//div[text()='Continue']")).click();
        await driver.wait(until.elementLocated(By.css('input[type="password"]')), 10000);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(myPassword);
        await driver.findElement(By.xpath("//div[text()='Continue']")).click();
        await driver.wait(until.urlContains('https://www.notion.so'), 10000);
    });

    after(async function () {
        await driver.quit();
    });

    beforeEach(async function () {
        // Navigate to board view before each test
        await driver.get('https://www.notion.so/your-board-url');
        await driver.wait(until.elementLocated(By.css('your-board-view-selector')), 10000);
    });

    it('Создание задачи (позитивный)', async function () {
        await driver.findElement(By.css('button[aria-label="New"]')).click();
        let titleField = await driver.findElement(By.css('input[placeholder="Untitled"]'));
        await titleField.sendKeys('Test Task');
        await titleField.sendKeys('\uE007'); // Press Enter key
        let task = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        expect(await task.isDisplayed()).to.be.true;
    });

    it('Создание задачи без имени (позитивный)', async function () {
        await driver.findElement(By.css('button[aria-label="New"]')).click();
        await driver.findElement(By.css('body')).click(); // Click outside to create the task with default name
        let task = await driver.findElement(By.xpath("//div[text()='Untitled']"));
        expect(await task.isDisplayed()).to.be.true;
    });

    it('Изменение статуса через карточку (позитивный)', async function () {
        let task = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        await task.click();
        await driver.wait(until.elementLocated(By.css('div[aria-label="Status"]')), 10000);
        let statusField = await driver.findElement(By.css('div[aria-label="Status"]'));
        await statusField.click();
        let newStatus = await driver.findElement(By.xpath("//div[text()='In Progress']"));
        await newStatus.click();
        await driver.findElement(By.css('body')).sendKeys('\uE00C'); // Press Escape key to close modal
        await driver.wait(until.stalenessOf(task), 10000);
        let movedTask = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        expect(await movedTask.isDisplayed()).to.be.true;
    });

    it('Изменение статуса через борд (позитивный)', async function () {
        let task = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        let targetColumn = await driver.findElement(By.css('div[aria-label="Completed"]'));
        await driver.actions().dragAndDrop(task, targetColumn).perform();
        let movedTask = await driver.findElement(By.xpath("//div[text()='Test Task' and ancestor::div[contains(@aria-label, 'Completed')]]"));
        expect(await movedTask.isDisplayed()).to.be.true;
    });

    it('Назначение выполняющего (позитивный)', async function () {
        let task = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        await task.click();
        await driver.wait(until.elementLocated(By.css('div[aria-label="Assignee"]')), 10000);
        let assigneeField = await driver.findElement(By.css('div[aria-label="Assignee"]'));
        await assigneeField.click();
        let assignee = await driver.findElement(By.xpath("//div[text()='User Name']"));
        await assignee.click();
        await driver.findElement(By.css('body')).sendKeys('\uE00C'); // Press Escape key to close modal
        let assignedTask = await driver.findElement(By.xpath("//div[text()='Test Task']/following-sibling::div[text()='User Name']"));
        expect(await assignedTask.isDisplayed()).to.be.true;
    });

    it('Назначение нескольких выполняющих (позитивный)', async function () {
        let task = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        await task.click();
        await driver.wait(until.elementLocated(By.css('div[aria-label="Assignee"]')), 10000);
        let assigneeField = await driver.findElement(By.css('div[aria-label="Assignee"]'));
        await assigneeField.click();
        let assignee1 = await driver.findElement(By.xpath("//div[text()='User Name']"));
        await assignee1.click();
        let assignee2 = await driver.findElement(By.xpath("//div[text()='Another User']"));
        await assignee2.click();
        await driver.findElement(By.css('body')).sendKeys('\uE00C'); // Press Escape key to close modal
        let assignedTask = await driver.findElement(By.xpath("//div[text()='Test Task']/following-sibling::div[contains(text(), 'User Name, Another User')]"));
        expect(await assignedTask.isDisplayed()).to.be.true;
    });

    it('Удаление выполняющих (позитивный)', async function () {
        let task = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        await task.click();
        await driver.wait(until.elementLocated(By.css('div[aria-label="Assignee"]')), 10000);
        let assigneeField = await driver.findElement(By.css('div[aria-label="Assignee"]'));
        await assigneeField.click();
        let removeAssignee = await driver.findElement(By.xpath("//div[text()='User Name']/following-sibling::div[contains(@aria-label, 'Remove')]"));
        await removeAssignee.click();
        await driver.findElement(By.css('body')).sendKeys('\uE00C'); // Press Escape key to close modal
        let assignedTask = await driver.findElement(By.xpath("//div[text()='Test Task']/following-sibling::div[text()='User Name']"));
        expect(await assignedTask.isDisplayed()).to.be.false;
    });

    it('Назначение несуществующего выполняющего (негативный)', async function () {
        let task = await driver.findElement(By.xpath("//div[text()='Test Task']"));
        await task.click();
        await driver.wait(until.elementLocated(By.css('div[aria-label="Assignee"]')), 10000);
        let assigneeField = await driver.findElement(By.css('div[aria-label="Assignee"]'));
        await assigneeField.click();
        let input = await driver.findElement(By.css('input[type="text"]'));
        await input.sendKeys('Nonexistent User');
        await input.sendKeys('\uE007'); // Press Enter key
        let noAssignee = await driver.findElement(By.xpath("//div[not(contains(text(), 'Nonexistent User'))]"));
        expect(await noAssignee.isDisplayed()).to.be.true;
    });
});
