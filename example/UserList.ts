import { Collection, View } from '../src';
import { UserProps } from './index';
import UserPanel from './UserPanel';

interface ViewOptions {
    collection: Collection<UserProps>;
}

interface Children {
    [key: string]: string;
}

export default class UserList extends View<ViewOptions, UserProps> {
    mapChildren = (): Children => {
        const children = {} as Children;

        this.options.collection.models.forEach((user, i) => {
            const userId = user.get('userId');

            if (userId) {
                children[userId] = `#user${i + 1}`;
            }
        });

        return children;
    };

    renderChildren(): void {
        this.options.collection.models.forEach(user => {
            const userId = user.get('userId');

            if (userId) {
                const userPanel = new UserPanel(this.children[userId], { model: user });
                userPanel.appendToDOM();
            }
        });
    }

    render(): string {
        let template = '';

        this.options.collection.models.forEach((user, i) => {
            const userId = user.get('userId');

            if (userId) {
                template += `<li class="user" id="user${i + 1}"></li>`;
            }
        });

        return template;
    }
}
