import { NumberField, Tooltip } from "@infinityfx/fluid";
import { LuALargeSmall } from "react-icons/lu";
import { useTextEditor } from "./root";

export default function Size({ tooltip = 'Font size', min = 8, max = 32, ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    tooltip?: string;
    min?: number;
    max?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const { formatting, format } = useTextEditor();

    return <Tooltip {...props} content={tooltip}>
        <NumberField
            size="sml"
            min={min}
            max={max}
            precision={0}
            icon={<LuALargeSmall />}
            style={{ position: 'relative' }}
            value={formatting.size}
            onChange={e => format?.('size', parseInt(e.target.value))} />
    </Tooltip>;
}

Size.displayName = 'TextEditor.Size';