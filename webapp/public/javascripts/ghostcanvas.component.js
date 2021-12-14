//http://jsfiddle.net/r4TMq/11/
angular.module('sexlightsApp').component('ghostFrame', {
  bindings: {
    frame: '=',
  },
  templateUrl: 'javascripts/ghostcanvas.template.html',
  controller: function($scope, $element) {
    
    var $ctrl = this;

    $ctrl.canvas;
    $ctrl.context; 

    $ctrl.knobs = {
      brushSize: {
        value: 10,
        options: {
          width: 100,
          min: 10,
          max: 200, 
          step: 10,
          skin: 'tron',
          fgColor: 'salmon',
          bgColor: '#ccc'
        }
      }
    };
 
    var sketchpad = new Sketchpad({
      element: "#canvas",
      width: 400,
      height: 400
    });


    $ctrl.updateOptions = function(size) {
      sketchpad.penSize = size;
    }

    $element.find('.color-picker').spectrum({
      move: function(color) {
        var values = color.toRgb();
        sketchpad.color = color.toHexString();
      }
    });


    $ctrl.$onInit = function() {
      $ctrl.canvas = $element.find('canvas')[0];
      $ctrl.context = $ctrl.canvas.getContext('2d');


      var img = new Image();   
      
      img.addEventListener('load', function() {
        $ctrl.context.drawImage(img,0,0,$ctrl.canvas.width,$ctrl.canvas.height);
      }, false);

      img.crossOrigin = '';
      img.src = $ctrl.frame.image; // Set source path





      $ctrl.frame.getPixelAt = function(distanceFromCenter,slicePosition) {

        var slices = 12;
        var slice = 2 *Math.PI/slices;
        var radius = ($ctrl.frame.width/2) - (distanceFromCenter/2);
        radius = distanceFromCenter/2;

        angle = slice * slicePosition%slices;
        var x = $ctrl.frame.width/2 + radius * Math.cos(angle);
        var y = $ctrl.frame.width/2 + radius * Math.sin(angle);

        var data = $ctrl.context.getImageData(x,y,1,1).data;
        color = [data[0],data[1],data[2]];

        $ctrl.context.drawImage(img,0,0,100,100);
        //$ctrl.context.fillRect(x, y, 1, 1);
        //$ctrl.context.fillStyle = "#000000";
        //$ctrl.context.fill();

        return color;
      }
    }

    

  }
})