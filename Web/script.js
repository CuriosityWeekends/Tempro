const client = mqtt.connect('ws://dev.streakon.net:9001', {
    username: 'tempro',
    password: 'firstfloor'
    });

const sensorDataMap = new Map();
const sensorLastSeenMap = new Map();
const ctx = document.getElementById('tempChart').getContext('2d');
const mqttStatus = document.getElementById('mqttStatus');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [],
          borderColor: (context) => {
            const value = context.raw;
            if (value > 30) return 'red';         // High danger
            if (value > 25) return 'orange';      // Warm
            return '#4caf50';                     // Safe (green)
          },
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBorderWidth: 2,
          pointBorderColor: '#ffffff',
          pointBackgroundColor: (context) => {
            const value = context.raw;
            if (value > 30) return 'red';
            if (value > 25) return 'orange';
            return '#4caf50';
          },
        },
        {
          label: 'Calibration Baseline',
          data: [], // Will be filled dynamically
          borderColor: '#1d8cf8',
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Temperature (°C)',
            color: '#ffffff'
          },
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          title: {
            display: true,
            text: 'Sensor ID',
            color: '#ffffff'
          },
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#ffffff' }
        }
      }
    }
  });
  
  
function updateChart() {
	const now = Date.now();
  
	for (const [sensor, lastSeen] of sensorLastSeenMap.entries()) {
	  if (now - lastSeen > 10000) {
		sensorDataMap.delete(sensor);
		sensorLastSeenMap.delete(sensor);
	  }
	}
  
	const entries = Array.from(sensorDataMap.entries()).sort((a, b) => {
	  const aNum = parseInt(a[0].replace('sensor', ''));
	  const bNum = parseInt(b[0].replace('sensor', ''));
	  return aNum - bNum;
	});
  
	const labels = entries.map(([sensor]) => sensor);
	const values = entries.map(([_, temp]) => temp + calibrationOffset);
cvnm
  
	chart.data.labels = labels;
	chart.data.datasets[0].data = values;
  
	if (values.length > 0) {
        const minTemp = Math.min(...values);
        const maxTemp = Math.max(...values);
        chart.options.scales.y.min = Math.floor(minTemp - 5);
        chart.options.scales.y.max = Math.ceil(maxTemp + 5);
      
        const highestTemp = Math.max(...values);
      
        if (highestTemp > 30) {
          statusText.textContent = 'High';
          statusText.className = 'text-red-500 font-bold';
        } else if (highestTemp > 25) {
          statusText.textContent = 'Medium';
          statusText.className = 'text-orange-500 font-bold';
        } else {
          statusText.textContent = 'Normal';
          statusText.className = 'text-green-500 font-bold';
        }
      
        if (calibrationBaseline !== null) {
          chart.data.datasets[1].data = chart.data.labels.map(() => calibrationBaseline);
        }
      }
      
      chart.update();
      
  
	chart.update();
  }
  let calibrationOffset = 0;
  let calibrationBaseline = null;
  document.getElementById('calibrateBtn').addEventListener('click', () => {
    const values = Array.from(sensorDataMap.values());
  
    if (values.length === 0) {
      alert("No sensor data available for calibration.");
      return;
    }
  
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    const actualMedian = sorted.length % 2 !== 0
      ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;
  
    calibrationBaseline = 28; // or let user input this
    calibrationOffset = calibrationBaseline - actualMedian;
  
    alert(`Calibration complete!\nBaseline set to ${calibrationBaseline.toFixed(2)}°C\nOffset: ${calibrationOffset.toFixed(2)}°C`);
  });
  


client.on('connect', () => {
  mqttStatus.textContent = 'MQTT: Connected';
  mqttStatus.classList.remove('text-red-500');
  mqttStatus.classList.add('text-green-400');

  for (let i = 1; i <= 10; i++) {
    client.subscribe(`tempro/sensor${i}`);
  }
});

client.on('message', (topic, message) => {
  const sensor = topic.split('/')[1];
  const temp = parseFloat(message.toString());

  if (!isNaN(temp)) {
    sensorDataMap.set(sensor, temp);
    sensorLastSeenMap.set(sensor, Date.now());
    updateChart();
  }
});

client.on('error', () => {
  mqttStatus.textContent = 'MQTT: Error';
  mqttStatus.classList.remove('text-green-400');
  mqttStatus.classList.add('text-red-500');
});

setInterval(updateChart, 5000);
