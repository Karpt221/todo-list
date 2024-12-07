import { generateToDo } from "./TodoView.js";
import { generateProject } from "./ProjectView.js";

export class ProjectsView {
    static #instance = null;

    constructor(projectsController) {
        if (ProjectsView.#instance) {
            throw new Error("ProjectsView instance already exists! Use ProjectsView.getInstance().");
        }
        this.projectsController = projectsController;

        //ToDo details modal elements
        this.todoDetailsDialog = document.querySelector(".todo-details-modal");
        this.closeToDoDetailsBtn = document.querySelector(".close-todo-details-btn");
        this.todoDetailsTitle = document.querySelector(".todo-details-title");
        this.todoDetailsDuration = document.querySelector(".todo-details-description");
        this.todoDetailsDueDate = document.querySelector(".todo-details-duedate");
        this.todoDetailsPriority = document.querySelector(".todo-details-priority");
        this.todoDetailsProject = document.querySelector(".todo-details-project");

        // ToDo Modal elements  
        this.todoDialog = document.querySelector(".add-todo-modal");
        this.openToDoModalBtn = document.querySelector('.open-todo-modal-btn');
        this.closeToDoModalBtn = document.querySelector('.close-todo-modal-btn');
        this.modalTodoTitle = document.querySelector("#modal-todo-title");
        this.modalTodoDescription = document.querySelector("#modal-todo-description");
        this.modalTodoDueDate = document.querySelector("#modal-todo-dueDate");
        this.modalTodoPriority = document.querySelector("#modal-todo-priority");
        this.modalTodoProject = document.querySelector("#modal-todo-project");

        // Project Modal elements  
        this.projectDialog = document.querySelector(".add-project-modal");
        this.openProjectModalBtn = document.querySelector('.add-project-btn');
        this.closeProjectModalBtn = document.querySelector('.close-project-modal-btn');
        this.modalProjectTitle = document.querySelector("#modal-project-title");

        // Project and ToDo elements  
        this.sideBar = document.querySelector('.sidebar');
        this.customProjects = document.querySelector('.custom-projects');
        this.projectTodos = document.querySelector('.project-todos');
        this.mainProjectTitle = document.querySelector('.main-project-title');

        // Forms  
        this.todoForm = document.querySelector('.todo-form');
        this.projectForm = document.querySelector('.project-form');

    }

    static getInstance(projectsController) {
        if (!ProjectsView.#instance) {
            ProjectsView.#instance = new ProjectsView(projectsController);
        }
        return ProjectsView.#instance;
    }

    // Grouped event listener initialization  
    initializeEventListeners() {
        this.attachProjectModalListeners();
        this.attachToDoModalListeners();
        this.attachToDoDetailsModalListeners();
        this.attachToDoListeners();
        this.attachProjectListeners();
    }

    // Attach listeners for the todo details modal  
    attachToDoDetailsModalListeners() {

        this.projectTodos.addEventListener('click', (event) => {
            if (event.target.closest('.details-btn')) {
                const todoLi = event.target.closest('.todo');
                const todotId = todoLi.dataset.todoId;
                const projectId = todoLi.dataset.projectId;
                const todo = this.projectsController.getProjectById(projectId).getToDoById(todotId);
                this.todoDetailsTitle.textContent = todo.title;
                this.todoDetailsDuration.textContent = todo.description;
                this.todoDetailsDueDate.textContent = todo.dueDate;
                this.todoDetailsPriority.textContent = todo.priority;
                this.todoDetailsProject.textContent = todo.project_title;
                this.todoDetailsDialog.showModal();
            }
        });
        this.closeToDoDetailsBtn.addEventListener('click', () => {
            this.todoDetailsDialog.close();
        });

        this.todoDetailsDialog.addEventListener("close", () => {
            this.todoDetailsTitle.textContent = "";
            this.todoDetailsDuration.textContent = "";
            this.todoDetailsDueDate.textContent = "";
            this.todoDetailsPriority.textContent = "";
            this.todoDetailsProject.textContent = "";
        });
    }


