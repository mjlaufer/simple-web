import UserContainer from './UserContainer';
import { ApiClient, Model, Collection, ModelManager } from '../src';

export interface UserProps {
    id?: number;
    userId?: number;
    name?: string;
    age?: number;
}

const userApiClient = new ApiClient<UserProps>('http://localhost:3000/users');

const userManager = new ModelManager<UserProps>(userApiClient);
const user = userManager.create({ userId: 1, name: 'Matthew' });
user.set({ age: 31 });

userManager.fetch().then((userCollection: Collection<UserProps>) => {
    const viewOptions = {
        model: user,
        collection: userCollection,
        modelManager: userManager,
        sync: ['change'],
    };

    const root = document.getElementById('root');

    if (root) {
        const userContainer = new UserContainer(root, viewOptions);
        userContainer.appendToDOM();
    } else {
        throw new Error('Root element not found.');
    }
});
