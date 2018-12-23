const puppeteer = require('puppeteer');
const json = require('./resources/config.json');
const $ = require('jquery').$;
const targetScan = require('./targetScan.js');

const delay = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
	// opens browser
	console.log('Fetching browser...');
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto('https://www.instagram.com/accounts/login/?hl=en');

	try {
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
		await page.mouse.click(400, 400);
		console.log('clicked');

		// await page.waitFor(3000);
		// await browser.close();

		let example = await targetScan.targetScan(page, json.targets);
		console.log(example);

	} catch (error) {
		console.log(error);
		// await browser.close();
	}
})();