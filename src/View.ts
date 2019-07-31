import { Model, Collection, ModelManager } from './index';

export type EventListener = (e: Event | KeyboardEvent) => void | Promise<void>;

interface ViewOptions<T> {
    model?: Model<T>;
    collection?: Collection<T>;
    modelManager?: ModelManager<T>;
    customEvents?: string[];
}

export abstract class View<T extends ViewOptions<ModelProps>, ModelProps> {
    children: { [key: string]: Element } = {};

    constructor(public parent: Element, public options: T) {
        let modelEvents = ['change'];
        let collectionEvents = ['add', 'change', 'remove', 'reset'];

        const { customEvents, model, collection } = this.options;

        if (customEvents) {
            modelEvents = modelEvents.concat(customEvents);
            collectionEvents = collectionEvents.concat(customEvents);
        }

        if (model) {
            modelEvents.forEach(eventName => {
                model.on(eventName, this.appendToDOM, this);
            });
        }

        if (collection) {
            collectionEvents.forEach(eventName => {
                collection.on(eventName, this.appendToDOM, this);
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

    mapEvents = (): { [key: string]: EventListener } => {
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

    appendToDOM(): void {
        this.parent.innerHTML = '';

        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.render();

        this.bindEvents(templateElement.content);
        this.getChildren(templateElement.content);
        this.renderChildren();
        this.parent.append(templateElement.content);
    }
}
