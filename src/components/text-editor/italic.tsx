import { Toggle, Tooltip } from "@infinityfx/fluid";
import { LuItalic } from "react-icons/lu";
import { useTextEditor } from "./root";

export default function Italic({ tooltip = 'Italic (ctrl + i)', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    tooltip?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const { formatting, format } = useTextEditor();

    return <Tooltip {...props} content={tooltip}>
        <Toggle
            compact
            checked={formatting.italic}
            onChange={e => format?.('italic', e.target.checked)}>
            <LuItalic />
        </Toggle>
    </Tooltip>;
}

Italic.displayName = 'TextEditor.Italic';