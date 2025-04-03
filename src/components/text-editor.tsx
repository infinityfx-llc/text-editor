'use client';

import { ColorField, NumberField, Scrollarea, Segmented, Toggle, Tooltip } from "@infinityfx/fluid";
import { Fragment, useRef, useState } from "react";
import { defaultFormatting, Formatting, Shortcut } from "../core/config";
import Editor, { EditorHandle } from "./editor";
import { LuALargeSmall, LuAlignCenter, LuAlignLeft, LuAlignRight, LuBold, LuItalic, LuStrikethrough, LuUnderline } from 'react-icons/lu';
import { createStyles } from "@infinityfx/fluid/css";
import { classes } from "@infinityfx/fluid/utils";

const styles = createStyles('text-editor', {
    '.wrapper': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-xsm)',
        minWidth: 'min(var(--width, 100vw), 12em)'
    },

    '.header': {
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

export default function TextEditor({
    formattingTools = ['bold', 'italic', 'underline'],
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
    formattingTools?: (keyof Formatting)[];
    shortcuts?: Shortcut[];
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    rows?: number;
    defaultValue?: string;
    onChange?: (value: string) => void;
    error?: any;
} & Omit<React.InputHTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange' | 'minLength' | 'maxLength'>) {
    const handle = useRef<EditorHandle>(null);
    const [formatting, setFormatting] = useState(defaultFormatting);

    const formatters = {
        size: <NumberField
            size="sml"
            min={8}
            max={32}
            precision={0}
            icon={<LuALargeSmall />}
            value={formatting.size}
            onChange={e => handle.current?.format('size', parseInt(e.target.value))} />,
        bold: <Tooltip content="Bold (ctrl + b)">
            <Toggle
                compact
                checked={formatting.bold}
                onChange={e => handle.current?.format('bold', e.target.checked)}>
                <LuBold />
            </Toggle>
        </Tooltip>,
        italic: <Tooltip content="Italic (ctrl + i)">
            <Toggle
                compact
                checked={formatting.italic}
                onChange={e => handle.current?.format('italic', e.target.checked)}>
                <LuItalic />
            </Toggle>
        </Tooltip>,
        underline: <Tooltip content="Underline (ctrl + u)">
            <Toggle
                compact
                checked={formatting.underline}
                onChange={e => handle.current?.format('underline', e.target.checked)}>
                <LuUnderline />
            </Toggle>
        </Tooltip>,
        strike: <Tooltip content="Striketrough">
            <Toggle
                compact
                checked={formatting.strike}
                onChange={e => handle.current?.format('strike', e.target.checked)}>
                <LuStrikethrough />
            </Toggle>
        </Tooltip>,
        align: <Segmented
            size="sml"
            options={[
                { label: <LuAlignLeft />, value: 'left' },
                { label: <LuAlignCenter />, value: 'center' },
                { label: <LuAlignRight />, value: 'right' }
            ]}
            value={formatting.align}
            onChange={val => handle.current?.format('align', val)} />,
        color: <ColorField
            size="sml"
            value={formatting.color}
            onChange={val => handle.current?.format('color', val)} />
    };

    return <div {...props} className={classes(styles.wrapper, props.className)}>
        <div className={styles.header}>
            {formattingTools.map((key, i) => <Fragment key={i}>
                {formatters[key]}
            </Fragment>)}
        </div>

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
    </div>;
}