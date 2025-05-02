const client = mqtt.connect('ws://localhost:9001');

const labels = [];
const data = {
    sensor1: [],
    sensor2: [],
    sensor3: [],
    sensor4: [],
    sensor5: [],
    sensor6: [],
    sensor7: [],
    sensor8: [],
    sensor9: [],
    sensor10: []
};

// Update HTML boxes
function updateValueBox(sensor, value) {
    document.getElementById(`val${sensor}`).innerText = value.toFixed(2);
}

// Combined chart
const ctx = document.getElementById('combinedChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Sensor 1',
                borderColor: '#8B0000', // Dark Red
                data: data.sensor1,
                fill: false
            },
            {
                label: 'Sensor 2',
                borderColor: '#006400', // Dark Green
                data: data.sensor2,
                fill: false
            },
            {
                label: 'Sensor 3',
                borderColor: '#00008B', // Dark Blue
                data: data.sensor3,
                fill: false
            },
            {
                label: 'Sensor 4',
                borderColor: '#FF4500', // Dark Orange Red
                data: data.sensor4,
                fill: false
            },
            {
                label: 'Sensor 5',
                borderColor: '#8B4513', // Dark Brown
                data: data.sensor5,
                fill: false
            },
            {
                label: 'Sensor 6',
                borderColor: '#2F4F4F', // Dark Slate Gray
                data: data.sensor6,
                fill: false
            },
            {
                label: 'Sensor 7',
                borderColor: '#4B0082', // Indigo
                data: data.sensor7,
                fill: false
            },
            {
                label: 'Sensor 8',
                borderColor: '#A52A2A', // Brown
                data: data.sensor8,
                fill: false
            },
            {
                label: 'Sensor 9',
                borderColor: '#800080', // Purple
                data: data.sensor9,
                fill: false
            },
            {
                label: 'Sensor 10',
                borderColor: '#B22222', // Firebrick
                data: data.sensor10,
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    }
});

client.on('connect', () => {
    console.log("Connected to MQTT");
    client.subscribe('tempro/sensor1');
    client.subscribe('tempro/sensor2');
    client.subscribe('tempro/sensor3');
    client.subscribe('tempro/sensor4');
    client.subscribe('tempro/sensor5');
    client.subscribe('tempro/sensor6');
    client.subscribe('tempro/sensor7');
    client.subscribe('tempro/sensor8');
    client.subscribe('tempro/sensor9');
    client.subscribe('tempro/sensor10');
});

client.on('message', (topic, message) => {
    const value = parseFloat(message.toString());
    const time = new Date().toLocaleTimeString();

    if (!labels.includes(time)) {
        labels.push(time);
        if (labels.length > 30) labels.shift();
    }

    let key = '';
    if (topic === 'tempro/sensor1') key = 'sensor1';
    if (topic === 'tempro/sensor2') key = 'sensor2';
    if (topic === 'tempro/sensor3') key = 'sensor3';
    if (topic === 'tempro/sensor4') key = 'sensor4';
    if (topic === 'tempro/sensor5') key = 'sensor5';
    if (topic === 'tempro/sensor6') key = 'sensor6';
    if (topic === 'tempro/sensor7') key = 'sensor7';
    if (topic === 'tempro/sensor8') key = 'sensor8';
    if (topic === 'tempro/sensor9') key = 'sensor9';
    if (topic === 'tempro/sensor10') key = 'sensor10';

    if (key) {
        data[key].push(value);
        updateValueBox(key.replace('sensor', ''), value);

        if (data[key].length > 30) data[key].shift();
        chart.update();
    }
});
