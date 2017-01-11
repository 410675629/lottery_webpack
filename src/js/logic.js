var utils = require('./utils.js');

var path = require('path');

var Event = require('./event.js');



var staff = require('../data/newStaff.json');
var reward = require('../data/reward.json');


var staffInfo;
var rewrdResult;

var init = function() {

    staffInfo = null;

    if (utils.getItem('staffInfo') === null) {
        staffInfo = staff;
        utils.setItem('staffInfo', staffInfo);
    } else {
        staffInfo = utils.getItem('staffInfo');
    }

    if (utils.getItem('rewrdResult') === null) {
        rewrdResult = [];
        utils.setItem('rewrdResult', rewrdResult);
    } else {
        rewrdResult = utils.getItem('rewrdResult');
    }
}
init();


window.addEventListener('beforeunload', function(e) {
    if (staffInfo !== null) {
        utils.setItem('staffInfo', staffInfo);
    }
    if (rewrdResult !== null) {
        utils.setItem('rewrdResult', rewrdResult);
    }
    var message = "是否退出抽奖？";
    e.returnValue = message;
    return message;
});

// ctrl+shift+alt+i 初始化抽奖程序
window.addEventListener('keyup', function(e) {

    if (e.ctrlKey && e.shiftKey && e.altKey && e.keyCode === 73) {
        utils.confirm('是否初始化抽奖程序？', function() {
            for (i in localStorage) {
                staffInfo = null;
                utils.removeItem(i);
            }
            init();
            console.log("has init all!");
        }, function() {
            console.log('no init all!');
        })
    }
})

var Zwes = function(arr) {

    var newArr = [];
    //var index = parseInt(Math.random() * arr.length);
    //window.lotteryIndex = index;
    newArr.push(arr[window.lotteryIndex]);
    arr.splice(window.lotteryIndex, 1);


    for (var i = 0; i < newArr.length; i++) {
        rewrdResult.push(newArr[i])
    }
    window.currentResult = newArr;

    utils.setItem('rewrdResult', newArr);
    utils.setItem('staffInfo', arr);
}

var drawLottery = function() {

    var index = parseInt(Math.random() * staffInfo.length);
    window.lotteryIndex = index;
    var arr = staffInfo;

    var newArr = [];
    //var index = parseInt(Math.random() * arr.length);
    //window.lotteryIndex = index;
    newArr.push(arr[window.lotteryIndex]);



    for (var i = 0; i < newArr.length; i++) {
        rewrdResult.push(newArr[i])
    }
    window.currentResult = newArr;

   /* var result;

    result = Zwes(staffInfo);
    for (var i = 0; i < result.length; i++) {
        rewrdResult.push(result[i])
    }
    window.currentResult = result;

    utils.setItem('rewrdResult', rewrdResult);
    utils.setItem('staffInfo', staffInfo);*/

}


Event.on('start', function() {

    drawLottery();
})

Event.on('success', function() {

    Zwes(staffInfo);
})
