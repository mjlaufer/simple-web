import { Model, ModelManager } from '../index';

export { default as View } from './View';

export interface ViewOptions<T> {
    model?: Model<T>;
    modelList?: Model<T>[];
    modelManager?: ModelManager<T>;
    sync?: string[];
}
