const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

//Creates a list of prompts that a user will choose
async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "View Departments",
          value: "VIEW_DEPARTMENT"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_ROLES":
      return viewRoles();
    case "VIEW_DEPARTMENT":
      return viewDepartment()
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager()
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "ADD_ROLE":
      return addRole();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "REMOVE_ROLE":
      return removeRole();
    case "REMOVE_DEPARTMENT":
      return removeDepartment();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager()
    default:
      return quit();
  }
}

//Whichever prompt a user chooses will direct them to one of the following functions

// View Employees Prompt
async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

//View Department Propmt
async function viewDepartment() {
  const departments = await db.findAllDepartments();

  console.log("\n");
  console.table(departments);

  loadMainPrompts();
}

//View Roles Prompt
async function viewRoles() {
  const roles = await db.findAllRoles();

  console.log("\n");
  console.table(roles);

  loadMainPrompts();
}

//Add Employee Prompt
async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });

  employee.manager_id = managerId;

  await db.createEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  loadMainPrompts();
}

//Add Department Prompt
async function addDepartment() {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({ id, name }) => (
    {
      name: name,
      value: id
    }));
  const role = await prompt([
    {
      name: "title",
      message: "What is the new departments name?"
    }
  ]);
  await db.createDepartment(department);
  console.log("Added $(department.title) to the database")


}

//Add Role Prompt
async function addRole() {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({ id, name }) => (
    {
      name: name,
      value: id
    }));
  const role = await prompt([
    {
      name: "title",
      message: "What is the new roles name?"
    },
    {
      name: "salary",
      message: "What is the salary of the new role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "What department does the role belong to?",
      choices: departmentChoices
    },
  ]);
  await db.createRole(role);
  console.log("Added $(role.title) to the database")
}

//Remove Employee Prompt
async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}

//Remove Department Prompt
async function removeDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department do you want to remove?",
      choices: departmentChoices
    }
  ]);

  await db.removeDepartment(departmentId);

  console.log("Removed department from the database");

  loadMainPrompts();
}

//Remove Role Prompt
async function removeRole() {
  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to remove?",
      choices: roleChoices
    }
  ]);

  await db.removeRole(roleId);

  console.log("Removed role from the database");

  loadMainPrompts();
}

//Update Employee Prompt
async function updateEmployeeRole() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  loadMainPrompts();
}

//Update Employee Manager Prompt
async function updateEmployeeManager(){
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices
    }
  ]);

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "manager_Id",
      message: "Which manager do you want to assign the selected employee?",
      choices: employeeChoices
    }
  ]);

  await db.updateEmployeeManager(manager_Id, employeeId);

  console.log("Updated employee's manager");

  loadMainPrompts();
}

//Quit Prompt
function quit() {
  console.log("Goodbye!");
  process.exit();
}
