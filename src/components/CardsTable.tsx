import React, { useState } from 'react';
import { getCardDetails } from '../../../exocolonist-core/src/utilities/getCardDetails.ts';
import { toTitleCase } from '../utilities/toTitleCase.ts';
import type { CardDetails } from '../../../exocolonist-core/src/types/interface/cardDetails.ts';

export const CARD_IMAGE_BASE_URL = 'https://cm8263.github.io/Exocolonist-Assets/images/cards';

interface CardsTableProps {
    cards: string[];
}

const TABLE_COLUM_STYLE: React.CSSProperties = {
    textAlign: 'left',
    padding: '0.5rem',
    borderBottom: '2px solid #ccc',
};

const getCardType = (details: CardDetails) => {
    const type = toTitleCase(details.suit !== 'none' ? details.suit : details.type);

    let color;

    switch (type) {
        case 'Collectible':
            color = 'orange';
            break;

        case 'Gear':
            color = 'purple';
            break;

        case 'Social':
            color = 'yellow';
            break;

        case 'Mental':
            color = 'blue';
            break;

        case 'Physical':
            color = 'red';
            break;

        case 'Wildcard':
            color = 'pink';
            break;

        default:
            color = 'black';
            break;
    }

    return <span style={{ color }}>{type}</span>;
};

export function CardsTable({ cards }: CardsTableProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const cardCounts = new Map<string, number>();

    for (const id of cards) {
        cardCounts.set(id, (cardCounts.get(id) ?? 0) + 1);
    }

    const cardsToRender = Array.from(cardCounts.entries())
        .map(([id, count]) => {
            const details = getCardDetails(id);

            return !details ? null : { details, count };
        })
        .filter((entry): entry is { details: CardDetails; count: number } => entry !== null)
        .sort((a, b) => {
            const aType = (a.details.suit !== 'none' && a.details.suit) || a.details.type;
            const bType = (b.details.suit !== 'none' && b.details.suit) || b.details.type;

            const typeCmp = aType.localeCompare(bType);

            if (typeCmp !== 0) return typeCmp;

            return a.details.name.localeCompare(b.details.name);
        });

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h2>Cards</h2>

            <table
                style={{
                    borderCollapse: 'collapse',
                    marginTop: '0.5rem',
                }}
            >
                <thead>
                    <tr>
                        <th style={TABLE_COLUM_STYLE}>Image</th>
                        <th style={TABLE_COLUM_STYLE}>Name</th>
                        <th style={TABLE_COLUM_STYLE}>Quantity</th>
                    </tr>
                </thead>

                <tbody>
                    {cardsToRender.map(({ details, count }, index) => {
                        const src = `${CARD_IMAGE_BASE_URL}/${details.id.toLowerCase()}.png`;
                        const isHovered = hoveredIndex === index;

                        return (
                            <tr key={`${details.id}-${index}`}>
                                <td
                                    style={{
                                        padding: '0.5rem',
                                        verticalAlign: 'middle',
                                        width: '64px',
                                    }}
                                >
                                    <div
                                        style={{ position: 'relative', display: 'inline-block' }}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        {/* Small image */}
                                        <img
                                            src={src}
                                            alt={details.name}
                                            loading="lazy"
                                            style={{
                                                width: 48,
                                                height: 48,
                                                objectFit: 'contain',
                                                display: 'block',
                                            }}
                                            onError={(e) => {
                                                (
                                                    e.currentTarget as HTMLImageElement
                                                ).style.display = 'none';
                                            }}
                                        />

                                        {/* Hover panel: big image + artist info */}
                                        <div
                                            style={{
                                                visibility: isHovered ? 'visible' : 'hidden',
                                                opacity: isHovered ? 1 : 0,
                                                transition:
                                                    'opacity 0.15s ease-out, transform 0.15s ease-out',
                                                position: 'absolute',
                                                top: -8,
                                                left: '90%',
                                                padding: '0.5rem 0.75rem',
                                                background: 'rgba(0, 0, 0, 0.9)',
                                                color: '#fff',
                                                borderRadius: 6,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                                                display: 'flex',
                                                gap: '0.75rem',
                                                alignItems: 'flex-start',
                                                transform: isHovered ? 'scale(1)' : 'scale(0.95)',
                                                transformOrigin: 'left top',
                                                pointerEvents: 'auto',
                                                zIndex: 20,
                                            }}
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            {/* Big image */}
                                            <img
                                                src={src}
                                                alt={details.name}
                                                loading="lazy"
                                                decoding="async"
                                                style={{
                                                    width: 256,
                                                    height: 256,
                                                    objectFit: 'contain',
                                                    flexShrink: 0,
                                                }}
                                                onError={(e) => {
                                                    (
                                                        e.currentTarget as HTMLImageElement
                                                    ).style.display = 'none';
                                                }}
                                            />

                                            {/* Artist info */}
                                            <div
                                                style={{
                                                    fontSize: '1.2rem',
                                                    lineHeight: 1.4,
                                                    whiteSpace: 'normal',
                                                    alignSelf: 'center',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        marginBottom: 4,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Illustration by {details.artistName}
                                                </div>

                                                {details.artistWebsite && (
                                                    <div
                                                        style={{
                                                            marginBottom: 2,
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        Website:{' '}
                                                        <a
                                                            href={
                                                                details.artistWebsite.startsWith(
                                                                    'http',
                                                                )
                                                                    ? details.artistWebsite
                                                                    : `https://${details.artistWebsite}`
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ color: '#9adfff' }}
                                                        >
                                                            {details.artistWebsite}
                                                        </a>
                                                    </div>
                                                )}

                                                {details.artistSocialAt &&
                                                    details.artistSocialURL && (
                                                        <div
                                                            style={{
                                                                whiteSpace: 'nowrap', // <- single line
                                                            }}
                                                        >
                                                            Social:{' '}
                                                            <a
                                                                href={details.artistSocialURL}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                style={{ color: '#9adfff' }}
                                                            >
                                                                @{details.artistSocialAt}
                                                            </a>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td
                                    style={{
                                        padding: '0.5rem',
                                        verticalAlign: 'middle',
                                    }}
                                >
                                    {details.name}
                                    <p
                                        style={{
                                            fontSize: '0.8rem',
                                            marginTop: '0.1vh',
                                        }}
                                    >
                                        {getCardType(details)}
                                    </p>
                                </td>

                                <td
                                    style={{
                                        padding: '0.5rem',
                                        verticalAlign: 'middle',
                                    }}
                                >
                                    {/* Quantity input, read-only for now */}
                                    <input
                                        type="number"
                                        min={0}
                                        value={count}
                                        readOnly
                                        style={{ width: '4rem' }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
