var primaryColorValue = {r:0,g:0,b:0};
var secondaryColorValue = {r:0,g:0,b:0};

angular.module('sexlightsApp',['ui.knob']).component('dashboard', {
  templateUrl: 'javascripts/dashboard.template.html',
  require: {
  },
  controller: function($scope, $timeout) {

    var wheelSocket = new Socket("4242");
    var relaySocket = new Socket("4242");

    var $ctrl = this;

    $ctrl.leds = [];
    $ctrl.relays = [];
    $ctrl.frames = [];

    $ctrl.knobs = KNOBS;

    $ctrl.animation = new Animation();
    $ctrl.frames.push(new Frame(1,"data:image/jpeg;base64,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"));

    /* CREATE LEDS */
    for(var i = 0; i < 26; i++) {
      var led = new Led(i)
      $ctrl.leds.push(led);
    }
    /* Create Relays */
    for(var i = 0; i < 8; i++) {
      var relay = new Relay(i);
      $ctrl.relays.push(relay);
    }

    /*

    ┬ ┬┬
    │ ││    ------------------------------------------
    └─┘┴

    */

    $ctrl.setOption = function(attr, value) {
      $ctrl.options[attr] = value;
    }

    $ctrl.increaseLedCount = function()  {
      var led = new Led($ctrl.leds.length+1)
      $ctrl.leds.push(led);
    }

    $ctrl.decreaseLedCount = function() {
      $ctrl.leds.splice($ctrl.leds.length - 1, 1);
    }

    $ctrl.selectLed = function(index) {
      $ctrl.activeLed = index;
      var led = $ctrl.leds[$ctrl.activeLed];
    }

    $ctrl.toggleRelay = function(index) {
      var relay = $ctrl.relays[index];
      relay.value.on = !relay.value.on;
      $ctrl.relays[index] = relay;
    }
    /*

    ┬  ┌─┐┬ ┬┌┐┌┌─┐┬ ┬┌─┐┌─┐┌┬┐
    │  ├─┤│ │││││  ├─┤├─┘├─┤ ││   ---------------------------------
    ┴─┘┴ ┴└─┘┘└┘└─┘┴ ┴┴  ┴ ┴─┴┘

    */

    function frame() {
      // Update the animation parameters
      $ctrl.animation.updateParams($ctrl.knobs);
      // Update the leds values
      // Update the view
      $timeout(function() {
        $scope.$apply();
      })
      // Send the data away
      // If launnchpad is engaged, we don't want to send anything here
      // because we might be triggering it our self
      wheelSocket.sendLeds($ctrl.leds);
      relaySocket.sendRelays($ctrl.relays);
      // Call this function again soon
      var frameRate = 500;
      if($ctrl.knobs != null) {
        frameRate = $ctrl.knobs.frameRate.value;
      }
      setTimeout(
        function() {
          frame()
        },
        frameRate
      );

    }

    frame();
    /* Send Led Data to Socket */
    var framePosition = 0;
    

    /*

    ┌─┐┌─┐┬  ┌─┐┬─┐  ┌─┐┬┌─┐┬┌─┌─┐┬─┐
    │  │ ││  │ │├┬┘  ├─┘││  ├┴┐├┤ ├┬┘   -------------------------
    └─┘└─┘┴─┘└─┘┴└─  ┴  ┴└─┘┴ ┴└─┘┴└─

    */

    $('.picker-primary').spectrum({
      move: function(color) {
        var values = color.toRgb();
        primaryColorValue = values;
        if($ctrl.animation.activeAnimation == "NONE") {
          for(key in $ctrl.leds) {
            $ctrl.leds[key].value = {
              r: values.r,
              g: values.g,
              b: values.b 
            }       
          }
        }
      }
    });

    $('.picker-secondary').spectrum({
      move: function(color) {
        var values = color.toRgb();
        secondaryColorValue = values;
      }
    });

  }

});

function Frame(id, image) {
  this.id = id; 
  this.image = image;
  this.width = 400;
}

function Led(position) {
  this.position = position;
  this.value = {
    r: 0,
    g: 0,
    b: 255
  }
}

function Relay(position) {
  this.position = position;
  this.value = {
    on: true
  }
}
