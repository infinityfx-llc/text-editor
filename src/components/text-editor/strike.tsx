import { Toggle, Tooltip } from "@infinityfx/fluid";
import { LuStrikethrough } from "react-icons/lu";
import { useTextEditor } from "./root";

export default function Strike({ tooltip = 'Striketrough', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    tooltip?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const { formatting, format } = useTextEditor();

    return <Tooltip {...props} content={tooltip}>
        <Toggle
            compact
            checked={formatting.strike}
            onChange={e => format?.('strike', e.target.checked)}>
            <LuStrikethrough />
        </Toggle>
    </Tooltip>;
}

Strike.displayName = 'TextEditor.Strike';