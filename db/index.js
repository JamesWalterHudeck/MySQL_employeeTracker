const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  findAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }
  findAllRoles(){
    return this.connection.query(
      "SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }
  findAllDepartments(){
    return this.connection.query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
      );
  }
  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }
  createRole(role){ 
    return this.connection.query("INSERT INTO role SET ?", role);
  }
  createDepartment(department){ 
    return this.connection.query("INSERT INTO department SET ?", department);
  }
  removeEmployee(employeeId) {
    return this.connection.query(
      "DELETE FROM employee WHERE id = ?", employeeId);
  }
  removeRole(roleId) {
    return this.connection.query(
      "DELETE FROM role WHERE id = ?", roleId);
  }
  removeDepartment(departmentId) {
    return this.connection.query(
      "DELETE FROM department WHERE id = ?", departmentId);
  }
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
  }
  updateEmployeeManager(employeeId, manager_Id) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?", [manager_Id, employeeId]);
  }
};


module.exports = new DB(connection);
