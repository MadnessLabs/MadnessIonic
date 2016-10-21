const rename   = require('gulp-rename');
const template = require('gulp-template');

const capFirstLetter = require('./capFirstLetter');


module.exports = function(gulp, name, type) {
    type = type ? type : '';
    gulp.src(tmplDir+'ts/service'+capFirstLetter(type)+'.ts')
        .pipe(template({
            app: appName,
            name: capFirstLetter(name),
            nameLower: name.toLowerCase()
        }))
        .pipe(rename(name+'.ts'))
        .pipe(gulp.dest(jsSrcDir+'service/'));
};