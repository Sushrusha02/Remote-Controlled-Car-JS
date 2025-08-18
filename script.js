const ctx = document.getElementById('carChart').getContext('2d');

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
let speed = 0.02;
let carEmoji = "🚕";
let elapsedTime = 0;


function changeCarEmoji(newEmoji){
    carEmoji = newEmoji;
    carImage = createCarImage(carEmoji); //redraw emoji into new img
    chart.data.datasets[1].pointStyle = carImage;
    chart.update();
}

let carImage = createCarImage(carEmoji);


let chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Distance from Emile',
        data: [],
        borderColor: 'beige',
        borderWidth: 2,
        borderDash: [],
        tension: 0,
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Car Position',
        data: [path[0]],
        borderColor: 'transparent',
        pointStyle: carImage,
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

let segment = 0;
let t = 0;

function interpolatePoint(p1, p2, t) {
  return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
}

function updateStats(point, prevPoint) {
  document.getElementById("timeElapsed").textContent = elapsedTime.toFixed(2);
  document.getElementById("distanceCovered").textContent = point.y.toFixed(2);

  let instSpeed = 0;
  if (prevPoint) {
    const dx = point.x - prevPoint.x;
    const dy = point.y - prevPoint.y;
    instSpeed = dx !== 0 ? (dy / dx).toFixed(2) : 0;
  }
  document.getElementById("instSpeed").textContent = instSpeed;
}

function startAnimation() {
  if (timer) return;
  timer = setInterval(() => {
    if (segment < path.length - 1) {
      let currentPoint = interpolatePoint(path[segment], path[segment + 1], t);

      chart.data.datasets[1].data[0] = currentPoint;

      let drawnPath = chart.data.datasets[0].data;
      if (drawnPath.length === 0) {
        drawnPath.push(path[0]);
      }
      if (t === 0) {
        drawnPath.push(path[segment]);
      }
      drawnPath[drawnPath.length - 1] = currentPoint;

      chart.update();

      elapsedTime += speed;
      updateStats(currentPoint, path[segment]);

      t += speed;
      if (t >= 1) {
        t = 0;
        segment++;
      }
    } else {
      clearInterval(timer);
      timer = null;
    }
  }, 100);
}

function pauseAnimation() {
  clearInterval(timer);
  timer = null;
}

function resetChart() {
  clearInterval(timer);
  timer = null;
  segment = 0;
  t = 0;
  elapsedTime = 0;
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data[0] = path[0];
  chart.update();
  updateStats({ x: 0, y: 0 });
}

function updateSpeed(val) {
  speed = parseFloat(val);
  document.getElementById("speedValue").textContent = val;
}

function changeCarEmoji(newEmoji) {
  carEmoji = newEmoji;
  carImage = createCarImage(carEmoji);
  chart.data.datasets[1].pointStyle = carImage;
  chart.update();
}

function changePathStyle(style) {
  chart.data.datasets[0].borderDash = style === "dashed" ? [5, 5] : [];
  chart.update();
}

function createCarImage(emoji){
    const carCanvas = document.createElement("canvas");
    carCanvas.width =30;
    carCanvas.height = 30;
    const carCtx = carCanvas.getContext("2d");
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.font="24px Arial";
    carCtx.textAlign = "center";
    carCtx.textBaseline ="middle";
    carCtx.fillText(emoji, 15, 15);
    const img = new Image();
    img.src = carCanvas.toDataURL();
    return img;
}
