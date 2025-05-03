const client = mqtt.connect('ws://192.168.68.106:9001');

const sensorDataMap = new Map();        // sensorID -> temperature
const sensorLastSeenMap = new Map();    // sensorID -> timestamp (ms)

const ctx = document.getElementById('tempChart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Temperature (°C)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Sensor ID'
                }
            }
        }
    }
});

// Update the chart with live data
function updateChart() {
    const now = Date.now();

    // Remove sensors not seen in the last 10 seconds
    for (const [sensor, lastSeen] of sensorLastSeenMap.entries()) {
        if (now - lastSeen > 6000) { // 10 seconds timeout
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
    const values = entries.map(([_, temp]) => temp);

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;

    if (values.length > 0) {
        const minTemp = Math.min(...values);
        const maxTemp = Math.max(...values);
        chart.options.scales.y.min = Math.floor(minTemp - 5);
        chart.options.scales.y.max = Math.ceil(maxTemp + 5);
    }

    chart.update();
}

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    for (let i = 1; i <= 10; i++) {
        client.subscribe(`tempro/sensor${i}`);
    }
});

client.on('message', (topic, message) => {
    const sensor = topic.split('/')[1]; // e.g., "sensor1"
    const temp = parseFloat(message.toString());

    if (!isNaN(temp)) {
        sensorDataMap.set(sensor, temp);
        sensorLastSeenMap.set(sensor, Date.now());
        updateChart();
    }
});

// Periodically check for inactive sensors
setInterval(updateChart, 5000);
