import { ToDo } from "./ToDo.js";
import { v4 as uuidv4 } from 'uuid';

export class Project {
    #toDoMap = new Map();

    constructor(title, id = uuidv4(), isDefault = false) {
        this.id = id;
        this.title = title;
        this.isDefault = isDefault;
    }

    createToDo(title, description, dueDate, priority, project_id = this.id, project_title = this.title, completed = false) {
        const todo = new ToDo(project_id, project_title, title, description, dueDate, priority, completed);
        this.#toDoMap.set(todo.id, todo);
    }

    editToDo(todo_id, todo_data_obj) {
        const todo = this.#toDoMap.get(todo_id);
        if (todo) {
            Object.assign(todo, todo_data_obj);
        } else {
            throw new Error(`ToDo with ID ${todo_id} not found.`);
        }
    }

    deleteToDo(todo_id) {
        if (!this.#toDoMap.delete(todo_id)) {
            throw new Error(`ToDo with ID ${todo_id} not found.`);
        }
    }

    switchToDoStatus(todo_id) {
        const todo = this.#toDoMap.get(todo_id);
        if (todo) {
            todo.switchCompleteStatus();
        } else {
            throw new Error(`ToDo with ID ${todo_id} not found.`);
        }
    }

    get toDoList() {
        return Object.freeze([...this.#toDoMap.values()]);
    }

    getToDoById(todo_id) {
        return this.#toDoMap.get(todo_id);
    }
}