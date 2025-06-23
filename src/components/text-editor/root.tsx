'use client';

import { Scrollarea } from "@infinityfx/fluid";
import { createContext, use, useRef, useState } from "react";
import { defaultFormatting, Formatting, Shortcut } from "../../core/config";
import Editor, { EditorHandle } from "../editor";
import { createStyles } from "@infinityfx/fluid/css";
import { classes } from "@infinityfx/fluid/utils";

const styles = createStyles('text-editor.root', {
    '.wrapper': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-xsm)',
        minWidth: 'min(var(--width, 100vw), 12em)'
    },

    '.toolbar': {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--f-spacing-xsm)',
        justifyContent: 'flex-end'
    },

    '.editor': {
        outline: 'solid 3px transparent',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        backgroundColor: 'var(--f-clr-fg-100)',
        transition: 'border-color .2s, color .2s, outline-color .2s'
    },

    '.editor .input': {
        resize: 'none',
        outline: 'none',
        border: 'none',
        background: 'none',
        padding: '.675em',
        minHeight: 'calc(100% - 2px)',
        boxSizing: 'border-box',
        overflow: 'visible',
        color: 'var(--f-clr-text-100)'
    },

    '.editor:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)'
    },

    '.editor[data-error="true"]': {
        borderColor: 'var(--f-clr-error-100)'
    },

    '.editor[data-error="true"]:focus-within': {
        outlineColor: 'var(--f-clr-error-400)'
    },

    '.editor[data-disabled="true"]': {
        backgroundColor: 'var(--f-clr-grey-100)',
        borderColor: 'var(--f-clr-grey-200)'
    }
});

export const TextEditorContext = createContext<{
    formatting: Formatting;
    format?: EditorHandle["format"];
} | null>(null);

export function useTextEditor() {
    const context = use(TextEditorContext);

    if (!context) throw new Error('Unable to access TextEditor context');

    return context;
}

export default function Root({
    children,
    toolbarPosition = 'top',
    shortcuts,
    resize,
    rows = 1,
    defaultValue = '',
    name,
    placeholder,
    required,
    disabled,
    readOnly,
    error,
    onChange,
    ...props
}: {
    ref?: React.Ref<HTMLDivElement>;
    toolbarPosition?: 'top' | 'bottom';
    shortcuts?: Shortcut[];
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    rows?: number;
    defaultValue?: string;
    onChange?: (value: string) => void;
    error?: any;
} & Omit<React.InputHTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'minLength' | 'maxLength'>) {
    const handle = useRef<EditorHandle>(null);
    const [formatting, setFormatting] = useState(defaultFormatting);

    return <TextEditorContext value={{
        formatting,
        format: handle.current?.format
    }}>
        <div {...props} className={classes(styles.wrapper, props.className)}>
            {toolbarPosition === 'top' && <div className={styles.toolbar}>
                {children}
            </div>}

            <Scrollarea
                data-error={error}
                data-disabled={disabled}
                className={styles.editor}
                style={{
                    resize,
                    height: `calc(${rows}lh + 1.35em)`
                }}>
                <Editor
                    handle={handle}
                    className={styles.input}
                    formatting={formatting}
                    onFormattingChange={setFormatting}
                    aria-invalid={!!error}
                    shortcuts={shortcuts}
                    defaultValue={defaultValue}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    onChange={onChange} />
            </Scrollarea>

            {toolbarPosition === 'bottom' && <div className={styles.toolbar}>
                {children}
            </div>}
        </div>
    </TextEditorContext>;
}

Root.displayName = 'TextEditor.Root';