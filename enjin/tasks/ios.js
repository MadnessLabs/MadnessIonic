const shell = require('gulp-shell');


module.exports = shell.task(['gulp build --e=' + deploy.env, 'ionic build ios']);