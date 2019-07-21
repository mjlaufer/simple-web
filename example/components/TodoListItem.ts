import { Collection, Model, View } from 'simple-web';
import { TodoProps } from '../index';

interface ViewOptions {
    collection: Collection<TodoProps>;
    model: Model<TodoProps>;
    sync: string[];
}

export default class TodoPanel extends View<ViewOptions, TodoProps> {
    toggle = (): void => {
        const { model } = this.options;
        const completed = model.get('completed');

        model.set({ completed: !completed })
        model.save();
    }

    destroy = async (): Promise<void> => {
        const { collection, model } = this.options;
        const id = model.get('id');

        if (id) {
            await model.delete(id);
            collection.remove(id);
        }
    }

    mapEvents = (): { [key: string]: () => void } => ({
        'click:.toggle': this.toggle,
        'click:.destroy': this.destroy,
    });

    render(): string {
        const { model } = this.options;

        const completed = model.get('completed');
        const title = model.get('title');

        return `
            <div class="view">
                <input class="toggle" type="checkbox" ${completed ? 'checked' : ''}>
                <label ${completed ? 'class="completed"' : ''}>${title}</label>
                <button class="destroy"></button>
            </div>
        `;
    }
}
