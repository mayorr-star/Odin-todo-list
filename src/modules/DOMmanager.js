import { projectsArray, Projects, Todos } from "./Todos";
import deleteIcon from "../images/delete.svg";
import editIcon from "../images/edit.svg";
import { setError, setSuccess } from "./validateForm";

function clearContent(content) {
  const parent = content.parentNode;
  parent.removeChild(content);
}

function ProjectElements() {
  let projectFormActive = false;
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
  
  const cancelProject = (element, button, elementStatus) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("cancel_project")) {
        const addProjectButton = document.getElementById("add_project");
        addProjectButton.classList.remove("hide");
      }
      clearContent(element);
      projectFormActive = false;
    });
  };
  
  const appendProjectForm = () => {
    const projectsContainer = document.getElementById("projects");
    projectsContainer.appendChild(createNewProjectForm());
    const projectForm = document.querySelector(".project_form");
    const cancelButton = document.getElementById("cancel_project");
    submitProject();
    cancelProject(projectForm, cancelButton, projectFormActive);
  };

  const switchElementStatus = (elementStatus, value) => {
    elementStatus = value;
  };
  
  function projectFormEventListner() {
    const addProjectButton = document.getElementById("add_project");
    addProjectButton.addEventListener("click", () => {
      if (!projectFormActive) {
        appendProjectForm();
        addProjectButton.classList.add("hide");
      }
      projectFormActive = true;
    });
  }
  
  const getDeleteButtons = () => {
    return Array.from(document.querySelectorAll("#delete_project_button"));
  };
  
  const addIndexToDeleteButtons = () => {
    const deleteButtons = getDeleteButtons();
    deleteButtons.forEach((button, index) => {
      button.setAttribute("data-index", `${index}`);
    })
  }

  const removeProjectButton = () => {
    const parent = document.querySelector("[data-id = projects-btns-div]");
    addIndexToDeleteButtons();
    parent.addEventListener("click", e => {
      if (e.target.tagName === "IMG") {
            const buttonToRemove = e.target.parentNode.parentNode;
            const buttonPosition = parseInt(e.target.parentNode.dataset.index);
                clearContent(buttonToRemove);
            Projects().deleteProject(buttonPosition);
      }
    })
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
      projectFormActive = false;
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
    projectFormEventListner,
    switchElementStatus,
    cancelProject,
    getProjectButtons,
  };
}

ProjectElements().displayProjects(projectsArray);
ProjectElements().projectFormEventListner();
ProjectElements().removeProjectButton();

