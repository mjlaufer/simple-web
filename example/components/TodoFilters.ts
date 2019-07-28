import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
}

export default class TodoFilters extends View<ViewOptions, TodoProps> {
    mapEvents = (): { [key: string]: () => void } => {
        const { collection, modelManager } = this.options;

        return {
            'click:.filter-all': (): void => {
                modelManager
                    .fetch()
                    .then((todoCollection: Collection<TodoProps>) =>
                        collection.reset(todoCollection.models),
                    );
            },
            'click:.filter-active': (): void => {
                modelManager.fetch().then((todoCollection: Collection<TodoProps>) => {
                    const activeTodos = todoCollection.models.filter(
                        todo => !todo.get('completed'),
                    );
                    collection.reset(activeTodos);
                });
            },
            'click:.filter-completed': (): void => {
                modelManager.fetch().then((todoCollection: Collection<TodoProps>) => {
                    const completedTodos = todoCollection.models.filter(
                        todo => todo.get('completed') === true,
                    );
                    collection.reset(completedTodos);
                });
            },
        };
    };

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
