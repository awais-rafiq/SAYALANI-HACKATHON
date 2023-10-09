import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AttendanceChart = ({ list }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (list.length === 0 || !chartRef.current) {
      return;
    }

    const absents = list.filter((entry) => entry.status === 'Absent').length;
    const presents = list.filter((entry) => entry.status === 'Present').length;

    const chartData = {
      labels: ['Absent', 'Present'],
      datasets: [
        {
          data: [absents, presents],
          backgroundColor: ['#FF5733', '#33FF57'],
        },
      ],
    };

    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData,
    });

    // Save the new chart instance to the ref
    chartInstanceRef.current = newChartInstance;
  }, [list]);

  return <canvas ref={chartRef}></canvas>;
};

export default AttendanceChart;
