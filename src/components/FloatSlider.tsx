export interface FloatSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;

    minLabel: string;
    maxLabel: string;
}

export function FloatSlider({
    label,
    value,
    min = -1,
    max = 1,
    step = 0.01,
    onChange,
    minLabel,
    maxLabel,
}: FloatSliderProps) {
    let finalOutput = '';

    switch (label) {
        // TODO: Update once we look at custom pronoun deserialization!
        case 'Pronouns':
            if (value < 0.33) {
                finalOutput = 'She/her';
            } else if (value > 0.66) {
                finalOutput = 'He/Him';
            } else {
                finalOutput = 'They/them';
            }
            break;

        case 'Appearance':
            if (value < 0.33) {
                finalOutput = 'Feminine';
            } else if (value > 0.66) {
                finalOutput = 'Masculine';
            } else {
                finalOutput = 'Androgynous';
            }
            break;
    }

    return (
        <div
            style={{
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingInline: '0.75rem',
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            <span style={{ width: 120 }}>{label}</span>

            <span
                style={{
                    flexShrink: 0,
                    minWidth: 80,
                    textAlign: 'right',
                    paddingRight: 4,
                    fontSize: '0.8rem',
                    opacity: 0.9,
                }}
            >
                {minLabel ?? min.toString()}
            </span>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ flex: 0.2 }}
            />

            <span
                style={{
                    flexShrink: 0,
                    minWidth: 80,
                    textAlign: 'left',
                    paddingLeft: 4,
                    fontSize: '0.8rem',
                    opacity: 0.9,
                }}
            >
                {maxLabel ?? max.toString()}
            </span>

            <span style={{ width: 60 }}>{finalOutput}</span>
        </div>
    );
}
