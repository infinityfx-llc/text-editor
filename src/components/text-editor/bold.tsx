import { Toggle, Tooltip } from "@infinityfx/fluid";
import { LuBold } from "react-icons/lu";
import { useTextEditor } from "./root";

export default function Bold({ tooltip = 'Bold (ctrl + b)', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    tooltip?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const { formatting, format } = useTextEditor();

    return <Tooltip {...props} content={tooltip}>
        <Toggle
            compact
            checked={formatting.bold}
            onChange={e => format?.('bold', e.target.checked)}>
            <LuBold />
        </Toggle>
    </Tooltip>;
}

Bold.displayName = 'TextEditor.Bold';