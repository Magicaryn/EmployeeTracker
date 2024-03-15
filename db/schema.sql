DROP DATABASE IF EXISTS my_company;
CREATE DATABASE my_company;

\c my_company

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
    manager VARCHAR(30),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
