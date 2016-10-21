const inquirer = require('inquirer');
const argv     = require('yargs').argv;
const rename   = require('gulp-rename');
const replace  = require('gulp-replace');

module.exports = function(gulp, callback) {
    function addController(controllerName) {
        gulp.src(tmplDir+'ts/controller.ts')
            .pipe(replace('@@{app}', appName))
            .pipe(replace('@@{name}', capFirstLetter(controllerName)))
            .pipe(rename(controllerName+'.ts'))
            .pipe(gulp.dest(jsSrcDir+'controller/'));
    }

    if (argv.n) {
        addController(argv.n);
        callback();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the controller?',
            name: 'controller'
        }], function(res) {
            addController(res.controller);
            callback();
        });
    }
};
