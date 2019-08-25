import { Collection, EventListener, Model, ModelManager, View } from 'simple-web';
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
    selectedFilter = this.getFilter();
    visibleTodos = this.getVisibleTodos();

    private getFilter(): Filter {
        const hashParam = window.location.hash.split('#/')[1] || '';

        switch (hashParam.toUpperCase()) {
            case Filter.active:
                return Filter.active;
            case Filter.completed:
                return Filter.completed;
            default:
                return Filter.all;
        }
    }

    private getVisibleTodos(): Model<TodoProps>[] {
        const { models } = this.options.collection;

        switch (this.selectedFilter) {
            case Filter.active:
                return models.filter(todo => !todo.get('completed'));
            case Filter.completed:
                return models.filter(todo => todo.get('completed') === true);
            default:
                return [...models];
        }
    }

    componentDidMount(): void {
        const input = this.parent.querySelector('input');
        if (input) {
            input.focus();
        }
    }

    setVisibleTodos = (filter: Filter): void => {
        this.selectedFilter = filter;
        this.visibleTodos = this.getVisibleTodos();
        this.options.collection.trigger('set-visible-todos');
    };

    handleNewTodoKeydown = async (e: KeyboardEvent | Event): Promise<void> => {
        if (!('keyCode' in e) || e.keyCode !== ENTER_KEY_CODE) {
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
            if (!title) {
                return;
            }
            newTodo.set({ title });
        }

        const todo = await newTodo.save();
        collection.add(todo);
        this.setVisibleTodos(this.selectedFilter);
    };

    handleToggleAllClick = (): void => {
        const { collection } = this.options;

        let shouldMarkCompleted = false;

        for (let todo of collection.models) {
            const completed = todo.get('completed');

            if (!completed) {
                shouldMarkCompleted = true;
            }
        }

        for (let todo of collection.models) {
            const completed = todo.get('completed');

            if (completed !== shouldMarkCompleted) {
                todo.set({ completed: shouldMarkCompleted }).save();
            }
        }

        collection.reset(collection.models);

        const checkbox = document.getElementById('toggle-all') as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = shouldMarkCompleted;
        }
    };

    mapEvents = (): { [key: string]: EventListener } => ({
        'change:.toggle-all': this.handleToggleAllClick,
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
            selectedFilter: this.selectedFilter,
            setVisibleTodos: this.setVisibleTodos,
        });
        todoFilters.appendToDOM();
    }

    render(): string {
        const { models } = this.options.collection;
        const areAllCompleted = models.filter(todo => !todo.get('completed')).length === 0;

        return `
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
            <section class="main">
                <input id="toggle-all" class="toggle-all" type="checkbox" ${
                    areAllCompleted ? 'checked' : ''
                }>
                <label for="toggle-all">Mark all as complete</label>
                <ul class="todo-list"></ul>
            </section>
            <section class="filter-container"></section>
        `;
    }
}
