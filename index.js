const inquirer = require('inquirer');
const fs = require('fs');
const { Client } = require('pg');
const clear = require('clear');
const consoleTable = require('console.table');
const { table } = require('console');

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
};

async function getDepartment() {
    try {
        const queryResult = await client.query('SELECT id, department_name FROM department');
        return queryResult.rows.map(row => ({ name: row.department_name, value: row.id }))
    } catch (error) {
        console.error('Error getting departments:', error);
        throw error;
    };
};

async function getEmployee() {
    try {
        const queryResult = await client.query('SELECT id, CONCAT(first_name,\' \', last_name) AS full_name FROM employee');
        return queryResult.rows.map(row => ({ name: row.full_name, value: row.id }))
    } catch (error) {
        console.error('Error getting employees:', error);
        throw error;
    }
}

async function getEmployeeWithNone() {
    try {
        const queryResult = await client.query('SELECT id, CONCAT(first_name,\' \', last_name) AS full_name FROM employee');
        const employees = queryResult.rows.map(row => ({ name: row.full_name, value: row.id }));
        employees.unshift({ name: 'None', value: null });
        return employees;
    } catch (error) {
        console.error('Error getting employees:', error);
        throw error;
    }
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
                    choices: ['View All Employees', 'Add Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Edit/Delete', 'Quit'],
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
                    
                case 'Edit/Delete':
                    console.log('');
                    await editDelete();
                    console.log('');
                    shouldQuit = true;
                    break;

                case 'Quit':
                    console.log('');
                    await quitApp();
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
        const query = `
        SELECT r.id AS id,
        r.title AS title,
        r.salary AS salary,
        r.department AS dept_id,
        d.department_name AS department
        FROM roles r
        LEFT JOIN department d on r.department = d.id;
        `;
        const { rows } = await client.query(query);
        console.table(rows);
    } catch (error) {
        console.error('error:', error)
    };
    await main();
};

//add employee

async function addEmployee() {

    try {
        let addMore = true;

        while (addMore) {
            const roleList = await getRoles();
            const managerList = await getEmployeeWithNone();
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
                    type: 'list',
                    message: "Who is the employee's manager?",
                    name: 'manager',
                    choices: managerList,
                }
            ]);

            const query = ' INSERT INTO employee (first_name, last_name, role_id, manager) VALUES ($1, $2, $3, $4)';
            const values = [
                employeeData.first_name,
                employeeData.last_name,
                employeeData.role_id,
                employeeData.manager,
            ];

            await client.query(query, values)

            console.log(`Added ${employeeData.firstName} ${employeeData.lastName} to the database!`);

            if (!employeeData.addMore) {
                break;
            }

        } main();
    } catch (error) {
        console.error('Error:', error);
    }

};



//view employees
async function viewAllEmployees() {
    try {
        const query = `
        SELECT e1.id AS id,
               e1.first_name AS first,
               e1.last_name AS last,
               r.title AS role,
               e1.manager AS manager_id,
               e2.first_name AS manager_first_name,
               e2.last_name AS manager_last_name
               FROM employee e1
               LEFT JOIN employee e2 ON e1.manager = e2.id
               LEFT JOIN roles r ON e1.role_id = r.id;
        `;
        const { rows } = await client.query(query);
        console.table(rows);
    } catch (error) {
        console.error('error viewing all employees:', error)
    };
    main();
};

//update role
async function editDelete() {
    try {
        const functMenu = await inquirer.prompt([
            {
                type: 'list',
                message: 'In which section will you be making a change?',
                choices: ['Department', 'Roles', 'Employee'],
                name: 'section',
            },

            {    
                type: 'list',
                message: 'Would you like to edit or delete?',
                choices: ['Edit', 'Delete'],
                name: 'action',
        },
        ]);

        let tableName;
        let columnName;
        switch (functMenu.section){
            case 'Department':
                tableName = 'department';
                columnName = [department_name]
                break;
            case 'Roles':
                tableName = 'roles';
                columnName = ['title', 'salary', 'department']
                break;
            case 'Employee':
                tableName = 'employee';
                columnName = ['first_name', 'last_name', 'role_id', 'manager']
                break;
            default:
                throw new Error('Invalid section selected');
        };


        if (functMenu.action === 'Edit'){

            const editMenu = await inquirer.prompt([
                {
                    type: 'list',
                    message: `What would you like to edit in ${functMenu.section}?`,
                    choices: columnName,
                    name: 'columnName',
                }
            ]);
            
            const newValue = await inquirer.prompt([
                {
                    type: 'input',
                    message: `Enter new data for ${editOption.columnName}:`,
                    name: 'newValue', 
                },
            ]);

            console.log(`Edit record in the ${tableName} table complete`)

        } else if (functMenu.action === 'Delete') {
            const deleteMenu = await inquirer.prompt([
                {
                    type: 'list',
                    message: `What would you like to delete in ${functMenu.section}?`,
                    choices: columnName,
                    name: 'columnName',
                }
            ]);

            const query = `DELETE FROM ${tableName} WHERE ${deleteMenu.columnName} = $1`;
            const values = [deleteMenu.columnName];

            await client.query(query, values);

            console.log(`Record deleted from ${tableName}`)

        }
    
} catch (error) {
    console.error('Error:', error);
}; main();
}

//quit application
function quitApp() {
    console.log('Exiting the Application...');
    client.end();
};

main();