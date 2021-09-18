
export class GameInterface {

    public readonly parentContainer: HTMLElement;
    public container: HTMLElement | undefined;

    constructor(parent: HTMLElement) {
        this.parentContainer = parent;
    }

    public render(): void {

    }

    public destroy(): void {
        this.parentContainer.removeChild(this.container!);
    }

}