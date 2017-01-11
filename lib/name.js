var fs = require('fs');
var path = require('path');
var staff = require('../src/data/staff.json');
var oldimagePath = '../src/staffImage/';
var newimagePath = '../src/newstaffImage/'


var result = [];

var randomsort = function(a, b) {
    return Math.random() > .5 ? -1 : 1;
}

fs.readdir(oldimagePath,function(err,files){
    files.forEach(function(item){
        var empNum = item.split('.')[0];
        for(var i = 0, len = staff.length; i < len; i++){
            if(staff[i].empNum == empNum){
                var renameImg = empNum + '-' + staff[i].department + '-' + staff[i].name + '.' + item.split('.')[1];

                fs.renameSync(oldimagePath + item,renameImg);
                staff[i].image = 'src/staffImage/' + renameImg;
                console.log(staff[i]);


            }

        }

    })
   console.log(staff);
    fs.writeFileSync('./newStaff.json', JSON.stringify(staff));

})

/*
fs.readdir(imagePath, function(err, files) {
    files.forEach(function(item) {
        console.log(item);
        fs.renameSync(imagePath+item,imagePath+item.replace(/\s+/g,'').replace(/\－/g,'-'));
        var _current = item.replace(/\s+/g,'').replace(/\－/g,'-').split(/\-/);
        var tpl = {};
        tpl.EMPLOYEE_ID = _current[0];
        tpl.empName = _current[2].replace(/.jpg|.png|.jpeg/ig, '');
        tpl.IMAGE = 'src/staffImage/' + item;
        result.push(tpl);
    })
    console.log(result.sort(randomsort));
    fs.writeFileSync('../src/data/staff.json', JSON.stringify(result.sort(randomsort)), 'utf-8');
})*/
