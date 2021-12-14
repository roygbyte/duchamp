function Launchpad() {

  this.ON = 0;
  this.OFF = 1;

  this.controller = {
    out: null,
    in: null
  };

  var self = this;

  this.engaged = 0;
  this.listener = null;
  this.isSticky = false;

  /* Init */
  WebMidi.enable(function (err) {

    self.controller.out = WebMidi.getOutputByName("Launchpad MIDI 1");
    self.controller.in = WebMidi.getInputByName("Launchpad MIDI 1");

    if(self.controller.in) {
      console.log("Found Launchpad in");
      self.controller.in.addListener('noteon','all', function(e) {
        var gridIndex = e.data[1];
        self.controller.out.send(status,[gridIndex,"13"],0);
        self.listener(gridIndex,self.ON);
        self.engaged += 1;
      });
      self.controller.in.addListener('noteoff','all', function(e) {
        var gridIndex = e.data[1];
        self.controller.out.send(status,[gridIndex,"0"],0);
        self.listener(gridIndex,self.OFF);
        self.engaged -= 1;
      });

    }
    
    if(self.controller.out) {
      console.log("Found Launchpad out");
      var status = 144;
      var index = 0;
     /* for(var i = 0; i < 64; i++) {
        self.controller.out.send(status,[index * 16 + i%8,"20"],0);
        if(i%8 == 7) {
          index++;
        }
      }*/
      console.log("done");
    }
  });

  this.isEngaged = function() {
    if(self.engaged > 0) {
      return true;
    } else {
      return false;
    }
  }

  this.setListener = function(l) {
    this.listener = l;
  }

  // This will output lights to the controller 
  // so we can know what's what
  this.fancy = function() {
    if(this.controller.out != null) {
      this.controller.out.send(144,[32, "20"],0);
      
      // Pause
      this.controller.out.send(144,[3, "40"],0);
      
      // Random
      this.controller.out.send(144,[22, "44"],0);


      for(var i = 48; i < 119; i++) {
        this.controller.out.send(144,[i ,"22"],0);
      }

    }
  }

  this.setSticky = function(value) {
    this.isSticky = value;
  }

  this.event = function() {
     /* for(var i = 0; i < 64; i++) {
        self.controller.out.send(status,[index * 16 + i%8,"20"],0);
        if(i%8 == 7) {
          index++;
        }
      }*/
  }

}