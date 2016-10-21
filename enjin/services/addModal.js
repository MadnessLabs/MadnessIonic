const rename   = require('gulp-rename');
const template = require('gulp-template');
const npc      = require('copy-paste');


module.exports = function(gulp, name) {
    gulp.src(tmplDir+'jade/modal.jade')
        .pipe(template({name: name}))
        .pipe(rename(name+'.jade'))
        .pipe(gulp.dest(htmlSrcDir+'modal/'));
    gulp.src(tmplDir+'scss/modal.scss')
        .pipe(template({name: name}))
        .pipe(rename(name+'.scss'))
        .pipe(gulp.dest(cssSrcDir+'modal/'));

    var copyText = `
        this.$ionicModal.fromTemplateUrl('html/modal/${name}.html', {
            scope: this.$scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then((modal) => {
            this.modal = modal;
        });
    `;

    npc.copy(copyText);
};