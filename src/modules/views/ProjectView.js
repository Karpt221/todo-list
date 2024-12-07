import poundIcon from '../../assets/pound.svg';
import editIcon from '../../assets/square-edit-outline.svg';
import deleteIcon from '../../assets/delete-outline.svg';

export const generateProject = (project, projectsList) =>{
    const projectLi = document.createElement('li');
                projectLi.classList.add('project');
                projectLi.dataset.projectId = project.id;

                // Create the project button  
                const projectButton = document.createElement('button');
                projectButton.classList.add('btn', 'project-btn');
                projectButton.type = 'button';

                // Create the project icon  
                const projectIcon = document.createElement('img');
                projectIcon.classList.add('icon');
                projectIcon.src = poundIcon;
                projectIcon.alt = '';

                // Add the icon and project title to the button  
                projectButton.appendChild(projectIcon);
                projectButton.appendChild(document.createTextNode(project.title));

                // Append the button to the <li>  
                projectLi.appendChild(projectButton);

                // Create the control buttons container  
                const controlBtns = document.createElement('div');
                controlBtns.classList.add('control-btns');

                // Create the edit button  
                const editButton = document.createElement('button');
                editButton.classList.add('edit-todo-btn');
                editButton.type = 'button';
                const editIconImg = document.createElement('img');
                editIconImg.classList.add('icon');
                editIconImg.src = editIcon;
                editIconImg.alt = '';
                editButton.appendChild(editIconImg);
                controlBtns.appendChild(editButton);

                // Create the delete button  
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.type = 'button';
                const deleteIconImg = document.createElement('img');
                deleteIconImg.classList.add('icon');
                deleteIconImg.src = deleteIcon;
                deleteIconImg.alt = '';
                deleteButton.appendChild(deleteIconImg);
                controlBtns.appendChild(deleteButton);

                // Append the control buttons container to the <li>  
                projectLi.appendChild(controlBtns);

                // Append the <li> to the customProjects container  
                projectsList.appendChild(projectLi);
} 