import poundIcon from '../assets/pound.svg';
import editIcon from '../assets/square-edit-outline.svg';
import deleteIcon from '../assets/delete-outline.svg';

export class ProjectsView {
    static #instance = null;

    constructor(projectsController) {
        if (ProjectsView.#instance) {
            throw new Error("ProjectsView instance already exists! Use ProjectsView.getInstance().");
        }
        this.projectsController = projectsController;

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
        this.customProjects = document.querySelector('.custom-projects');
        this.projectTodos = document.querySelector('.project-todos');
        this.mainProjectTitle = document.querySelector('.main-project-title');
        this.deleteTodoBtns = document.querySelectorAll('.delete-todo-btn');

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
        this.attachToDoFormListeners();
        this.attachProjectModalListeners();
        this.attachToDoModalListeners();
    }

    // Attach listeners for the ToDo form  
    attachToDoFormListeners() {
        this.todoForm.addEventListener('submit', () => {
            const allProjectsList = this.projectsController.projectsList;
            const project_id = this.modalTodoProject.value;
            const project = allProjectsList.find(project => project.id === project_id);

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
    }

    // Attach listeners for the project modal  
    attachProjectModalListeners() {
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
            this.modalTodoPriority.value = "";
        });
    }

    // Attach listeners for project clicks  
    attachProjectClickListeners() {
        document.querySelectorAll('.project').forEach((project) => {
            project.addEventListener("click", (event) => {
                const projectId = event.target.dataset.projectId;
                this.renderToDos(projectId);
            });
        });
    }

    // Attach listeners for ToDo actions (delete, edit, etc.)  
    attachToDoListeners() {
        this.deleteTodoBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Add delete functionality here  
            });
        });
    }

    // Render projects  
    renderProjects() {
        this.customProjects.innerHTML = '';
        this.projectsController.projectsList.forEach((project) => {
            if(!project.isDefault){
                this.customProjects.insertAdjacentHTML('beforeend',
                    `<li><button data-project-id="${project.id}" class="btn project" type="button">  
                        <img class="icon" src="${poundIcon}" alt="">${project.title}</button></li>`);
            }
        });
        this.attachProjectClickListeners(); // Reattach listeners after rendering  
    }

    // Render ToDos  
    renderToDos(project_id) {
        this.mainProjectTitle.innerHTML = '';
        this.projectTodos.innerHTML = '';

        const allProjectsList = this.projectsController.projectsList;
        const project = allProjectsList.find(project => project.id === project_id);

        this.mainProjectTitle.textContent = project.title;
        this.mainProjectTitle.setAttribute('data-project-id', project.id);

        project.toDoList.forEach((todo) => {
            this.projectTodos.insertAdjacentHTML('beforeend', `  
                <li class="todo">  
                    <button data-project-id="${todo.id}" class="todo btn" type="button">  
                        <input data-project-id="${todo.id}" class="todo-checkbox" type="checkbox" name="todo-checkbox">  
                        <div class="todo-info">  
                            <div class="todo-title">${todo.title}</div>  
                            <div class="todo-date">${todo.dueDate}</div>  
                            <div class="todo-project">${todo.project_title}</div>  
                        </div>  
                    </button>  
                    <div class="control-btns">  
                        <button class='edit-todo-btn' data-project-id="${todo.id}" type="button"><img class="icon" src="${editIcon}" alt=""></button>  
                        <button class='delete-todo-btn' data-project-id="${todo.id}" type="button"><img class="icon" src="${deleteIcon}" alt=""></button>  
                    </div>  
                </li>`);
        });
        this.attachToDoListeners(); // Reattach listeners after rendering  
    }
}