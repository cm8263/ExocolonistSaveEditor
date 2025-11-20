import React, { useState } from 'react';
import { SaveGame } from '../../exocolonist-core/dist/types/class/saveGame';
import { ingestRawSaveFile } from '../../exocolonist-core/src/utilities/ingestRawSaveFile.ts';
import { SkillSlider } from './components/SkillSlider.tsx';
import { secondsToHoursMinutes } from './utilities/secondsToHoursMinutes.ts';
import { FloatSlider } from './components/FloatSlider.tsx';
import { CardsTable } from './components/CardsTable.tsx';
import { getSkillDetails } from '../../exocolonist-core/src/utilities/getSkillDetails.ts';
import { CustomGenderStringEditor } from './components/CustomGenderStringEditor.tsx';
import type { CustomGenderString } from '../../exocolonist-core/dist/types/interface/customGenderString';
import { exportParsedSaveFile } from '../../exocolonist-core/src/utilities/exportParsedSaveFile.ts';

const SPECIAL_SKILLS = new Set(['kudos', 'stress', 'rebellion']);

const ROW_STYLE: React.CSSProperties = { marginBottom: '0.5rem' };
const SECTION_STYLE: React.CSSProperties = { marginTop: '1.5rem' };
const INPUT_STYLE: React.CSSProperties = { padding: '0.25rem' };
const BUTTON_STYLE: React.CSSProperties = { padding: '0.25rem' };

