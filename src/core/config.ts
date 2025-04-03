export type Formatting = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
    size: number;
    color: string;
    align: 'left' | 'center' | 'right';
}

export const defaultFormatting: Formatting = {
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    size: 12,
    color: '',
    align: 'left'
};

type Char = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '[' | ']' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';

export type Shortcut = {
    action: keyof Formatting;
    shortcut: Char | `ctrl+${Char}` | `shift+${Char}` | `ctrl+shift+${Char}`;
    value?: Formatting[keyof Formatting];
}

export const defaultShortcuts: Shortcut[] = [
    {
        action: 'bold',
        shortcut: 'ctrl+b'
    },
    {
        action: 'italic',
        shortcut: 'ctrl+i'
    },
    {
        action: 'underline',
        shortcut: 'ctrl+u'
    },
    {
        action: 'align',
        shortcut: 'ctrl+shift+l',
        value: 'left'
    },
    {
        action: 'align',
        shortcut: 'ctrl+shift+e',
        value: 'center'
    },
    {
        action: 'align',
        shortcut: 'ctrl+shift+r',
        value: 'right'
    },
    {
        action: 'size',
        shortcut: 'ctrl+[',
        value: -1
    },
    {
        action: 'size',
        shortcut: 'ctrl+]',
        value: 1
    }
];