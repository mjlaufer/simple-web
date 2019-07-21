import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
}

export default class TodoFooter extends View<ViewOptions, TodoProps> {
    allTodos = this.options.collection.models;
    activeTodos = this.options.collection.models.filter(todo => !todo.get('completed'));
    completedTodos = this.options.collection.models.filter(todo => todo.get('completed'));

    mapEvents = (): { [key: string]: () => void } => ({
        'click:.filter-all': (): void => this.options.collection.reset(this.allTodos),
        'click:.filter-active': (): void => this.options.collection.reset(this.activeTodos),
        'click:.filter-completed': (): void => this.options.collection.reset(this.completedTodos),
    });

    render(): string {
        const count = this.activeTodos.length;
        const plural = count > 1 ? 's' : '';

        return `
            <span class="todo-count">${count} item${plural} left</span>
            <ul class="filters">
                <li>
                    <span class="filter-all">All</span>
                </li>
                <li>
                    <span class="filter-active">Active</span>
                </li>
                <li>
                    <span class="filter-completed">Completed</span>
                </li>
            </ul>
        `;
    }
}
