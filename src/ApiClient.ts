import axios, { AxiosPromise } from 'axios';

interface WithId {
    id?: number;
}

export default class ApiClient<T extends WithId> {
    constructor(public baseUrl: string) {}

    fetchOne = (id: number): AxiosPromise => axios.get(`${this.baseUrl}/${id}`);

    fetch = (): AxiosPromise => axios.get(this.baseUrl);

    save = (data: T): AxiosPromise => {
        const { id } = data;

        if (id) {
            return axios.put(`${this.baseUrl}/${id}`, data);
        }
        return axios.post(this.baseUrl, data);
    };

    delete = (id: number): AxiosPromise => axios.delete(`${this.baseUrl}/${id}`);
}
