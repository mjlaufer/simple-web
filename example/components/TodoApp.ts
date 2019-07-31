import { Collection, EventListener, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';

const ENTER_KEY_CODE = 13;

export enum Filter {
    all = 'ALL',
    active = 'ACTIVE',
    completed = 'COMPLETED',
}

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
}

export default class TodoApp extends View<ViewOptions, TodoProps> {
    selectedFilter = Filter.all;
    visibleTodos = [...this.options.collection.models];

    setVisibleTodos = (filter: Filter) => {
        this.selectedFilter = filter;

        const { models } = this.options.collection;

        switch (filter) {
            case Filter.active:
                this.visibleTodos = models.filter(todo => !todo.get('completed'));
                break;
            case Filter.completed:
                this.visibleTodos = models.filter(todo => todo.get('completed') === true);
                break;
            default:
                this.visibleTodos = [...models];
        }

        this.options.collection.trigger('set-visible-todos');
    };

    handleNewTodoKeydown = async (e: KeyboardEvent | Event): Promise<void> => {
        if (!("keyCode" in e) || e.keyCode !== ENTER_KEY_CODE) {
            return;
        }

        e.preventDefault();

        const { collection, modelManager } = this.options;

        const newTodo = modelManager.create({
            completed: false,
        });

        const input = this.parent.querySelector('input');

        if (input) {
            const title = input.value;
            newTodo.set({ title });
        }

        const todo = await newTodo.save();
        collection.add(todo);
        this.setVisibleTodos(this.selectedFilter);
    };

    mapEvents = (): { [key: string]: EventListener } => ({
        'keydown:.new-todo': this.handleNewTodoKeydown,
    });

    mapChildren = (): { [key: string]: string } => ({
        todoList: '.todo-list',
        filters: '.filter-container',
    });

    renderChildren(): void {
        const todoList = new TodoList(this.children.todoList, {
            ...this.options,
            visibleTodos: this.visibleTodos,
            selectedFilter: this.selectedFilter,
            setVisibleTodos: this.setVisibleTodos,
        });
        todoList.appendToDOM();

        const todoFilters = new TodoFilters(this.children.filters, {
            ...this.options,
            setVisibleTodos: this.setVisibleTodos,
        });
        todoFilters.appendToDOM();
    }

    render(): string {
        return `
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
            <section class="main">
                <label for="toggle-all">Mark all as complete</label>
                <ul class="todo-list"></ul>
            </section>
            <section class="filter-container"></section>
        `;
    }
}
