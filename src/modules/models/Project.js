import { ToDo } from "./ToDo.js";
import { v4 as uuidv4 } from 'uuid';

export class Project {
    #toDoMap = new Map();
    #controller;

    constructor(title, id = uuidv4(), isDefault = false, controller = null) {
        this.id = id;
        this.title = title;
        this.isDefault = isDefault;
        this.#controller = controller;
    }

    notifyController() {  
        if (this.#controller) {  
            this.#controller.saveToLocalStorage();  
        }  
    }  

    setController(controller) {  
        this.#controller = controller;  
    }  

    createToDo(title, description, dueDate, priority, project_id = this.id, project_title = this.title, completed = false) {
        const todo = new ToDo(project_id, project_title, title, description, dueDate, priority, completed);
        this.#toDoMap.set(todo.id, todo);
        this.notifyController();
    }

    editToDo(todo_id, todo_data_obj) {
        const todo = this.#toDoMap.get(todo_id);
        if (todo) {
            Object.assign(todo, todo_data_obj);
            this.notifyController();
        } else {
            throw new Error(`ToDo with ID ${todo_id} not found.`);
        }

    }

    deleteToDo(todo_id) {
        if (!this.#toDoMap.delete(todo_id)) {
            throw new Error(`ToDo with ID ${todo_id} not found.`);
        }
        this.notifyController();
    }

    switchToDoStatus(todo_id) {
        const todo = this.#toDoMap.get(todo_id);
        if (todo) {
            todo.switchCompleteStatus();
            this.notifyController();
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

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            isDefault: this.isDefault,
            toDoList: this.toDoList.map(todo => todo.toJSON()),
        };
    }

    static fromJSON(data) {
        const project = new Project(data.title, data.id, data.isDefault);
        project.#toDoMap = new Map(  
            data.toDoList.map(todoData => {  
                const todo = ToDo.fromJSON(todoData); // Deserialize each ToDo  
                return [todo.id, todo]; // Use the ToDo's ID as the key  
            })
        );  
        return project;
    }
}