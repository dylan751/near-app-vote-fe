import React from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
interface chartProps {
  title: string;
  data: any[];
}
const PieChart: React.FC<chartProps> = ({ data, title }) => {
  let newData: any[] = [];
  if (data.length > 5) {
    let anotherVote: number = 0;
    for (let index = 0; index < data.length; index++) {
      if (index > 4) anotherVote += data[index].total_vote;
    }
    newData = data.filter((item, index) => {
      if (index < 5)
        return {
          option: item.option,
          total_vote: item.total_vote,
        };
    });
    newData.push({ option: 'Other', total_vote: anotherVote });
  } else {
    newData = [...data];
  }
  return (
    <div>
      <Doughnut
        data={{
          labels: newData.map((item) => item.option),
          datasets: [
            {
              data: newData.map((item) => item.total_vote),
              backgroundColor: [
                'rgba(255, 69, 69, 0.7)',
                'rgba(255, 183, 70, 0.7)',
                'rgba(65, 212, 114, 0.7)',
                'rgba(255, 254, 85, 0.7)',
                'rgba(70, 184, 255, 0.7)',
                'rgba(155, 200, 204, 0.7)',
              ],
              borderColor: [
                'rgba(255, 69, 69, 1)',
                'rgba(255, 183, 70, 1)',
                'rgba(65, 212, 114, 1)',
                'rgba(255, 254, 85, 1)',
                'rgba(70, 184, 255, 1)',
                'rgba(155, 200, 204, 1)',
              ],
              borderWidth: 1,
            },
          ],
        }}
        width={360}
        height={240}
        options={{
          title: {
            display: true,
            text: title,
            position: 'bottom',
          },
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
            },
          },

          // maintainAspectRatio: false,
          // scales: {
          //   yAxes: [
          //     {
          //       ticks: {
          //         beginAtZero: true,
          //       },
          //     },
          //   ],
          // },
          // legend: {
          //   labels: {
          //     fontSize: 25,
          //   },
          // },
        }}
      />
    </div>
  );
};

export default PieChart;
