import { Model, Collection, ModelManager } from './index';

interface ViewOptions<T> {
    model?: Model<T>;
    collection?: Collection<T>;
    modelManager?: ModelManager<T>;
    sync?: string[];
}

export default abstract class View<T extends ViewOptions<ModelProps>, ModelProps> {
    children: { [key: string]: Element } = {};

    constructor(public parent: Element, public options: T) {
        if (this.options.sync) {
            this.options.sync.forEach(eventName => {
                if (this.options.model) {
                    this.options.model.on(eventName, this.appendToDOM);
                }
                if (this.options.collection) {
                    this.options.collection.on(eventName, this.appendToDOM);
                }
            });
        }
    }

    abstract render(): string;

    mapChildren = (): { [key: string]: string } => {
        return {};
    };

    getChildren = (fragment: DocumentFragment): void => {
        const children = this.mapChildren();

        for (let key in children) {
            const selector = children[key];
            const element = fragment.querySelector(selector);

            if (element) {
                this.children[key] = element;
            }
        }
    };

    mapEvents = (): { [key: string]: () => void } => {
        return {};
    };

    bindEvents = (fragment: DocumentFragment): void => {
        const eventsMap = this.mapEvents();

        for (let key in eventsMap) {
            const [eventName, selector] = key.split(':');

            fragment.querySelectorAll(selector).forEach(el => {
                el.addEventListener(eventName, eventsMap[key]);
            });
        }
    };

    renderChildren(): void {}

    appendToDOM = (): void => {
        this.parent.innerHTML = '';

        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.render();

        this.bindEvents(templateElement.content);
        this.getChildren(templateElement.content);
        this.renderChildren();
        this.parent.append(templateElement.content);
    };
}
