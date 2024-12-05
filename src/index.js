import "./style.css";
import { ProjectsController } from "./modules/ProjectsController.js";
import { ProjectsView } from "./modules/ProjectsView.js";

const projects =  ProjectsController.getInstance();

const projectsView =  ProjectsView.getInstance(projects);

projectsView.initializeEventListeners();

// Initial rendering  
projectsView.renderProjects();
projectsView.renderToDos('inbox');