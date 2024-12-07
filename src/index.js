import "./style.css";
import { ProjectsController } from "./modules/models/ProjectsController.js";
import { ProjectsView } from "./modules/views/MainView.js";

//const projectsController =  ProjectsController.getInstance();

let projectsController;  

const savedController = localStorage.getItem('projectsController');  
if (savedController) {  
    projectsController = ProjectsController.fromJSON(savedController);  
} else {  
    projectsController = ProjectsController.getInstance();  
}  


const projectsView =  ProjectsView.getInstance(projectsController);

projectsView.initializeEventListeners();

// Initial rendering  
projectsView.renderProjects();
projectsView.renderToDos('inbox');