
//window.app = window.app || {};

function Animation() {

  this.ANIMATION = {
    FADE_OUT: "FADEOUT",
    STROBE: "STROBE",
    CHASE: "CHASE",
    HSV_CYCLE: "HSV_CYCLE",
    IMAGE: "IMAGE",
    PAUSE: "PAUSE",
    FADE_BETWEEN: "FADE_BETWEEN"
  }

  this.animationFrame = 0;
  this.activeAnimation = "NONE";
  this.effectA = 0;
  this.effectB = 0;
  this.speed = 0.1;
  this.brightness = 100;

  this.updateParams = function(knobs) {
    if(knobs != null) {
      this.effectA = knobs.effectA.value;
      this.effectB = knobs.effectB.value;
      this.speed = knobs.speed.value;
      this.brightness = knobs.brightness.value;
    }
  }

  this.render = function(leds, frame) {

    for(var i = 0; i < leds.length; i++) {
     /* var color = tinycolor(leds[i].value).darken(this.brightness).toRgb();
      leds[i].value.r = color.r;
      leds[i].value.c = color.g;
      leds[i].value.b = color.b;*/
    }

    if(this.activeAnimation == "FADEOUT") {
      return this.fadeOut(leds);
    } else if(this.activeAnimation == "IMAGE") {
      return this.image(leds,frame);      
    } else if(this.activeAnimation == "HSV_CYCLE") {
      return this.hsvCycle(leds);
    } else if (this.activeAnimation == "ON") {
      return this.cut(leds);
    } else if(this.activeAnimation == "OFF") {
      return this.on(leds);
    } else if(this.activeAnimation == "STROBE") {
      return this.strobe(leds);
    } else if(this.activeAnimation == "CHASE") {
      return this.chase(leds);
    } else if(this.activeAnimation == "FADE_BETWEEN") {
      return this.fadeBetween(leds);
    } else {
      return leds;
    }
  }

  this.activate = function(name) {
    this.activeAnimation = name;
  }

  // This could probably go elsewhere eventually
  // doesn't feel like it should be in an Animation class
  this.setLedsToRgb = function(leds,r,g,b) {
    for(var i = 0; i < leds.length; i++) {
      leds[i].value.r = r;
      leds[i].value.g = g;
      leds[i].value.b = b;
    }
    return leds;
  }

  this.setLedsToRandom = function(leds) {
    var random = Math.round(Math.random() * (100 - 1) + 1);
    var value = tinycolor("hsv(" + random + "%,100%,100%)").toRgb();
    for(var i = 0; i < leds.length; i++) {
      leds[i].value.r = value.r;
      leds[i].value.g = value.g;
      leds[i].value.b = value.b;
    }
    return leds;
  }

  this.image = function(leds, currentFrame) {
    var frame = currentFrame;
    var width = frame.width;
    var pixel = 0;
    // for each led, get a pixel value.
    var ledCount = leds.length;
    for(var i = 0; i < ledCount; i++) {
      var values = frame.getPixelAt(pixel,this.animationFrame);
      pixel += Math.round(width/ledCount);
      leds[i].value.r = values[0];
      leds[i].value.g = values[1];
      leds[i].value.b = values[2];
    }
    this.animationFrame++;
    return leds;
  }
  
  this.strobe = function(leds) {
    var ledCount = leds.length;

    var onDuration = 1;
    var offDuration = 1;
    this.animationFrame+= this.speed/100;

    if(this.animationFrame > onDuration) {
      for(key in leds) {
        leds[key].value = {
          r: secondaryColorValue.r,
          g: secondaryColorValue.g,
          b: secondaryColorValue.b 
        }       
      }
    } else {
      for(key in leds) {
        leds[key].value = {
          r: primaryColorValue.r,
          g: primaryColorValue.g,
          b: primaryColorValue.b 
        }       
      }   
    }

    if(this.animationFrame > onDuration + offDuration) {
      this.animationFrame = 0;
    }

    return leds;
  }

  this.fadeBetween = function(leds) {
    var ledCount = leds.length;

    var duration = 5000;
    var frameRate = 50;
    var step = duration / frameRate; 
    var leds = leds;

    var onDuration = 1;
    var offDuration = 1;
    this.animationFrame += 1;

    var primary = tinycolor("rgb ("+primaryColorValue.r + "," + primaryColorValue.g + ", " + primaryColorValue.b + ")");
    var secondary = tinycolor("rgb ("+secondaryColorValue.r + "," + secondaryColorValue.g + ", " + secondaryColorValue.b + ")");

    var gradients = tinygradient([
      primary.toHexString(),
      secondary.toHexString()
    ]);

    if(this.animationFrame == this.effectA) {
      this.animationFrame = 0;
      var tempColor = primaryColorValue;
      primaryColorValue = secondaryColorValue;
      secondaryColorValue = tempColor;
      return leds;
    }

    var colors = gradients.rgb(this.effectA);
    var c = colors[this.animationFrame];

    if(c != null) {
      c = c.toRgb();
      for(key in leds) {
        var led = leds[key];
        led.value.r = c.r;
        led.value.g = c.g;
        led.value.b = c.b;
      }
    }
  
    return leds;
  }



  this.chase = function(leds) {

    var ledCount = leds.length;

    var MULTIPLE = this.effectA;

    for(key in leds) {
      var led = leds[key];
      if((key%MULTIPLE) + this.effectB <= this.animationFrame%MULTIPLE ||
          (key%MULTIPLE) == this.animationFrame%MULTIPLE) {
        led.value = {
          r: secondaryColorValue.r,
          g: secondaryColorValue.g,
          b: secondaryColorValue.b
        }
      } else {
        led.value = {
          r: primaryColorValue.r,
          g: primaryColorValue.g,
          b: primaryColorValue.b
        }
      }
    }


    if(this.animationFrame > ledCount) {
      this.animationFrame = 0;
      var tempColor = primaryColorValue;
      primaryColorValue = secondaryColorValue;
      secondaryColorValue = tempColor;
    }

    this.animationFrame+=this.speed/10;
    return leds;


  }

  this.hsvCycle = function(leds) {
    var duration = 1000;
    var frameRate = 50;
    var step = duration / frameRate; 
    var leds = leds;
    
    var speed = this.speed/1000;
    var wave_divisions = this.effectB;

    // Setup

    for(key in leds) {
      var led = leds[key];
      var color = tinycolor("rgb " +
        led.value.r + " " + 
        led.value.g + " " +
        led.value.b + ""
      ).toHsv();
      // we can take 100 steps through hues
      // we want to spread these steps out over the number of leds
      // we want to cycle the values
      // so... right now, we are getting 1 led in the strip
      // for this led, we want to find its relative position in the steps

      var base_change = this.animationFrame / wave_divisions;
      var color_rotation_time = Math.sin(this.animationFrame / 250);
      var color_rotation = key * this.effectA * color_rotation_time / 255;
      var hue = Math.sin(base_change + color_rotation);


//      color.h = (this.animationFrame%360);
      color.h = Math.abs(hue) * 360;
      color.s = 1;
      color.v = 1;
      color = tinycolor(color).toRgb();

      led.value.r = color.r;
      led.value.g = color.g;
      led.value.b = color.b;

      this.animationFrame += speed;

    }

    return leds;
  }

  this.on = function(leds) {

    for(key in leds) {
          leds[key].value = {
            r: primaryColorValue.r,
            g: primaryColorValue.g,
            b: primaryColorValue.b 
          }       
        }   
        return leds;
  }

  this.cut = function(leds) {
    this.animationFrame++;

    for(key in leds) {
      var led = leds[key];
      led.value.r = 0;
      led.value.g = 0;
      led.value.b = 0;
    }
  }

  this.fadeOut = function(leds,frame) {

    var duration = 1000;
    var frameRate = 50;
    var step = duration / frameRate; 
    var leds = leds;
    
    if(this.animationFrame * step < duration && leds != null) {

      for(key in leds) {
        var led = leds[key];
        var color = tinycolor("rgb " +
          led.value.r + " " + 
          led.value.g + " " +
          led.value.b + ""
        ).darken((step / duration) * 100).toRgb();
        led.value.r = color.r;
        led.value.g = color.g;
        led.value.b = color.b;
      }

      this.animationFrame ++;
      return leds;
    } else { 
      this.animationFrame = 0;
      this.activeAnimation = "NONE";
      // this should be a callback function
      return leds;
    }
  }
  
}