import { Segmented, Tooltip } from "@infinityfx/fluid";
import { LuAlignCenter, LuAlignLeft, LuAlignRight } from "react-icons/lu";
import { useTextEditor } from "./root";

export default function Align({ tooltip = 'Text alignment', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    tooltip?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const { formatting, format } = useTextEditor();

    return <Tooltip {...props} content={tooltip}>
        <Segmented
            size="sml"
            style={{ position: 'relative' }}
            options={[
                { label: <LuAlignLeft />, value: 'left' },
                { label: <LuAlignCenter />, value: 'center' },
                { label: <LuAlignRight />, value: 'right' }
            ]}
            value={formatting.align}
            onChange={val => format?.('align', val)} />
    </Tooltip>;
}

Align.displayName = 'TextEditor.Align';