const puppeteer = require('puppeteer');
const json = require('./resources/config.json');
const $ = require('jquery').$;

var isAlpha = function(ch){
    return typeof ch === "string" && ch.length === 1
        && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
}  

async function targetScan(page, targets) {
    // console.log('cycles through list of targets');

    var targetStats = [];
    var hashtagMap = new Map();

    // cycle through every target
    for (var target = 0; target < targets.length; target++) {
        console.log('target: ', targets[target]);

        var stats = {
            name: targets[target],
            numPosts: '',
            followers: '', 
            following: '',
            posts: []
        }

        var targetAddress = 'https://www.instagram.com/' + targets[target] + '/';
        await page.goto(targetAddress);

        await page.waitFor(1000);

        // gets num of posts, followers, and following numbers
        const element = await page.$$(".g47SY");

        // console.log('ISSUE GRABBING NUM POSTS, FOLLOWERS AND FOLLOWING');
        stats.numPosts = await page.evaluate(element => element.textContent, element[0]);
        stats.followers = await page.evaluate(element => element.textContent, element[1]);
        stats.following = await page.evaluate(element => element.textContent, element[2]);

        // click on first photo
        const photo = await page.$("._9AhH0");
        await photo.click();
        
        // grab and compile last ten captions
        for (var i = 0; i < 10; i++) {
            try {
                // await page.waitFor(5000);

                // wait for display to appear
                await page.waitForSelector('span[class=RPhNB]');
                await page.waitForSelector('div[class=C4VMK]');

                console.log('grabbing captions');
                var temp,
                    caption, 
                    hashtags = [], 
                    likes;

                // grab caption
                temp = await page.$$(".C4VMK span");
                caption = await page.evaluate(element => element.textContent, temp[0]);
                
                // grab likes
                temp = await page.$$(".yWX7d span");
                likes = await page.evaluate(element => element.textContent, temp[3]);
                likes += 3;

                // extract hashtags
                for (var x = 0; x < caption.length; x++) {
                    // console.log(caption[x]);
                    // if it's a hash tag...
                    if(caption[x] === '#') {
                        // console.log('x is #!')
                        var tag = '';

                        tag += caption[x];
                        var holder = x + 1;

                        /// as long as it's not a space, continue
                        while(isAlpha(caption[holder])) {
                            // console.log('pushing letter...' + caption[holder]);
                            tag += caption[holder];
                            holder++;
                        }

                        hashtags.push(tag);                    
                        x += tag.length - 1;

                        // compile all hashtags 
                        // if the hashtag is currently in the heatmap, increase count by one
                        // if the hashtag isn't in the heatmap, add it and make the current count 1
                        if(hashtagMap.has(tag)) {
                            // console.log('updated count of ' + tag);
                            var count = hashtagMap.get(tag);
                            count += 1;
                            hashtagMap.set(tag, count);

                        } else {
                            hashtagMap.set(tag, 1);
                        }
                        
                    }
                }

                // add to temp post object
                const tempPost = {
                    "hashtags": hashtags,
                    "likes": likes
                }

                // push post object to target.post array
                stats.posts.push(tempPost);
            
                // click the next arrow
                temp = await page.$(".coreSpriteRightPaginationArrow");
                temp.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
            } catch (err) {
                console.log('ERROR: ' + err);
                // decrement for loop 
                i--;
                // if an error happens getting this specific post's info, skip it and move on
                console.log('cant get a page so moving to next one');
                temp = await page.$(".coreSpriteRightPaginationArrow");
                temp.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
            }
        }

        targetStats.push(stats);
    }

    return hashtagMap;
}

module.exports = {
    targetScan: targetScan
};