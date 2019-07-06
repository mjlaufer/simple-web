import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';
import TodoList from './TodoList';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
}

export default class TodoContainer extends View<ViewOptions, TodoProps> {
    mapChildren = (): { [key: string]: string } => ({
        todoList: '.todo-list',
    });

    renderChildren(): void {
        const todoList = new TodoList(this.children.todoList, this.options);
        todoList.appendToDOM();
    }

    render(): string {
        return `
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list"></ul>
        `;
    }
}
