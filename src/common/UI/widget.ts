import { FastDomNode } from "./domNode.js";

export interface IWidget {
    id?: string;
    element: HTMLElement | FastDomNode<HTMLElement>;
    imgElement?: HTMLImageElement;
}