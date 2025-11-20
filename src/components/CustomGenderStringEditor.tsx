import React from 'react';
import type { CustomGenderString } from '../../../exocolonist-core/dist/types/interface/customGenderString';

interface CustomGenderStringEditorProps {
    entries: CustomGenderString[];
    onChange: (entries: CustomGenderString[]) => void;
}

export function CustomGenderStringEditor({ entries, onChange }: CustomGenderStringEditorProps) {
    const [rows, setRows] = React.useState(entries);

    const updateValue = (index: number, newValue: string) => {
        const next = rows.map((row, i) => (i === index ? { ...row, value: newValue } : row));

        setRows(next);
        onChange?.(next);
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th
                        style={{
                            textAlign: 'left',
                            padding: '4px 8px',
                            width: '40%',
                        }}
                    >
                        Pronoun
                    </th>
                    <th
                        style={{
                            textAlign: 'left',
                            padding: '4px 8px',
                            width: '60%',
                        }}
                    >
                        Value
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => {
                    return (
                        <tr key={row.string}>
                            <td
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '0.85rem',
                                    color: '#aaa',
                                }}
                            >
                                <div>{row.string.replaceAll('|', ' / ')}</div>
                            </td>
                            <td style={{ padding: '4px 8px' }}>
                                <input
                                    type="text"
                                    value={row.value}
                                    onChange={(e) => updateValue(index, e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
