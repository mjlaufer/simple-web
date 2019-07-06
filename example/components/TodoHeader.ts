import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';
import TodoForm from './TodoForm';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
}

export default class TodoHeader extends View<ViewOptions, TodoProps> {
    mapChildren = (): { [key: string]: string } => ({
        todoForm: '.todo-form',
    });

    renderChildren(): void {
        const todoForm = new TodoForm(this.children.todoForm, this.options);
        todoForm.appendToDOM();
    }

    render(): string {
        return `
            <h1>todos</h1>
            <div class="todo-form"></div>
        `;
    }
}
