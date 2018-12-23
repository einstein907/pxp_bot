const puppeteer = require('puppeteer');
const json = require('./resources/config.json');
const $ = require('jquery').$;

var isAlpha = function(ch){
    return typeof ch === "string" && ch.length === 1
           && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
  }  

async function targetScan(page, targets) {
    console.log('cycles through list of targets');

    var targetStats = [];

    // cycle through every target
    for (var i = 0; i < 1; i++) {
        console.log('target: ', targets[i]);

        var stats = {
            name: targets[i],
            posts: '',
            followers: '', 
            following: ''
        }

        var targetAddress = 'https://www.instagram.com/' + targets[i] + '/';
        await page.goto(targetAddress);

        await page.waitFor(1000);


        // gets num of posts, followers, and following numbers
        const element = await page.$$(".g47SY");
        
        stats.posts = await page.evaluate(element => element.textContent, element[0]);
        stats.followers = await page.evaluate(element => element.textContent, element[1]);
        stats.following = await page.evaluate(element => element.textContent, element[2]);

        // click on first photo
        const photo = await page.$("._9AhH0");
        await photo.click();

        // wait for display to appear
        await page.waitForSelector('span[class=RPhNB]');
        
        // grab and compile last ten captions
        for (var i = 0; i < 1; i++) {
            console.log('grabbing captions');
            var temp;
            var caption; 
            var hashtags = []; 

            // grab caption
            temp = await page.$$(".C4VMK span");
            caption = await page.evaluate(element => element.textContent, temp[0]);
            
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

                    console.log(tag);
                    hashtags.push(tag);
                    x += tag.length - 1;
                }
            }

            console.log(hashtags);

            // add to temp post object
            // const post = {
            //     "caption": caption,
            //     "hashtags"
            // }

            // push post object to target.post array


        }

    }


    return 'tada';
}

module.exports = {
    targetScan: targetScan
};