import { Model, ModelManager, View } from '../src';
import { UserProps } from './index';
import UserList from './UserList';

interface ViewOptions {
    model: Model<UserProps>;
    modelList: Model<UserProps>[];
    modelManager: ModelManager<UserProps>;
}
export default class UserForm extends View<ViewOptions, UserProps> {
    handleSetNameClick = (): void => {
        const input = this.parent.querySelector('input');

        if (input) {
            const name = input.value;
            this.options.model.set({ name });
        }
    };

    handleSetAgeClick = (): void => {
        const age = Math.round(Math.random() * 100);
        this.options.model.set({ age });
    };

    handleSaveClick = async (): Promise<void> => {
        await this.options.model.save();
    };

    mapChildren = (): { [key: string]: string } => ({
        userList: '.user-list',
    });

    mapEvents = (): { [key: string]: () => void } => {
        return {
            'click:.set-name': this.handleSetNameClick,
            'click:.set-age': this.handleSetAgeClick,
            'click:.save': this.handleSaveClick,
        };
    };

    renderChildren(): void {
        const userList = new UserList(this.children.userList, this.options);
        userList.appendToDOM();
    }

    render(): string {
        const name = this.options.model.get('name');

        return `
            <div>
                <input placeholder="${name}"/>
                <button class="set-name">Set Name</button>
                <button class="set-age">Set Random Age</button>
                <button class="save">Save User</button>
                <ul class="user-list"></ul>
            </div>
        `;
    }
}