function App() {
    const [saveGame, setSaveGame] = useState<SaveGame | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateSaveGame = (updater: (sg: SaveGame) => void) => {
        setSaveGame((prev) => {
            if (!prev) return prev;

            const next = new SaveGame(structuredClone(prev.parsedSaveFile));
            updater(next);
            return next;
        });
    };

    const exportSaveGame = () => {
        if (!saveGame) return;

        try {
            const json = exportParsedSaveFile(saveGame.parsedSaveFile);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const baseName =
                fileName?.replace(/\.json$/i, '') ??
                `${saveGame.playerName || 'exo-save'}-week-${saveGame.week}`;

            const a = document.createElement('a');
            a.href = url;
            a.download = `${baseName}-edited.json`;

            document.body.appendChild(a);

            a.click();
            a.remove();

            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            setError('Failed to export save file.');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setFileName(file.name);

        const text = await file.text();

        try {
            const parsed = ingestRawSaveFile(text);
            const sg = new SaveGame(parsed);
            setSaveGame(sg);
        } catch (err) {
            console.error(err);
            setError('Failed to parse save file. Is this a valid Exocolonist save?');
            setSaveGame(null);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateSaveGame((next) => {
            next.playerName = value;
        });
    };

    const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (Number.isNaN(value)) return;

        updateSaveGame((next) => {
            next.week = value;
        });
    };

    const handleExpeditionJobIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateSaveGame((next) => {
            next.expeditionJobId = value;
        });
    };

    const handlePlayTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value) || value < 0) return;

        updateSaveGame((next) => {
            next.playTime = value;
        });
    };

    const handleKudosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value) || value < 0 || value > 999) return;

        updateSaveGame((next) => {
            next.setSkill('kudos', value);
        });
    };

    const setMaxKudos = () => {
        updateSaveGame((next) => {
            next.setSkill('kudos', 999);
        });
    };

    const handlePronounsChange = (value: number) => {
        updateSaveGame((next) => {
            next.pronouns = value;
        });
    };

    const handleCustomGenderStringChange = (entries: CustomGenderString[]) => {
        updateSaveGame((next) => {
            next.customGenderStrings = entries;
        });
    };

    const handleAppearanceChange = (value: number) => {
        updateSaveGame((next) => {
            next.appearance = value;
        });
    };

    const handleSkillChange = (skillId: string, value: number) => {
        if (Number.isNaN(value) || value < 0 || value > 100) return;

        updateSaveGame((next) => {
            next.setSkill(skillId, value);
        });
    };

    const playTimeLabel = saveGame ? secondsToHoursMinutes(saveGame.playTime) : '';
    const rebellionValue = saveGame ? saveGame.getSkill('rebellion') : 0;
    const rebellionIsRebel = rebellionValue > 50;
    const rebellionLabel = rebellionIsRebel ? '(Rebel)' : '(Loyalist)';
    const rebellionColor = rebellionIsRebel ? 'red' : 'blue';

    return (
        <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1>Exocolonist Save Editor</h1>

            <input type="file" accept=".json" onChange={handleFileChange} />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {saveGame && (
                <>
                    {/* BASIC INFO */}
                    <section style={SECTION_STYLE}>
                        <h2>Basic Info</h2>

                        <div style={ROW_STYLE}>
                            <label>
                                Player Name:{' '}
                                <input
                                    value={saveGame.playerName}
                                    onChange={handleNameChange}
                                    style={INPUT_STYLE}
                                />
                            </label>
                        </div>

                        <div style={ROW_STYLE}>
                            <label>
                                Week:{' '}
                                <input
                                    value={saveGame.week}
                                    onChange={handleWeekChange}
                                    style={INPUT_STYLE}
                                    type="number"
                                    min="1"
                                    max="999"
                                />
                            </label>
                        </div>

                        <div style={ROW_STYLE}>
                            <label>
                                Expedition Job ID:{' '}
                                <input
                                    value={saveGame.expeditionJobId}
                                    onChange={handleExpeditionJobIdChange}
                                    style={INPUT_STYLE}
                                />
                            </label>
                        </div>

                        <div style={ROW_STYLE}>
                            <label>
                                Play Time (seconds):{' '}
                                <input
                                    value={saveGame.playTime}
                                    onChange={handlePlayTimeChange}
                                    style={INPUT_STYLE}
                                    type="number"
                                    min="0"
                                />
                            </label>
                            <span style={{ marginLeft: '0.5rem' }}>({playTimeLabel})</span>
                        </div>

                        <div style={ROW_STYLE}>
                            <label>
                                Kudos:{' '}
                                <input
                                    value={saveGame.getSkill('kudos')}
                                    onChange={handleKudosChange}
                                    style={INPUT_STYLE}
                                    type="number"
                                    min="0"
                                    max="999"
                                />
                            </label>{' '}
                            <button onClick={setMaxKudos} style={BUTTON_STYLE} type="button">
                                Set Max
                            </button>
                        </div>

                        <div style={ROW_STYLE}>
                            <label>
                                Stress:{' '}
                                <input
                                    value={saveGame.getSkill('stress')}
                                    onChange={(e) =>
                                        handleSkillChange('stress', Number(e.target.value))
                                    }
                                    style={INPUT_STYLE}
                                    type="number"
                                    min="0"
                                    max="100"
                                />
                            </label>{' '}
                            <button
                                onClick={() => handleSkillChange('stress', 0)}
                                style={BUTTON_STYLE}
                                type="button"
                            >
                                Set Zero
                            </button>
                        </div>

                        <div style={ROW_STYLE}>
                            <label>
                                Rebellion:{' '}
                                <input
                                    value={rebellionValue}
                                    onChange={(e) =>
                                        handleSkillChange('rebellion', Number(e.target.value))
                                    }
                                    style={INPUT_STYLE}
                                    type="number"
                                    min="0"
                                    max="100"
                                />
                            </label>{' '}
                            <span style={{ color: rebellionColor }}>{rebellionLabel}</span>{' '}
                            <button
                                onClick={() => handleSkillChange('rebellion', 0)}
                                style={BUTTON_STYLE}
                                type="button"
                            >
                                Set Loyal
                            </button>{' '}
                            <button
                                onClick={() => handleSkillChange('rebellion', 100)}
                                style={BUTTON_STYLE}
                                type="button"
                            >
                                Set Rebellious
                            </button>
                        </div>
                    </section>

                    {/* IDENTITY */}
                    <section style={SECTION_STYLE}>
                        <h2>Identity</h2>
                        <FloatSlider
                            label="Pronouns"
                            value={saveGame.pronouns}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={handlePronounsChange}
                            minLabel={'She/Her'}
                            maxLabel={'He/Him'}
                        />

                        <FloatSlider
                            label="Appearance"
                            value={saveGame.appearance}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={handleAppearanceChange}
                            minLabel={'Feminine'}
                            maxLabel={'Masculine'}
                        />

                        {saveGame.customGenderStrings.length > 0 && (
                            <CustomGenderStringEditor
                                entries={saveGame.customGenderStrings}
                                onChange={handleCustomGenderStringChange}
                            ></CustomGenderStringEditor>
                        )}
                    </section>

                    {/* SKILLS */}
                    <section style={SECTION_STYLE}>
                        <h2>Skills</h2>
                        <div className={'skill-grid'}>
                            <div style={{ fontWeight: 500 }}>Skill</div>
                            <div style={{ fontWeight: 500 }}></div>
                            <div style={{ fontWeight: 500 }}>Value</div>
                            <div style={{ fontWeight: 500 }}>1st Perk</div>
                            <div style={{ fontWeight: 500 }}>2nd Perk</div>
                            <div style={{ fontWeight: 500 }}>3rd Perk</div>
                        </div>

                        {saveGame.skills
                            .filter((s) => !SPECIAL_SKILLS.has(s.name))
                            .map((skill) => {
                                const skillDetail = getSkillDetails(skill.name);

                                if (!skillDetail) return;

                                return (
                                    <SkillSlider
                                        key={skill.name}
                                        label={skillDetail.name}
                                        notes={skillDetail.notes}
                                        perks={[
                                            skillDetail.perk30,
                                            skillDetail.perk60,
                                            skillDetail.perk100,
                                        ]}
                                        value={skill.value}
                                        onChange={(v) => handleSkillChange(skill.name, v)}
                                    />
                                );
                            })}
                    </section>

                    {/* CARDS */}
                    <section style={SECTION_STYLE}>
                        <CardsTable cards={saveGame.cards} />
                    </section>

                    {/* DOWNLOAD */}
                    <section style={SECTION_STYLE}>
                        <button onClick={exportSaveGame} type="button">
                            Download edited save
                        </button>
                    </section>
                </>
            )}
        </div>
    );
}

export default App;
