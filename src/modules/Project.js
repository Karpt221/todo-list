import { ToDo } from "./ToDo.js";
import { v4 as uuidv4 } from 'uuid';  

export class Project{
    #toDoList = [];

    //#toDoMap = new Map();

    constructor(title, id=uuidv4(), isDefault=false,) {
        this.id = id;
        this.title = title;
        this.isDefault = isDefault;
    }

    createToDo(title, description, dueDate, priority,project_id=this.id,project_title=this.title) {
        let todo = new ToDo(project_id, project_title, title, description, dueDate, priority);
        this.#toDoList.push(todo);

        //this.#toDoMap.set(todo.id, todo);
    }
    editToDo(todo_idx, todo_data_obj) {
        Object.assign(this.#toDoList[todo_idx], todo_data_obj);
    }
    deleteToDo(todo_idx) {
        this.#toDoList.splice(todo_idx, 1);
        //this.#toDoMap.delete(todo_id);
    }
    switchToDoStatus(todo_idx){
        this.#toDoList[todo_idx].switchCompleteStatus();
    }
    get toDoList() {
        return Object.freeze([...this.#toDoList]);
    }
}