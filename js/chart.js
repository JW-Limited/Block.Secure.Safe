
var ctx = document.getElementById('chartCanvas').getContext('2d');
var chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Sozial-Media Tracking', 'Tracking Cookies','Third-Party Cookies','Tracking Scripts','PUA Scripts'],
    datasets: [
      {
        data: [1160,1840,120,1211,1222], // Replace with your data
        backgroundColor: ['#2596be', '#36A2EB','#167A9D','#164B9D','#135DD0'], // Customize colors
        borderWidth: 0, // Remove border
      },
    ],
  },
  options: {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#FFF',
        font: {
          weight: 'bold'
        },
        formatter: function(value) {
          return value + '%';
        }
      }
    },
    responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Months"
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Usage"
          }
        }
      },
    scales: {
      x: {
        display: false,
        beginAtZero: true
      },
      y: {
        display: false
      }
    }
  }
});
