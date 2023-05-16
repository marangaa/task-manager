const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');

// Create a new database instance
const db = new sqlite3.Database('task_management.db', (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Set up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


// Display menu options
const displayMenu = () => {
  console.log('Task Management System');
  console.log('----------------------');
  console.log('1. Create a new task');
  console.log('2. View all tasks');
  console.log('3. Update a task');
  console.log('4. Delete a task');
  console.log('5. Exit');
  console.log('');
};

// Handle user input
const handleUserInput = () => {
  rl.question('Enter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        // Create a new task
        createTask();
        break;
      case '2':
        // View all tasks
        viewTasks();
        break;
      case '3':
        // Update a task
        updateTask();
        break;
      case '4':
        // Delete a task
        deleteTask();
        break;
      case '5':
        // Exit
        exit();
        break;
      default:
        console.log('Invalid choice. Please try again.');
        console.log('');
        handleUserInput();
    }
  });
};


const createTask = () => {
  rl.question('Enter task name: ', (taskName) => {
    rl.question('Enter description: ', (description) => {
      rl.question('Enter due date (YYYY-MM-DD): ', (dueDate) => {
        rl.question('Enter status: ', (status) => {
          const sql = `INSERT INTO tasks (task_name, description, due_date, status) VALUES (?, ?, ?, ?)`;
          const values = [taskName, description, dueDate, status];

          db.run(sql, values, function (err) {
            if (err) {
              console.error(err.message);
              return;
            }
            console.log(`New task with ID ${this.lastID} created.`);
            console.log('');
            handleUserInput();
          });
        });
      });
    });
  });
};


const viewTasks = () => {
  const sql = `SELECT * FROM tasks`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    rows.forEach((row) => {
      console.log(row);
    });
    console.log('');
    handleUserInput();
  });
};


const updateTask = () => {
  rl.question('Enter the task ID to update: ', (taskId) => {
    rl.question('Enter the new status: ', (newStatus) => {
      const sql = `UPDATE tasks SET status = ? WHERE task_id = ?`;
      const values = [newStatus, taskId];

      db.run(sql, values, function (err) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(`Task with ID ${taskId} updated.`);
        console.log('');
        handleUserInput();
      });
    });
  });
};


const deleteTask = () => {
  rl.question('Enter the task ID to delete: ', (taskId) => {
    const sql = `DELETE FROM tasks WHERE task_id = ?`;

    db.run(sql, taskId, function (err) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`Task with ID ${taskId} deleted.`);
      console.log('');
      handleUserInput();
    });
  });
};


const exit = () => {
  console.log('Exiting the application...');
  rl.close();
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Disconnected from the SQLite database.');
    process.exit(0);
  });
};


// Start the application
displayMenu();
handleUserInput();

