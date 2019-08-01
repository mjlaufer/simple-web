import { Collection, EventListener, View } from 'simple-web';
import { TodoProps } from '../index';
import { Filter } from './TodoApp';

interface ViewOptions {
    collection: Collection<TodoProps>;
    selectedFilter: Filter;
    setVisibleTodos: (filter: Filter) => void;
}

export default class TodoFilters extends View<ViewOptions, TodoProps> {
    mapEvents = (): { [key: string]: EventListener } => ({
        'click:#filter-all': () => this.options.setVisibleTodos(Filter.all),
        'click:#filter-active': () => this.options.setVisibleTodos(Filter.active),
        'click:#filter-completed': () => this.options.setVisibleTodos(Filter.completed),
    });

    render(): string {
        const { collection, selectedFilter } = this.options;

        const count = collection.models.filter(todo => !todo.get('completed')).length;
        const plural = count !== 1 ? 's' : '';

        return `
            <span class="todo-count">${count} item${plural} left</span>
            <ul class="filters">
                <li>
                    <a href="#/" ${
                        selectedFilter === Filter.all ? 'class="selected"' : ''
                    } id="filter-all">All</a>
                </li>
                <li>
                    <a href="#/active" ${
                        selectedFilter === Filter.active ? 'class="selected"' : ''
                    } id="filter-active">Active</a>
                </li>
                <li>
                    <a href="#/completed" ${
                        selectedFilter === Filter.completed ? 'class="selected"' : ''
                    } id="filter-completed">Completed</a>
                </li>
            </ul>
        `;
    }
}
