import { projectsArray, Projects, Todos } from "./Todos";
import deleteIcon from "../images/delete.svg";
import editIcon from "../images/edit.svg";
import { setError, setSuccess } from "./validateForm";
import { startOfDay, isBefore, isToday, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

function clearContent(content) {
  const parent = content.parentNode;
  parent.removeChild(content);
}

function ProjectElements() {
  const createProjectButton = (projectName) => {
    const projectButtonContainer = document.createElement("div");
    projectButtonContainer.classList.add("project_btn_container");
    const projectButton = document.createElement("button");
    projectButton.classList.add("project_btn");
    projectButton.setAttribute("id", "project_btn");
    projectButton.setAttribute("type", "button");
    projectButton.textContent = projectName;
    const deleteProjectButtonElement = document.createElement("button");
    deleteProjectButtonElement.classList.add("delete_project_btn");
    deleteProjectButtonElement.setAttribute("id", "delete_project_button");
    deleteProjectButtonElement.setAttribute("type", "button");
    deleteProjectButtonElement.setAttribute("data-id", "button");
    projectButtonContainer.appendChild(projectButton);
    projectButtonContainer.appendChild(deleteProjectButtonElement);
    const deleteIconImage = new Image();
    deleteIconImage.src = deleteIcon;
    deleteProjectButtonElement.appendChild(deleteIconImage);
    return projectButtonContainer;
  };

  const appendProjectButton = (projectButton) => {
    const projectBtnDiv = document.querySelector(
      "[data-id = projects-btns-div]"
    );
    projectBtnDiv.appendChild(projectButton);
  };

  const displayProjects = (arr) => {
    for (const project of arr) {
      const newProjectButton = createProjectButton(project.projectName);
      appendProjectButton(newProjectButton);
    }
  };

  const createNewProjectForm = () => {
    const projectForm = document.createElement("form");
    projectForm.classList.add("project_form");
    const projectTitle = document.createElement("input");
    projectTitle.setAttribute("type", "text");
    projectTitle.setAttribute("id", "project_title");
    projectTitle.setAttribute("name", "project_title");
    projectTitle.setAttribute("placeholder", "Enter project title...");
    const buttonControl = document.createElement("div");
    buttonControl.classList.add("project_btns_control");
    const submitProjectBtn = document.createElement("button");
    submitProjectBtn.classList.add("submit_project");
    submitProjectBtn.setAttribute("id", "submit_project_btn");
    submitProjectBtn.textContent = "Submit";
    const cancelProjectBtn = document.createElement("button");
    cancelProjectBtn.classList.add("cancel_project");
    cancelProjectBtn.setAttribute("id", "cancel_project");
    cancelProjectBtn.textContent = "Cancel";
    buttonControl.appendChild(submitProjectBtn);
    buttonControl.appendChild(cancelProjectBtn);
    projectForm.appendChild(projectTitle);
    projectForm.appendChild(buttonControl);
    return projectForm;
  };

  const validateInput = () => {
    const projectTitleInput = document.getElementById("project_title");
    const projectTitle = projectTitleInput.value.trim();

    if (projectTitle === "") return false;
    return true;
  };

  const closeProjectForm = (element) => {
    const cancelButton = document.getElementById("cancel_project");
    cancelButton.addEventListener("click", (e) => {
      e.preventDefault();
      const addProjectButton = document.getElementById("add_project");
      addProjectButton.classList.remove("hide");
      clearContent(element);
    });
  };

  const appendProjectForm = () => {
    const projectsContainer = document.getElementById("projects");
    projectsContainer.appendChild(createNewProjectForm());
    const projectForm = document.querySelector(".project_form");
    const cancelButton = document.getElementById("cancel_project");
    submitProject();
    closeProjectForm(projectForm);
  };

  const switchElementStatus = (elementStatus, value) => {
    elementStatus = value;
  };

  const getDeleteButtons = () => {
    return Array.from(document.querySelectorAll("#delete_project_button"));
  };

  const addIndexToDeleteButtons = () => {
    const deleteButtons = getDeleteButtons();
    deleteButtons.forEach((button, index) => {
      button.setAttribute("data-index", `${index}`);
    });
  };

  const removeProjectButton = () => {
    const parent = document.querySelector("[data-id = projects-btns-div]");
    addIndexToDeleteButtons();
    parent.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        const buttonToRemove = e.target.parentNode.parentNode;
        const buttonPosition = parseInt(e.target.parentNode.dataset.index);
        clearContent(buttonToRemove);
        Projects().deleteProject(buttonPosition);
      }
    });
  };

  const submitProject = () => {
    const projectForm = document.querySelector(".project_form");
    projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateInput()) return false;
      const projectTitle = document.getElementById("project_title").value;
      const newProject = Projects().createProject(projectTitle);
      newProject.storeProject();
      const newProjectButton = createProjectButton(projectTitle);
      appendProjectButton(newProjectButton);
      clearContent(projectForm);
      const addProjectButton = document.getElementById("add_project");
      addProjectButton.classList.remove("hide");
    });
  };

  const getProjectButtons = () => {
    return Array.from(document.querySelectorAll("#project_btn"));
  };

  return {
    displayProjects,
    removeProjectButton,
    switchElementStatus,
    getProjectButtons,
    appendProjectForm,
  };
}

