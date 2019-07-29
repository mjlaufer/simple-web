import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';

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

        this.options.collection.trigger('change');
    };

    mapChildren = (): { [key: string]: string } => ({
        form: '.todo-form',
        todoList: '.todo-list',
        filters: '.filter-container',
    });

    renderChildren(): void {
        const todoForm = new TodoForm(this.children.form, {
            ...this.options,
            selectedFilter: this.selectedFilter,
            setVisibleTodos: this.setVisibleTodos,
        });
        todoForm.appendToDOM();

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
            <section class="todo-form"></section>
            <section class="main">
                <label for="toggle-all">Mark all as complete</label>
                <ul class="todo-list"></ul>
            </section>
            <section class="filter-container"></section>
        `;
    }
}
