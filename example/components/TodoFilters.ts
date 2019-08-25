import { Collection, EventListener, ModelManager, View } from 'type-ui';
import { TodoProps } from '../index';
import { Filter } from './TodoApp';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
    selectedFilter: Filter;
    setVisibleTodos: (filter: Filter) => void;
}

export default class TodoFilters extends View<ViewOptions, TodoProps> {
    handleClearClick = async (): Promise<void> => {
        const { collection, modelManager, selectedFilter, setVisibleTodos } = this.options;

        let deletePromises = [] as Promise<any>[];

        collection.models
            .filter(todo => todo.get('completed') === true)
            .forEach(todo => {
                const id = todo.get('id');
                if (id) {
                    deletePromises.push(todo.delete(id));
                }
            });

        await Promise.all(deletePromises);
        const todoCollection = await modelManager.fetch();
        collection.reset(todoCollection.models);
        setVisibleTodos(selectedFilter);
    };

    mapEvents = (): { [key: string]: EventListener } => ({
        'click:#filter-all': () => this.options.setVisibleTodos(Filter.all),
        'click:#filter-active': () => this.options.setVisibleTodos(Filter.active),
        'click:#filter-completed': () => this.options.setVisibleTodos(Filter.completed),
        'click:.clear-completed': this.handleClearClick,
    });

    render(): string {
        const {
            collection: { models },
            selectedFilter,
        } = this.options;

        const activeCount = models.filter(todo => !todo.get('completed')).length;
        const completedCount = models.length - activeCount;
        const plural = activeCount !== 1 ? 's' : '';

        return `
            <span class="todo-count">${activeCount} item${plural} left</span>
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
            ${completedCount > 0 ? '<button class="clear-completed">Clear completed</button>' : ''}
        `;
    }
}
