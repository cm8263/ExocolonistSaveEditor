import React, { useMemo, useState } from 'react';
import { getAllCardDetails } from '../../../exocolonist-core/src/utilities/getCardDetails.ts';
import { toTitleCase } from '../utilities/toTitleCase.ts';
import type { CardDetails } from '../../../exocolonist-core/src/types/interface/cardDetails.ts';

export const CARD_IMAGE_BASE_URL = 'https://cm8263.github.io/Exocolonist-Assets/images/cards';

interface CardsTableProps {
    cards: string[];
    onCardsChange?: (nextCards: string[]) => void;
}

const TABLE_COLUM_STYLE: React.CSSProperties = {
    textAlign: 'left',
    padding: '0.5rem',
    borderBottom: '2px solid #ccc',
};
const SMALL_IMAGE_STYLE: React.CSSProperties = {
    width: 48,
    height: 48,
    objectFit: 'contain',
    display: 'block',
};
const HOVER_PANEL_STYLE: React.CSSProperties = {
    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
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
    transformOrigin: 'left top',
    pointerEvents: 'auto',
    zIndex: 20,
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

const compareCardDetails = (a: CardDetails, b: CardDetails) => {
    const aType = (a.suit !== 'none' && a.suit) || a.type;
    const bType = (b.suit !== 'none' && b.suit) || b.type;
    const typeCmp = aType.localeCompare(bType);

    if (typeCmp !== 0) return typeCmp;

    return a.name.localeCompare(b.name);
};

const buildCardCounts = (cards: string[]) => {
    const map = new Map<string, number>();

    for (const id of cards) {
        map.set(id, (map.get(id) ?? 0) + 1);
    }

    return map;
};

const rebuildCardsArray = (
    cards: string[],
    updatedId: string,
    newCount: number,
    allCardDetails: CardDetails[],
): string[] => {
    const counts = buildCardCounts(cards);

    if (newCount <= 0) {
        counts.delete(updatedId);
    } else {
        counts.set(updatedId, newCount);
    }

    const result: string[] = [];

    for (const id of cards) {
        const remaining = counts.get(id);

        if (remaining && remaining > 0) {
            result.push(id);
            counts.set(id, remaining - 1);
        }
    }

    if (counts.size > 0) {
        for (const details of allCardDetails) {
            const remaining = counts.get(details.id);

            if (remaining && remaining > 0) {
                for (let i = 0; i < remaining; i++) {
                    result.push(details.id);
                }

                counts.delete(details.id);
            }
        }

        for (const [id, remaining] of counts) {
            for (let i = 0; i < remaining; i++) {
                result.push(id);
            }
        }
    }

    return result;
};

export function CardsTable({ cards, onCardsChange }: CardsTableProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const allCardDetails = useMemo(() => {
        return [...getAllCardDetails()].sort(compareCardDetails);
    }, []);

    const cardCounts = useMemo(() => buildCardCounts(cards), [cards]);

    const allCardsWithCounts = allCardDetails.map((details) => ({
        details,
        count: cardCounts.get(details.id) ?? 0,
    }));

    const ownedCards = allCardsWithCounts.filter((c) => c.count > 0);
    const missingCards = allCardsWithCounts.filter((c) => c.count === 0);

    const handleCountChange = (id: string, value: string) => {
        if (!onCardsChange) return;

        const numeric = Number(value);
        const safeValue = Number.isNaN(numeric) || numeric < 0 ? 0 : numeric;

        const nextCards = rebuildCardsArray(cards, id, safeValue, allCardDetails);
        onCardsChange(nextCards);
    };

    const renderRow = (details: CardDetails, count: number) => {
        const src = `${CARD_IMAGE_BASE_URL}/${details.id.toLowerCase()}.png`;
        const isHovered = hoveredId === details.id;
        const isMissing = count === 0;

        return (
            <tr key={details.id}>
                <td
                    style={{
                        padding: '0.5rem',
                        verticalAlign: 'middle',
                        width: '64px',
                    }}
                >
                    <div
                        style={{ position: 'relative', display: 'inline-block' }}
                        onMouseEnter={() => setHoveredId(details.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Small image */}
                        <img
                            src={src}
                            alt={details.name}
                            loading="lazy"
                            style={SMALL_IMAGE_STYLE}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                        />

                        {/* Hover panel */}
                        <div
                            style={{
                                ...HOVER_PANEL_STYLE,
                                visibility: isHovered ? 'visible' : 'hidden',
                                opacity: isHovered ? 1 : 0,
                                transform: isHovered ? 'scale(1)' : 'scale(0.95)',
                            }}
                            onMouseEnter={() => setHoveredId(details.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
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
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                            />

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
                                        <a
                                            href={details.artistWebsite}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: '#9adfff' }}
                                        >
                                            {details.artistWebsite}
                                        </a>
                                    </div>
                                )}

                                {details.artistSocialAt && details.artistSocialURL && (
                                    <div
                                        style={{
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
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
                        opacity: isMissing ? 0.5 : 1,
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
                        opacity: isMissing ? 0.5 : 1,
                    }}
                >
                    <input
                        type="number"
                        min={0}
                        max={details.type === 'gear' ? 1 : 999}
                        value={count}
                        style={{ width: '4rem' }}
                        onChange={(e) => handleCountChange(details.id, e.currentTarget.value)}
                    />
                </td>
            </tr>
        );
    };

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h2>Cards</h2>

            {/* Owned cards */}
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
                    {ownedCards.length === 0 ? (
                        <tr>
                            <td
                                colSpan={3}
                                style={{
                                    padding: '0.75rem',
                                    fontStyle: 'italic',
                                }}
                            >
                                You don&apos;t have any cards yet.
                            </td>
                        </tr>
                    ) : (
                        ownedCards.map(({ details, count }) => renderRow(details, count))
                    )}
                </tbody>
            </table>

            {/* Missing cards */}
            {missingCards.length > 0 && (
                <details style={{ marginTop: '1rem' }}>
                    <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
                        Missing cards ({missingCards.length})
                    </summary>

                    <div style={{ marginTop: '0.5rem' }}>
                        <table
                            style={{
                                borderCollapse: 'collapse',
                                marginTop: '0.25rem',
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
                                {missingCards.map(({ details, count }) =>
                                    renderRow(details, count),
                                )}
                            </tbody>
                        </table>
                    </div>
                </details>
            )}
        </div>
    );
}
