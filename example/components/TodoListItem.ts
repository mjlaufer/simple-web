import { Collection, EventListener, Model, View } from 'simple-web';
import { TodoProps } from '../index';
import { Filter } from './TodoApp';

interface ViewOptions {
    collection: Collection<TodoProps>;
    model: Model<TodoProps>;
    selectedFilter: Filter;
    setVisibleTodos: (filter: Filter) => void;
}

export default class TodoListItem extends View<ViewOptions, TodoProps> {
    toggle = (): void => {
        const { collection, model } = this.options;
        const completed = model.get('completed');

        model.set({ completed: !completed }).save();
        collection.set([model]);
    };

    destroy = async (): Promise<void> => {
        const { collection, model, selectedFilter, setVisibleTodos } = this.options;
        const id = model.get('id');

        if (id) {
            await model.delete(id);
            collection.remove(id);
            setVisibleTodos(selectedFilter);
        }
    };

    mapEvents = (): { [key: string]: EventListener } => ({
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
