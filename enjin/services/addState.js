const rename   = require('gulp-rename');
const template = require('gulp-template');
const npc      = require('copy-paste');

const addController  = require('./addController');
const addRoute       = require('./addRoute');
const capFirstLetter = require('./capFirstLetter');


module.exports = function(gulp, name, view) {
    gulp.src(tmplDir+'jade/state.jade')
        .pipe(template({name: name}))
        .pipe(rename(name+'.jade'))
        .pipe(gulp.dest(htmlSrcDir+'state/'));
    gulp.src(tmplDir+'scss/state.scss')
        .pipe(template({name: name}))
        .pipe(rename(name+'.scss'))
        .pipe(gulp.dest(cssSrcDir+'state/'));
    addController(gulp, name + 'State', 'state');
    var stateSteps = name.split(/(?=[A-Z])/);
    var state = stateSteps.join(".").toLowerCase();
    addRoute(gulp, state, '/'+stateSteps[stateSteps.length - 1].toLowerCase(), 'html/state/'+name+'.html', capFirstLetter(name)+'StateController', view);
    
    var copyText = `ui-view(name="${view}")`;

    npc.copy(copyText);
};