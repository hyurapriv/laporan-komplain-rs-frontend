// import React from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, Tooltip, Legend, Title, ArcElement } from 'chart.js';

// ChartJS.register(Tooltip, Legend, Title, ArcElement);

// const PieChart = ({ data, title }) => {
//   const chartData = {
//     labels: data.map(item => item.unit),
//     datasets: [{
//       data: data.map(item => item.averageResponseTime),
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//     }],
//   };

//   const options = {
//     plugins: {
//       title: {
//         display: true,
//         text: title || 'Pie Chart',
//         font: {
//           size: 16
//         }
//       }
//     }
//   };

//   return <Pie data={chartData} options={options} />;
// };

// export default PieChart;