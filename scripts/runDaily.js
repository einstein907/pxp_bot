// const $ = require('jquery').$;
// const targetScan = require('./scripts/targetScan.js');
const fs = require('fs');
const login = require('./login.js');
const puppeteer = require('puppeteer');

function appendTextFile(afilename, output)
{
	fs.appendFile(afilename, output + '\n', function(err) {
		if(err) {
			return console.log(err);
		}
	}); 
}

async function runDaily(hashtags){
	// establish filename
	const f = "output.txt";

	fs.writeFile(f, '', function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	}); 

	// opens browser
	console.log('Fetching browser...');
	appendTextFile(f, 'Fetching browser...');

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

		for(var x = 0; x < hashtags.length; x++) {
			var targetAddress = 'https://www.instagram.com/explore/tags/' + hashtags[x] + '/';
			await page.goto(targetAddress);
			console.log('hashtag: ' + hashtags[x]);
			appendTextFile(f, 'hashtag: ' + hashtags[x]);
	
			// click on first photo
			const photo = await page.$("._9AhH0");
			await photo.click();

			for (var i = 0; i < 33; i++) {
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
							appendTextFile(f, 'already liked... moving on');
							i--;
						} else {
							console.log(i + ': found heart');
							appendTextFile(f, i + ': found heart');
							temp.click();	
						}

						await page.waitFor(2000);
		
						// click next page
						temp = await page.$(".coreSpriteRightPaginationArrow");
						temp.click();
						await page.waitForNavigation({ waitUntil: 'networkidle2' });
					} catch (err) {
						console.log('ERROR: ' + err);
						appendTextFile(f, err);
						// decrement for loop 
						i--;
						// if an error happens getting this specific post's info, skip it and move on
						console.log('cant get a page so moving to next one');
						appendTextFile(f, 'cant get a page so moving to next one');

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
					appendTextFile(f, 'skipping 10%!');
				}
			}
		}
		await browser.close();

	} catch (error) {
		console.log(error);
		appendTextFile(f, err);
		// await browser.close();
	}
}

module.exports = {
    runDaily: runDaily
};