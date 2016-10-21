const shell = require('gulp-shell');


module.exports = shell.task(['gulp build --e=' + deploy.env, 'ionic upload --note "' + deploy.note + '" --deploy ' + deploy.branch]);