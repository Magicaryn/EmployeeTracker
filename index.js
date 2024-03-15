const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool(
    {
        user: 'postgres',
        host: 'localhost',
        database: 'my_company',
        password: 'jelly',
    },
    console.log('Connected to the company database.')
)

pool.connect();

function runInquirer() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do? (Use arrow Keys)',
                name: 'selection',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', ' View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
            }
        ])
        .then((answers) => {
            if (answers.choice === 'Add Department') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: 'What is the name of the department?',
                            name: 'newDepartment',
                        },
                    ])
                    .then((answers) => {
                        pool.query('INSERT INTO departments (name) VALUES ($1)'), [answers.department], (err, res) => {
                            if (err) throw err;
                            console.log('Department added successfully');
                            runInquirer();
                        }
                    }
                    )
            } else if (answers.choice === 'Add Role') {
                inquirer
                    .prompt([
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
                            choices: department.map(department => department.department_name),
                        },
                    ])
                    .then((answers) => {
                        pool.query('INSERT INTO roles VALUES ($1, $2, $3)'), [answers.roles], (err, res) => {
                            if (err) throw err;
                            console.log('Role added successfully');
                            runInquirer();
                        }
                    })
            } else if (answers === 'Add Employee') {
                inquirer
                    .prompt([
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
                            name: 'role_id',
                            choices: roles.map(roles => roles.title),

                        },

                        {
                            type: 'input',
                            message: "Who is the employee's manager?",
                            name: 'manager',
                        },
                    ])
                    .then((answers) => {
                        pool.query('INSERT INTO employee VALUES ($1, $2, $3, $4)'), [employee.roles], (err, res) => {
                            if (err) throw err;
                            console.log('Employee added successfully');
                            runInquirer();
                        }
                    })
            } else if (answers.choice === 'View All Departments') {
                const query = 'SELECT * FROM departments'
                pool.query(query)
                    .then((result) => {
                        const departments = result.rows;
                        if (departments.length === 0) {
                            console.log('No departments found.');
                        } else {
                            console.log('List of Departments:');
                            departments.forEach(department => {
                                console.log(`${department.id}: ${department.name}`);
                            });
                        }
                        runInquirer();
                    })

            }



        })
}
runInquirer()