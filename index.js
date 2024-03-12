const inquirer = require('inquirer');
const fs = require('fs');
const clear = require('clear');

let departments = [];
let roles = [];
let employees = [];

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

async function main() {
    try {
        let shouldQuit = false;
        clear();

        while (!shouldQuit) {
            const { selection } = await displayMenu();

            switch (selection) {
                case 'View All Employees':
                    viewAllEmployees();
                    shouldQuit = true;
                    break;

                case 'Add Employee':
                    addEmployee();
                    shouldQuit = true;
                    break;

                case 'Update Employee Role':
                    updateRole();
                    shouldQuit = true;
                    break;

                case 'View All Roles':
                    viewRoles();
                    shouldQuit = true;
                    break;

                case 'Add Role':
                    addRole();
                    shouldQuit = true;
                    break;

                case 'View All Departments':
                    viewDepartments();
                    shouldQuit = true;
                    break;

                case 'Add Department':
                    addDepartment();
                    shouldQuit = true;
                    break;

                case 'Quit':
                    console.log('Exiting...');
                    shouldQuit = true;
                    return;
            }
        }

    } catch (error) {
        console.error('error', error)
    }
}
//add department prompt
async function addDepartment() {
    try {
        const departmentData = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'newDepartment',
            },
        ])

        // if (departmentExists(departmentData.newDepartment)) {
        //     console.log('Department already exists in the database!');
        //     return;
        // }

        departments.push(departmentData.newDepartment);

        console.log(`Added ${departmentData.newDepartment} to the database!`);

        const sqlStatement = `INSERT INTO department (department) VALUES ('${departmentData.newDepartment}')`;

        fs.appendFileSync('seeds.sql', sqlStatement + ';\n');

    } catch (error) {
        console.error('Error:', error);
    }
}


//add role
async function addRole() {

    try {
        const roleData = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'newRole',
            },

            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
            },

            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'departmentData',
                choices: [`${departmentData}`],
            },

        ]);
        // if (roleExists(roleData.newRole)) {
        //     console.log('Role already exists!');
        //     return
        // }

        roles.push({
            name: roleData.newRole,
            salary: roleData.salary,
            department: roleData.departmentData,
        });

        console.log(`Added ${response.newRole} to the database!`);

        const sqlStatement = `INSERT INTO (role) VALUES (${roleData.newRole})`;

        fs.appendFileSync('seeds.sql', sqlStatement + ';\n')
    } catch (error) {
        console.error('Error:', error);
    }
}

// //add employee

async function addEmployee() {

    try {
        const employeeData = await inquirer.prompt([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'firstName',
            },

            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lastName',
            },

            {
                type: 'list',
                message: "What is the employee's role?",
                name: 'employee_role',
                choices: [`${roleData}`],

            },

            {
                type: 'list',
                message: "Who is the employee's manager?",
                name: 'manager',
                choices: [`${employeeData}`]
            }
        ])
        // if (employeeExists(employeeData.addEmployee)) {
        //     console.log('Employee already exists!');
        //     return
        // }

        employees.push({
            first
        });

        console.log(`Added ${firstName} ${lastName} to the database!`);

        const sqlStatement = `INSERT INTO (employee) VALUES (${employeeData.newEmployee});\n`;

        fs.appendFileSync(`seeds.sql`, sqlStatement);
    } catch (error) {
        console.error('Error:', error);
    }

};


//updating employee role

// async function updateRole() {
//     try {
//         const updatedRoleData = await inquirer.prompt([
//             {
//                 type: 'list',
//                 message: "Whice employee's role do you want to update?",
//                 name: 'employeeChange',
//                 choices: [`${employeeData}`],
//             },

//             {
//                 types: 'list',
//                 message: 'Whice role do you want to assign to selected employee?',
//                 name: 'roleChange',
//                 choices: [`${roleData}`],
//             }
//         ])
//         console.log(`Updated role for ${response.employeeData}!`)

//     } catch (error) {
//         console.error('Error:', error);
//     }

//     ;
// }

main();