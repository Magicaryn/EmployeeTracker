const inquirer = require('inquirer');
const fs = require('fs');
const { Client } = require('pg');
const clear = require('clear');
const consoleTable = require('console.table');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'company_db',
    password: 'jelly',
})

client.connect()
    .then(() => console.log('Connected to PostgreSQL database!'))
    .catch(err => console.error('Error connecting to PostgreSQL database:', err));

    async function getRoles() {
        try {
            const queryResult = await client.query('SELECT id, title FROM roles');
            return queryResult.rows.map(row => ({ name: row.title, value: row.id }));
        } catch (error) {
            console.error('Error getting roles:', error);
            throw error;
        };
    }

    async function getDepartment(){
        try {
            const queryResult = await client.query('SELECT id, department_name FROM department');
            return queryResult.rows.map(row => ({name: row.department_name, value: row.id}))
        } catch (error) {
            console.error('Error getting roles:', error);
            throw error;
        };
    }
// function displayMenu() {
//     return inquirer.prompt([
//         {
//             type: 'list',
//             message: 'What would you like to do? (Use arrow Keys)',
//             name: 'selection',
//             choices: ['View All Employees', 'Add Employee', 'Update Employee Role', ' View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
//         }

//     ]);
// };

async function main() {
    try {
        let shouldQuit = false;
    

        while (!shouldQuit) {
            const { selection } = await inquirer.prompt([
                {
                    type: 'list',
                    message: 'What would you like to do? (Use arrow Keys)',
                    name: 'selection',
                    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
                }
        
            ]);
            
            switch (selection) {
                case 'View All Employees':
                    console.log('');
                   await viewAllEmployees();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'Add Employee':
                    console.log('');
                    await addEmployee();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'Update Employee Role':
                    console.log('');
                    await updateRole();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'View All Roles':
                    console.log('');
                    await viewAllRoles();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'Add Role':
                    console.log('');
                    await addRole();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'View All Departments':
                    console.log('');
                    await viewDepartments();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'Add Department':
                    console.log('');
                    await addDepartment();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'Quit':
                    console.log('');
                    awaitquitApp();
                    console.log('');
                    shouldQuit = true;
                    return;
            }

        }

    } catch (error) {
        console.error('error', error);
    }
};

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
            const query = 'INSERT INTO department (department_name) VALUES ($1)';
            const values = [
                departmentData.newDepartment
            ];

            await client.query(query, values);

            console.log(`Added ${departmentData.newDepartment} to the database!`);

            if (!departmentData.addMore) {
                break;
            }

        } main();
    } catch (error) {
        console.error('Error:', error);
    }
};

//view dept
async function viewDepartments() {
    try {
        const { rows } = await client.query('SELECT * FROM department;');
        console.log(consoleTable.getTable(rows));
    } catch (error) {
        console.error('error:', error)
    };
    main();
};

//add role
async function addRole() {
    try {
        let addMore = true
        while (addMore) {
            const departmentList = await getDepartment();
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
                    choices: departmentList,
                },
                {
                    type: 'confirm',
                    message: 'Would you like to add another role?',
                    name: 'addMore',
                    default: false,
                }

            ]);
            const query = 'INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)';
            const values = [
                roleData.title,
                roleData.salary,
                roleData.departmentData 
            ];

            await client.query(query, values);

            console.log(`Added ${roleData.title} to the database!`);

            if (!roleData.addMore) {
                break;
            }
        }
        main();

    } catch (error) {
        console.error('Error:', error);
    }
};


//view roles
async function viewAllRoles() {
    try {
        const { rows } = await client.query('SELECT * FROM roles;');
        console.log(consoleTable.getTable(rows));
    } catch (error) {
        console.error('error:', error)
    };
    await main();
};

//add employee

async function addEmployee() {

    try {
        let addMore = true;
        
        while(addMore) {
        const roleList = await getRoles();
        const employeeData = await inquirer.prompt([
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
                name: 'role_id',
                choices: roleList,

            },

            {
                type: 'input',
                message: "Who is the employee's manager?",
                name: 'manager',
            }
        ]);

        const query = ' INSERT INTO employee (first_name, last_name, role_id, manager) VALUES ($1, $2, $3, $4)';
        const values = [
            employeeData.first_name,
            employeeData.last_name,
            employeeData.role_id,
            employeeData.manager, 
        ];
     
        await client.query(query,values)

        console.log(`Added ${employeeData.firstName} ${employeeData.lastName} to the database!`);

        if (!employeeData.addMore) {
            break;
        }

    }main();
    } catch (error) {
        console.error('Error:', error);
    }

};



//view employees
async function viewAllEmployees() {
    try {
        const { rows } = await client.query('SELECT * FROM employee;');
        console.log(consoleTable.getTable(rows));
    } catch (error) {
        console.error('error:', error)
    };
    main();
};

//update role
async function updateRole() {

};

//quit application
 function quitApp(){
    console.log('Exiting the Application...');
    client.end();
};

main();