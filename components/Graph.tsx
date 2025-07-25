import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js"
import type { ChartOptions, ChartData, ChartArea, Plugin } from "chart.js"
import dayjs from "dayjs"
import React, { useEffect, useRef, useState } from "react"
import { Line } from "react-chartjs-2"

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

const generateLast7DaysUsage = () => {
  const data = []
  for (let i = 6; i >= 0; i--) {
    data.push({
      date: dayjs().subtract(i, "day").format("MMM D"),
      usage: Math.floor(Math.random() * 100) + 20 // Example random usage
    })
  }
  return data
}

function Graph() {
    const chartRef = useRef<ChartJS<'line'>>(null);
      const [graphData, setGraphData] = useState<ChartData<'line'>>({
    datasets: [],
  });
  const usageData = generateLast7DaysUsage()

    function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
        const gradient = ctx.createLinearGradient(area.left, area.top + (area.bottom - area.top) / 2, area.right, area.top + (area.bottom - area.top) / 2);   
        gradient.addColorStop(0, "#41d5de");
        gradient.addColorStop(1, "#39afea");
        return gradient
    }

  const data: ChartData<'line'> = {
    labels: usageData.map((entry) => entry.date),
    datasets: [
      {
        pointRadius: 2,
        label: '',
        data: usageData.map((entry) => entry.usage),
        fill: false,
        borderWidth: 4,
        backgroundColor: '#4bc0c0',
        tension: 0.5,
      },
    ],
  };

   let _stroke = null as null | (() => void);
  const shadowPlugin: Plugin<"line"> = {
    id: "piaf",
    beforeDatasetsDraw: function (chart) {
      if (!_stroke) _stroke = chart.ctx.stroke;
      chart.ctx.stroke = function () {
        if (!chart.ctx) return;
        chart.ctx.save();
        chart.ctx.shadowColor = "rgba(0,0,0,0.15)";
        chart.ctx.shadowBlur = 10;
        chart.ctx.shadowOffsetX = 0;
        chart.ctx.shadowOffsetY = 10;
        _stroke!.apply(this, arguments as any);
        chart.ctx.restore();
      };
    },
  };

   useEffect(() => {
    const chart = chartRef.current;

     if (!chart || !chart.chartArea) return;

  const formattedData = {
    ...data, 
    datasets: data.datasets.map(dataset => ({
        ...dataset, 
        borderColor: createGradient(chart.ctx, chart.chartArea),
    }))
  }

    setGraphData(formattedData);
  }, [chartRef.current]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#6a6f75',
        titleColor: "#dbdddd",
        titleMarginBottom: 4,
        titleFont: {
            weight: "normal",
            size: 12,
        },
        bodyColor: "#fff",
        bodyFont: {
            weight: "bold",
            size: 16
        },
         padding: 10, 
         cornerRadius: 6,
         displayColors: false, 
         
      },
    },
    scales: {
        x: {
            ticks: {
                display: false
            },
            grid: {
                // display: false
                drawTicks: false,
                color: "#91949c1a",
                lineWidth: 1.4,
            },
            border: {
                display: false,
                dash: [8, 6]
            }
        },
        y: {
            // beginAtZero: true,
            ticks: {
                display: false
            },
            border: {
                display: false,
                dash: [10, 6]
            },
            grid: {
                drawTicks: false,
                color: "#91949c1a",
                lineWidth: 1.4
            }
      },
    },
  };

  return (
    <div className="max-w-[160px]">
      {/* <h3>Usage in the Last 7 Days</h3> */}
      <Line ref={chartRef} data={graphData} options={options} plugins={[shadowPlugin]} />
    </div>
  )
}

export default Graph
