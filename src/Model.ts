import { AxiosPromise, AxiosResponse } from 'axios';
import Attributes from './Attributes';
import EventEmitter from './EventEmitter';

interface ApiClient<T> {
    fetchOne(id: number): AxiosPromise;
    fetch(): AxiosPromise;
    save(data: T): AxiosPromise;
    delete(id: number): AxiosPromise;
}

interface WithId {
    id?: number;
}

export class ModelManager<T extends WithId> {
    constructor(private apiClient: ApiClient<T>) {}

    create = (props: T) => new Model(new Attributes<T>(props), this.apiClient);

    fetchOne = (id: number): Promise<Model<T>> =>
        this.apiClient.fetchOne(id).then(({ data }: AxiosResponse) => this.create(data));

    fetch = (): Promise<Collection<T>> =>
        this.apiClient.fetch().then(({ data }: AxiosResponse) => {
            const models = data.map((item: T) => this.create(item));

            const collection = new Collection<T>();
            collection.set(models);

            return collection;
        });
}

export class Collection<T extends WithId> {
    models: Model<T>[] = [];

    private events = new EventEmitter();

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    append() {
        this.trigger('change');
    }

    set(models: Model<T>[]) {
        this.models = models;
        this.trigger('change');
    }

    add(model: Model<T>) {
        this.models.push(model);
        this.trigger('change');
    }

    remove(id: number) {
        this.trigger('change');
    }
}

export class Model<T extends WithId> {
    constructor(private attrs: Attributes<T>, private apiClient: ApiClient<T>) {}

    private events = new EventEmitter();

    get get() {
        return this.attrs.get;
    }

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    set = (propsToUpdate: T): void => {
        this.attrs.set(propsToUpdate);
        this.trigger('change');
    };

    save = (): Promise<void> =>
        this.apiClient
            .save(this.attrs.getAll())
            .then(
                (): void => {
                    this.trigger('save');
                },
            )
            .catch(
                (): void => {
                    this.trigger('error');
                },
            );

    delete = (id: number): AxiosPromise => this.apiClient.delete(id);
}
