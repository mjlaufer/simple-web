import { Model, ModelManager, View } from '../src';
import { UserProps } from './index';
import UserForm from './UserForm';
import UserPanel from './UserPanel';

interface ViewOptions {
    model: Model<UserProps>;
    modelList: Model<UserProps>[];
    modelManager: ModelManager<UserProps>;
}

export default class UserContainer extends View<ViewOptions, UserProps> {
    mapChildren = (): { [key: string]: string } => ({
        userPanel: '.user-panel',
        userForm: '.user-form',
    });

    renderChildren(): void {
        const userPanel = new UserPanel(this.children.userPanel, this.options);
        userPanel.appendToDOM();

        const userForm = new UserForm(this.children.userForm, this.options);
        userForm.appendToDOM();
    }

    render(): string {
        return `
            <div>
                <div class="user-panel"></div>
                <div class="user-form"></div>
            </div>
        `;
    }
}
