var express = require('express');
var router = express.Router();

const dgram = require('dgram');

var flicker = [
	[
		[255,255,0],
		[255,0,0]
	],
	[
		[0,0,255],
		[255,0,255]
	]
];

// go through each pixel
// set the current index value corresponding 
// 	to the current loop pixel as high





function hslToRgb(h, s, l) {
	  var r, g, b;

		  if (s == 0) {
				    r = g = b = l; // achromatic
						  } else {
								    function hue2rgb(p, q, t) {
											      if (t < 0) t += 1;
														      if (t > 1) t -= 1;
																	      if (t < 1/6) return p + (q - p) * 6 * t;
																				      if (t < 1/2) return q;
																							      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
																										      return p;
																													    }

										    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
												    var p = 2 * l - q;

														    r = hue2rgb(p, q, h + 1/3);
																    g = hue2rgb(p, q, h);
																		    b = hue2rgb(p, q, h - 1/3);
																				  }

			  return [ r * 255, g * 255, b * 255 ];
}


function HSVtoRGB(h, s, v) {
	    var r, g, b, i, f, p, q, t;
			    if (arguments.length === 1) {
						        s = h.s, v = h.v, h = h.h;
										    }
					    i = Math.floor(h * 6);
							    f = h * 6 - i;
									    p = v * (1 - s);
											    q = v * (1 - f * s);
													    t = v * (1 - (1 - f) * s);
															    switch (i % 6) {
																		        case 0: r = v, g = t, b = p; break;
																										        case 1: r = q, g = v, b = p; break;
																																		        case 2: r = p, g = v, b = t; break;
																																										        case 3: r = p, g = q, b = v; break;
																																																		        case 4: r = t, g = p, b = v; break;
																																																										        case 5: r = v, g = p, b = q; break;
																																																																		    }
																	    return {
																				        r: Math.round(r * 255),
																								        g: Math.round(g * 255),
																												        b: Math.round(b * 255)
																																	    };
}



/**
 *  * Converts an HSV color value to RGB. Conversion formula
 *   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 *    * Assumes h, s, and v are contained in the set [0, 1] and
 *     * returns r, g, and b in the set [0, 255].
 *      *
 *       * @param   Number  h       The hue
 *        * @param   Number  s       The saturation
 *         * @param   Number  v       The value
 *          * @return  Array           The RGB representation
 *           */
function hsvToRgb(h, s, v){
	    var r, g, b;

			    var i = Math.floor(h * 6);
					    var f = h * 6 - i;
							    var p = v * (1 - s);
									    var q = v * (1 - f * s);
											    var t = v * (1 - (1 - f) * s);

													    switch(i % 6){
																        case 0: r = v, g = t, b = p; break;
																								        case 1: r = q, g = v, b = p; break;
																																        case 2: r = p, g = v, b = t; break;
																																								        case 3: r = p, g = q, b = v; break;
																																																        case 4: r = t, g = p, b = v; break;
																																																								        case 5: r = v, g = p, b = q; break;
																																																																    }

															    return [r * 255, g * 255, b * 255];
}


/* GET home page. */
router.get('/', function(req, res, next) {
	
	var port = 8888;
	var address = "192.168.2.18";

	var index = 0;

	
	function animation() {

		var anim = [];

		for(var pixel = 0; pixel < 20; pixel++) {
			if(pixel == index%20) {
				var a = index%100;
				var val = hsvToRgb(a/100,1,1);
//				console.log(val);
				led = val;
			} else {
				led = [0,0,0];
			}
			anim.push(led);
		}
		index++;
		send(anim);
		setTimeout(animation,100);
	}


	animation();



	function send(frames) {
		var s = "";
		for(var i = 0; i < frames.length; i++) {
			var frame = frames[i];
	//		console.log(frame);
			for(var v = 0; v < frame.length; v++) {
				var led = frame[v];
				s+= led + ":";
			}
			s += "#";
		}

		s = s.substr(0,s.length-2);
//		console.log(s);

		const buf1 = Buffer.from(s);
		const client= dgram.createSocket('udp4');

/*		client.send([buf1],port,address, (err) => {
//			console.log(err);
			client.close();
		});
*/
	}


  res.render('index', { title: 'Express' });
});

router.get('/udp',function(req, res, next) {

	console.log('accessing udp');

	var port = 8888;
	var address = "192.168.179.2";

	const buf1 = Buffer.from("0:255:255#0:0:255");
	const client= dgram.createSocket('udp4');
	client.send([buf1],port,address, (err) => {
		console.log('he');
		console.log(err);
		client.close();
	});

})



module.exports = router;
