import { Collection, ModelManager, View } from 'simple-web';
import { TodoProps } from '../index';

interface ViewOptions {
    collection: Collection<TodoProps>;
    modelManager: ModelManager<TodoProps>;
}
export default class TodoForm extends View<ViewOptions, TodoProps> {
    model = this.options.modelManager.create({
        completed: false,
    });

    handleAddClick = async (): Promise<void> => {
        const input = this.parent.querySelector('input');

        if (input) {
            const title = input.value;
            this.model.set({ title });
        }

        const todo = await this.model.save();
        this.options.collection.add(todo);
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