ProjectElements().displayProjects(projectsArray);
ProjectElements().removeProjectButton();

const addProjectButton = document.getElementById("add_project");
addProjectButton.addEventListener("click", (e) => {
  ProjectElements().appendProjectForm();
  addProjectButton.classList.add("hide");
});

(function TodoElements() {
  let activeProject = null;
  let editId = null;
  let edit = false;
  let todoBtn = false;
  const switchActiveProject = (value) => {
    activeProject = value;
  };
  const getActiveProject = () => activeProject;
  const createTodoForm = (titleValue, descriptionValue, dueDateValue) => {
    const todoForm = document.createElement("form");
    const legend = document.createElement("legend");
    const fieldsetDiv = document.createElement("div");
    fieldsetDiv.classList.add("fieldset");
    legend.classList.add("legend");
    legend.textContent = "Todo Info";
    todoForm.classList.add("todo_form");
    const titleInputControl = document.createElement("div");
    titleInputControl.classList.add("input_control");
    const todoTitleLable = document.createElement("label");
    todoTitleLable.setAttribute("for", "todo_title");
    todoTitleLable.textContent = "Title";
    const todoTitle = document.createElement("input");
    todoTitle.setAttribute("type", "input");
    todoTitle.setAttribute("id", "todo_title");
    todoTitle.setAttribute("name", "todo_title");
    todoTitle.classList.add("todo_title");
    todoTitle.value = titleValue;
    const titleErrorDiv = document.createElement("div");
    titleErrorDiv.classList.add("error");
    const descriptionControl = document.createElement("div");
    descriptionControl.classList.add("input_control");
    const todoDescriptionLable = document.createElement("label");
    todoDescriptionLable.setAttribute("for", "todo_description");
    todoDescriptionLable.textContent = "Description";
    const todoDescription = document.createElement("textarea");
    todoDescription.setAttribute("id", "todo_description");
    todoDescription.setAttribute("name", "todo_description");
    todoDescription.classList.add("todo_description");
    todoDescription.value = descriptionValue;
    const descriptionErrorDiv = document.createElement("div");
    descriptionErrorDiv.classList.add("error");
    const dueDateControl = document.createElement("div");
    dueDateControl.classList.add("input_control");
    const todoDueDateLable = document.createElement("label");
    todoDueDateLable.setAttribute("for", "todo_duedate");
    todoDueDateLable.textContent = "Due date";
    const todoDueDate = document.createElement("input");
    todoDueDate.setAttribute("type", "date");
    todoDueDate.setAttribute("id", "todo_duedate");
    todoDueDate.setAttribute("name", "todo_duedate");
    todoDueDate.value = dueDateValue;
    const dueDateErrorDiv = document.createElement("div");
    dueDateErrorDiv.classList.add("error");
    const priorityControl = document.createElement("div");
    priorityControl.classList.add("input_control");
    const todoPriorityLable = document.createElement("label");
    todoPriorityLable.setAttribute("for", "todo_priority");
    todoPriorityLable.textContent = "Priority";
    const todoPriority = document.createElement("select");
    todoPriority.setAttribute("id", "todo_priority");
    const highPriority = document.createElement("option");
    highPriority.setAttribute("value", "High");
    highPriority.textContent = "High";
    const mediumPriority = document.createElement("option");
    mediumPriority.setAttribute("value", "Medium");
    mediumPriority.textContent = "Medium";
    const lowPriority = document.createElement("option");
    lowPriority.setAttribute("value", "Low");
    lowPriority.textContent = "Low";
    const submitTodoBtn = document.createElement("button");
    submitTodoBtn.classList.add("submit_todo");
    submitTodoBtn.setAttribute("id", "submit_todo_btn");
    submitTodoBtn.textContent = "Submit";
    const cancelTodoBtn = document.createElement("button");
    cancelTodoBtn.classList.add("cancel_todo");
    cancelTodoBtn.setAttribute("id", "cancel_todo_btn");
    cancelTodoBtn.textContent = "Cancel";
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("btn_box");
    buttonContainer.appendChild(submitTodoBtn);
    buttonContainer.appendChild(cancelTodoBtn);

    todoPriority.appendChild(highPriority);
    todoPriority.appendChild(mediumPriority);
    todoPriority.appendChild(lowPriority);
    titleInputControl.appendChild(todoTitleLable);
    titleInputControl.appendChild(todoTitle);
    titleInputControl.appendChild(titleErrorDiv);
    descriptionControl.appendChild(todoDescriptionLable);
    descriptionControl.appendChild(todoDescription);
    descriptionControl.appendChild(descriptionErrorDiv);
    dueDateControl.appendChild(todoDueDateLable);
    dueDateControl.appendChild(todoDueDate);
    dueDateControl.appendChild(dueDateErrorDiv);
    priorityControl.appendChild(todoPriorityLable);
    priorityControl.appendChild(todoPriority);
    todoForm.appendChild(legend);
    fieldsetDiv.appendChild(titleInputControl);
    fieldsetDiv.appendChild(descriptionControl);
    fieldsetDiv.appendChild(dueDateControl);
    fieldsetDiv.appendChild(priorityControl);
    fieldsetDiv.appendChild(buttonContainer);
    todoForm.appendChild(fieldsetDiv);

    return todoForm;
  };

  const appendTodoForm = (form) => {
    console.log(edit)
    const mainTodosWrapper = document.getElementById("todos_wrapper");
    mainTodosWrapper.appendChild(form);
    closeTodoForm(form);
    submitTodo();
  };

  const createNewTodoButton = () => {
    const newTodoButton = document.createElement("button");
    newTodoButton.textContent = "New Todo";
    newTodoButton.setAttribute("type", "button");
    newTodoButton.setAttribute("id", "new_todo_btn");
    newTodoButton.classList.add("new_todo_btn");
    newTodoButton.classList.add("add_style");
    return newTodoButton;
  };

  const appendNewTodoButton = () => {
    const newTodoButton = createNewTodoButton();
    const mainTodosWrapper = document.getElementById("todos_wrapper");
    mainTodosWrapper.appendChild(newTodoButton);
    newTodoButton.addEventListener("click", function () {
      const todoForm = createTodoForm("", "", "");
      appendTodoForm(todoForm);
      newTodoButton.classList.add("hide");
    });
  };

  const projectBtnsContanier = document.querySelector(
    "[data-id = projects-btns-div]"
  );
  projectBtnsContanier.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const parent = e.target.parentNode.parentNode;
      switchActiveProject(e.target.textContent);
      if (!todoBtn) {
        appendNewTodoButton();
        todoBtn = true;
      }
      const filterdArr = Todos().filterTodos(getActiveProject());
      clearGrid();
      showTodos(filterdArr);
      changeHeader(e.target.textContent);
    }
  });

  function clearGrid() {
    const grid = getGridElement();
    grid.innerHTML = "";
  }

  const checkArrayLength = (arr, value) => {
    if (arr.length === 0) {
      changeHeader(value);
      return true;
    }
    return false;
  };

  function isCurrentWeek(date) {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    return isWithinInterval(date, {start, end});
  }

  const navBtnsContainer = document.querySelector(".home-nav-btns");
  navBtnsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      todoBtn = false;
      if (document.getElementById("new_todo_btn") !== null) {
        const button = document.getElementById("new_todo_btn")
        clearContent(button);
      };
      clearGrid();
      switch (e.target.textContent) {
        case "All Tasks":
          let allTasks = [];
          for (const project of projectsArray) {
            for (const todo of project.todoList) {
              allTasks.push(todo);
            }
          }
          if (!checkArrayLength(allTasks, "There are no available tasks")) {
            showTodos(allTasks);
            changeHeader("All Tasks");
          }
          break;
        case "Today":
          let todaysTasks = [];
          for (const project of projectsArray) {
            for (const todo of project.todoList) {
              if (isToday(startOfDay(todo.dueDate))) {
                todaysTasks.push(todo);
              }
            }
          }
          if (!checkArrayLength(todaysTasks, "There are no tasks due today")) {
            showTodos(todaysTasks);
            changeHeader("Today");
          }
          break;
        case "This Week":
          let thisWeekTasks = [];
          for (const project of projectsArray) {
            for (const todo of project.todoList) {
              if (isCurrentWeek(todo.dueDate)) {
                thisWeekTasks.push(todo);
              }
            }
          }
          if (!checkArrayLength(thisWeekTasks, "There are no tasks due this week")) {
            showTodos(thisWeekTasks);
            changeHeader("This Week");
          }
          break;
        case "Completed":
          let completedTasks = [];
          for (const project of projectsArray) {
            for (const todo of project.todoList) {
              if (todo.status === "completed") {
                completedTasks.push(todo);
              }
            }
          }
          if (!checkArrayLength(completedTasks, "There are no completed tasks")) {
            showTodos(completedTasks);
            changeHeader("Completed Tasks");
          }
          break;
        default:
          let importantTasks = [];
          for (const project of projectsArray) {
            for (const todo of project.todoList) {
              if (todo.priority === "High") {
                importantTasks.push(todo);
              }
            }
          }
          if (!checkArrayLength(importantTasks, "There are no important tasks")) {
            showTodos(importantTasks);
            changeHeader("Important");
          }
      }
    }
  });

  const changeHeader = (value) => {
    const header = document.querySelector(".project-header");
    header.textContent = value;
  };

  const showTodos = (arr) => {
    for (const todo of arr) {
      if (arr.length === 0) {
        return;
      } else {
        const todoElement = createTodoElement(
          todo.title,
          todo.description,
          todo.dueDate,
          todo.priority,
          todo.project
        );
        appendTodoElement(todoElement);
      }
    }
  };

  function displayInitialTasks() {
    const arr = [];
    for (const project of projectsArray) {
      for (const todo of project.todoList) {
        arr.push(todo);
      }
    }
    showTodos(arr);
  }
  
  const validateInputs = () => {
    const todoTitleInput = document.getElementById("todo_title");
    const todoDescriptionTextarea = document.getElementById("todo_description");
    const todoDueDateInput = document.getElementById("todo_duedate");

    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionTextarea.value.trim();
    const dueDate = todoDueDateInput.value.trim();
    const selectedDate = startOfDay(dueDate);
    const currentDate = startOfDay(new Date());

    if (todoTitle === "") {
      setError(todoTitleInput, "Todo title is required");
      return false;
    } else {
      setSuccess(todoTitleInput);
    }

    if (todoDescription === "") {
      setError(todoDescriptionTextarea, "Todo description is required");
      return false;
    } else {
      setSuccess(todoDescriptionTextarea);
    }
    if (edit) {
      if (dueDate === "") {
        setError(todoDueDateInput, "Due date is required");
        return false;
      } else if (isBefore(selectedDate, currentDate)) {
        setError(todoDueDateInput, "Invalid date, must be a future date");
        return false;
      } else {
        setSuccess(todoDueDateInput);
      }
      
    }

    return true;
  };

  let inputValues = [];

  const saveValues = (title, description, date, priority) => {
    inputValues = [title, description, date, priority];
  };
  const getInputValues = () => inputValues;

  const submitTodo = () => {
    const todoForm = document.querySelector(".todo_form");
    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const todoTitleInput = document.getElementById("todo_title");
      const todoDescriptionTextarea =
        document.getElementById("todo_description");
      const todoDueDateInput = document.getElementById("todo_duedate");
      const todoPrioritySelect = document.getElementById("todo_priority");
      const todoForm = document.querySelector(".todo_form");

      const todoTitle = todoTitleInput.value;
      const todoDescription = todoDescriptionTextarea.value;
      const dueDate = todoDueDateInput.value;
        const priority = todoPrioritySelect.value;
        const projectName = getActiveProject();
        if (!edit) {
          if (validateInputs()) {
            const todo = Todos().createTodo(
              todoTitle,
              todoDescription,
              dueDate,
              priority,
              projectName,
              "pending",
              todoTitle
            );
            todo.storeTodo();
            const todoElement = createTodoElement(
              todoTitle,
              todoDescription,
              dueDate,
              priority,
              projectName
            );
            appendTodoElement(todoElement);
            clearContent(todoForm);
            const newTodoButton = document.getElementById("new_todo_btn");
            if (newTodoButton) {
              newTodoButton.classList.remove("hide");
            }
          }
        } else if (edit) {
          saveValues(todoTitle, todoDescription, dueDate, priority)
          const [title, description, date, importance] = getInputValues();
          Todos().editTodo(
            findTodoPosition(editId),
            title,
            description,
            date,
            importance,
            getActiveProject()
          );
          editTodoElement(title, description, date, importance);
          clearContent(todoForm);
          const newTodoButton = document.getElementById("new_todo_btn");
          if (newTodoButton) {
            newTodoButton.classList.remove("hide");
          }
        }
        if (edit) {
          edit = false;
        }
    });
  };

  const closeTodoForm = (element) => {
    const cancelButton = document.getElementById("cancel_todo_btn");
    cancelButton.addEventListener("click", (e) => {
      e.preventDefault();
      const newTodoButton = document.getElementById("new_todo_btn");
      if (newTodoButton) {
        newTodoButton.classList.remove("hide");
      }
      clearContent(element);
      edit = false;
    });
  };

  const createTodoElement = (
    titleValue,
    descriptionValue,
    dateValue,
    priorityValue,
    projectName
  ) => {
    const todoElement = document.createElement("article");
    const todoContainer = document.createElement("div");
    todoContainer.classList.add("todo-container");
    todoContainer.setAttribute("project-id", `${projectName}`);
    const border = document.createElement("div");
    border.classList.add("border");
    todoElement.classList.add("todo_article");
    const title = document.createElement("h3");
    title.textContent = titleValue;
    todoElement.setAttribute("id", `${title.textContent}`);
    const description = document.createElement("p");
    const descriptionHeader = document.createElement("span");
    const descriptionControl = document.createElement("div");
    descriptionControl.classList.add("element_container");
    descriptionHeader.textContent = "Description: ";
    description.textContent = descriptionValue;
    const date = document.createElement("span");
    const dateHeader = document.createElement("span");
    const dateControl = document.createElement("div");
    dateControl.classList.add("element_container");
    dateHeader.textContent = "Due date: ";
    date.textContent = dateValue;
    const priority = document.createElement("span");
    const priorityHeader = document.createElement("span");
    const priorityControl = document.createElement("div");
    priorityControl.classList.add("element_container");
    priorityHeader.textContent = "Priority: ";
    priority.textContent = priorityValue;

    const controls = document.createElement("div");
    controls.classList.add("controls");
    const checkInput = document.createElement("input");
    checkInput.setAttribute("type", "checkbox");
    checkInput.setAttribute("name", "status");
    checkInput.setAttribute("id", "status");
    const deleteTodoBtn = new Image();
    deleteTodoBtn.src = deleteIcon;
    deleteTodoBtn.setAttribute("data-id", "delete_todo_btn");
    const editTodoBtn = new Image();
    editTodoBtn.src = editIcon;
    editTodoBtn.setAttribute("data-id", "edit_todo_btn");

    descriptionControl.appendChild(descriptionHeader);
    descriptionControl.appendChild(description);
    dateControl.appendChild(dateHeader);
    dateControl.appendChild(date);
    priorityControl.appendChild(priorityHeader);
    priorityControl.appendChild(priority);
    controls.appendChild(checkInput);
    controls.appendChild(editTodoBtn);
    controls.appendChild(deleteTodoBtn);
    todoContainer.appendChild(border);
    todoElement.appendChild(title);
    todoElement.appendChild(descriptionControl);
    todoElement.appendChild(dateControl);
    todoElement.appendChild(priorityControl);
    todoElement.appendChild(controls);
    todoContainer.appendChild(todoElement);

    showPriority(border, priorityValue)

    if (checkStatus(projectName).includes(titleValue)) {
      todoContainer.classList.add("checked");
    }
    return todoContainer;
  };

  const appendTodoElement = (todo) => {
    const gridContainer = getGridElement();
    gridContainer.appendChild(todo);
  };

  const showPriority = (borderElement, priority) => {
    switch (priority) {
      case "High":
        borderElement.style.backgroundColor = "red";
        break;
      case "Medium":
        borderElement.style.backgroundColor = "#1C39BB";
        break;
      case "Low":
        borderElement.style.backgroundColor = "yellow";
    }
  };

  const findTodoPosition = (id) => {
    for (const project of projectsArray) {
      const index = project.todoList.findIndex((todo) => {
        return todo.id === id;
      });
      return index;
    }
  };

  const removeTodoElement = () => {
    const gridContainer = getGridElement();
    gridContainer.addEventListener("click", (e) => {
      if (
        e.target.tagName === "IMG" &&
        e.target.dataset.id === "delete_todo_btn"
      ) {
        const todoToRemove = e.target.parentNode.parentNode.parentNode;
        const projectName = todoToRemove.getAttribute("project-id");
        const todoId = getTodoId(e);
        Todos().deleteTodo(projectName, findTodoPosition(todoId));
        clearContent(todoToRemove);
      }
    });
  };

  const strikeTodoElement = () => {
    const gridContainer = getGridElement();
    gridContainer.addEventListener("click", (e) => {
      if (e.target.type === "checkbox") {
        const todoArticle = e.target.parentNode.parentNode.parentNode;
        todoArticle.classList.toggle("checked");
        const todoId = getTodoId(e);
        const projectName = todoArticle.getAttribute("project-id");
        if (e.target.checked) {
          Todos().changeTodoStatus(
            findTodoPosition(todoId),
            "completed",
            projectName
          );
        } else {
          Todos().changeTodoStatus(
            findTodoPosition(todoId),
            "pending",
            projectName
          );
        }
      }
    });
  };

  const checkStatus = (projectName) => {
    const filterData = [];
    for (const project of projectsArray) {
      for (const todo of project.todoList) {
        if (todo.status === "completed" && todo.project === projectName) {
          filterData.push(todo.id)
        }
      }
    }
    return filterData;
  }

  const getGridElement = () => document.getElementById("grid");

  const gridContainer = getGridElement();
  gridContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" && e.target.dataset.id === "edit_todo_btn") {
      const parent = e.target.parentNode.parentNode;
      const title = parent.children[0].textContent;
      const text = parent.children[1].children[1].textContent;
      const date = parent.children[2].children[1].textContent;
      const importance = parent.children[3].children[1].textContent;
      saveValues(title, text, date, importance);
      const inputValues = getInputValues();
      const todoForm = createTodoForm(
        inputValues[0],
        inputValues[1],
        inputValues[2]
      );
      appendTodoForm(todoForm);
      parent.classList.add("edit");
      editId = getTodoId(e);
      edit = true;
    }
  });

  const editTodoElement = (title, description, date, importance) => {
    const todoItems = document.querySelectorAll(".todo_article");
    todoItems.forEach((todo) => {
      if (todo.classList.contains("edit")) {
        const border = todo.parentNode.firstChild;
        const todoTitle = todo.children[0];
        const todoDescription = todo.children[1].children[1];
        const todoDate = todo.children[2].children[1];
        const priority = todo.children[3].children[1];
        todoTitle.textContent = title;
        todoDescription.textContent = description;
        todoDate.textContent = date;
        priority.textContent = importance;
        showPriority(border, importance);
      }
    });
  };

  const getTodoId = (e) => e.target.parentNode.parentNode.getAttribute("id");

  strikeTodoElement();
  removeTodoElement();
  displayInitialTasks();
})();
