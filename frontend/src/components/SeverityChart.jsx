import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SeverityChart = ({ data }) => {
  const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const colors = {
    CRITICAL: '#dc2626',
    HIGH: '#ea580c',
    MEDIUM: '#f59e0b',
    LOW: '#22c55e',
  };

  const chartData = {
    labels: severityOrder,
    datasets: [
      {
        label: 'Number of Vulnerabilities',
        data: severityOrder.map(severity => data[severity] || 0),
        backgroundColor: severityOrder.map(severity => colors[severity]),
        borderColor: severityOrder.map(severity => colors[severity]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} vulnerabilities`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SeverityChart;
