import { Project } from "./Project.js";

export class ProjectsController {
    static #instance;
    #defaultProjectsList = [];
    #customProjectsList = [];



    constructor(defaultProjects) {
        if (ProjectsController.#instance) {
            throw new Error("ProjectsController instance already exists! Use ProjectsController.getInstance().");
        }
        this.#defaultProjectsList = defaultProjects;
        this.#defaultProjectsList[0].createToDo("TITLE", "description", "2024-12-04 22:00", "LOW");
        this.createProject("Project 1");
        this.#customProjectsList[0].createToDo("title", "description", "2024-12-04 22:00", "HIGH");
        

        ProjectsController.#instance = this;
    }

    static getInstance() {
        if (!ProjectsController.#instance) {
            ProjectsController.#instance = new ProjectsController([new Project('Inbox', 'inbox')]);
        }
        return ProjectsController.#instance;
    }

    mergeProjects(){
        return this.defaultProjectsList.concat(this.customProjectsList);
    }

    createProject(project_title) {
        this.#customProjectsList.push(new Project(project_title));
    }
    editProject(project_idx, project_title) {
        Object.assign(this.#customProjectsList[project_idx], project_title)
    }
    deleteProject(project_idx) {
        this.#customProjectsList.splice(project_idx, 1);
    }

    get customProjectsList() {
        return Object.freeze([...this.#customProjectsList]);
    }

    get defaultProjectsList() {
        return Object.freeze([...this.#defaultProjectsList]);
    }
}
