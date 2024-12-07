import { Project } from "./Project.js";
import { v4 as uuidv4 } from 'uuid';

export class ProjectsController {
    static #instance;

    #projectsMap = new Map();

    constructor(storedProjects) {
        if (ProjectsController.#instance) {
            throw new Error("ProjectsController instance already exists! Use ProjectsController.getInstance().");
        }

        storedProjects.forEach(project => this.#projectsMap.set(project.id, project));

        ProjectsController.#instance = this;
    }

    static getInstance() {
        if (!ProjectsController.#instance) {
            // Create the controller instance first  
            const controller = new ProjectsController([]);
            // Create the default "Inbox" project and set the controller  
            const inboxProject = new Project('Inbox', 'inbox', true, controller);
            controller.#projectsMap.set(inboxProject.id, inboxProject);
            ProjectsController.#instance = controller;
        }
        return ProjectsController.#instance;
    }

    createProject(project_title) {
        const newProject = new Project(project_title, uuidv4(), false, this);
        this.#projectsMap.set(newProject.id, newProject);
        this.saveToLocalStorage();
    }

    editProject(project_id, project_data_obj) {
        const project = this.#projectsMap.get(project_id);
        if (project) {
            Object.assign(project, project_data_obj);
            this.saveToLocalStorage();
        } else {
            throw new Error(`Project with ID ${project_id} not found.`);
        }
    }

    deleteProject(project_id) {
        if (!this.#projectsMap.delete(project_id)) {
            throw new Error(`Project with ID ${project_id} not found.`);
        }
        this.saveToLocalStorage();
    }

    get projectsList() {
        return Object.freeze([...this.#projectsMap.values()]);
    }

    getProjectById(project_id) {
        return this.#projectsMap.get(project_id);
    }

    toJSON() {
        return JSON.stringify({
            projects: [...this.#projectsMap.values()],
        });
    }

    static fromJSON(jsonString) {
        const data = JSON.parse(jsonString);
        const storedProjects = data.projects.map(projectData => Project.fromJSON(projectData));
        const controller = new ProjectsController(storedProjects);

        // Set the controller for each project  
        storedProjects.forEach(project => {
            project.setController(controller);
        });

        return controller;

    }

    saveToLocalStorage() {
        localStorage.setItem('projectsController', this.toJSON());
    }

}