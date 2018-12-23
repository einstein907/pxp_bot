const json = require('../resources/config.json');

async function login(page) {
    // login on instagram
    console.log('sign up loaded');
    await page.waitForSelector('p[class=izU2O]');

    await page.waitForSelector('input[name=username]');

    await page.type(
        'input[name=username]',
        json.login.username
    );

    await page.waitForSelector('input[name=password');
    await page.type(
        'input[name=password]',
        json.login.password
    );

    const submitButton = await page.$('button[type=submit]');
    await submitButton.click();

    console.log('wait for page to load');
    await page.waitForNavigation();

    // accept dialogue box
    await page.mouse.click(400, 600);
}  

module.exports = {
    login: login
};