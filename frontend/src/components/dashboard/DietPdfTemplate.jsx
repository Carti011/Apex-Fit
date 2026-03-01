import React from 'react';

// Helper to render markdown-like bolds inline
const renderBold = (text) => {
    if (!text || typeof text !== 'string') return text;
    if (!text.includes('**')) return text;
    const parts = text.split('**');
    return (
        <span>
            {parts.map((part, index) =>
                index % 2 === 1 ? <strong key={index} style={{ color: '#00ff88', fontWeight: 'bold' }}>{part}</strong> : <span key={index}>{part}</span>
            )}
        </span>
    );
};

const DietPdfTemplate = ({ data }) => {
    if (!data) return null;

    const { athleteName, emissionDate, headerLines, meals, hydration } = data;

    return (
        <div style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
            color: '#e2e8f0',
            padding: '40px',
            boxSizing: 'border-box',
            minHeight: '100vh',
            width: '800px', // FIXING width for standard PDF A4 portrait ratio approximation
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)', zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
                filter: 'blur(60px)', zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* Cabeçalho */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                    paddingBottom: '20px',
                    marginBottom: '30px'
                }}>
                    <div>
                        <h1 style={{
                            color: '#00ff88',
                            fontSize: '2.5rem',
                            margin: 0,
                            letterSpacing: '3px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            textShadow: '0 0 20px rgba(0, 255, 136, 0.4)'
                        }}>APEX<span style={{ color: 'white' }}>FIT</span></h1>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '0.9rem',
                            margin: '5px 0 0',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: 600
                        }}>Nutrição de Alta Performance</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>
                            <strong style={{ color: '#00ff88' }}>Atleta: </strong> {athleteName}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                            <strong style={{ color: '#00ff88' }}>Emissão: </strong> {emissionDate}
                        </p>
                    </div>
                </div>

                {/* Resumo/Objetivos (Glassmorphism Highlight) */}
                {headerLines && headerLines.length > 0 && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderLeft: '4px solid #38bdf8', /* Azul neon pra destacar o header */
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '32px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                    }}>
                        {headerLines.map((line, idx) => (
                            <p key={idx} style={{
                                margin: '0 0 8px 0',
                                fontSize: '1.05rem',
                                lineHeight: '1.5'
                            }}>
                                {renderBold(line)}
                            </p>
                        ))}
                    </div>
                )}

                {/* Refeições Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    alignItems: 'start'
                }}>
                    {meals && meals.map((meal, index) => (
                        <div key={index} style={{
                            pageBreakInside: 'avoid',
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(0, 255, 136, 0.15)',
                            borderTop: '3px solid #00ff88',
                            borderRadius: '12px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                        }}>
                            <h3 style={{
                                color: '#00ff88',
                                margin: '0 0 15px 0',
                                fontSize: '1.2rem',
                                borderBottom: '1px dashed rgba(0, 255, 136, 0.2)',
                                paddingBottom: '10px'
                            }}>
                                {renderBold(meal.title)}
                            </h3>

                            <div style={{ flex: 1 }}>
                                {meal.items.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '10px',
                                        fontSize: '0.95rem',
                                        color: '#cbd5e1'
                                    }}>
                                        <span style={{ color: '#00ff88', marginRight: '8px', fontSize: '1.2rem', lineHeight: '1' }}>•</span>
                                        <span style={{ lineHeight: '1.4' }}>{renderBold(item)}</span>
                                    </div>
                                ))}
                            </div>

                            {meal.totals && (
                                <div style={{
                                    marginTop: '15px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                    fontWeight: '600',
                                    color: '#38bdf8', /* Azul pra contrastar o total */
                                    fontSize: '0.95rem'
                                }}>
                                    {renderBold(meal.totals)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Hidratação & Rodapé */}
                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    background: 'rgba(56, 189, 248, 0.05)',
                    border: '1px dashed rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h4 style={{ color: '#38bdf8', margin: '0 0 5px 0', fontSize: '1.1rem' }}>💧 Meta de Hidratação</h4>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0', fontWeight: 'bold' }}>
                        {hydration ? renderBold(hydration) : 'Conforme metabolismo (Mínimo 2.5L)'}
                    </p>
                </div>

                <div style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '15px'
                }}>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0, letterSpacing: '1px' }}>
                        GERADO POR APEX FIT IA — NUTRIÇÃO DIGITAL AVANÇADA
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DietPdfTemplate;
