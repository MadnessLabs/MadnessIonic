const inquirer = require('inquirer');
const argv     = require('yargs').argv;

const removePage = require('../../services/removePage');


module.exports = function(gulp, callback) {
    if (argv.n) {
        removePage(gulp, argv.n);
        callback();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the state name of the page you would like to remove?',
            name: 'name'
        }], function(res) {
            removePage(gulp, res.name);
            callback();
        });
    }
};