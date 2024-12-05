import { Project } from "./Project.js";  

export class ProjectsController {  
    static #instance;  

    #projectsMap = new Map();  

    constructor(defaultProjects) {  
        if (ProjectsController.#instance) {  
            throw new Error("ProjectsController instance already exists! Use ProjectsController.getInstance().");  
        }  

        // Initialize the Map with default projects  
        defaultProjects.forEach(project => this.#projectsMap.set(project.id, project));  
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
        const newProject = new Project(project_title);  
        this.#projectsMap.set(newProject.id, newProject);  
    }  

    editProject(project_id, updatedProjectData) {  
        const project = this.#projectsMap.get(project_id);  
        if (project) {  
            Object.assign(project, updatedProjectData);  
        } else {  
            throw new Error(`Project with ID ${project_id} not found.`);  
        }  
    }  

    deleteProject(project_id) {  
        if (!this.#projectsMap.delete(project_id)) {  
            throw new Error(`Project with ID ${project_id} not found.`);  
        }  
    }  

    get projectsList() {  
        return Object.freeze([...this.#projectsMap.values()]);  
    }  

    getProjectById(project_id) {  
        return this.#projectsMap.get(project_id);  
    }  
}