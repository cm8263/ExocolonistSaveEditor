import { useState } from 'react';
import * as React from 'react';
import { SaveGame } from '../../exocolonist-core/dist/types/class/saveGame';
import { ingestRawSaveFile } from '../../exocolonist-core/src/utilities/ingestRawSaveFile.ts';
import { SkillSlider } from './components/SkillSlider.tsx';
import { secondsToHoursMinutes } from './utilities/secondsToHoursMinutes.ts';
import { FloatSlider } from './components/FloatSlider.tsx';

function App() {
    const [saveGame, setSaveGame] = useState<SaveGame | null>(null);
    const [, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const HIDDEN_SKILLS = new Set(['kudos', 'stress', 'rebellion']);

    const updateSaveGame = (updater: (sg: SaveGame) => void) => {
        setSaveGame((prev) => {
            if (!prev) return prev;

            const next = new SaveGame(structuredClone(prev.data));
            updater(next);
            return next;
        });
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

    const handlePronounsChange = (value: number) => {
        updateSaveGame((next) => {
            next.pronouns = value;
        });
    };

    const handleAppearanceChange = (value: number) => {
        updateSaveGame((next) => {
            next.appearance = value;
        });
    };

    const handleSkillChange = (skillId: string, value: number) => {
        updateSaveGame((next) => {
            next.setSkill(skillId, value);
        });
    };

    return (
        <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1>Exocolonist Save Editor</h1>

            <input type="file" accept=".json" onChange={handleFileChange} />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {saveGame && (
                <>
                    {/* BASIC INFO */}
                    <section style={{ marginTop: '1.5rem' }}>
                        <h2>Basic Info</h2>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <label>
                                Player Name:{' '}
                                <input
                                    value={saveGame.playerName}
                                    onChange={handleNameChange}
                                    style={{ padding: '0.25rem' }}
                                />
                            </label>
                        </div>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <label>
                                Week:{' '}
                                <input
                                    value={saveGame.week}
                                    onChange={handleWeekChange}
                                    style={{ padding: '0.25rem' }}
                                    type="number"
                                    min="1"
                                    max="999"
                                />
                            </label>
                        </div>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <label>
                                Expedition Job ID:{' '}
                                <input
                                    value={saveGame.expeditionJobId}
                                    onChange={handleExpeditionJobIdChange}
                                    style={{ padding: '0.25rem' }}
                                />
                            </label>
                        </div>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <label>
                                Play Time (seconds):{' '}
                                <input
                                    value={saveGame.playTime}
                                    onChange={handlePlayTimeChange}
                                    style={{ padding: '0.25rem' }}
                                    type="number"
                                    min="0"
                                />
                            </label>
                            {(() => {
                                const hoursMins = secondsToHoursMinutes(saveGame.playTime);
                                return <span style={{ marginLeft: '0.5rem' }}>({hoursMins})</span>;
                            })()}
                        </div>
                    </section>

                    {/* IDENTITY */}
                    <section style={{ marginTop: '1.5rem' }}>
                        <h2>Identity</h2>
                        {/* TODO: check the naming of the sliders in-game and match here */}
                        <FloatSlider
                            label="Pronouns"
                            value={saveGame.pronouns}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={handlePronounsChange}
                        />

                        <FloatSlider
                            label="Appearance"
                            value={saveGame.appearance}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={handleAppearanceChange}
                        />
                    </section>

                    {/* SKILLS */}
                    <section style={{ marginTop: '1.5rem' }}>
                        <h2>Skills</h2>
                        {saveGame.data.skills
                            .filter((s) => !HIDDEN_SKILLS.has(s.name))
                            .map((skill) => (
                                <SkillSlider
                                    key={skill.name}
                                    label={skill.name}
                                    value={skill.value}
                                    onChange={(v) => handleSkillChange(skill.name, v)}
                                />
                            ))}
                    </section>

                    {/* PLACEHOLDERS FOR FUTURE SECTIONS */}
                    {/* Relationships, statuses, cards, etc. */}
                    {/* <section style={{ marginTop: '1.5rem' }}>
                        <h2>Relationships</h2>
                        // map over saveGame.love here with sliders and handleLoveChange(...)
                    </section> */}

                    <section style={{ marginTop: '1.5rem' }}>
                        <button>Download edited save</button>
                    </section>
                </>
            )}
        </div>
    );
}

export default App;
