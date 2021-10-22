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