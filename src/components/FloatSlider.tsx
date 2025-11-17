export interface FloatSliderProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
}

export function FloatSlider({
    label,
    value,
    min = -1,
    max = 1,
    step = 0.01,
    onChange,
}: FloatSliderProps) {
    return (
        <div
            style={{
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}
        >
            <span style={{ width: 120 }}>{label}</span>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ flex: 1 }}
            />

            <span style={{ width: 48, textAlign: 'right' }}>{value.toFixed(2)}</span>
        </div>
    );
}
