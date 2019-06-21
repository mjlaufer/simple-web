import { Model, View } from '../src';
import { UserProps } from './index';

interface ViewOptions {
    model: Model<UserProps>;
}

export default class UserPanel extends View<ViewOptions, UserProps> {
    render(): string {
        const name = this.options.model.get('name');
        const age = this.options.model.get('age');

        return `
            <div>
                <h3>User Detail</h3>
                <div>${name}</div>
                <div>${age}</div>
            </div>
        `;
    }
}
