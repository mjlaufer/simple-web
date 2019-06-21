export default class Attributes<T> {
    constructor(private props: T) {}

    get = <K extends keyof T>(key: K): T[K] => {
        return this.props[key];
    };

    getAll = (): T => {
        return this.props;
    };

    set = (propsToUpdate: T): void => {
        this.props = { ...this.props, ...propsToUpdate };
    };
}
