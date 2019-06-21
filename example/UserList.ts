import { Model, View } from '../src';
import { UserProps } from './index';
import UserPanel from './UserPanel';

interface ViewOptions {
    modelList: Model<UserProps>[];
}

interface Children {
    [key: string]: string;
}

export default class UserList extends View<ViewOptions, UserProps> {
    mapChildren = (): Children => {
        const children = {} as Children;

        this.options.modelList.forEach((user, i) => {
            const id = user.get('id');

            if (id) {
                children[id] = `#user${i + 1}`;
            }
        });

        return children;
    };

    renderChildren(): void {
        this.options.modelList.forEach(user => {
            const id = user.get('id');

            if (id) {
                const userPanel = new UserPanel(this.children[id], { model: user });
                userPanel.appendToDOM();
            }
        });
    }

    render(): string {
        let template = '';

        this.options.modelList.forEach((user, i) => {
            const id = user.get('id');

            if (id) {
                template += `<li class="user" id="user${i + 1}"></li>`;
            }
        });

        return template;
    }
}
