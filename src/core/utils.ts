import { rgbToHex } from "@infinityfx/fluid/utils";
import { defaultFormatting, Formatting, Shortcut } from "./config";

function colorToHex(color: string) {
    const rgb = color.match(/^rgb\((.+),\s*(.+),\s*(.+)\)/) || [];
    return rgb.length ? rgbToHex(rgb.slice(1).map(parseFloat) as any) : color;
}

export function matchShortcut(e: React.KeyboardEvent, shortcut: Shortcut["shortcut"]) {
    for (const key of shortcut.split('+')) {
        switch (key) {
            case 'ctrl':
                if (!e.ctrlKey) return false;
                break;
            case 'shift':
                if (!e.shiftKey) return false;
                break;
            default:
                if (e.key.toLowerCase() !== key) return false;
        }
    }

    e.preventDefault();
    
    return true;
}

export function formattingToString({ bold, italic, underline, strike, size, color }: typeof defaultFormatting) {
    return Object.entries({
        fontWeight: bold ? '700' : '',
        fontStyle: italic ? 'italic' : '',
        textDecoration: [
            underline ? 'underline' : '',
            strike ? 'line-through' : ''
        ].filter(val => val).join(' '),
        fontSize: size !== 12 ? size + 'pt' : '',
        color
    })
        .filter(([_, val]) => val)
        .map(([key, val]) => `${key.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()}:${val};`)
        .join('');
}

export function getRange() {
    const selection = document.getSelection();

    return selection?.rangeCount ?
        selection.getRangeAt(0) :
        null;
}

export function getLineRange() {
    let selection = document.getSelection(), range;
    if (!selection || !selection.rangeCount) return null;

    const { startContainer, startOffset } = selection.getRangeAt(0);
    selection.modify('move', 'right', 'lineboundary');
    const { endContainer, endOffset } = range = selection.getRangeAt(0);

    range.setStart(startContainer, startOffset);
    selection.collapseToStart();
    selection.modify('move', 'left', 'lineboundary');
    (range = selection.getRangeAt(0)).setEnd(endContainer, endOffset);

    return range;
}

function getRangeNodes(range: Range) {
    let nodes = [range.startContainer], node: Node;

    while ((node = nodes[nodes.length - 1]) !== range.endContainer && node.nextSibling) {
        nodes.push(node.nextSibling);
    }

    return nodes;
}

export function getParent(container: Element, node: Node | null, furthest = false) {
    let parent;

    while (node && container !== node) {
        if (node instanceof HTMLElement) parent = node;
        if (!furthest && parent) return parent;

        node = node.parentNode;
    }

    return parent;
}

export function nodeIsEmpty(node: Node | string = '') {
    return /^\u200B?$/.test(typeof node === 'string' ? node : node.textContent || '');
}

export function extract(range: Range, parent?: HTMLElement) {
    let wrapper = getParent(parent?.parentNode as any, range.commonAncestorContainer),
        content = Array.from(range.extractContents().childNodes) as Node[];

    if (nodeIsEmpty(range.commonAncestorContainer)) { // capture current formatting first??
        range.selectNodeContents(range.commonAncestorContainer);
        range.deleteContents();
    }

    if (parent) {
        range.setStartBefore(parent);
        let fragment = range.extractContents();
        if (!nodeIsEmpty(fragment)) {
            range.insertNode(fragment);
            range.collapse();
        }

        range.setEndAfter(parent);
        fragment = range.extractContents();
        if (!nodeIsEmpty(fragment)) {
            range.insertNode(fragment);
            range.collapse(true);
        }

        const [node, nodes] = content;
        if (node instanceof Text && !nodes && wrapper instanceof HTMLSpanElement) {
            content = [wrapper.cloneNode()];
            content[0].appendChild(node);
        }
    }

    const fragment = document.createDocumentFragment();
    content.forEach(node => {
        fragment.append(...node instanceof HTMLDivElement ?
            Array.from(node.childNodes) :
            [node]);
    });

    return fragment;
}

function removeBreakline(range: Range) {
    range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
    const nodes = Array.from(range.cloneContents().childNodes);

    nodes.length == 1 && nodes[0] instanceof HTMLBRElement ?
        range.deleteContents() :
        range.collapse();
}

export function insertNode(range: Range, content: Node): Node;
export function insertNode<T extends keyof HTMLElementTagNameMap>(range: Range, type: T, content?: Node | string): HTMLElementTagNameMap[T];
export function insertNode<T extends keyof HTMLElementTagNameMap>(range: Range, typeOrContent: T | Node, content?: Node | string) {
    const node = typeof typeOrContent === 'string' ? document.createElement(typeOrContent) : typeOrContent;
    // @ts-expect-error
    if (content && 'replaceChildren' in node) node.replaceChildren(content);

    removeBreakline(range);

    range.insertNode(node);
    if (!(node instanceof DocumentFragment || node instanceof HTMLBRElement)) range.selectNodeContents(node);
    if (nodeIsEmpty(content)) range.collapse();

    return node;
}

export function insertText(range: Range, text: string) {
    if (!(range.startContainer instanceof Text)) {
        text = text || '\u200B'; // u200B temp fix
        insertNode(range, document.createTextNode(''));
    }

    const node = range.startContainer as Text;
    node.replaceData(range.startOffset, 0, text);
    range.setStart(node, range.startOffset + text.length);
}

export function getFormatting(container: Element, range: Range) {
    const formatting: any = {
        bold: true,
        italic: true,
        underline: true,
        strike: true,
        size: Number.MAX_VALUE
    };
    const nodes = getRangeNodes(range);

    for (const node of nodes) {
        const parent = getParent(container, node);
        if (!parent) return defaultFormatting;

        const { fontWeight, fontStyle, textDecoration, fontSize, textAlign } = getComputedStyle(parent);
        formatting.bold = formatting.bold && fontWeight == '700';
        formatting.italic = formatting.italic && fontStyle == 'italic';
        formatting.underline = formatting.underline && textDecoration.includes('underline');
        formatting.strike = formatting.strike && textDecoration.includes('line-through');
        formatting.size = Math.min(formatting.size, Math.round(parseFloat(fontSize) * .75));

        const hex = colorToHex(parent.style.color);
        if (!('color' in formatting)) formatting.color = hex;
        formatting.color = formatting.color !== hex ? '' : hex;

        const align = ['left', 'center', 'right'].includes(textAlign) ? textAlign : 'left';
        if (!('align' in formatting)) formatting.align = align;
        formatting.align = formatting.align !== align ? 'left' : align;
    }

    return formatting as Formatting;
}