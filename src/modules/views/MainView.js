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
        this.todoDialog = document.querySelector(".todo-modal");
        this.openToDoModalBtn = document.querySelector('.open-todo-modal-btn');
        this.closeToDoModalBtn = document.querySelector('.close-todo-modal-btn');
        this.modalTodoTitle = document.querySelector("#modal-todo-title");
        this.modalTodoDescription = document.querySelector("#modal-todo-description");
        this.modalTodoDueDate = document.querySelector("#modal-todo-dueDate");
        this.modalTodoPriority = document.querySelector("#modal-todo-priority");
        this.modalTodoProject = document.querySelector("#modal-todo-project");

        // Project Modal elements  
        this.projectDialog = document.querySelector(".project-modal");
        this.openProjectModalBtn = document.querySelector('.add-project-btn');
        this.closeProjectModalBtn = document.querySelector('.close-project-modal-btn');
        this.modalProjectTitle = document.querySelector("#modal-project-title");

        // Project and ToDo elements  
        this.customProjects = document.querySelector('.custom-projects');
        this.projectTodos = document.querySelector('.project-todos');
        this.mainProjectTitle = document.querySelector('.main-project-title');

        // Forms  
        this.todoForm = document.querySelector('.todo-form');
        this.projectForm = document.querySelector('.project-form');
        this.todoFormSubmit = document.querySelector('.todo-form-submit');
        this.projectFormSubmit = document.querySelector('.project-form-submit');
        
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
    }


    // Attach listeners for the project modal  
    attachProjectModalListeners() {
        this.projectForm.addEventListener('submit', () => {

            if (this.projectForm.dataset.actionType === 'create') {
                this.projectsController.createProject(this.modalProjectTitle.value);
            }
            else if(this.projectForm.dataset.actionType === 'edit'){
                const new_project_data = {
                    title: this.modalProjectTitle.value,
                };
                this.projectsController.editProject(this.projectForm.dataset.projectId, new_project_data)
            }
            this.renderProjects()
        });

        this.openProjectModalBtn.addEventListener('click', () => {
            this.projectForm.dataset.actionType = 'create';
            this.projectFormSubmit.textContent = 'Create project';
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
            let selectedProjectId = null;
            const initialProjectId = this.mainProjectTitle.dataset.projectId;
            const initialProject = this.projectsController.getProjectById(initialProjectId);
            if (this.todoForm.dataset.actionType === 'create') {
                initialProject.createToDo(
                    this.modalTodoTitle.value,
                    this.modalTodoDescription.value,
                    this.modalTodoDueDate.value,
                    this.modalTodoPriority.value,
                    initialProject.id,
                    initialProject.title
                );
                selectedProjectId = initialProject.id;
            }
            else if (this.todoForm.dataset.actionType === 'edit') {
                const todoId = this.todoForm.dataset.todoId;
                const todo = initialProject.getToDoById(todoId);
                const new_todo_data =
                {
                    title: this.modalTodoTitle.value,
                    description: this.modalTodoDescription.value,
                    dueDate: this.modalTodoDueDate.value,
                    priority: this.modalTodoPriority.value,
                    project_id: this.modalTodoProject.value,
                    project_title: this.modalTodoProject.selectedOptions[0].textContent,
                    completed: todo.completed,
                };
               
                if(initialProjectId !== new_todo_data.project_id){
                    initialProject.deleteToDo(todoId);
                    const newProject = this.projectsController.getProjectById(new_todo_data.project_id);
                    newProject.createToDo(...Object.values(new_todo_data));
                    selectedProjectId = newProject.id;
                }else{
                    initialProject.editToDo(todoId, new_todo_data);
                    selectedProjectId = initialProject.id;
                }
            }
            this.renderToDos(selectedProjectId);
        });

        this.openToDoModalBtn.addEventListener('click', () => {
            this.renderToDoModalProject();
            this.todoForm.dataset.actionType = 'create';
            this.todoFormSubmit.textContent = 'Create todo';
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
        this.customProjects.addEventListener('click', (event) => {
            const projectId = event.target.closest('.project').dataset.projectId;
            if (event.target.closest('.project-btn')) {
                if (projectId !== this.mainProjectTitle.dataset.projectId) {
                    this.renderToDos(projectId);
                }
            }
            else if (event.target.closest('.delete-btn')) {
                this.projectsController.deleteProject(projectId);
                this.renderProjects();
                if (projectId === this.mainProjectTitle.dataset.projectId) {
                    this.renderToDos('inbox');
                }
            }
            else if (event.target.closest('.edit-btn')) {
                const project = this.projectsController.getProjectById(projectId);
                this.modalProjectTitle.value = project.title;
                this.projectForm.dataset.actionType = 'edit';
                this.projectForm.dataset.projectId = projectId;
                this.projectFormSubmit.textContent = 'Edit project';
                this.projectDialog.showModal();
            }
        });

    }

    // Attach listeners for ToDo actions (delete, edit, etc.)  
    attachToDoListeners() {
        this.projectTodos.addEventListener('click', (event) => {
            const todoLi = event.target.closest('.todo');
            const projectId = todoLi.dataset.projectId;
            const todoId = todoLi.dataset.todoId;
            if (event.target.closest('.delete-btn')) {
                this.projectsController.getProjectById(projectId).deleteToDo(todoId);
                this.renderToDos(projectId);
            }
            else if (event.target.closest('.todo-checkbox')) {
                const project = this.projectsController.getProjectById(projectId);
                project.switchToDoStatus(todoId);
                const todoInfo = todoLi.querySelector('.todo-info');
                const checkBox = event.target.closest('.todo-checkbox');
                todoInfo.classList.toggle('completed-todo');
                checkBox.classList.toggle('completed-todo');
            }
            else if (event.target.closest('.edit-btn')) {
                const todo = this.projectsController.getProjectById(projectId).getToDoById(todoId);
                this.renderToDoModalProject();
                this.modalTodoTitle.value = todo.title;
                this.modalTodoDescription.value = todo.description;
                this.modalTodoDueDate.value = todo.dueDate;
                this.modalTodoPriority.value = todo.priority;
                this.todoForm.dataset.actionType = 'edit';
                this.todoFormSubmit.textContent = 'Edit todo';
                this.todoDialog.showModal();
                this.todoForm.dataset.todoId = todo.id;
            }

        });
    }

    renderToDoModalProject() {
        this.modalTodoProject.innerHTML = '';
        const allProjectsList = this.projectsController.projectsList;
        allProjectsList.forEach((project) => {
            const projectOption = document.createElement('option');
            projectOption.value = project.id;
            projectOption.textContent = project.title;
            if (project.id === this.mainProjectTitle.dataset.projectId) {
                projectOption.setAttribute("selected", true);
            }
            this.modalTodoProject.add(projectOption);
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