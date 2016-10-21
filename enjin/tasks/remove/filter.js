const inquirer = require('inquirer');
const argv     = require('yargs').argv;

const removeFilter = require('../../services/removeFilter');


module.exports = function(gulp, callback) {
    if (argv.n) {
        removeFilter(gulp, argv.n);
        callback();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the state name of the filter you would like to remove?',
            name: 'name'
        }], function(res) {
            removeFilter(gulp, res.name);
            callback();
        });
    }
};