const inquirer = require('inquirer')
const fs = require('fs')


//main screen

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do? (Use arrow Keys)',
            name: 'menu',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', ' View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        }

    ])

//add department

inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'new_department',
        },
    ])

then((response) => {
    console.log('Added ${new_department} to the database!')
});



//add role

inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'new_role',
        },

        {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'salary',
        },

        {
            type: 'list',
            message: 'Which department does the role belong to?',
            name: 'role_department',
            choices: [${ department }],
        },
    ])

then((response) => {
    console.log('Added ${new_role} to the database!')
});

//add employee

inquirer
    .prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'first_name',
        },

        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'last_name',
        },

        {
            type: 'list',
            message: "What is the employee's role?",
            name: 'employee_role',
            choices: [${role}],

        },

        {
            type: 'list',
            message: "Who is the employee's manager?",
            name: 'manager',
            choices: [${employees}]
        }
    ])

    then((response) => {
        console.log('Added ${first_name} ${last_name} to the database!')
    });
    

    //updating employee role

    inquirer
    .prompt([
        {
            type: 'list',
            message: "Whice employee's role do you want to update?",
            name: 'role_change',
            choices: [${employees}],
        }

        {
            types: 'list',
            message: 'Whice role do you want to assign to selected employee?',
            name: 'role_change',
            choices: [${roles}],
        }
    ])

    then((response) => {
        console.log("Updated employee's role")
    });
