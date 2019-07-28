import { Collection, Model, View } from 'simple-web';
import { TodoProps } from '../index';
import TodoListItem from './TodoListItem';
import { Filter } from './TodoApp';

interface ViewOptions {
    collection: Collection<TodoProps>;
    visibleTodos: Model<TodoProps>[];
    selectedFilter: Filter;
    setVisibleTodos: (filter: Filter) => void;
}

interface Children {
    [key: string]: string;
}

export default class TodoList extends View<ViewOptions, TodoProps> {
    mapChildren = (): Children => {
        const children = {} as Children;

        this.options.visibleTodos.forEach((todo, i) => {
            const id = todo.get('id');

            if (id) {
                children[id] = `#todo${i + 1}`;
            }
        });

        return children;
    };

    renderChildren(): void {
        this.options.visibleTodos.forEach(todo => {
            const id = todo.get('id');

            if (id) {
                const todoListItem = new TodoListItem(this.children[id], {
                    ...this.options,
                    model: todo,
                    sync: ['change'],
                });
                todoListItem.appendToDOM();
            }
        });
    }

    render(): string {
        let template = '';

        this.options.visibleTodos.forEach((todo, i) => {
            const id = todo.get('id');

            if (id) {
                template += `<li class="todo" id="todo${i + 1}"></li>`;
            }
        });

        return template;
    }
}
