import { IWidget } from "./widget";

export interface IButtonStyles {

}

export interface IButtonOptions extends IButtonStyles {

}

export interface IButton extends IWidget {

}

export class Button implements IButton {
    
    public readonly id: string;
    public element: HTMLElement;
    public imgElement?: HTMLImageElement;

    constructor(id: string, container: HTMLElement) {
        this.id = id;
        this.element = document.createElement('div');
        this.element.id = id;
        
        container.appendChild(this.element);
    }

    public setClass(classes: string[]): void {
        this.element.classList.add(...classes);
    }

    public setImage(src: string): void {
        this.imgElement = document.createElement('img');
        this.imgElement.src = src;
        
        this.element.appendChild(this.imgElement);
    }

    public setImageID(id: string): void {
        if (this.imgElement) {
            this.imgElement.id = id;
        }
    }

    public setImageClass(classes: string[]): void {
        if (this.imgElement) {
            this.imgElement.classList.add(...classes);
        }
    }

}