import React from 'react';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const SingleMiniChart = ({ item }) => (
    <div style={{ width: '100%', height: 150, textAlign: 'center' }}>
        <h5>{item.name}</h5>
        <ResponsiveContainer>
            <RadialBarChart
                innerRadius="70%"
                outerRadius="90%"
                barSize={10}
                data={[item]}
                startAngle={90}
                endAngle={-270}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background clockWise dataKey="value" cornerRadius={5} fill={item.fill} />
                <Tooltip formatter={(value) => `${value}% spent`} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '20px', fill: 'var(--text-primary)' }}>
                    {`${item.value}%`}
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
    </div>
);


const AnalyticsChart = ({ totalIncome, totalExpenses, dashboardData, isDetailedView }) => {
    // --- Data for Main Single Chart ---
    const overallPercentSpent = (totalIncome > 0) ? Math.round((totalExpenses / totalIncome) * 100) : 0;
    const mainChartData = [{ name: '% Spent', value: overallPercentSpent, fill: '#EF4444' }];

    // --- Data for Detailed Charts ---
    const detailedChartData = dashboardData.map((item, index) => {
        const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        const percentSpent = (item.allocated > 0) ? Math.round((item.spent / item.allocated) * 100) : 0;
        return {
            name: item.category,
            value: percentSpent > 100 ? 100 : percentSpent,
            fill: COLORS[index % COLORS.length],
        };
    });

    // --- Conditional Rendering ---
    if (isDetailedView) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                {detailedChartData.map(item => <SingleMiniChart key={item.name} item={item} />)}
            </div>
        );
    }

    // --- Main Single Chart View ---
    return (
        <div style={{ width: '100%', height: 350, position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>{`${overallPercentSpent}%`}</div>
                <div style={{ color: 'var(--text-secondary)' }}>of Income Spent</div>
            </div>
            <ResponsiveContainer>
                <RadialBarChart
                    innerRadius="85%"
                    outerRadius="105%"
                    barSize={15}
                    data={mainChartData}
                    startAngle={90}
                    endAngle={-270}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar
                        background={{ fill: 'var(--border-color)' }}
                        dataKey="value"
                        cornerRadius={10}
                    />
                    <Tooltip content={() => null} />
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;