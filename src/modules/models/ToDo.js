import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';  

export const PRIORITY = {
    "HIGH":"HIGH",
    "MEDIUM": "MEDIUM",
    "LOW": "LOW",
};
//=format(new Date(),'yyyy-MM-dd hh:mm')
//=PRIORITY.LOW
export class ToDo {
    constructor(project_id,project_title, title, description, dueDate, priority, completed = false) {
        this.id = uuidv4();
        this.project_id = project_id;
        this.project_title = project_title;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }

    switchCompleteStatus() {
        this.completed = this.completed === true ? false : true;
    }

    getCompleteStatus(){
        return this.completed;
    }

    toJSON() {  
        return {  
            id: this.id,  
            title: this.title,  
            description: this.description,  
            dueDate: this.dueDate,  
            priority: this.priority,  
            project_id: this.project_id,  
            project_title: this.project_title,  
            completed: this.completed,  
        };  
    }  

    static fromJSON(data) {  
        const todo = new ToDo( 
            data.project_id,  
            data.project_title,   
            data.title,  
            data.description,  
            data.dueDate,  
            data.priority,  
            data.completed  
        );  
        todo.id = data.id;
        return todo;  
    }  
}

