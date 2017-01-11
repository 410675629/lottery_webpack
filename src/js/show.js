var $ = require('jquery');
var ease = require('./easing.js');

var Event = require('./event.js');
var utils = require('./utils.js');

var staff = require('../data/newStaff.json');
var reward = require('../data/reward.json');


var html = {
    tpl: {
        base: '<li><img src="src/images/xiaolangren.png"></li>',
        staffList: (function() {
            var _current = [];
            for (var i = 0; i < staff.length; i++) {
                _current.push('<img index="' + i + '" staff-id="' + staff[i].empNum + '" class="staff-item" src="' + staff[i].image + '"/>');
            }
            return '<li class="people"><div class="staff-list">' + _current.join('') + '</div></li>';
        })()
    },

    createHtml: function(htmlTpl) {
        debugger;
        $('.list').html(htmlTpl);
        $('.staff-list').each(function(index) {
            $(this).css({
                'top': -parseInt(Math.random() * staff.length) * 222 + 'px',
            });
        })
    },

    createList: function() {
        debugger;
        var tpl = this.tpl;
        var temp = tpl.staffList;
        this.createHtml(temp);



    }
}


// staff-list 动画
var ani = {
    oneTime: 50, // 每人动画时间 100ms
    ing: false,
    oneHeight: 222,
    staffLen: staff.length,
    extraTime:100,
    linearLoopAni: function(ele) { // 循环匀速运行
        var _this = this;
        ele.animate({
            'top': -_this.oneHeight * (_this.staffLen - 1) + 'px'
        }, _this.oneTime * (_this.staffLen - 1), 'linear', function() {
            ele.css('top', '0');
            _this.linearLoopAni(ele);
        })
    },
    easeInAni: function(ele, cb) { // 加速运行到最底部
        var _this = this;
        var currentIndex = Math.round(Math.abs(parseInt(ele.css('top')) / ani.oneHeight));
        ele.animate({
            'top': -_this.oneHeight * (_this.staffLen - 1) + 'px'
        }, _this.oneTime * (_this.staffLen - currentIndex), 'easeInQuad', function() {
            ele.css('top', '0');
            cb && cb(ele);
        })
    },
    easeOutAni: function(ele, cb) { // 减速运行到目标位置
        var _this = this;
        var index = ele.index('.staff-list');
        var currentTop = ele.css('top');
        var currentIndex = Math.round(Math.abs(parseInt(currentTop) / ani.oneHeight));
        var targetTop = -($('[staff-id="' + window.currentResult[index].empNum + '"]').attr('index') * ani.oneHeight);
        var targetIndex = $('[staff-id="' + window.currentResult[index].empNum + '"]').attr('index');
        var resultCon = $('.message li').eq($('.people').eq(index).index())[0];
        var diff = Math.abs(targetIndex - currentIndex);
        if (targetIndex > currentIndex) {
            if (diff > 20) {
                ele.animate({
                    'top': targetTop + 'px'
                }, diff * ani.extraTime, 'easeOutQuad', function() {
                    resultCon.innerHTML = '<div>' + window.currentResult[index].name + '</div><div>' + window.currentResult[index].department + '</div>';
                    cb && cb();
                })
            } else {
                if (targetIndex < 20) {
                    ele.css('top', '0');
                } else {
                    ele.css('top', -(targetIndex - 20) * _this.oneHeight);
                }
                ele.animate({
                    'top': targetTop + 'px'
                }, (diff + 20) * ani.extraTime, 'easeOutQuad', function() {
                    resultCon.innerHTML = '<div>' + window.currentResult[index].name + '</div><div>' + window.currentResult[index].department + '</div>';
                    cb && cb();
                })
            }
        } else {
            if (diff < _this.staffLen / 2) {
                ele.css('top', '0');
                ele.animate({
                    'top': targetTop + 'px'
                }, targetIndex * ani.extraTime, 'easeOutQuad', function() {
                    resultCon.innerHTML = '<div>' + window.currentResult[index].name + '</div><div>' + window.currentResult[index].department + '</div>';
                    cb && cb();
                })
            } else {
                ele.animate({
                    'top': -_this.oneHeight * (_this.staffLen - 1) + 'px'
                }, (_this.staffLen - 1 - currentIndex) * _this.extraTime, 'linear', function() {
                    ele.css('top', '0');
                    ele.animate({
                        'top': targetTop + 'px'
                    }, targetIndex * ani.extraTime, 'easeOutQuad', function() {
                        resultCon.innerHTML = '<div>' + window.currentResult[index].name + '</div><div>' + window.currentResult[index].empNum + '</div>';
                        cb && cb();
                    })
                })
            }
        }

    }
}

/*$('.bonus_set ul li').on('click', function() {
    window.drawErr = false;
    var index = $(this).attr('reward');
    //rewardListSwtich();
    $('.bonus_set .bonus_set_title').css({
        'background': 'url(' + reward[index]['bg'] + ') no-repeat center '
    })
    html.createList()
    $('.bonus_set_title').attr('reward', index);
    $('.message').html('<li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li><li><div>***</div><div>*****</div></li>');
})*/


$('.start').on('click', function() {
    debugger;
    html.createList()

    if (ani.ing) {
        return;
    }
    ani.ing = true;

    Event.trigger('start')

    if (window.drawErr) {
        return;
    }

    $('.message').html('<li><div>***</div><div>*****</div></li>');

    $('audio')[0].play();
    debugger;


    setTimeout(function() {
        ani.easeInAni($('.staff-list'), function() {
            ani.linearLoopAni($('.staff-list'));
        });
    }, 300);

})



$('.stop').on('click', function() {
    if (!ani.ing) {
        return;
    }

    // $('.staff-list').each(function(index) {
    var ele = $('.staff-list');
    ele.stop();
    ani.easeOutAni(ele, function() {


    ani.ing = false;
    $('audio')[0].pause();

    });
})


$('.success').on('click',function(){
    Event.trigger('success');
})





