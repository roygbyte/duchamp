#include <Adafruit_NeoPixel.h>;

#ifndef NeoPatterns_H
#define NeoPatterns_H

enum pattern { NONE, RAINBOW_CYCLE };
enum direction { FORWARD, REVERSE };

class NeoPatterns : public Adafruit_NeoPixel 
{
	public:
		NeoPatterns(uint16_t pixels, uint8_t pin, uint8_t type, void(*callback)());
		
		pattern ActivePattern;
		direction Direction;

		unsigned long Interval;
		unsigned long lastUpdate;

		uint32_t Color1, Color2;
		uint16_t TotalSteps;
		uint16_t Index;

		void (*onComplete)();
		void update();
		void reverse();
		void increment();
		uint32_t wheel(byte);
		void rainbowCycle(uint8_t,direction);
		void rainbowCycleUpdate();

};

#endif
