import { ApiClient, Collection, ModelManager } from 'simple-web';
import TodoApp from './components/TodoApp';

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
    };

    const app = document.querySelector('.todoapp');

    if (app) {
        const todoApp = new TodoApp(app, viewOptions);
        todoApp.appendToDOM();
    } else {
        throw new Error("Selector '.todoapp' not found.");
    }
});
