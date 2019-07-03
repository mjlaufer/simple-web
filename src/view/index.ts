import { Model, Collection, ModelManager } from '../index';

export { default as View } from './View';

export interface ViewOptions<T> {
    model?: Model<T>;
    collection?: Collection<T>;
    modelManager?: ModelManager<T>;
    sync?: string[];
}
