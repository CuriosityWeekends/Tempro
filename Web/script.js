const client = mqtt.connect('ws://192.168.68.106:9001');

const sensorDataMap = new Map();
const sensorLastSeenMap = new Map();

const ctx = document.getElementById('tempChart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderColor: '#00bcd4',
            backgroundColor: 'rgba(0, 188, 212, 0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00e5ff',
            pointBorderColor: '#00e5ff',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        family: 'monospace',
                        size: 14
                    }
                }
            },
            tooltip: {
                backgroundColor: '#263238',
                titleColor: '#00e5ff',
                bodyColor: '#ffffff'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#ffffff'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                    color: '#00e5ff'
                }
            },
            x: {
                ticks: {
                    color: '#ffffff'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                },
                title: {
                    display: true,
                    text: 'Sensor ID',
                    color: '#00e5ff'
                }
            }
        }
    }
});

function updateChart() {
    const now = Date.now();

    for (const [sensor, lastSeen] of sensorLastSeenMap.entries()) {
        if (now - lastSeen > 6000) {
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
    const sensor = topic.split('/')[1];
    const temp = parseFloat(message.toString());

    if (!isNaN(temp)) {
        sensorDataMap.set(sensor, temp);
        sensorLastSeenMap.set(sensor, Date.now());
        updateChart();
    }
});

setInterval(updateChart, 5000);
