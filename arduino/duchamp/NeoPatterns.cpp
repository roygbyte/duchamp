#include "NeoPatterns.h";

NeoPatterns::NeoPatterns(uint16_t pixels, uint8_t pin, uint8_t type, void(*callback)())
	:Adafruit_NeoPixel(pixels, pin, type)
{
	onComplete = callback;
	begin();
}

void NeoPatterns::update() 
{
	if((millis() - lastUpdate) > Interval) 
	{
		lastUpdate = millis();
		switch(ActivePattern) 
		{
			case RAINBOW_CYCLE:
				rainbowCycleUpdate();
				break;
			default:
				break;
		}
	}
}

void NeoPatterns::increment() 
{
	if(Direction == FORWARD) 
	{
		Index++;
		if(Index >= TotalSteps)
		{
			Index = 0;
			if(onComplete != NULL) 
			{
				onComplete();
			}
		}
	}
	else
	{
		--Index;
		if(Index <= 0) 
		{
			Index = TotalSteps-1;
			if(onComplete != NULL) 
			{
				onComplete();
			}
		}
	}
}

void NeoPatterns::reverse()
{
	if(Direction == FORWARD) 
	{
		Direction = REVERSE;
		Index = TotalSteps-1;
	}
	else
	{
		Direction = FORWARD;
		Index = 0;
	}
}

void NeoPatterns::rainbowCycle(uint8_t interval, direction dir)
{
	ActivePattern = RAINBOW_CYCLE;
	Interval = interval;
	TotalSteps = 255;
	Index = 0;
	Direction = FORWARD;
}

void NeoPatterns::rainbowCycleUpdate()
{
	for(int i = 0; i < numPixels(); i++)
	{
		setPixelColor(i, wheel(((i * 256 / numPixels()) + Index) & 255));
	}
	show();
	increment();
}

uint32_t NeoPatterns::wheel(byte WheelPos) 
{
	WheelPos = 255 - WheelPos;
	if(WheelPos < 85) 
	{ 
		return Color(255 - WheelPos * 3, 0, WheelPos * 3);
	}					    
}


