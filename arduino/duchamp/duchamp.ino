
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

#include <cstring>

#include "NeoPatterns.h"
#include "DadaWiFi.h"

//const char* ssid = "drugkitten";
//const char* password = "meowmeow";
const char* ssid = "BELL898";
const char* password = "A56A9559F217";

const int PIXELS = 26;
const int PIN = 5;
const int TYPE = NEO_GRB + NEO_KHZ800;

void ledCallback();

NeoPatterns leds(PIXELS, PIN, TYPE, *ledCallback);

//const char* ssid = "FIBREOP477";
//const char* password = "3490929112";

unsigned int localPort = 8888;

DadaWiFi wifi;

void setup() {
	Serial.begin(115200);

	wifi.connectWiFi(ssid, password);
	wifi.connectUdp(localPort);
	
	leds.begin();

}

void loop() {

	wifi.readPackets(*newPacket);

}

void newPacket() {

	char* chars_array = strtok(wifi.packet,"#:");

	int index = 0;
	int pixel = 0;

	uint8_t r = 0;
	uint8_t g = 0;
	uint8_t b = 0;

		while(chars_array) {

		char value = *chars_array;

		if(index == 0) {
			r = (atoi(chars_array));
		} else if(index == 1) {
			g = (atoi(chars_array));
		} else if(index == 2) {
			b = (atoi(chars_array));
		}

		chars_array = strtok(NULL,"#:");
		//Serial.println("hh");
//		uint8_t o = strtoul(&value,NULL,10);
		//Serial.println(atoi(&value));
//		color[index++] = (int) (chars_array - 0);
	//	Serial.println(color[index-1]);
		index += 1;

		if(index >= 3) {
/*			Serial.println("values: ");
			Serial.print(r);
			Serial.print(g);
			Serial.print(b);
			Serial.println();*/
			leds.setPixelColor(pixel++, leds.Color(r,g,b));
			leds.show();
			index = 0;
		}
	}

	wifi.packetProcessed = true;

}

void ledCallback() {
	Serial.println("Callback");
}
