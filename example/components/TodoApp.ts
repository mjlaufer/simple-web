import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
    sync: string[];
}

export default class TodoContainer extends View<ViewOptions, TodoProps> {
    mapChildren = (): { [key: string]: string } => ({
        form: '.todo-form',
        todoList: '.todo-list',
        filters: '.filter-container',
    });

    renderChildren(): void {
        const todoForm = new TodoForm(this.children.form, this.options);
        todoForm.appendToDOM();

        const todoList = new TodoList(this.children.todoList, this.options);
        todoList.appendToDOM();

        const todoFilters = new TodoFilters(this.children.filters, this.options);
        todoFilters.appendToDOM();
    }

    render(): string {
        return `
            <h1>todos</h1>
            <section class="todo-form"></section>
            <section class="main">
                <label for="toggle-all">Mark all as complete</label>
                <ul class="todo-list"></ul>
            </section>
            <section class="filter-container"></section>
        `;
    }
}