function TodoElements() {
  let todoButtonActive = false;
  let todoFormActive = false;
  let activeProject = null;
  const switchActiveProject = (value) => {
    activeProject = value;
  };
  const getActiveProject = () => activeProject;
  const createTodoForm = (titleValue, descriptionValue, dueDateValue) => {
    const todoForm = document.createElement("form");
    todoForm.classList.add("todo_form");
    const titleInputControl = document.createElement("div");
    titleInputControl.classList.add("input_control");
    const todoTitleLable = document.createElement("label");
    todoTitleLable.setAttribute("for", "todo_title");
    todoTitleLable.textContent = "Title:";
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
    todoDescriptionLable.textContent = "Description:";
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
    todoDueDateLable.textContent = "Due date:";
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
    todoPriorityLable.textContent = "Priority:";
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
    todoForm.appendChild(titleInputControl);
    todoForm.appendChild(descriptionControl);
    todoForm.appendChild(dueDateControl);
    todoForm.appendChild(priorityControl);
    todoForm.appendChild(buttonContainer);

    return todoForm;
  };

  const appendTodoForm = (form) => {
    const mainTodosWrapper = document.getElementById("todos_wrapper");
    mainTodosWrapper.appendChild(form);
    const cancelButton = document.getElementById("cancel_todo_btn");
    ProjectElements().cancelProject(form, cancelButton, todoFormActive);
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
    if (!todoButtonActive) {
      const newTodoButton = createNewTodoButton();
      const mainTodosWrapper = document.getElementById("todos_wrapper");
      mainTodosWrapper.appendChild(newTodoButton);
      newTodoButton.addEventListener("click", function () {
        const todoForm = createTodoForm("", "", "");
        appendTodoForm(todoForm);
      });
    }
    ProjectElements().switchElementStatus(todoButtonActive, true);
  };

  const showTodos = () => {
    const projectButtons = ProjectElements().getProjectButtons();
    projectButtons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        switchActiveProject(e.target.textContent);
        appendNewTodoButton();
      });
    });
  };

  const compareDates = (todaysDate, compareDate) => {
    const todaysDateInMIliseconds = new Date(todaysDate).getTime();
    const compareDateInMIliseconds = new Date(compareDate).getTime();
    if (todaysDateInMIliseconds > compareDateInMIliseconds) {
      return false;
    }
    return true;
  };

  const validateInputs = () => {
    const todoTitleInput = document.getElementById("todo_title");
    const todoDescriptionTextarea = document.getElementById("todo_description");
    const todoDueDateInput = document.getElementById("todo_duedate");
    const todoPrioritySelect = document.getElementById("todo_priority");

    const todoTitle = todoTitleInput.value.trim();
    const todoDescription = todoDescriptionTextarea.value.trim();
    const dueDate = todoDueDateInput.value.trim();
    const selectedDate = new Date(dueDate);
    const currentDate = new Date();
    const priority = todoPrioritySelect.value;

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

    if (dueDate === "") {
      setError(todoDueDateInput, "Due date is required");
      return false;
    } else if (!compareDates(currentDate, selectedDate)) {
      setError(todoDueDateInput, "Invalid date, must be a future date");
      return false;
    } else {
      setSuccess(todoDueDateInput);
    }
    return true;
  };

  let inputValues = [];

  const storeInputValues = (title, description, date) => {
    inputValues = [title, description, date];
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

      if (validateInputs()) {
        const todoTitle = todoTitleInput.value;
        const todoDescription = todoDescriptionTextarea.value;
        const dueDate = todoDueDateInput.value;
        storeInputValues(todoTitle, todoDescription, dueDate);
        const priority = todoPrioritySelect.value;
        const projectName = getActiveProject();
        const todo = Todos().createTodo(
          todoTitle,
          todoDescription,
          dueDate,
          priority,
          projectName
        );
        todo.storeTodo();
        const todoElement = createTodoElement();
        appendTodoElement(todoElement);
        clearContent(todoForm);
      }
    });
  };

  const createTodoElement = () => {
    const todoContainer = document.createElement("article");
    todoContainer.classList.add("todo_article");
    const title = document.createElement("h3");
    title.textContent = document.getElementById("todo_title").value;
    const description = document.createElement("p");
    description.textContent = `Description: ${
      document.getElementById("todo_description").value
    }`;
    const date = document.createElement("span");
    date.textContent = `Due date: ${
      document.getElementById("todo_duedate").value
    }`;
    const priority = document.createElement("span");
    priority.textContent = `Priority: ${
      document.getElementById("todo_priority").value
    }`;

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

    controls.appendChild(checkInput);
    controls.appendChild(editTodoBtn);
    controls.appendChild(deleteTodoBtn);
    todoContainer.appendChild(title);
    todoContainer.appendChild(description);
    todoContainer.appendChild(date);
    todoContainer.appendChild(priority);
    todoContainer.appendChild(controls);
    return todoContainer;
  };

  const appendTodoElement = (todo) => {
    const gridContainer = getGridElement();
    gridContainer.appendChild(todo);
  };

  const findTodoPosition = (title) => {
    for (const project of projectsArray) {
      const index = project.todoList.findIndex((todo) => {
        return todo.title === title;
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
        const todoToRemove = e.target.parentNode.parentNode;
        const title = getTodoTitle(e);
        Todos().deleteTodo(getActiveProject(), findTodoPosition(title));
        clearContent(todoToRemove);
      }
    });
  };

  const strikeTodoElement = () => {
    const gridContainer = getGridElement();
    gridContainer.addEventListener("click", (e) => {
      if (e.target.type === "checkbox") {
        const article = e.target.parentNode.parentNode;
        article.classList.toggle("checked");
        const title = getTodoTitle(e);
        if (e.target.checked) {
          const activeProject = getActiveProject();
          Todos().changeTodoStatus(
            findTodoPosition(title),
            "complete",
            activeProject
          );
        } else {
          Todos().changeTodoStatus(
            findTodoPosition(title),
            "pending",
            activeProject
          );
        }
      }
    });
  };

  const getGridElement = () => document.getElementById("grid");

  const editTodoElement = () => {
    const gridContainer = getGridElement();
    gridContainer.addEventListener("click", (e) => {
      if (
        e.target.tagName === "IMG" &&
        e.target.dataset.id === "edit_todo_btn"
      ) {
        const inputValues = getInputValues();
        const todoForm = createTodoForm(
          inputValues[0],
          inputValues[1],
          inputValues[2]
        );
        appendTodoForm(todoForm);
      }
    });
  };

  const getTodoTitle = (e) =>
    e.target.parentNode.parentNode.firstChild.textContent;

  strikeTodoElement();
  removeTodoElement();
  editTodoElement();

  return { showTodos };
}
// TodoElements().showTodos();
