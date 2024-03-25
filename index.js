const inquirer = require('inquirer');
const { Client } = require('pg');

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
            console.log('');

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
   const query = `
   SELECT d.id AS department_name,
   d.department_name AS department_name,
   SUM(r.salary) AS total_salary
   FROM department d
   LEFT JOIN roles r ON d.id = r.department
   LEFT JOIN employee e ON r.id = e.role_id
   GROUP BY d.id, d.department_name
   ORDER BY d.department_name;
   `;
   const {rows} = await client.query(query);
   console.table(rows);
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
            console.log('');

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

            console.log(`Added ${employeeData.first_name} ${employeeData.last_name} to the database!`);
            console.log('');

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

    const employeeMenu = await inquirer.prompt([
        {
            type: 'list',
            message: 'How would you like to view the employees? View By:',
            choices: ['all', 'department', 'manager'],
            name: 'userListChoice'
        }
    ]);
    try {
        let query
        switch (employeeMenu.userListChoice) {
            case 'all':
                query = `
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
                break;
            case 'manager':
                query = `
            SELECT e1.id AS employee_id,
            e1.first_name AS employee_first,
            e1.last_name AS employee_last,
            e2.id AS manager_id,
            e2.first_name AS manager_first,
            e2.last_name AS manager_last
            FROM employee e1
            LEFT JOIN employee e2 ON e1.manager = e2.id
            ORDER BY e2.id;
         `;
                break;
            case 'department':
                query = `
        SELECT e.id AS employee_id,
       e.first_name AS employee_first,
       e.last_name AS employee_last,
       r.title AS role_title,
       d.department_name AS department_name
FROM employee e
LEFT JOIN roles r ON e.role_id = r.id
LEFT JOIN department d ON r.department = d.id
ORDER BY d.department_name;
        `
                break;
            default:
                console.error('Invalid option');
                return;
        }
        const { rows } = await client.query(query);
        console.table(rows);
    } catch (error) {
        console.error('error viewing employees:', error)
    };
    await main();
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
        switch (functMenu.section) {
            case 'Department':
                tableName = 'department';
                columnName = ['department_name']
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


        if (functMenu.action === 'Edit') {

            if (functMenu.section === 'Department') {
                console.log(''),
                    console.log('Please use add or delete'),
                    console.log('')
                await main();
            }

            else if (functMenu.section === 'Roles') {
                console.log('')
                console.log('Please use add or delete')
                console.log('')
                await main();
            }

            else if (functMenu.section === 'Employee') {
                const employee = await getEmployee()
                const editMenu = await inquirer.prompt([
                    {
                        type: 'list',
                        message: `Which employee would you like to edit?`,
                        choices: employee.map(employee => employee.name),
                        name: 'employeeChange',
                    },
                    {
                        type: 'list',
                        message: `What would you like to change?`,
                        choices: ['Employee_role', 'Employee_manager'],
                        name: 'userChoice',
                    }]);
                if (editMenu.userChoice === 'Employee_role') {
                    const employee = editMenu.employeeChange;
                    const roles = await getRoles();

                    const editRolePrompt = await inquirer.prompt([
                        {
                            type: 'list',
                            message: 'What role would you like to assign to them?',
                            choices: roles.map(role => ({ name: role.name, value: role.id })),
                            name: 'roleChange',
                        },
                    ]);
                    const roleChange = editRolePrompt.roleChange;

                    const selectedEmployee = editMenu.employeeChange;
                    const employeeId = selectedEmployee.value;

                    const updateQuery = 'UPDATE employee SET role_id = $1 WHERE id = $2';
                    const updateValues = [roleChange, employeeId];
                    await client.query(updateQuery, updateValues);

                    console.log('Employee role updated successfully!');
                    console.log('');
                }
                else if (editMenu.userChoice === 'Employee_manager') {

                    const manager = await getEmployeeWithNone();
                    const managerChoices = manager.map(mgr => ({ name: mgr.name, value: mgr.value }))

                    const managerChangePrompt = await inquirer.prompt([
                        {
                            type: 'list',
                            message: 'What manager would you like to assign to them?',
                            choices: managerChoices.map(choice => choice.name),
                            name: 'selectedManagerName',
                        },
                    ]);


                    const selectedManagerName = managerChangePrompt.selectedManagerName;
                    const selectedManager = managerChoices.find(choice => choice.name === selectedManagerName);
                    const newManagerId = selectedManager.value;

                    const selectedEmployeeName = editMenu.employeeChange;
                    const selectedEmployee = employee.find(emp => emp.name === selectedEmployeeName)
                    const employeeId = selectedEmployee ? selectedEmployee.value : null;


                    const updateQuery = 'UPDATE employee SET manager = $1 WHERE id = $2';
                    const updateValues = [newManagerId, employeeId];
                    await client.query(updateQuery, updateValues);

                    console.log('Employee role updated successfully!');
                    console.log('')
                }
            }

        } else if (functMenu.action === 'Delete') {
            if (functMenu.section === 'Department') {

                const department = await getDepartment();
                const deleteMenu = await inquirer.prompt([
                    {
                        type: 'list',
                        message: `Which department would you like to delete?`,
                        choices: department.map(department => department.name),
                        name: 'departmentName',
                    }
                ]);
                const query = `DELETE FROM department WHERE department_name = $1`;
                const values = [deleteMenu.departmentName];

                await client.query(query, values);

                console.log(`Record deleted from departments.`);
                console.log('');
            }
            else if (functMenu.section === 'Roles') {

                const roles = await getRoles();
                const deleteMenu = await inquirer.prompt([
                    {
                        type: 'list',
                        message: `Which role would you like to delete?`,
                        choices: roles.map(roles => roles.name),
                        name: 'rolesName',
                    }
                ]);
                const query = `DELETE FROM roles WHERE title = $1`;
                const values = [deleteMenu.rolesName];

                await client.query(query, values);

                console.log(`Record deleted from roles.`)
                console.log('');
            }
            else if (functMenu.section === 'Employee') {

                const employee = await getEmployee();
                const deleteMenu = await inquirer.prompt([
                    {
                        type: 'list',
                        message: `Which employee would you like to delete?`,
                        choices: employee.map(employee => employee.name),
                        name: 'employeeName',
                    }
                ]);
                const selectedEmployee = employee.find(emp => emp.name === deleteMenu.employeeName)

                if (selectedEmployee) {
                    const employeeId = selectedEmployee.value;

                    const query = `DELETE FROM employee WHERE id = $1`;
                    const values = [employeeId];

                    await client.query(query, values);

                    console.log(`Record deleted from employees.`)
                    console.log('');
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
    await main();
}

//quit application
function quitApp() {
    console.log('Exiting the Application...');
    client.end();
};

main();