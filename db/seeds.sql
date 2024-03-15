INSERT INTO department (department_name) 
VALUES  ('human resources'),
        ('maintenance'),
        ('customer service'),
        ('supervisor'),
        ('landscaper');

INSERT INTO roles (title, salary, department) 
VALUES  ('payroll', 62000, 1),
        ('plumber', 67000, 2),
        ('lead plumber', 70000, 4),
        ('weeder', 48000, 5),
        ('cashier', 27000, 3),
        ('lead cashier', 32000, 4);




INSERT INTO employee (first_name, last_name, role_id, manager) 
VALUES  ('John', 'Lennon', 1, 'The Man'),
        ('Eren', 'Yeager', 4, 'YMIR'),
        ('caryn', 'behnke', 5, 'Emma');