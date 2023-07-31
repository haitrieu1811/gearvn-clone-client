import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';

Chart.register(CategoryScale);

const BarChart = () => {
  // Dữ liệu biểu đồ
  const data = {
    labels: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ],
    datasets: [
      {
        label: 'Doanh thu',
        data: [5000, 300, 200, 600, 400, 700],
        backgroundColor: 'rgba(75,192,192,1)'
      }
    ]
  };

  // Cấu hình tùy chọn cho biểu đồ
  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
