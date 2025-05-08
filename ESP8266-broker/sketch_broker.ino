#include <ESP8266WiFi.h>
#include "uMQTTBroker.h"

class MyMQTTBroker : public uMQTTBroker {
public:
  boolean onConnect(IPAddress addr, uint16_t client_count) {
    Serial.println("Client connected");
    return true;
  }

  void onDisconnect(IPAddress addr, String client_id) {
    Serial.println("Client disconnected");
  }

  boolean onAuth(String username, String password, String client_id) {
    Serial.println("Client authenticated");
    return true;
  }

  void onData(String topic, const char *data, uint32_t length) {
    Serial.print("Received topic: ");
    Serial.println(topic);
    Serial.print("Data: ");
    Serial.write((const uint8_t*)data, length);
    Serial.println();
  }
};

MyMQTTBroker myBroker;

const char* ssid = "WiFi-SSID";
const char* password = "WiFi-Password";

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  myBroker.init();  // Starts the MQTT broker
  Serial.println("MQTT broker started");
}

void loop() {
  // No need to call anything here, the MQTT broker runs automatically
}
