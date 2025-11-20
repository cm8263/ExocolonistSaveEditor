import { useState } from 'react';
import { getCardDescription } from '../../../exocolonist-core/src/utilities/getCardDescription.ts';

export const CARD_IMAGE_BASE_URL = 'https://cm8263.github.io/Exocolonist-Assets/images/cards/';

interface CardsTableProps {
    cards: string[];
}

export function CardsTable({ cards }: CardsTableProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h2>Cards</h2>

            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '0.5rem',
                }}
            >
                <thead>
                    <tr>
                        <th
                            style={{
                                textAlign: 'left',
                                padding: '0.5rem',
                                borderBottom: '2px solid #ccc',
                            }}
                        >
                            Image
                        </th>
                        <th
                            style={{
                                textAlign: 'left',
                                padding: '0.5rem',
                                borderBottom: '2px solid #ccc',
                            }}
                        >
                            Name
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {cards
                        .slice()
                        .sort((a, b) => a.localeCompare(b))
                        .map((card, index) => {
                            const src = `${CARD_IMAGE_BASE_URL}/${card}.png`;
                            const isHovered = hoveredIndex === index;

                            return (
                                <tr key={`${card}-${index}`}>
                                    <td
                                        style={{
                                            padding: '0.5rem',
                                            verticalAlign: 'middle',
                                            width: '64px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'relative',
                                                width: 48,
                                                height: 48,
                                            }}
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            {/* Small image */}
                                            <img
                                                src={src}
                                                alt={card}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    display: 'block',
                                                }}
                                                onError={(e) => {
                                                    (
                                                        e.currentTarget as HTMLImageElement
                                                    ).style.display = 'none';
                                                }}
                                            />

                                            {/* Big zoomed image */}
                                            <img
                                                src={src}
                                                alt={card}
                                                style={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    left: 'calc(100% + 8px)',
                                                    width: 160,
                                                    height: 160,
                                                    objectFit: 'contain',
                                                    opacity: isHovered ? 1 : 0,
                                                    transform: isHovered
                                                        ? 'scale(1)'
                                                        : 'scale(0.95)',
                                                    transformOrigin: 'left top',
                                                    transition:
                                                        'opacity 0.15s ease-out, transform 0.15s ease-out',
                                                    pointerEvents: 'none',
                                                    zIndex: 10,
                                                }}
                                                onError={(e) => {
                                                    (
                                                        e.currentTarget as HTMLImageElement
                                                    ).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </td>

                                    <td
                                        style={{
                                            padding: '0.5rem',
                                            verticalAlign: 'middle',
                                        }}
                                    >
                                        {getCardDescription(card)}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
