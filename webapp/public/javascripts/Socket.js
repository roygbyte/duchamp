
function Socket(port) {


    /* Connect to our backend socket */
    var socket = io.connect('http://localhost:' + port);

    socket.on('connect', function(data) {
      socket.emit('join','He');
    })

    this.sendLeds = function(leds, callback) {

      var s = "";

      var a = 1;
      var b = 10;
      var c = 19;

      for(var i = 0; i < leds.length - 1; i+=3) {
        a += 1;
        b -= 1;
        c += 1;
      }

      var indexes = [1,4,7,10,13,16,19,22,25,24,21,18,15,12,9,6,3,0,2,5,8,11,14,17,20,23];

      for(var i = 0; i <= indexes.length; i++) {
        index = indexes[i];
        var led = leds[index];

        if(led != null) {
          s += led.value.r + ":";
          s += led.value.g + ":";
          s += led.value.b + "#";
        }
      }

      if(socket) {
        socket.emit('leds',s);
      }

    }

    this.sendRelays = function(relays, callback) {

      var s = "";

      for(var i = 0; i < relays.length - 1; i++) {
        var relay = relays[i];
        s += i + ":";
        if(relay.value.on) {
          s += 1 + "#";
        } else {
          s += 0 + "#";
        }
      }      

      if(socket) {
        socket.emit('relays',s);
      }

      // Relays will send out here

    }

}