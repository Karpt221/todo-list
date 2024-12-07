import editIcon from '../../assets/square-edit-outline.svg';
import deleteIcon from '../../assets/delete-outline.svg';

export const generateToDo = (todo, todosList) => {
    const todoLi = document.createElement('li');
    todoLi.classList.add('todo');
    todoLi.dataset.projectId = todo.project_id;
    todoLi.dataset.todoId = todo.id;

    // Create the checkbox  
    const todoCheckbox = document.createElement('input');
    todoCheckbox.classList.add('todo-checkbox');
    todoCheckbox.type = 'checkbox';
    todoCheckbox.name = 'todo-checkbox';
    todoLi.appendChild(todoCheckbox);

    // Create the details button  
    const detailsButton = document.createElement('button');
    detailsButton.classList.add('btn', 'details-btn');
    detailsButton.type = 'button';

    // Create the todo-info div  
    const todoInfo = document.createElement('div');
    todoInfo.classList.add('todo-info');

    // Create the todo-title div  
    const todoTitle = document.createElement('div');
    todoTitle.classList.add('todo-title');
    todoTitle.textContent = todo.title;
    todoInfo.appendChild(todoTitle);

    // Create the todo-date div  
    const todoDate = document.createElement('div');
    todoDate.classList.add('todo-date');
    todoDate.textContent = todo.dueDate;
    todoInfo.appendChild(todoDate);

    // Create the todo-priority div  
    const todoPriority = document.createElement('div');
    todoPriority.classList.add('todo-priority');
    todoPriority.textContent = todo.priority;
    todoInfo.appendChild(todoPriority);

    // Append todo-info to the details button  
    detailsButton.appendChild(todoInfo);
    todoLi.appendChild(detailsButton);

    // Create the control-btns div  
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

    // Append control-btns to the todoLi  
    todoLi.appendChild(controlBtns);

    if (todo.getCompleteStatus() === true) {
        todoInfo.classList.toggle('completed-todo');
        todoCheckbox.classList.toggle('completed-todo');
        todoCheckbox.setAttribute('checked', 'checked')
    }
    // Append the todoLi to the projectTodos container  
    todosList.appendChild(todoLi);
}