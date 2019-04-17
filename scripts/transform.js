// const $ = require('jquery').$;
// const targetScan = require('./scripts/targetScan.js');
const fs = require('fs');
const mock = require('../../../Downloads/ciot_json_mock.json');

var stringifiedMock = JSON.stringify(mock);
stringifiedMock = JSON.parse(stringifiedMock);
var incidents = stringifiedMock.incidents;
console.log(incidents[0].ticket_number);

// for(var i = 0; i < incidents.length; i++) {
//     if(incidents[i].ticket_number)
// }