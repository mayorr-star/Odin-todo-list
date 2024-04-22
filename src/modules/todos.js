// import { ContextExclusionPlugin } from "webpack";

export const projectsArray = [
  {
    projectName: "Car dashboard",
    todoList: [
      {
        title: "Get dashboard",
        description: "Go to town to  buy dashboard.",
        dueDate: "12 / 02 / 24",
        priority: "High",
        satus: "pending",
        project: "Car dashboard",
        id: "Car dashboard"
      },
      {
        title: "Electrician",
        description: "Call the electrician to come inspect the car.",
        dueDate: "14 / 02 / 24",
        priority: "High",
        satus: "pending",
        project: "Car dashboard",
        id: "Electrician"
      },
    ],
  },
  {
    projectName: "Spanish",
    todoList: [
      {
        title: "Duolingo",
        description: "Download the duolingo app from google play store.",
        dueDate: "5 / 01 / 24",
        priority: "High",
        satus: "pending",
        project: "Spanish",
        id: "Duolingo"
      },
    ],
  },
  {
    projectName: "Ingersoll Rand Compressor",
    todoList: [
      {
        title: "Seal",
        description: "Remove seal and assemble it back again",
        dueDate: "19 / 03 / 24",
        priority: "High",
        satus: "pending",
        project: "Ingersoll Rand Compressor",
        id: "Seal"
      },
    ],
  },
];

export function Projects() {
  class Project {
    constructor(projectName) {
      this.projectName = projectName;
      this.todoList = [];
    }

    storeProject() {
      projectsArray.push(this);
    }
  }

  const createProject = (projectName) => {
    const newProject = new Project(projectName);
    return newProject;
  };

  const deleteProject = (id) => {
    projectsArray.splice(id, 1);
    return projectsArray;
  };

  return { createProject, deleteProject };
}

export function Todos() {
  class Todo {
    constructor(
      title,
      description,
      dueDate,
      priority,
      project,
      status = "pending",
      id
    ) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.status = status;
      this.project = project;
      this.id = id;
    }

    storeTodo() {
      for (const project of projectsArray) {
        if (this.project === project.projectName) {
          project.todoList.push(this);
        }
      }
    }
  }

  const createTodo = (title, description, dueDate, priority, projectName, id) => {
    const newTodo = new Todo(
      title,
      description,
      dueDate,
      priority,
      projectName,
      id
    );
    return newTodo;
  };

  const changeTodoStatus = (todoIndex, value, projectName) => {
    for (const project of projectsArray) {
      for (let i = 0; i < project.todoList.length; i++) {
        const todo = project.todoList[i];
        if (
          todo.status !== value &&
          todoIndex === i &&
          todo.project === projectName
        ) {
          todo.status = value;
        }
      }
    }
  };

  const editTodo = (todoIndex, newTitle, newDescription, newDueDate, newPriority, projectName) => {
    for (const project of projectsArray) {
      if (project.projectName === projectName) {
        for (let i = 0; i < project.todoList.length; i++) {
          const todo = project.todoList[i];
          if (todoIndex === i) {
            todo.title = newTitle;
            todo.description = newDescription;
            todo.dueDate = newDueDate;
            todo.priority = newPriority;
          }
        }
      }
    }
  };

  const deleteTodo = (projectName, index) => {
    for (const project of projectsArray) {
      if (projectName === project.projectName) {
        project.todoList.splice(index, 1);
      }
    }
  };

  const filterTodos = (array, value) => {
    return array.filter((project) => project.projectName === value);
  };

  return {
    filterTodos,
    deleteTodo,
    createTodo,
    editTodo,
    changeTodoStatus,
  };
}