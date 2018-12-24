const config = require('./resources/config.json');
const runDaily = require('./scripts/runDaily');

(async () => {
    // grab the config'd hashtags
    const hashtags = config.hashtags;

    // grab the current start time
    runDaily.runDaily(hashtags);

    // run the function 24 times 
    // run the function an hour after the first function runs
    // give the function the first ten targets





})();