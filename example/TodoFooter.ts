import { Collection, ModelManager, View } from '../src';
import { TodoProps } from './index';
import TodoCount from './TodoCount';
import TodoFilters from './TodoFilters';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
}

export default class TodoFooter extends View<ViewOptions, TodoProps> {
    mapChildren = (): { [key: string]: string } => ({
        todoCount: '.todo-count',
        todoFilters: '.todo-filters',
    });

    renderChildren(): void {
        const todoCount = new TodoCount(this.children.todoCount, this.options);
        todoCount.appendToDOM();

        const todoFilters = new TodoFilters(this.children.todoFilters, this.options);
        todoFilters.appendToDOM();
    }

    render(): string {
        return `
            <span class="todo-count"></span>
            <ul class="filters"></ul>
        `;
    }
}
