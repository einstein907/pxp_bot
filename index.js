const config = require('./resources/config.json');
const hashJson = require('./resources/hashtags.json');
const runDaily = require('./scripts/runDaily');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

function appendTextFile(afilename, output)
{
	fs.appendFile(afilename, output + '\n', function(err) {
		if(err) {
			return console.log(err);
		}
	}); 
}


(async () => {
    // figure out seconds until top of the hour 
    const msInHour = 60 * 60 * 1000;

    var begin = 0;
    var end = 10;

    for(var i = 0; i < 24; i++) {
        // grab the config'd hashtags
        const hashtags = config.hashtags;

        // time began
        var timeBegan = new Date();
        console.log('time began: ' + timeBegan);

        const passedHashtags = hashtags.slice(begin, end);
        console.log(passedHashtags);

        // grab the current start time
        console.log('running');
        const totalTimeRan = await runDaily.runDaily(passedHashtags);

        var curTime = new Date();
        var expectantTime = timeBegan.getHours() + 1;
        while(curTime.getHours() !== expectantTime) {
            console.log('Session Began Hour: ' + timeBegan.getHours());
            console.log('Expectant Hour: ' + expectantTime);
            console.log('Current Time: ' + curTime.getHours())
            // wait fifteen minutes
            console.log('going to sleep for fifteen minutes');
            await sleep(900000);
            curTime = new Date();
        }

        console.log('finally the next hour... restarting session');
        begin = end;
        end = end + 10;
    }    

})();