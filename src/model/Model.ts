import { AxiosPromise, AxiosResponse } from 'axios';
import Attributes from './Attributes';
import EventEmitter from './EventEmitter';

interface ApiClient<T> {
    fetch(id: number): AxiosPromise;
    fetchAll(): AxiosPromise;
    save(data: T): AxiosPromise;
    delete(id: number): AxiosPromise;
}

interface WithId {
    id?: number;
}

export class ModelManager<T extends WithId> {
    constructor(private apiClient: ApiClient<T>) {}

    private events = new EventEmitter();

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    create = (props: T) => new Model(new Attributes<T>(props), this.apiClient);

    fetch = (id: number): Promise<Model<T>> =>
        this.apiClient.fetch(id).then((response: AxiosResponse) => {
            this.trigger('fetch');
            return this.create(response.data);
        });

    fetchAll = (): Promise<Model<T>[]> =>
        this.apiClient.fetchAll().then(({ data }) => {
            this.trigger('fetch_all');
            return data.map((item: T) => this.create(item));
        });
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
        this.trigger('set');
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
