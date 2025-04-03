'use client';

import { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { extract, formattingToString, getFormatting, getParent, getRange, insertNode, insertText, getLineRange, nodeIsEmpty, matchShortcut } from "../core/utils";
import { defaultFormatting, defaultShortcuts, Formatting, Shortcut } from "../core/config";
import { classes } from "@infinityfx/fluid/utils";
import { createStyles } from "@infinityfx/fluid/css";

// (links, ordered lists??)
// override paste command to only keep supported formatting
// inside align div, inserting new formatting sometimes causes extra new line (/ sometimes looses formatting)

export type EditorHandle = {
    format: <T extends keyof Formatting>(key: T, value: Formatting[T]) => void;
    set: (value: string) => void;
};

const styles = createStyles('editor', {
    '.editor': {
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        boxSizing: 'content-box',
        minHeight: '1lh',
        resize: 'both',
        fontSize: '12pt',
        border: 'inset 2px lightgrey',
        background: 'field',
        color: 'fieldtext'
    },

    '.editor::before': {
        content: 'attr(aria-placeholder)',
        position: 'absolute',
        color: 'grey'
    },

    '.editor[aria-disabled="true"]': {
        backgroundColor: 'lightgrey',
        color: 'darkgray'
    }
});

export default function Editor({
    handle,
    onChange,
    formatting,
    onFormattingChange,
    shortcuts,
    defaultValue = '',
    name,
    placeholder,
    disabled,
    readOnly,
    required,
    ...props
}: {
    ref?: React.Ref<HTMLDivElement | null>;
    handle?: React.Ref<EditorHandle>;
    defaultValue?: string;
    onChange?: (value: string) => void;
    formatting?: Formatting;
    onFormattingChange?: (formatting: Formatting) => void;
    shortcuts?: Shortcut[];
} & Omit<React.InputHTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange' | 'minLength' | 'maxLength'>) {
    const ref = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [rules, setRules] = formatting ? [formatting, onFormattingChange] : useState(defaultFormatting);

    function checkFormatting() {
        const range = getRange();
        if (!range || !ref.current) return;

        const currentFormatting = getFormatting(ref.current, range);
        if (JSON.stringify(currentFormatting) !== JSON.stringify(rules)) setRules?.(currentFormatting);
    }

    function format<T extends keyof Formatting>(key: T, value: Formatting[T]) {
        if (!ref.current) return;
        ref.current.focus();

        const updated = { ...rules, [key]: value };
        updated.size = Math.max(1, updated.size);
        setRules?.(updated);

        const range = key === 'align' ? getLineRange() : getRange();
        if (!range) return;

        const parent = getParent(ref.current, range.commonAncestorContainer, key === 'align');

        if (key === 'align') {
            let content: Node = extract(range, parent);
            content = nodeIsEmpty(content) ? new Text('\u200B') : content; // u200B temp fix and optimize?

            if (value !== 'left') {
                const node = insertNode(range, 'div', content);
                node.style.textAlign = value as Formatting['align'];
            } else {
                insertNode(range, content);
            }

            range.collapse(); // figure out way to keep prev selection?
        } else {
            const content = extract(range, parent instanceof HTMLSpanElement ? parent : undefined),
                styles = formattingToString(updated);

            if (styles) {
                const node = insertNode(range, 'span', content.textContent || '\u200B'); // u200B temp fix
                node.style = styles;
            } else {
                insertText(range, content.textContent || '');
            }
        }

        updateValue();
    }

    function updateValue() {
        const value = ref.current?.innerHTML || '';
        onChange?.(value);
        setValue(value);
    }

    const mergedShortcuts = useMemo(() => {
        const merged = [...defaultShortcuts];

        if (shortcuts) {
            for (const shortcut of shortcuts) {
                const i = merged.findIndex(val => val.action === shortcut.action);
                i >= 0 ?
                    merged.splice(i, 0, shortcut) :
                    merged.push(shortcut);
            }
        }

        return merged;
    }, [shortcuts]);

    useImperativeHandle(handle, () => ({
        format,
        set(value: string) {
            if (ref.current) ref.current.innerHTML = value;
        }
    }), [rules]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (mounted && ref.current) ref.current.innerHTML = value;
    }, [mounted]);

    return <>
        <div
            {...props}
            ref={ref}
            role="textbox"
            aria-placeholder={/^(<br>)?$/.test(value) ? placeholder : ''}
            aria-disabled={disabled}
            aria-readonly={readOnly}
            aria-required={required}
            contentEditable={!(disabled || readOnly)}
            className={classes(styles.editor, props.className)}
            dangerouslySetInnerHTML={mounted ? undefined : {
                __html: value
            }}
            onMouseUp={e => {
                checkFormatting();
                props.onMouseUp?.(e);
            }}
            onKeyUp={e => {
                checkFormatting();
                props.onKeyUp?.(e);
            }}
            onKeyDown={e => {
                const range = getRange();
                if (range && ['Enter', 'Tab'].includes(e.key)) {
                    e.preventDefault();

                    range.deleteContents();

                    if (e.key === 'Enter') {
                        insertText(range, '\n');
                        insertNode(range, 'br');
                    } else {
                        insertText(range, '\t');
                    }

                    updateValue();
                }

                for (let { action, shortcut, value } of mergedShortcuts) {
                    if (matchShortcut(e, shortcut)) {
                        value = !value ? !rules[action] : value;
                        if (typeof value === 'number') value = rules.size + value;

                        format(action, value);
                    }
                }
            }}
            onInput={updateValue} />
        <input
            type="hidden"
            name={name}
            required={required}
            value={value} />
    </>;
}