const ctx = document.getElementById('carChart').getContext('2d');

// Path coordinates
const path = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
  { x: 3, y: 4 },
  { x: 4, y: 0 },
  { x: 5, y: 0 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
  { x: 8, y: 0 }
];

let timer;

const carCanvas = document.createElement("canvas");
carCanvas.width = 30;
carCanvas.height = 30;
const carCtx = carCanvas.getContext("2d");
carCtx.font = "24px Arial";
carCtx.textAlign = "center";
carCtx.textBaseline = "middle";
carCtx.fillText("🚕", 15, 15);
const carImg = new Image();
carImg.src = carCanvas.toDataURL();


let chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Distance from Emile',
        data: [], 
        borderColor: 'blue',
        borderWidth: 2,
        tension: 0,
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Car Position',
        data: [path[0]],
        borderColor: 'transparent',
        pointStyle: carImg,
        pointRadius: 15,
        showLine: false
      }
    ]
  },
  options: {
    responsive: true,
    animation: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: { display: true, text: 'Time' },
        ticks: { stepSize: 1 }
      },
      y: {
        title: { display: true, text: 'Distance' },
        ticks: { stepSize: 1 }
      }
    }
  }
});

function interpolatePoint(p1, p2, t) {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

function startAnimation() {
  resetChart();
  let segment = 0;
  let t = 0;
  const speed = 0.02; 

  timer = setInterval(() => {
    if (segment < path.length - 1) {
      let currentPoint = interpolatePoint(path[segment], path[segment + 1], t);

      // Update car position
      chart.data.datasets[1].data[0] = currentPoint;

      //Update Path
      let drawnPath = chart.data.datasets[0].data;
      if (drawnPath.length === 0) {
        drawnPath.push(path[0]); // This is the first point
      }
      if (t === 0) {
        drawnPath.push(path[segment]);
      }
      drawnPath[drawnPath.length - 1] = currentPoint;

      chart.update();

      t += speed;
      if (t >= 1) {
        t = 0;
        segment++;
      }
    } else {
      clearInterval(timer);
    }
  }, 50);
}

function resetChart() {
  clearInterval(timer);
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data[0] = path[0];
  chart.update();
}