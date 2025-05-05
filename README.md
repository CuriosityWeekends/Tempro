# TemPro: TemperatureProfiler

**TemPro** is an IoT-based temperature monitoring system using the ESP8266 microcontroller. It transmits temperature data wirelessly via MQTT and displays it in real-time through a responsive web dashboard. Ideal for home automation, agriculture, or industrial monitoring environments.

---

## 🔧 Features

- 📡 **ESP8266-Powered**: Wireless temperature sensing and transmission
- 🧠 **MQTT Protocol**: Lightweight and efficient data communication
- 🌐 **Web Dashboard**: Clean, real-time data visualization in any modern browser
- 🧩 **Modular Structure**: Separated firmware, broker, and web interface components

---

## 📁 Project Structure

```bash
TemPro/
├── Code For NodeMCU/ # ESP8266 firmware (Arduino-compatible)
├── ESP8266-broker/ # MQTT broker setup and config
├── Web/ # Web UI for live temperature display
└── README.md # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- ESP8266 (e.g. NodeMCU board)
- Arduino IDE with ESP8266 support
- MQTT broker (e.g. Mosquitto)
- Local web server (optional for hosting dashboard)

### Setup Instructions

1. **Clone the Repo**

   ```bash
   git clone https://github.com/CuriosityWeekends/TemPro.git
   cd TemPro
   ```
    Flash the ESP8266

        Open Code For NodeMCU/ in Arduino IDE

        Install required libraries (e.g., PubSubClient, DHT)

        Set Wi-Fi and MQTT details in the sketch

        Upload to your ESP8266

    Start the MQTT Broker

        Navigate to ESP8266-broker/ and follow setup instructions

        Or use a public broker like broker.hivemq.com for testing

    Run the Web Dashboard

        Open Web/index.html in a browser, or serve with any HTTP server

        Monitor real-time temperature from your ESP8266

## 📷 Screenshots

Include screenshots of your hardware setup and web dashboard here
## 🤝 Contributing

Got improvements? Found a bug?

    Fork the repo

    Create your feature branch: git checkout -b my-feature

    Commit your changes: git commit -m 'Add feature'

    Push to the branch: git push origin my-feature

    Open a Pull Request!

## 📄 License

MIT License – see LICENSE for details.
