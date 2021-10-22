-- View Employees
SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee,role.title AS "Job Title",department.name AS Department,role.salary AS Salary,CONCAT(e.first_name, " ", e.last_name) as Manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee e ON employee.manager_id = e.id;

-- View Departments
SELECT id as ID, name AS "Department Name"
FROM department;

-- View Roles
SELECT role.id AS ID, role.title as "Job Title", department.name AS Department, role.salary AS Salary
FROM role
JOIN department ON role.department_id = department.id;