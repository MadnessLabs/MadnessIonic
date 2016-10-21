const clean    = require('gulp-clean');
const runSequence = require("run-sequence");

module.exports = function(gulp, name, dir) {
    dir = dir ? dir : 'controller' ;
    gulp.src([
        jsSrcDir+ dir + '/'+name+'.ts'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
    
    setTimeout(function(){
        runSequence('router', 'js-build', 'sync-reload');
    }, 2000);
};