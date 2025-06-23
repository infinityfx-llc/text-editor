import { Toggle, Tooltip } from "@infinityfx/fluid";
import { LuUnderline } from "react-icons/lu";
import { useTextEditor } from "./root";

export default function Underline({ tooltip = 'Underline (ctrl + u)', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    tooltip?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const { formatting, format } = useTextEditor();

    return <Tooltip {...props} content={tooltip}>
        <Toggle
            compact
            checked={formatting.underline}
            onChange={e => format?.('underline', e.target.checked)}>
            <LuUnderline />
        </Toggle>
    </Tooltip>;
}

Underline.displayName = 'TextEditor.Underline';