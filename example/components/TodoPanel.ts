import { Model, View } from 'simple-web';
import { TodoProps } from '../index';

interface ViewOptions {
    model: Model<TodoProps>;
}

export default class TodoPanel extends View<ViewOptions, TodoProps> {
    render(): string {
        const title = this.options.model.get('title');

        return `
            <span>${title}</span>
        `;
    }
}
