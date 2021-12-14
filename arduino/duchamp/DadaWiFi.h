#include <WiFiUdp.h>
#include <ESP8266WiFi.h>

#ifndef DadaWiFi_H;
#define DadaWiFi_H;

class DadaWiFi 
{
	WiFiUDP UDP;
	unsigned int localPort;
	public:
		DadaWiFi();		
		boolean connectWiFi(const char* ssid, const char* password);
		boolean connectUdp(unsigned int localPort);

		void readPackets(void (*callback)());

		boolean wifiConnected;
		boolean udpConnected;
		char packetBuffer[UDP_TX_PACKET_MAX_SIZE];
		boolean packetRead;
		boolean packetProcessed;
		char* packet;
};

#endif
