import React, { useState } from 'react';
import {
    User, Mail, Lock, ShieldCheck, Eye, EyeOff,
    ChevronDown, Weight, Ruler, Droplet,
    Calendar, Target, Activity, Save, Info, LogOut
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AccountSettings.css';

// Componente de seção colapsável reutilizável
const SecaoColapsavel = ({ titulo, icone: Icone, descricao, cor = '#00ff88', defaultOpen = false, children }) => {
    const [aberta, setAberta] = useState(defaultOpen);
    return (
        <div
            className={`settings-section${aberta ? ' is-open' : ''}`}
            style={{ '--secao-cor': cor }}
        >
            <button
                type="button"
                className="secao-toggle"
                onClick={() => setAberta(!aberta)}
                aria-expanded={aberta}
            >
                <div className="secao-toggle-left">
                    {Icone && (
                        <div className="secao-icon-badge" style={{
                            background: `${cor}1a`,
                            border: `1px solid ${cor}33`,
                            color: cor,
                        }}>
                            <Icone size={18} />
                        </div>
                    )}
                    <div className="secao-texto">
                        <h3 className="section-title">{titulo}</h3>
                        {descricao && <p className="section-desc">{descricao}</p>}
                    </div>
                </div>
                <div className={`secao-chevron${aberta ? ' open' : ''}`}>
                    <ChevronDown size={16} />
                </div>
            </button>
            {aberta && <div className="secao-conteudo">{children}</div>}
        </div>
    );
};

const AccountSettings = ({ user, onUpdateSuccess }) => {
    const { updateUser, logout } = useAuth();

    // ─── Estado: Conta / Senha ────────────────────────────
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingConta, setLoadingConta] = useState(false);
    const [messageConta, setMessageConta] = useState({ type: '', text: '' });

    // ─── Estado: Medidas (mensal) ─────────────────────────
    const [weight, setWeight] = useState(user?.weight || user?.bioProfile?.weight || '');
    const [bodyFat, setBodyFat] = useState(user?.bodyFatPercentage || user?.bioProfile?.bodyFatPercentage || '');
    const [loadingMedidas, setLoadingMedidas] = useState(false);
    const [messageMedidas, setMessageMedidas] = useState({ type: '', text: '' });

    // ─── Estado: Dados Pessoais (raro) ────────────────────
    const [bioData, setBioData] = useState({
        birthDate: user?.birthDate || user?.bioProfile?.birthDate || '',
        gender: user?.gender || user?.bioProfile?.gender || 'MALE',
        height: user?.height || user?.bioProfile?.height || '',
    });

    // ─── Estado: Objetivo / Atividade (trimestral) ────────
    const [objetivo, setObjetivo] = useState(user?.goal || user?.bioProfile?.goal || 'LOSE_WEIGHT');
    const [atividade, setAtividade] = useState(user?.activityLevel || user?.bioProfile?.activityLevel || 'MODERATE');
    const [loadingObjetivo, setLoadingObjetivo] = useState(false);
    const [messageObjetivo, setMessageObjetivo] = useState({ type: '', text: '' });

    // ── Handler: Salvar nome/senha ────────────────────────
    const handleUpdateConta = async (e) => {
        e.preventDefault();
        if (newPassword && newPassword !== confirmPassword) {
            setMessageConta({ type: 'error', text: 'A nova senha e a confirmação não coincidem.' });
            return;
        }
        setLoadingConta(true);
        setMessageConta({ type: '', text: '' });
        try {
            const payload = { name, currentPassword: currentPassword || null, newPassword: newPassword || null };
            const updatedData = await api.updateAccountProfile(user.token, payload);
            if (updatedData?.name) updateUser({ name: updatedData.name });
            setMessageConta({ type: 'success', text: 'Conta atualizada com sucesso!' });
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            if (onUpdateSuccess) onUpdateSuccess(updatedData);
        } catch {
            setMessageConta({ type: 'error', text: 'Erro ao atualizar conta. Verifique sua senha atual.' });
        } finally {
            setLoadingConta(false);
        }
    };

    // ── Handler: Salvar Medidas + Objetivo (BioProfile) ──
    const salvarBioProfile = async (camposExtras = {}) => {
        const payload = {
            birthDate: bioData.birthDate,
            gender: bioData.gender,
            height: bioData.height ? parseFloat(bioData.height) : null,
            weight: weight ? parseFloat(weight) : null,
            bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : null,
            goal: objetivo,
            activityLevel: atividade,
            ...camposExtras,
        };
        return await api.updateBioProfile(user.token, payload);
    };

    const handleSalvarMedidas = async (e) => {
        e.preventDefault();
        setLoadingMedidas(true);
        setMessageMedidas({ type: '', text: '' });
        try {
            const updatedData = await salvarBioProfile();
            setMessageMedidas({ type: 'success', text: 'Medidas atualizadas!' });
            if (onUpdateSuccess) onUpdateSuccess(updatedData);
        } catch {
            setMessageMedidas({ type: 'error', text: 'Erro ao salvar medidas.' });
        } finally {
            setLoadingMedidas(false);
        }
    };

    const handleSalvarObjetivo = async (e) => {
        e.preventDefault();
        setLoadingObjetivo(true);
        setMessageObjetivo({ type: '', text: '' });
        try {
            const updatedData = await salvarBioProfile();
            setMessageObjetivo({ type: 'success', text: 'Objetivo e atividade salvos!' });
            if (onUpdateSuccess) onUpdateSuccess(updatedData);
        } catch {
            setMessageObjetivo({ type: 'error', text: 'Erro ao salvar objetivo.' });
        } finally {
            setLoadingObjetivo(false);
        }
    };

    const handleSalvarDadosPessoais = async () => {
        try {
            const updatedData = await salvarBioProfile();
            if (onUpdateSuccess) onUpdateSuccess(updatedData);
        } catch { /* silencioso */ }
    };

    const nivel = user?.level || 1;
    const getUserTitle = (lvl) => {
        if (lvl >= 100) return '🏆 Lenda do Apex Fit';
        if (lvl >= 50) return '👑 Elite';
        if (lvl >= 25) return '🏋️ Atleta Focado';
        if (lvl >= 10) return '🏃 Amador';
        return '🌱 Iniciante';
    };

    return (
        <div className="account-settings-container slide-up-fade">
            {/* ─── Card de Perfil ─── */}
            <div className="profile-hero-card">
                <div className="profile-hero-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="profile-hero-info">
                    <h2 className="profile-hero-name">{user?.name || 'Usuário'}</h2>
                    <span className="profile-hero-title">{getUserTitle(nivel)}</span>
                    <span className="profile-hero-email">{user?.email || ''}</span>
                </div>
                <div className="profile-hero-level">
                    <span className="profile-hero-level-number">{nivel}</span>
                    <span className="profile-hero-level-label">nível</span>
                </div>
            </div>

            {/* ─── Seção 1: Dados Principais + Senha (sempre visível) ─── */}
            <SecaoColapsavel
                titulo="Dados da Conta"
                icone={ShieldCheck}
                descricao="Nome, e-mail e senha de acesso"
            >
                {messageConta.text && (
                    <div className={`status-message ${messageConta.type}`}>{messageConta.text}</div>
                )}
                <form onSubmit={handleUpdateConta} className="settings-form">
                    <div className="form-group">
                        <label>Nome de Exibição</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="glass-input padding-left-icon" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>E-mail Cadastrado</label>
                        <div className="input-with-icon disabled-input">
                            <Mail size={18} className="input-icon" />
                            <input type="email" value={user?.email || ''} className="glass-input padding-left-icon" disabled />
                        </div>
                        <div className="email-status">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>E-mail protegido (alteração indisponível no MVP 1.0)</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label><Lock size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />Senha Atual</label>
                        <div className="password-input-wrapper">
                            <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="glass-input padding-right-icon" placeholder="Apenas para alterar senha" />
                            <button type="button" className="password-toggle-btn" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-row-2">
                        <div className="form-group">
                            <label>Nova Senha</label>
                            <div className="password-input-wrapper">
                                <input type={showNewPassword ? 'text' : 'password'} value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="glass-input padding-right-icon" placeholder="Mín. 6 caracteres" />
                                <button type="button" className="password-toggle-btn" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirmar Nova Senha</label>
                            <div className="password-input-wrapper">
                                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="glass-input padding-right-icon" placeholder="Repita a senha" />
                                <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="save-settings-btn generic-btn primary glow" disabled={loadingConta}>
                        {loadingConta ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </SecaoColapsavel>

            {/* ─── Seção 2: Medidas Físicas (mensal) ─── */}
            <SecaoColapsavel
                titulo="Atualizar Medidas"
                icone={Weight}
                descricao="Peso e % de gordura corporal"
                cor="#60a5fa"
            >
                {messageMedidas.text && (
                    <div className={`status-message ${messageMedidas.type}`}>{messageMedidas.text}</div>
                )}
                <form onSubmit={handleSalvarMedidas} className="settings-form">
                    <div className="form-row-2">
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Weight size={15} /> Peso Atual (kg)
                            </label>
                            <input type="number" step="0.1" placeholder="Ex: 75.5" value={weight}
                                onChange={e => setWeight(e.target.value)} className="glass-input" required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Droplet size={15} /> BF % <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>(Opcional)</span>
                            </label>
                            <input type="number" step="0.1" placeholder="Ex: 15.5" value={bodyFat}
                                onChange={e => setBodyFat(e.target.value)} className="glass-input" />
                        </div>
                    </div>
                    <div className="info-box">
                        <Info size={15} />
                        <span>Com BF% preenchido, usamos a fórmula <strong>Katch-McArdle</strong> (mais precisa). Sem ela, usamos <strong>Mifflin-St Jeor</strong>.</span>
                    </div>
                    <button type="submit" className="save-settings-btn generic-btn primary" disabled={loadingMedidas}>
                        <Save size={16} /> {loadingMedidas ? 'Salvando...' : 'Salvar Medidas'}
                    </button>
                </form>
            </SecaoColapsavel>

            {/* ─── Seção 3: Objetivo + Atividade (trimestral) ─── */}
            <SecaoColapsavel
                titulo="Meu Objetivo"
                icone={Target}
                descricao="Alvo metabólico e nível de atividade física"
                cor="#a78bfa"
            >
                {messageObjetivo.text && (
                    <div className={`status-message ${messageObjetivo.type}`}>{messageObjetivo.text}</div>
                )}
                <form onSubmit={handleSalvarObjetivo} className="settings-form">
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Target size={15} /> Alvo Metabólico
                        </label>
                        <select value={objetivo} onChange={e => setObjetivo(e.target.value)} className="glass-input">
                            <option value="LOSE_WEIGHT">🔥 Secar (Déficit Calórico)</option>
                            <option value="MAINTAIN">⚖️ Manter Peso (Manutenção)</option>
                            <option value="GAIN_MUSCLE">💪 Construir Músculo (Superávit)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Activity size={15} /> Nível de Atividade
                        </label>
                        <select value={atividade} onChange={e => setAtividade(e.target.value)} className="glass-input">
                            <option value="SEDENTARY">🛋️ Sedentário (Pouco ou nenhum exercício)</option>
                            <option value="LIGHT">🚶 Levemente Ativo (1-3 dias/semana)</option>
                            <option value="MODERATE">🏃 Moderadamente Ativo (3-5 dias/semana)</option>
                            <option value="ACTIVE">🏋️ Muito Ativo (6-7 dias/semana)</option>
                            <option value="VERY_ACTIVE">⚡ Extremamente Ativo (Trabalho físico pesado)</option>
                        </select>
                    </div>
                    <button type="submit" className="save-settings-btn generic-btn primary" disabled={loadingObjetivo}>
                        <Save size={16} /> {loadingObjetivo ? 'Salvando...' : 'Salvar Objetivo'}
                    </button>
                </form>
            </SecaoColapsavel>

            {/* ─── Seção 4: Dados Pessoais (raro) ─── */}
            <SecaoColapsavel
                titulo="Dados Pessoais"
                icone={Calendar}
                descricao="Data de nascimento, sexo e altura"
                cor="#64748b"
            >
                <div className="settings-form">
                    <div className="form-row-2">
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Calendar size={15} /> Data de Nascimento
                            </label>
                            <input type="date" value={bioData.birthDate}
                                onChange={e => setBioData({ ...bioData, birthDate: e.target.value })}
                                className="glass-input" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <User size={15} /> Sexo Biológico
                            </label>
                            <select value={bioData.gender} onChange={e => setBioData({ ...bioData, gender: e.target.value })} className="glass-input">
                                <option value="MALE">Masculino</option>
                                <option value="FEMALE">Feminino</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Ruler size={15} /> Altura (cm)
                        </label>
                        <input type="number" placeholder="Ex: 180" value={bioData.height}
                            onChange={e => setBioData({ ...bioData, height: e.target.value })}
                            className="glass-input" style={{ maxWidth: '200px' }} />
                    </div>
                    <button type="button" className="save-settings-btn generic-btn secondary" onClick={handleSalvarDadosPessoais}>
                        <Save size={16} /> Salvar Dados Pessoais
                    </button>
                </div>
            </SecaoColapsavel>

            {/* ─── Sair ─── */}
            <div className="settings-section glass" style={{ marginTop: '0.5rem' }}>
                <button
                    type="button"
                    className="save-settings-btn generic-btn danger"
                    onClick={() => { logout(); window.location.href = '/'; }}
                    style={{ width: '100%' }}
                >
                    <LogOut size={16} /> Sair da Conta
                </button>
            </div>
        </div>
    );
};

export default AccountSettings;
