DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

\c company_db

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(30)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title   VARCHAR(30),
    salary DECIMAL,
    department INTEGER,
    FOREIGN KEY (department) REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id)
    FOREIGN KEY (manager) REFERENCES employee(id)
);
