const inquirer = require('inquirer');
const fs = require('fs');
const { Client } = require('pg');
const clear = require('clear');
const { resolve } = require('path');

let departments = [];
let roles = [];
let employees = [];

let employeeSqlQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ';
let roleSqlQuery = 'INSERT INTO role (role_id, title, salary, department) VALUES ';
let departmentSqlQuery = 'INSERT INTO department (department_name) VALUES ';

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'company',
    password: 'jelly',
    port: 5432,
})

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL database:', err));

//LANDING PAGE
async function displayLandingPage(){
    console.log('Welcome to your application!');
    console.log('Conecting to database...');

    try{
        await client.connect();
        console.log('Connected to postgreSQL databsase');

        await executeSchema();


        await displayMenu();
    } catch {
        console.error('Error:', error);
        process.exit(1)
    }
}


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

// schema call
async function executeSchema() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');

        const schemaPath = path.join(__dirname, 'db/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await client.query(schema);
        console.log('Schema executed successfully');
    } catch (error) {
        console.error('Error executing schema:', error)
    }
};

//seeds call
async function executeSeeds() {
    try{
        const seedsPath = path.join(__dirname, 'db/seeds.sql');
        const seeds = fs.readFileSync(seedsPath, 'utf8');

        await client.query(seeds);
        console.log('Seeds executed successfully');
    } catch (error) {
        console.error('Error executing seeds:', error); 
    }
}

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
        console.error('error', error);
    } finally {
        await client.end();
        console.log('Connection to PostgreSQL database closed');
    }
}
//add department prompt
async function addDepartment() {
    try {
        let addMore = true;
        while (addMore) {
            const departmentData = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of the department?',
                    name: 'newDepartment',
                },
                {
                    type: 'confirm',
                    message: 'Would you like to add another department?',
                    name: 'addMore',
                    default: false,
                }
            ])

            departments.push(departmentData.newDepartment);

            console.log(`Added ${departmentData.newDepartment} to the database!`);

            departmentSqlQuery += `(${departmentData.newDepartment})`;

            if (departmentData.addMore) {
                departmentSqlQuery += ',';
            } else {
                departmentSqlQuery += ';\n';
                fs.appendFileSync('seeds.sql', departmentSqlQuery);
                departmentSqlQuery = 'INSERT INTO department (department_name) VALUES';
            }
            addMore = departmentData.addMore;
        }
        main();

    } catch (error) {
        console.error('Error:', error);
    }
}



//add role
async function addRole() {
    try {
        let addMore = true
        while (addMore) {
            const roleData = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of the role?',
                    name: 'title',
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
                    choices: [`${departments}`],
                },
                {
                    type: 'confirm',
                    message: 'Would you like to add another role?',
                    name: 'addMore',
                    default: false,
                }

            ]);
            // if (roleExists(roleData.newRole)) {
            //     console.log('Role already exists!');
            //     return
            // }

            roles.push({
                name: roleData.title,
                salary: roleData.salary,
                department: roleData.departmentData,
            });

            console.log(`Added ${response.title} to the database!`);

            roleSqlQuery += `(${roleData.title})`;

            if (roleData.addMore) {
                roleSqlQuery += ',';
            } else {
                roleSqlQuery += ';\n';
                fs.appendFileSync('seeds.sql', roleSqlQuery);
                roleSqlQuery = 'INSERT INTO role (title, salary, department) VALUES';
            }
            addMore = roleData.addMore;
        }
        main();

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
                choices: [`${roles}`],

            },

            {
                type: 'list',
                message: "Who is the employee's manager?",
                name: 'manager',
                choices: [`${employees}`]
            }
        ])
        // if (employeeExists(employeeData.addEmployee)) {
        //     console.log('Employee already exists!');
        //     return
        // }

        employees.push(employeeData.newEmployee);

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

displayLandingPage();