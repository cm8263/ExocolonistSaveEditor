export interface SkillSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

export function SkillSlider({ label, value, onChange }: SkillSliderProps) {
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
                min={0}
                max={100}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ flex: 0.5 }}
            />

            <span style={{ width: 32, textAlign: 'right' }}>{value}</span>
        </div>
    );
}
