import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AccountSettings.css';

const AccountSettings = ({ user, onUpdateSuccess }) => {
    const { updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'A nova senha e a confirmação não coincidem.' });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name,
                currentPassword: currentPassword || null,
                newPassword: newPassword || null
            };

            // Assume we create this endpoint in the backend
            const updatedData = await api.updateAccountProfile(user.token, payload);

            if (updatedData && updatedData.name) {
                updateUser({ name: updatedData.name });
            }

            setMessage({ type: 'success', text: 'Conta atualizada com sucesso!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            if (onUpdateSuccess) onUpdateSuccess(updatedData);

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar configuração da conta.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-settings-container slide-up-fade">
            <div className="settings-header">
                <User size={32} className="text-emerald-400" />
                <h2>Minha Conta</h2>
                <p>Gerencie suas informações de acesso e dados pessoais básicos.</p>
            </div>

            {message.text && (
                <div className={`status-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpdateProfile} className="settings-form">
                <div className="settings-section glass">
                    <h3 className="section-title">Dados Principais</h3>

                    <div className="form-group">
                        <label>Nome de Exibição</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="glass-input padding-left-icon"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>E-mail Cadastrado</label>
                        <div className="input-with-icon disabled-input">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                value={user?.email || ''}
                                className="glass-input padding-left-icon"
                                disabled
                            />
                        </div>
                        <div className="email-status">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>E-mail protegido e em uso (Alteração indisponível no MVP 1.0)</span>
                        </div>
                    </div>
                </div>

                <div className="settings-section glass">
                    <h3 className="section-title">
                        <Lock size={20} className="inline-icon" />
                        Alterar Senha
                    </h3>
                    <p className="section-desc">Preencha apenas se desejar modificar sua senha atual.</p>

                    <div className="form-group">
                        <label>Senha Atual</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="glass-input padding-right-icon"
                                placeholder="Digite sua senha atual"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nova Senha</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="glass-input padding-right-icon"
                                placeholder="Mínimo 6 caracteres"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirmar Nova Senha</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="glass-input padding-right-icon"
                                placeholder="Repita a nova senha"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="save-settings-btn generic-btn primary glow"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default AccountSettings;
