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
            collection.reset(models);

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

    add(model: Model<T>) {
        this.models.push(model);
        this.trigger('add');
    }

    remove(id: number) {
        this.models = this.models.filter((model: Model<T>) => model.get('id') !== id);
        this.trigger('remove');
    }

    reset(models: Model<T>[]) {
        this.models = models;
        this.trigger('reset');
    }

    set(models: Model<T>[]) {
        models.forEach((model: Model<T>) => {
            const index = this.models.map((m: Model<T>) => m.get('id')).indexOf(model.get('id'));

            if (index === -1) {
                this.add(model);
            } else {
                this.models[index] = model;
                this.trigger('change');
            }
        });
    }
}

export class Model<T extends WithId> {
    constructor(private attrs: Attributes<T>, private apiClient: ApiClient<T>) {}

    private events = new EventEmitter();

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    get get() {
        return this.attrs.get;
    }

    set = (propsToUpdate: T): Model<T> => {
        this.attrs.set(propsToUpdate);
        this.trigger('change');
        return this;
    };

    save = async (): Promise<Model<T>> => {
        try {
            const { data } = await this.apiClient.save(this.attrs.getAll());
            this.trigger('save');
            this.set(data);
            return this;
        } catch (err) {
            this.trigger('error');
            throw err;
        }
    };

    delete = (id: number): AxiosPromise => this.apiClient.delete(id);
}
