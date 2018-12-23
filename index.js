// const $ = require('jquery').$;
// const targetScan = require('./scripts/targetScan.js');
// const fs = require('fs');
const login = require('./scripts/login.js');
const puppeteer = require('puppeteer');
const config = require('./resources/config.json');

(async () => {
	// opens browser
	console.log('Fetching browser...');
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({
		width: 800,
		height: 1000
	});
	await page.goto('https://www.instagram.com/accounts/login/?hl=en');

	try {
		// login
		await login.login(page);

		const hashtags = config.hashtags;

		for(var x = 0; x < hashtags.length; x++) {
			var targetAddress = 'https://www.instagram.com/explore/tags/' + hashtags[x] + '/';
			await page.goto(targetAddress);
			console.log('hashtag: ' + hashtags[x]);
	
			// click on first photo
			const photo = await page.$("._9AhH0");
			await photo.click();

			for (var i = 0; i < 33; i++) {
				console.log('i: ' + i)
				console.log(i !== 10);
				// skip three pics for an avg of 10% skipped
				if(i !== 10 && i !== 20 && i !== 30) {
					try {		
						// wait for display to appear
						await page.waitForSelector('span[class=RPhNB]');
						await page.waitForSelector('div[class=C4VMK]');
	
						//like photo
						// await page.waitForSelector('button[class=coreSpriteHeartOpen');
						temp = await page.$(".coreSpriteHeartOpen");
						const heart = await page.$(".glyphsSpriteHeart__filled__24__red_5");

						if(heart !== null) {
							console.log('already liked... moving on');
							i--;
						} else {
							console.log(i + ': found heart');
							temp.click();	
						}

						await page.waitFor(2000);
		
						// click next page
						temp = await page.$(".coreSpriteRightPaginationArrow");
						temp.click();
						await page.waitForNavigation({ waitUntil: 'networkidle2' });
					} catch (err) {
						console.log('ERROR: ' + err);
						// decrement for loop 
						i--;
						// if an error happens getting this specific post's info, skip it and move on
						console.log('cant get a page so moving to next one');

						try {
							temp = await page.$(".coreSpriteRightPaginationArrow");
							temp.click();
						} catch (err) {
							await page.reload({ waitUntil: 'networkidle0' });
							// await page.keyboard.press('ArrowRight');
							const photos = await page.$$("._9AhH0");
							await photos[i].click();				
						}

						await page.waitForNavigation({ waitUntil: 'networkidle2' });
					}	
				} else {
					console.log('skipping 10%!');
				}
			}
	
		
		}


		

		// // like first ten photos
		// await page.waitForSelector('div[class=_9AhH0');

		// for(var x = 0; x < 10; x++) {

		// 	await page.evaluate(() => {
		// 		window.scrollBy(0, window.innerHeight);
		// 	  });

		// 	await page.mouse.click(400, 400, { button: 'left', clickCount: 2 });
		// 	console.log('clicked');
		// 	await page.waitFor(3000);
		// }

		// temp = await page.$$("._9AhH0");

		// console.log(temp.length);

		// temp.click();


		await browser.close();

	} catch (error) {
		console.log(error);
		// await browser.close();
	}
})();