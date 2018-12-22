const puppeteer = require('puppeteer');
const json = require('./resources/config.json');

(async () => {
	// opens browser
	console.log('Fetching browser...');
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto('https://www.instagram.com/accounts/login/?hl=en');

	try {
		// authenticate on microsoft office online
		// enter email address
		// await page.waitFor(5000);

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

		// // submit email & password together
		// await page.waitForSelector('#submitButton');
		// console.log('password submitted');
		// await page.click('#submitButton');

		// // take screenshot
		// const res = await page.waitForResponse(response => response.url() === "http://stl-pulse-api-1812883780.us-east-2.elb.amazonaws.com/responses" && response.status() === 200);
	
		// await page.screenshot({
		// 	path: 'scripts/images/screenshot.png',
		// 	clip: {
		// 		x: 86.5,
		// 		y: 115.5,
		// 		width: 718,
		// 		height: 700
		// 	}
		// });

		// console.log('logging out');
		// await browser.close();
	} catch (error) {
		console.log(error);
		// await browser.close();
	}
})();