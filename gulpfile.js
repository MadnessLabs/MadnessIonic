 /////////////////////////////////////
// REQUIRED LIBRARIES
gulp         = require('gulp');
startEnjin   = require('enjinionic');

 /////////////////////////////////////
// ON LOAD
startEnjin();

 /////////////////////////////////////
// TASKS
require('gulp-require-tasks')({
    path: process.cwd() + '/node_modules/enjinionic/tasks',
    gulp: gulp
});