DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);

USE company_db;

INSERT INTO department (name)
    VALUES
    ("Sales"),
    ("Legal"),
    ("Engineering");

INSERT INTO role (title,salary,department_id)
    VALUES
    ("Lead Sales",200000,1),
    ("Salesperson",100000,1),
    ("Legal Team Lead",300000,2),
    ("Lawyer",200000,2),
    ("Lead Engineer",200000,3),
    ("Engineer",100000,3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
    VALUES
    ("Nina","Winston",1,null),
    ("Giuliana","Kaloyanov",2,1),
    ("Wilheard","Alamilla",2,1),
    ("Chand","Van Kann",3,null),
    ("Frances","Kavanaugh",4,4),
    ("Whitney","Tuft",4,4),
    ("Hilda","Nurmi",5,null),
    ("Chea","Langbroek",6,7),
    ("Ashraqat","Somma",6,7);