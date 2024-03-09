const inquirer = require('inquirer')
const fs = require('fs')



//main screen menu options
function displayMenu() {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do? (Use arrow Keys)',
            name: 'selection',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', ' View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        }

    ]);
};


//add department prompt
async function addDepartment() {
    try {
        const departmentData = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'new_department',
            },
        ])

        if (departmentExists(departmentData.new_department)) {
            console.log('Department already exists in the database!');
            return;
        }

        console.log('Added ${response.new_department} to the database!');

        const sqlStatement = `INSERT INTO department (department_name) VALUES ('${departmentData.new_department}');\n`;

        // fs.appendFileSync('seeds.sql', sqlStatement');

    } catch (error) {
        console.error('Error:', error);
    }
}

async function main() {
    await addDepartment();
}

main ().catch(console.error)

//add role
// async function promptForRoleData() {
//     return inquirer.prompt([
//         {
//             type: 'input',
//             message: 'What is the name of the role?',
//             name: 'new_role',
//         },

//         {
//             type: 'input',
//             message: 'What is the salary of the role?',
//             name: 'salary',
//         },

//         {
//             type: 'list',
//             message: 'Which department does the role belong to?',
//             name: 'role_department',
//             choices: [${ department }],
//         },
//     ])

//         .then((response) => {
//             console.log('Added ${response.new_role} to the database!');
//             return response
//         });
// }


// //add employee

// inquirer
//     .prompt([
//         {
//             type: 'input',
//             message: "What is the employee's first name?",
//             name: 'first_name',
//         },

//         {
//             type: 'input',
//             message: "What is the employee's last name?",
//             name: 'last_name',
//         },

//         {
//             type: 'list',
//             message: "What is the employee's role?",
//             name: 'employee_role',
//             choices: [${ role }],

//         },

//         {
//             type: 'list',
//             message: "Who is the employee's manager?",
//             name: 'manager',
//             choices: [${ employees }]
//         }
//     ])

// then((response) => {
//     console.log('Added ${first_name} ${last_name} to the database!')
// });


// //updating employee role

// inquirer
//     .prompt([
//         {
//             type: 'list',
//             message: "Whice employee's role do you want to update?",
//             name: 'role_change',
//             choices: [${ employees }],
//         }

//         {
//             types: 'list',
//             message: 'Whice role do you want to assign to selected employee?',
//             name: 'role_change',
//             choices: [${ roles }],
//         }
//     ])

// then((response) => {
//     console.log("Updated employee's role")
// });
