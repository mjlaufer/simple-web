import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';
import { Filter } from './TodoApp';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
    selectedFilter: Filter;
    setVisibleTodos: (filter: Filter) => void;
}
export default class TodoForm extends View<ViewOptions, TodoProps> {
    model = this.options.modelManager.create({
        completed: false,
    });

    handleAddClick = async (): Promise<void> => {
        const { collection, selectedFilter, setVisibleTodos } = this.options;
        const input = this.parent.querySelector('input');

        if (input) {
            const title = input.value;
            this.model.set({ title });
        }

        const todo = await this.model.save();
        collection.add(todo);
        setVisibleTodos(selectedFilter);
    };

    mapEvents = (): { [key: string]: () => void } => ({
        'click:.add-todo': this.handleAddClick,
    });

    render(): string {
        return `
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
            <button class="add-todo">Add</button>
        `;
    }
}
