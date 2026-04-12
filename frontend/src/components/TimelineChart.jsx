import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TimelineChart = ({ scans, heightClass = 'h-64' }) => {
  // Reverse to show chronological order
  const reversedScans = [...scans].reverse();

  const chartData = {
    labels: reversedScans.map(scan => {
      const date = new Date(scan.scan_date);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }),
    datasets: [
      {
        label: 'Critical',
        data: reversedScans.map(scan => scan.critical_count),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'High',
        data: reversedScans.map(scan => scan.high_count),
        borderColor: '#ea580c',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Medium',
        data: reversedScans.map(scan => scan.medium_count),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Low',
        data: reversedScans.map(scan => scan.low_count),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex;
            return reversedScans[index].image_name;
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
      x: {
        ticks: {
          maxRotation: 30,
          minRotation: 30,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    },
  };

  if (scans.length === 0) {
    return (
      <div className={`${heightClass} flex items-center justify-center text-gray-500`}>
        No scan history available
      </div>
    );
  }

  return (
    <div className={heightClass}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TimelineChart;
