import { Collection, EventListener, View } from 'simple-web';
import { TodoProps } from '../index';
import { Filter } from './TodoApp';

interface ViewOptions {
    collection: Collection<TodoProps>;
    setVisibleTodos: (filter: Filter) => void;
}

export default class TodoFilters extends View<ViewOptions, TodoProps> {
    mapEvents = (): { [key: string]: EventListener } => ({
        'click:.filter-all': () => this.options.setVisibleTodos(Filter.all),
        'click:.filter-active': () => this.options.setVisibleTodos(Filter.active),
        'click:.filter-completed': () => this.options.setVisibleTodos(Filter.completed),
    });

    render(): string {
        const count = this.options.collection.models.filter(todo => !todo.get('completed')).length;
        const plural = count !== 1 ? 's' : '';

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
