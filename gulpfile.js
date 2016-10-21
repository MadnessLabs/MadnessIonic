 /////////////////////////////////////
// REQUIRED LIBRARIES
gulp         = require('gulp');
startEnjin   = require('./enjin/services/start');

 /////////////////////////////////////
// ON LOAD
startEnjin();

 /////////////////////////////////////
// TASKS
require('gulp-require-tasks')({
    path: process.cwd() + '/enjin/tasks',
    gulp: gulp
});