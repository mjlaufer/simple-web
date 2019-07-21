import TodoApp from './components/TodoApp';
import { ApiClient, Collection, ModelManager } from 'simple-web';

export interface TodoProps {
    id?: number;
    title?: string;
    completed?: boolean;
}

const todoApiClient = new ApiClient<TodoProps>('http://localhost:3000/todos');

const todoManager = new ModelManager<TodoProps>(todoApiClient);

todoManager.fetch().then((todoCollection: Collection<TodoProps>) => {
    const viewOptions = {
        collection: todoCollection,
        modelManager: todoManager,
        sync: ['change'],
    };

    const app = document.querySelector('.todoapp');

    if (app) {
        const todoApp = new TodoApp(app, viewOptions);
        todoApp.appendToDOM();
    } else {
        throw new Error("Selector '.todoapp' not found.");
    }
});
