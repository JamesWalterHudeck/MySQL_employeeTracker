const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  //Finds All Employees from employee database
  findAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  //Finds All Roles from employee database
  findAllRoles(){
    return this.connection.query(
      "SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  //Finds All Departments from employee database
  findAllDepartments(){
    return this.connection.query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
      );
  }

  //Creates a new employee in the employee database
  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }

  //Creates a new role in the employee database
  createRole(role){ 
    return this.connection.query("INSERT INTO role SET ?", role);
  }

  //Creates a new department in the employee database
  createDepartment(department){ 
    return this.connection.query("INSERT INTO department SET ?", department);
  }

  //Removes a employee from the employee database
  removeEmployee(employeeId) {
    return this.connection.query(
      "DELETE FROM employee WHERE id = ?", employeeId);
  }

  //Removes a role from the employee database
  removeRole(roleId) {
    return this.connection.query(
      "DELETE FROM role WHERE id = ?", roleId);
  }

  //Removes a department from the employee database
  removeDepartment(departmentId) {
    return this.connection.query(
      "DELETE FROM department WHERE id = ?", departmentId);
  }

  //Updates a role in the employee database
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
  }

  //Updates an employees manager in the employee database
  updateEmployeeManager(employeeId, manager_Id) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?", [manager_Id, employeeId]);
  }
};


module.exports = new DB(connection);
