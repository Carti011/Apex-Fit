import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';

const WeeklyChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await api.getGamificationHistory(token);
                setData(response); // response is the array of data directly from res.json()
            } catch (error) {
                console.error("Erro ao buscar histórico de XP:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Carregando gráfico...</div>;
    }

    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum dado de XP recente.</div>;
    }

    return (
        <div style={{ width: '100%', height: '100%', minHeight: 200, minWidth: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.2)"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(13, 13, 13, 0.9)',
                            border: '1px solid var(--accent-color)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: 'var(--accent-color)', fontWeight: 'bold' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="xp"
                        name="XP Ganho"
                        stroke="#00ff88"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorXp)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyChart;
