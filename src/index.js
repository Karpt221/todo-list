import "./style.css";
import { ProjectsController } from "./modules/models/ProjectsController.js";
import { ProjectsView } from "./modules/views/MainView.js";

const projects =  ProjectsController.getInstance();

const projectsView =  ProjectsView.getInstance(projects);

projectsView.initializeEventListeners();

// Initial rendering  
projectsView.renderProjects();
projectsView.renderToDos('inbox');