import { Project } from "./Project.js";

export class ProjectsController {
    static #instance;

    #projectsList = [];

    constructor(defaultProjects) {
        if (ProjectsController.#instance) {
            throw new Error("ProjectsController instance already exists! Use ProjectsController.getInstance().");
        }
        this.#projectsList = defaultProjects;
        this.createProject('Project 1');
        ProjectsController.#instance = this;
    }

    static getInstance() {
        if (!ProjectsController.#instance) {
            ProjectsController.#instance = new ProjectsController([new Project('Inbox', 'inbox', true)]);
        }
        return ProjectsController.#instance;
    }

    createProject(project_title) {
        this.#projectsList.push(new Project(project_title));
    }
    editProject(project_idx, project_title) {
        Object.assign(this.#projectsList[project_idx], project_title)
    }
    deleteProject(project_idx) {
        this.#projectsList.splice(project_idx, 1);
    }

    get projectsList() {
        return Object.freeze([...this.#projectsList]);
    }

}