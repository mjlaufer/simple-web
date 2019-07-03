import { Collection, ModelManager, View } from '../src';
import { UserProps } from './index';
import UserList from './UserList';

interface ViewOptions {
    collection: Collection<UserProps>;
    modelManager: ModelManager<UserProps>;
}
export default class UserForm extends View<ViewOptions, UserProps> {
    model = this.options.modelManager.create({
        userId: Math.round(Math.random() * 100),
    });

    handleSetNameClick = (): void => {
        const input = this.parent.querySelector('input');

        if (input) {
            const name = input.value;
            this.model.set({ name });
        }
    };

    handleSetAgeClick = (): void => {
        const age = Math.round(Math.random() * 100);
        this.model.set({ age });
    };

    handleSaveClick = async (): Promise<void> => {
        const user = this.model;

        await user.save();
        this.options.collection.add(user);
    };

    mapChildren = (): { [key: string]: string } => ({
        userList: '.user-list',
    });

    mapEvents = (): { [key: string]: () => void } => ({
        'click:.set-name': this.handleSetNameClick,
        'click:.set-age': this.handleSetAgeClick,
        'click:.save': this.handleSaveClick,
    });

    renderChildren(): void {
        const userList = new UserList(this.children.userList, this.options);
        userList.appendToDOM();
    }

    render(): string {
        const name = this.model.get('name');

        return `
            <div>
                <input placeholder="Name"/>
                <button class="set-name">Set Name</button>
                <button class="set-age">Set Random Age</button>
                <button class="save">Save User</button>
                <ul class="user-list"></ul>
            </div>
        `;
    }
}
