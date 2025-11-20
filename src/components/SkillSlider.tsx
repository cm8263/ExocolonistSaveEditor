import { getPerkDetails } from '../../../exocolonist-core/src/utilities/getPerkDetails.ts';

export interface SkillSliderProps {
    label: string;
    notes: string;
    perks: string[];
    value: number;
    onChange: (value: number) => void;
}

export function SkillSlider({ label, value, onChange, notes, perks }: SkillSliderProps) {
    return (
        <div className="skill-grid">
            <div style={{ fontWeight: 500 }}>
                {label}
                <br />
                <div style={{ fontSize: '0.8rem', color: '#979797' }}>
                    <div>{notes}</div>
                </div>
            </div>

            <div>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{value}</div>

            {perks.map((perk, index) => {
                const perkDetails = getPerkDetails(perk);

                if (!perkDetails) return null;

                let color = 'red';

                switch (index) {
                    case 0:
                        if (value >= 30) color = 'green';
                        break;

                    case 1:
                        if (value >= 60) color = 'green';
                        break;

                    case 2:
                        if (value >= 100) color = 'green';
                        break;
                }

                return (
                    <div key={`${perk}-${index}`} style={{ color: color }}>
                        {perkDetails.name}
                        <br />
                        <div style={{ fontSize: '0.8rem', color: '#979797' }}>
                            <div>{perkDetails.description}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
