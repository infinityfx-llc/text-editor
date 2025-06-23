import { ColorField, Tooltip } from "@infinityfx/fluid";
import { useTextEditor } from "./root";

export default function Color({ tooltip = 'Font color', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    tooltip?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const { formatting, format } = useTextEditor();

    return <Tooltip {...props} content={tooltip}>
        <ColorField
            size="sml"
            style={{ position: 'relative' }}
            value={formatting.color}
            onChange={val => format?.('color', val)} />
    </Tooltip>;
}

Color.displayName = 'TextEditor.Color';