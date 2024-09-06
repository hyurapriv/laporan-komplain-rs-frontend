import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailyRequestsLineChart = ({ data, selectedMonth, selectedYear }) => {
  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const chartData = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
    const day = i + 1;
    const date = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return { date, count: data[date] || 0 };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`Tanggal: ${label.split('-')[2]}`}</p>
          <p className="intro">{`Jumlah: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 15,
            right: 5,
            left: 5,
            bottom: 5,  // Increased space at the bottom for X axis labels and legend
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => tick.split('-')[2]}
            interval={0}
            angle={0}  // Rotate labels to prevent overlap
            textAnchor="middle"
            height={60}  // Increase height to fit rotated labels
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{
              bottom: 0,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 12
            }}
          />
          <Line type="monotone" dataKey="count" name="Jumlah" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyRequestsLineChart;
