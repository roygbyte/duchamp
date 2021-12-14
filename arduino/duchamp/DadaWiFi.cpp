#include "DadaWiFi.h"
#include <Arduino.h>

DadaWiFi::DadaWiFi() {

	packetRead = false;
	packetProcessed = true;

	packet = new char[UDP_TX_PACKET_MAX_SIZE];

}

boolean DadaWiFi::connectWiFi(const char* ssid, const char* password) {

	boolean state = true;
	int i = 0;

	WiFi.begin(ssid,password);

	while(WiFi.status() != WL_CONNECTED) {
		delay(500);
		Serial.print(".");
		if(i > 10) {
			state = false;
			break;
		}
		i++;
	}

	if(state) {
		Serial.println("Wifi Connected as: ");
		Serial.println(WiFi.localIP());
	} else {
		Serial.print("Connection failed.");
	}
	wifiConnected = state;
	return state;

}

boolean DadaWiFi::connectUdp(unsigned int localPort) {
	boolean state = false;

	if(UDP.begin(localPort) == 1) {
		state = true;
		Serial.println("Connected to UDP");
	} else {
		Serial.println("Connection failed");
	}
	udpConnected = state;
	return state;
}

void DadaWiFi::readPackets(void (*callback)()) {
	if(wifiConnected) {
		if(udpConnected) {
			int packetSize = UDP.parsePacket();
			if(packetSize) {
			/*	Serial.println("");
				Serial.print("Received packed of size ");
				Serial.println(packetSize);
				*/
				packetRead = false;
			};
			if(!packetRead && packetProcessed) {
				UDP.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
//				char* p = new char[UDP_TX_PACKET_MAX_SIZE];
				for(int i = 0; i < packetSize; i++) {
					packet[i] = packetBuffer[i];
				}
				packetRead = true;
				packetProcessed = false;
				// Call the callback function when there 
				// is a new packet
				callback();
			}
		}
	}
}