    // Attach listeners for the project modal  
    attachProjectModalListeners() {
        this.projectForm.addEventListener('submit', () => {
            this.projectsController.createProject(this.modalProjectTitle.value);
            this.renderProjects()
        });

        this.openProjectModalBtn.addEventListener('click', () => {
            this.projectDialog.showModal();
        });

        this.closeProjectModalBtn.addEventListener('click', () => {
            this.projectDialog.close();
        });

        this.projectDialog.addEventListener("close", () => {
            this.modalProjectTitle.value = "";
        });
    }

    // Attach listeners for the ToDo modal  
    attachToDoModalListeners() {
        this.todoForm.addEventListener('submit', () => {
            const project_id = this.modalTodoProject.value;
            const project = this.projectsController.getProjectById(project_id);

            project.createToDo(
                this.modalTodoTitle.value,
                this.modalTodoDescription.value,
                this.modalTodoDueDate.value,
                this.modalTodoPriority.value,
                project.id,
                project.title
            );
            this.renderToDos(project.id);
        });

        this.openToDoModalBtn.addEventListener('click', () => {
            this.modalTodoProject.innerHTML = '';
            const allProjectsList = this.projectsController.projectsList;

            allProjectsList.forEach((project) => {
                const projectOption = document.createElement('option');
                projectOption.value = project.id;
                projectOption.textContent = project.title;
                if (project.id === this.mainProjectTitle.dataset.projectId) {
                    projectOption.setAttribute("selected", "selected");
                }
                this.modalTodoProject.append(projectOption);
            });
            this.todoDialog.showModal();
        });

        this.closeToDoModalBtn.addEventListener('click', () => {
            this.todoDialog.close();
        });

        this.todoDialog.addEventListener("close", () => {
            this.modalTodoTitle.value = "";
            this.modalTodoDescription.value = "";
            this.modalTodoDueDate.value = "";
            this.modalTodoPriority.value = "LOW";
        });
    }

    // Attach listeners for projects actions  
    attachProjectListeners() {
        this.sideBar.addEventListener('click', (event) => {
            if (event.target.closest('.project-btn')) {
                const projectId = event.target.closest('.project').dataset.projectId;
                if (projectId !== this.mainProjectTitle.dataset.projectId) {
                    this.renderToDos(projectId);
                }
            } 
            else if (event.target.closest('.delete-btn')) {
                const projectId = event.target.closest('.project').dataset.projectId;
                this.projectsController.deleteProject(projectId);
                this.renderProjects();
                if (projectId === this.mainProjectTitle.dataset.projectId) {
                    this.renderToDos('inbox');
                }
            }
        });

    }

    // Attach listeners for ToDo actions (delete, edit, etc.)  
    attachToDoListeners() {
        this.projectTodos.addEventListener('click', (event) => {
            if (event.target.closest('.delete-btn')) {
                const todoLi = event.target.closest('.todo');
                const projectId = todoLi.dataset.projectId;
                const todoId = todoLi.dataset.todoId;
                this.projectsController.getProjectById(projectId).deleteToDo(todoId);
                this.renderToDos(projectId);
            } 
            else if (event.target.closest('.todo-checkbox')) {
                const todoLi = event.target.closest('.todo');
                const projectId = todoLi.dataset.projectId;
                const todoId = todoLi.dataset.todoId;
                const project = this.projectsController.getProjectById(projectId);
                project.switchToDoStatus(todoId);
                const todoInfo = todoLi.querySelector('.todo-info');
                const checkBox = event.target.closest('.todo-checkbox');
                todoInfo.classList.toggle('completed-todo');
                checkBox.classList.toggle('completed-todo');
            }

        });
    }

    // Render projects  
    renderProjects() {
        this.customProjects.innerHTML = '';
        this.projectsController.projectsList.forEach((project) => {
            if (!project.isDefault) {
                generateProject(project, this.customProjects);
            }
        });

    }

    // Render ToDos  
    renderToDos(project_id) {
        this.mainProjectTitle.innerHTML = '';
        this.projectTodos.innerHTML = '';

        const project = this.projectsController.getProjectById(project_id);

        this.mainProjectTitle.textContent = project.title;
        this.mainProjectTitle.setAttribute('data-project-id', project.id);

        project.toDoList.forEach((todo) => {
            generateToDo(todo, this.projectTodos);
        });
    }
}