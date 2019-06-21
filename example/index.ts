import UserContainer from './UserContainer';
import { ApiClient, Model, ModelManager } from '../src';

export interface UserProps {
    id?: number;
    name?: string;
    age?: number;
}

const userApiClient = new ApiClient<UserProps>('http://localhost:3000/users');

const userManager = new ModelManager<UserProps>(userApiClient);
const user = userManager.create({ name: 'Matthew' });
user.set({ age: 30 });

userManager.fetchAll().then((userList: Model<UserProps>[]) => {
    const viewOptions = {
        model: user,
        modelList: userList,
        modelManager: userManager,
        sync: ['set'],
    };

    const root = document.getElementById('root');

    if (root) {
        const userContainer = new UserContainer(root, viewOptions);
        userContainer.appendToDOM();
    } else {
        throw new Error('Root element not found.');
    }
});
