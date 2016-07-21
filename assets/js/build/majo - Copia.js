
//
var MajoCreator = {};
(function (majo) {
	//variable of confinguration
	var conf = {
		cvw: 700,
		cvh: 500,
		squareli: 10,
		square: 0,
		padding: 15,
		maximg: 8
	};
	var self = this;
	var ctx;
	var sizsquad = 10;
	var ctxcache;
	var cvcache = document.createElement("canvas");
	var ctxfinally;
	var canvas;
	var i = 0;
	var edition = false;
	//Contaien the object imagen
	var imagenSorce = [];
	var imagenground = [];
	var textsource = [];
	var currenttext = null;
	var currentImgae = null;
	//resizing the img

	this.getEdition = function () {
		return edition;
	};
	this.setEdition = function (state) {
		edition = state;
	};
	//initialize function to get the canvas component
	this.initialize = function (cv) {
		canvas = document.getElementById(cv);
		canvas.width = conf.cvw;
		canvas.height = conf.cvh;
		canvas.addEventListener("wheel", this.currentZoom);
		ctx = canvas.getContext("2d");

		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		tipsquare();
	};

	var Text = function (id) {

		this.cvtext = document.createElement("canvas");
		this.cvtext.width = conf.cvw;
		this.cvtext.height = conf.cvh;
		this.ctx = this.cvtext.getContext("2d");
		this.root = document.getElementById("contenttext");
		this.ele = document.createElement("div");
		var self = this;
		var current = false;
		this.id = id;
		var color = {
			white: "rgb(255,255,255)", //white
			black: "rgb(0,0,0)",
			fillStyle: true,
			strokeStyle: false,
			shadowStyle: false,
			current: "rgb(0,0,0)"
		};
		var font = {
			size: 60,
			letter: "Impact, Arial Black"
		};
		var pos = {
			x: 10,
			y: 10,
			h: font.size + 10,
			w: conf.cvw
		};
		//square of the text meme
		var square = {
			minw: Math.floor(conf.cvw / 2),
			minh: font.size + 10,
			maxw: conf.cvw - 90,
			maxh: Math.floor(conf.cvh / 2) - 100,
			minl: 25
		};
		this.setCurrent = function () {
			current = true;
		};

		this.getSquare = function () {
			return square;
		};
		this.getPos = function () {
			return pos;
		};
		this.getLines = function () {
			return lines;
		};
		this.getFont = function () {
			return font;
		};

		this.drawTextMeme = function () {
			ctx.save();
			this.draw();
		};
		this.getColor = function () {
			return color;
		};
		this.getThis = function () {
			return this;
		};
		//when the div lost the focus, remove the object if it doesn't have contents
		this.onfocusout = function (evt) {

			if (evt.target.textContent.trim().length == 0) {
				var len = textsource.length;
				i = 0;
				for (; i < len; i++) {
					var strid = evt.target.id.split("-")[1];

					if (self.id == parseInt(strid)) {
						console.log(i, strid);
						textsource.splice(i, 1);
						self.root.removeChild(evt.target);
						break;
					}
				}
			} else {
				self.str = evt.target.textContent.trim();
				self.str = self.str.toUpperCase();
				evt.target.style.overflow = "hidden";
				evt.target.removeAttribute("contentEditable");
				evt.target.className = "text " + self.getClass();
			}
			evt.stopPropagation();
		};
		this.dbClick = function (evt) {};
		this.onClick = function (evt) {
			evt.target.className += " active";
			evt.target.setAttribute("contentEditable", "true");
			evt.target.focus();
		};
		var x, y;

		this.onMouseMove = function (evt) {

			if (current) {
				var x1 = evt.offsetX;
				var y1 = evt.offsetY;
				var mx, my;
				mx = x1 - x;
				my = y1 - y;
				console.log(mx, my);
				if (mx > 0) {
					self.getPos().x += mx;
				}
				if (mx < 0) {
					self.getPos().x -= mx;
				}
				if (my > 0) {
					self.getPos().y += my;
				}
				if (my < 0) {
					self.getPos().y -= my;
				}

				evt.target.style.left = self.getPos().x + "px";
				evt.target.style.top = self.getPos().y + "px";
				x = x1;
				y = y1;
			}
		};

		this.onMouseDown = function (evt) {
			evt.target.removeAttribute("contentEditable");
			current = true;
			x = evt.offsetX;
			y = evt.offsetY;

			evt.target.style.cursor = "move";
		};
		this.onMouseUp = function (evt) {
			current = false;
			evt.target.style.cursor = "auto";
		};
		this.onMousedbClick = function (evt) {};
		this.add();
	};
	Text.prototype = {
		measure: function () {
			var font = this.getFont();
			this.ctx.font = font.size + "px " + font.letter;
			//this.ctx.font = "60px Impact, Arial";
			w = this.ctx.measureText(this.str).width;
			//console.log(w)
			if (w > conf.cvw) {
				var word = this.str.split(" ");

				var len = word.length;
				i = 0;
				var sum = 0;
				var s = 0; //add new line for the draw word
				var line = [];
				line.push([]);
				do {
					word[i] = word[i].trim();
					sum += this.ctx.measureText(word[i]).width;

					line[s].push(word[i]);
					if (sum > this.getPos().w) {
						line.push([]);
						s++;
						sum = 0;
					}
					i++;
				} while (i < word.length);
				//if the length of line is less than four, then drawing with the same letter size
				if (line.length < 4) {} else {
					//the diference between the text and general canvas
					var diff = w - conf.cvw;
					var font = this.getFont();
					//var newsize = ((diff*100)/this.getFont().size)/100;
					var newsize = this.getFont().size / diff;
					this.getFont().size = newsize;
					console.log(this.getFont());
				}
			}
		},
		drawCurrent: function () {
			this.cvtext.width = this.cvtext.width;

			this.ctx.fillStyle = "rgba(255,255,255,0.3)";
			this.ctx.fillRect(this.getPos().x - 5, this.getPos().y, this.getPos().w, this.getPos().h);
			this.ctx.strokeStyle = "rgb(0,0,0)";
			this.ctx.lineWidth = 3;
			this.ctx.setLineDash([1, 2]);
			this.ctx.rect(this.getPos().x - 5, this.getPos().y, this.getPos().w, this.getPos().h);
			this.ctx.stroke();

			//resize
			var middle = Math.ceil(this.getPos().w / 2);
			this.ctx.lineWidth = 5;
			this.ctx.fillStyle = "rgb(255,255,255)";
			//top
			this.ctx.fillRect(this.getPos().x + middle, this.getPos().y - 5, sizsquad, sizsquad);
			//bottom
			this.ctx.fillRect(this.getPos().x + middle, this.getPos().h - 5, sizsquad, sizsquad);

			middle = Math.ceil(this.getPos().h / 2);
			//right
			this.ctx.fillRect(this.getPos().x - 5, this.getPos().y + middle, sizsquad, sizsquad);
			//left
			this.ctx.fillRect(this.getPos().x + 5 + this.getPos().w, this.getPos().y + middle, sizsquad, sizsquad);
		},
		getHead: function (w, h) {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><foreignObject width="100%" height="100%">';
		},
		getFooter: function () {
			return '</foreignObject></svg>';
		},
		getBody: function (body, style) {
			var stl = "style=";
			i = 0;
			var len = style.length;
			for (; i < len; i++) {
				stl += style[i];
			}

			var srt = '<div xmlns="http://www.w3.org/1999/xhtml" ' + stl + ' ">';
			str += body;
			stx += "</div>";
			return str;
		},
		add: function () {
			console.log(this);
			this.ele.className = "text active " + this.getClass();
			this.ele.id = "text-" + this.id;
			this.ele.setAttribute("contentEditable", "true");
			this.ele.style.minWidth = "10px";
			this.ele.style.minHeight = this.getSquare().minh + "px";
			this.ele.style.maxHeight = this.getSquare().maxh + "px";
			this.ele.style.maxWidth = this.getSquare().maxw + "px";
			this.ele.style.lineHeight = "55px"; //size letter
			if (textsource.length == 0) {}
			if (textsource.length == 1) {
				this.getPos().y = conf.cvh - this.getSquare().minh - 20;
			}
			if (textsource.length > 2) {
				this.getPos().x = Math.floor(Math.random() * (conf.cvw - 100 + 1)) + 100;
				this.getPos().y = Math.floor(Math.random() * (conf.cvh - 100 + 1)) + 100;
			}
			this.ele.style.top = this.getPos().y + "px";
			this.ele.style.left = this.getPos().x + "px";
			this.root.appendChild(this.ele);
			this.ele.onblur = this.onfocusout;
			this.ele.onclick = this.onClick;
			this.ele.onmousemove = this.onMouseMove;
			this.ele.onmouseup = this.onMouseUp;
			this.ele.onmousedown = this.onMouseDown;
			this.ele.ondblclick = this.onMousedbClick;
			console.log(Object.create(this.ele));
			this.ele.focus();
		}
	};

	var TextMeme = function (id) {

		this.draw = function () {
			this.drawCurrent();
			this.ctx.setLineDash([1, 0]);
			var font = this.getFont();
			this.ctx.font = font.size + "px " + font.letter;
			this.ctx.lineWidth = 6;
			this.ctx.strokeStyle = "rgb(0,0,0)";
			this.ctx.strokeText(this.str, this.getPos().x, this.getPos().h - 5);
			this.ctx.fillStyle = "rgb(255,255,255)";
			this.ctx.fillText(this.str, this.getPos().x, this.getPos().h - 5);
			ctxcache.drawImage(this.ctx.canvas, 0, 0);
		};
		this.getClass = function () {
			return "memetext";
		};
		Text.call(this, id);
	};

	TextMeme.prototype = Text.prototype;
	TextMeme.prototype.constructor = TextMeme;

	var TextStandard = function (id) {

		this.rotate = function (ang) {};
		this.getClass = function () {
			return "standard";
		};
		this.draw = function () {
			if (color.fillStyle) {
				ctx.lineWidth = 6;
				ctx.strokeStyle = "rgb(0,0,0)";
				ctx.strokeText(str, x, y);
				ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillText(str, x, y);
			}
			if (color.strokeStyle) {

				ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillText(str, x, y);
			}
			if (color.shadowStyle) {
				ctx.shadowColor = "#000000";
				ctx.shadowOffsetX = -1;
				ctx.shadowOffsetY = 0;
				ctx.shadowBlur = 5;
				ctx.fillText(str, x, y);
			}
		};
		this.setColorText = function (id) {};
		Text.call(this, id);
	};

	TextStandard.prototype = Object.create(Text.prototype);

	//object image meme, this is instanced when the user click over the image
	var ImagenMeme = function (id, x, y, width, height) {

		var img = new Image();
		var id = id;
		this.x = x;
		this.y = y;
		this.h = height;
		this.w = width;
		this.sx = x;
		this.sy = this.y;
		this.sx = this.w;

		var self = this;
		var currentSelect = false;
		//to cut of Image
		var cut = {
			x: 0,
			y: 0,
			w: conf.cvw,
			h: conf.cvh,
			sx: this.x,
			sy: this.y,
			state: false
		};
		var tmpcut = {
			x: 0,
			y: 0,
			w: conf.cvw,
			h: conf.cvh
		};
		this.strictrender = {
			x: 0,
			y: 0,
			x1: 0,
			y1: 0
		};

		this.setImage = function (src) {
			img.onload = function () {
				//console.log(this);
				//self.setImage(this);
			};
			img.src = src;
		};
		this.getId = function () {
			return id;
		};
		this.getImage = function () {
			return img;
		};
		var setImage = function (image) {
			img = image;
		};
		this.getSx = function () {
			return cut.x;
		};
		this.getSy = function () {
			return cut.y;
		};
		this.getSheight = function () {
			return cut.h;
		};
		this.getSwidth = function () {
			return cut.w;
		};
		this.draw = function (img) {

			cvcache.width = conf.cvw;
			cvcache.height = conf.cvh;

			var ctx1 = cvcache.getContext("2d");
			var img = this.getImage();
			//console.log(this.getImage().width+" "+this.getImage().height);

			ctx1.drawImage(this.getImage(), 0, 0, conf.cvw, conf.cvh);
			ctxcache = cvcache.getContext("2d");
			ctxfinally = cvcache.getContext("2d");
			ctx1.imageSmoothingEnabled = false;
			ctx1.mozImageSmoothingEnabled = false;
			ctx1.webkitImageSmoothingEnabled = false;
			ctx1.msImageSmoothingEnabled = false;

			if (cut.state) ctx.drawImage(ctx1.canvas, cut.x, cut.y, cut.w, cut.h, this.x, this.y, this.w, this.h); //,this.w,this.h);
			else ctx.drawImage(ctx1.canvas, this.x, this.y, this.w, this.h); //,this.w,this.h);
			ctxcache.drawImage(ctx.canvas, 0, 0, conf.cvw, conf.cvh);
			ctxfinally.drawImage(ctx.canvas, 0, 0, conf.cvw, conf.cvh);
		};
		this.setCutState = function (state) {
			conf.state = state;
		};
		this.setUp = function (pos) {
			this.x = pos.x;
			this.y = pos.y;
			this.w = pos.xw;
			this.h = pos.yh;
		};
		this.getX = function () {
			return this.x;
		};
		this.setX = function (xs) {
			this.x = xs;
		};
		this.getY = function () {
			return this.y;
		};
		this.setY = function (ys) {
			this.y = ys;
		};
		this.setUpstrictrender = function (setup) {
			this.strictrender.x = setup.x;
			this.strictrender.x1 = setup.x1;
			this.strictrender.y = setup.y;
			this.strictrender.y1 = setup.y1;
		};
		this.setCurrent = function () {
			currentSelect = true;
			renderCurrent();
		};
		//when the user begin to cut the image, set the temporal square
		this.initCut = function (x, y) {
			cut.sx = x;
			cut.sy = y;
			//rule of three
			var x1 = x - this.x;
			var y1 = y - this.y;

			var x2 = this.w;
			var y2 = this.h;

			var nx = x1 * 100 / x2;
			var ny = y1 * 100 / y2;

			var cx = Math.ceil(conf.cvw * nx / 100);
			var cy = Math.ceil(conf.cvh * ny / 100);

			tmpcut.x = cx, tmpcut.y = cy;
			//cut.state = true;
		};
		this.endCut = function (x, y) {
			var x = x * conf.cvw / (this.x + this.w);
			var y = y * conf.cvh / (this.y + this.h);
			var w = x - tmpcut.x;
			var h = y - tmpcut.y;
			tmpcut.w = w;
			tmpcut.h = h;
		};
		this.getInitCut = function () {
			return { x: tmp.x, y: tmp.y };
		};
		this.getCut = function () {
			return cut;
		};
		this.getcutState = function () {
			return cut.state;
		};
		this.cut = function () {
			cut.x = tmpcut.x;
			cut.y = tmpcut.y;
			cut.w = tmpcut.w;
			cut.h = tmpcut.h;
			cut.state = true;
			render();
		};
		this.noCut = function () {
			canvas.width = canvas.width;
			ctx.drawImage(ctxcache.canvas, 0, 0, conf.cvw, conf.cvh);
			currentImgae = false;
			//render();	
		};
		//zooming for the current image (in) increase and (out) decrease 
		this.zoomin = function () {
			if (cut.h > 50) {
				cut.x += 2;
				cut.y += 2;
				cut.w -= 4;
				cut.h -= 4;
				cut.state = true;
				render();
			}
		};
		this.zoomout = function () {

			if (cut.x > 0 || cut.y > 0 || cut.w < conf.cvw || cut.h < conf.cvh) {
				if (cut.x > 0) cut.x -= 2;
				if (cut.y > 0) cut.y -= 2;
				if (cut.w < conf.cvw) cut.w += 4;
				if (cut.h < conf.cvh) cut.h += 4;
				cut.state = true;
				render();
			}
		};
		var mx, my;
		this.initMove = function (x, y) {
			mx = x;
			my = y;
		};

		this.move = function (x, y) {
			var mvx, mvy;
			mvx = mx - x;
			mvy = my - y;
			console.log(mvy, mvx);
			if (mvx > 0) {
				if (cut.x + cut.w < conf.cvw) cut.x += 1;
			} else {
				if (cut.x > 0) cut.x -= 1;
				//cut.x-=1;
			}
			if (mvy > 0) {
				if (cut.y + cut.h < conf.cvh) cut.y += 1;
			} else {
				if (cut.y > 0) cut.y -= 1;
			}
			render();
			mx = x;
			my = y;
		};

		this.toString = function () {
			console.log(this);
		};
	};
	ImagenMeme.prototype.constructor = ImagenMeme;
	ImagenMeme.prototype = {
		setSource: function (src) {
			this.setImage(src);
		},
		setWidth: function (w) {
			this.w = w;
		},
		setHeight: function (h) {
			this.h = h;
		},
		setPosition: function (x, y) {},
		getWidth: function () {
			return this.w;
		},
		getHeight: function () {
			return this.h;
		}

	};
	/**
  * [tipsquare Create line for to view the Image ]
  * @return {[type]} [grid line]
  */
	var tipsquare = function () {
		var y = 0;
		var x = 0;
		conf.square = Math.floor(conf.cvh / conf.squareli);
		ctx.lineWidth = 0.5;
		ctx.setLineDash([5, 15]);
		ctx.strokeStyle = "#E1E1E1";
		for (; y < conf.cvh; y += conf.square) {
			ctx.moveTo(0, y);
			ctx.lineTo(conf.cvw, y);
			ctx.stroke();
		}
		for (; x < conf.cvw; x += conf.square) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, conf.cvh);
			ctx.stroke();
		}
	};
	//draw the background image, to extend of image meme
	var ImagenGrounder = function () {
		ImagenMeme.apply(this);
		this.draw = function () {
			ctx.drawImage(this.getImage(), 0, 0, conf.cvw, conf.cvh);
		};
	};
	ImagenGrounder.prototype = Object.create(ImagenMeme.prototype);

	//section for to enable or to disable text and image
	this.newImagen = function () {
		/*var img = new ImagenMeme()
  img.setSource(src);
  imagenSorce.put(img);*/
		console.log(++i);
	};
	this.newText = function (type) {
		if (type == 1) {
			var text = new TextMeme(textsource.length);
		} else {
			var text = new TextStandard(textsource.length);
		}
		textsource.push(text);
		currenttext = text;
	};
	this.getImageLength = function () {
		return imagenSorce.length;
	};
	this.ableNew = function () {
		return imagenSorce.length <= conf.maximg ? true : false;
	};
	this.newImagenground = function (src, id) {
		var img = new ImagenMeme(id);
		img.setSource(src);
		imagenSorce.push(img);
		selectGrid();
		/*var img = new ImagenGrounder(id)
  img.setSource(src);
  //imagenSorce.push(img);
  img.draw();*/
	};

	//-----------------fin section
	function selectGrid() {
		imagenSorce.indexOf(currentImgae);
		currentImgae = false;
		switch (imagenSorce.length) {
			case 1:
				simpleSquare();
				break;
			case 2:
				doubleSquare.doubleVsquare();
				break;
			case 3:
				tripleSquare.tripleonetwoHsquare();
				break;
			case 4:
				fourSquare.four3x1Hsquare();
				break;
			case 5:
				fiveSquare.five1_2_2Hsquare();
				break;
			case 6:
				sixSquare.six3x2square();
				break;
			case 7:
				sevenSquare.seven2_3_2Wsquare();
				break;
			case 8:
				eightSquare.eight4x2square();
				break;
			case 9:
				nineSquare.nine3x3square();
				break;
		}
		render();
	}

	//action over Image
	this.deleteImage = function (id) {
		i = 0;
		var len = imagenSorce.length;
		for (; i < len; i++) {
			if (imagenSorce[i].getId() == id) {
				var id = i;
				imagenSorce.splice(i, 1);
				selectGrid();
				return { state: true, id: id };
			}
		}
		return { state: false };
	};
	/*
 //Rendering of aplication Majo
  */
	//indentify the style for to draw simpleSquare, rendering of objct.
	var squareDraw;
	var render = function () {
		var len = imagenSorce.length;
		var i = 0;
		canvas.width = canvas.width;
		for (; i < len; i++) {
			imagenSorce[i].draw();
		};
		//squareDraw.render();
	};

	var renderCurrent = function () {
		canvas.width = canvas.width;
		ctx.drawImage(ctxcache.canvas, 0, 0, conf.cvw, conf.cvh);
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 4;
		ctx.lineCap = "round";
		ctx.rect(currentImgae.x, currentImgae.y, currentImgae.w, currentImgae.h);
		ctx.stroke();

		var middle = Math.ceil(currentImgae.w / 2);
		ctx.lineWidth = 5;
		//top
		ctx.rect(currentImgae.x + middle, currentImgae.y, sizsquad, sizsquad);
		//bottom
		ctx.rect(currentImgae.x + middle, currentImgae.y + currentImgae.h - sizsquad, sizsquad, sizsquad);

		middle = Math.ceil(currentImgae.h / 2);
		//right
		ctx.rect(currentImgae.x, currentImgae.y + middle, sizsquad, sizsquad);
		//left
		ctx.rect(currentImgae.x + currentImgae.w - sizsquad, currentImgae.y + middle, sizsquad, sizsquad);

		ctx.stroke();

		//ctxcache.drawImage(ctx.canvas,0,0,conf.cvw,conf.cvh);
	};
	//-----------------------Finish rendering

	//the square for to show the cutting
	this.setCut = function (w, h) {
		canvas.width = canvas.width;
		ctx.drawImage(ctxcache.canvas, 0, 0, conf.cvw, conf.cvh);
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.fillRect(currentImgae.getCut().sx, currentImgae.getCut().sy, w, h);
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.setLineDash([5, 9]);
		ctx.rect(currentImgae.getCut().sx, currentImgae.getCut().sy, w, h);
		ctx.stroke();
	};
	this.initCut = function (x, y) {
		currentImgae.initCut(x, y);
	};
	//__________________________________
	//style general of object
	var ruler = function (x, y, xw, yh) {

		return { x: x,
			y: y,
			yh: yh,
			xw: xw };
	};

	var simpleSquare = function (imgsource) {
		//Ruler
		var dataimg = imgsource;
		imagenSorce[0].setUp(ruler(0, 0, conf.cvw, conf.cvh));
	};
	var CenterSquare = function () {
		var simple = ruler(20, 20, conf.height - 20, conf.width - 20);
	};
	var doubleSquare = {
		doubleVsquare: function () {
			var simple = [];
			var middle = Number.parseInt(conf.cvw / 2);
			simple.push(ruler(0, 0, middle, conf.cvh));
			simple.push(ruler(middle, 0, middle, conf.cvh));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		doubleHsquare: function () {
			var simple = [];
			var middle = Number.parseInt(conf.cvh / 2);
			//console.log(ruler(0,0,conf.cvw,middle));
			//Ruler
			simple.push(ruler(0, 0, conf.cvw, middle));
			simple.push(ruler(0, middle, conf.cvw, middle));
			i = 0;
			for (; i < simple.length; i++) {
				//console.log(imagenSorce[i]);
				imagenSorce[i].setUp(simple[i]);
			}
		}
	};

	//
	var tripleSquare = {
		tripleVsquare: function () {
			var simple = [];
			var triple = Number.parseInt(conf.cvw / 3);
			//Ruler
			simple.push(ruler(0, 0, triple, conf.cvh));
			simple.push(ruler(triple, 0, triple, conf.cvh));
			simple.push(ruler(triple * 2, 0, triple, conf.cvh));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		tripleonetwoVsquare: function () {
			var simple = [];
			var dbl = Number.parseInt(conf.cvw / 2);
			var dblh = Number.parseInt(conf.cvh / 2);
			//Ruler
			simple.push(ruler(0, 0, dbl, conf.cvh));
			simple.push(ruler(dbl, 0, dbl, conf.cvh - dblh));
			simple.push(ruler(dbl, dblh, dbl, conf.cvh));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}, //two images on the right and one on the left
		tripletwooneVsquare: function () {
			var simple = [];
			var dbl = Number.parseInt(conf.cvw / 2);
			var dblh = Number.parseInt(conf.cvh / 2);
			//Ruler
			simple.push(ruler(0, 0, dbl, dblh));
			simple.push(ruler(0, dblh, dbl, conf.cvh - dblh));
			simple.push(ruler(dbl, 0, dbl, conf.cvh));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}, //two images on the left and one on the right
		tripleHSquare: function () {
			var simple = [];
			var triple = Number.parseInt(conf.cvh / 3);
			//Ruler
			simple.push(ruler(0, 0, conf.cvw, triple));
			simple.push(ruler(0, triple, conf.cvw, triple));
			simple.push(ruler(0, triple * 2, conf.cvw, triple));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}, //two images above and one below
		tripleonetwoHsquare: function () {
			var simple = [];
			var dbl = Number.parseInt(conf.cvw / 2); //widht of img
			var dblh = Number.parseInt(conf.cvh / 2); //height of img
			//Ruler
			simple.push(ruler(0, 0, conf.cvw, dblh));
			simple.push(ruler(0, dblh, dbl, dblh));
			simple.push(ruler(dbl, dblh, dbl, dblh));

			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}, //two images below and one above
		tripletwooneHsquare: function () {
			var simple = [];
			var dbl = Number.parseInt(conf.cvw / 2); //divido la imgaen en ancho
			var dblh = Number.parseInt(conf.cvh / 2); //divido la imagen en alto
			//Ruler
			simple.push(ruler(0, 0, dbl, dblh));
			simple.push(ruler(dbl, 0, dbl, dblh));
			simple.push(ruler(0, dblh, conf.cvw, dblh));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		} //two images above and one below
	};
	//
	var fourSquare = {
		fourHsquare: function () {
			var simple = [];
			var four = Number.parseInt(conf.cvh / 4);
			//Ruler
			simple.push(ruler(0, 0, conf.cvw, four));
			simple.push(ruler(0, four, conf.cvw, four));
			simple.push(ruler(0, four * 2, conf.cvw, four));
			simple.push(ruler(0, four * 3, conf.cvw, four));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		fourVsquare: function () {
			var simple = [];
			var four = Number.parseInt(conf.cvw / 4);
			//Ruler
			simple.push(ruler(0, 0, four, conf.cvh));
			simple.push(ruler(four, 0, four, conf.cvh));
			simple.push(ruler(four * 2, 0, four, conf.cvh));
			simple.push(ruler(four * 3, 0, four, conf.cvh));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		four2x2square: function () {
			var simple = [];
			var middleW = Number.parseInt(conf.cvw / 2);
			var middleH = Number.parseInt(conf.cvh / 2);
			//Ruler
			simple.push(ruler(0, 0, middleW, middleH));
			simple.push(ruler(middleW, 0, middleW, middleH));
			simple.push(ruler(0, middleH, middleW, middleH));
			simple.push(ruler(middleW, middleH, middleW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		four1x3Hsquare: function () {
			var simple = [];
			var tripleW = Number.parseInt(conf.cvw / 3);
			var middleH = Number.parseInt(conf.cvh / 2);
			//Ruler
			simple.push(ruler(0, 0, conf.cvw, middleH));
			simple.push(ruler(0, middleH, tripleW, middleH));
			simple.push(ruler(tripleW, middleH, tripleW, middleH));
			simple.push(ruler(tripleW * 2, middleH, tripleW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		four3x1Hsquare: function () {
			var simple = [];
			var tripleW = Number.parseInt(conf.cvw / 3);
			var middleH = Number.parseInt(conf.cvh / 2);
			//Ruler
			simple.push(ruler(0, 0, tripleW, middleH));
			simple.push(ruler(tripleW, 0, tripleW, middleH));
			simple.push(ruler(tripleW * 2, 0, tripleW, middleH));
			simple.push(ruler(0, middleH, conf.cvw, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}
	};
	var fiveSquare = {
		fiveHsquare: function () {
			var simple = [];
			var five = Number.parseInt(conf.cvh / 5);
			//Ruler
			simple.push(ruler(0, 0, conf.cvw, five));
			simple.push(ruler(0, five, conf.cvw, five));
			simple.push(ruler(0, five * 2, conf.cvw, five));
			simple.push(ruler(0, five * 3, conf.cvw, five));
			simple.push(ruler(0, five * 4, conf.cvw, five));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		fiveVsquare: function () {
			var simple = [];
			var five = Number.parseInt(conf.cvw / 5);
			//Ruler
			simple.push(ruler(0, 0, five, conf.cvh));
			simple.push(ruler(five, 0, five, conf.cvh));
			simple.push(ruler(five * 2, 0, five, conf.cvh));
			simple.push(ruler(five * 3, 0, five, conf.cvh));
			simple.push(ruler(five * 4, 0, five, conf.cvh));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		five2_3Hsquare: function () {
			var simple = [];
			var middleW = Number.parseInt(conf.cvw / 2);
			var middleH = Number.parseInt(conf.cvh / 2);
			var tripleW = Number.parseInt(conf.cvw / 3);
			//Ruler
			simple.push(ruler(0, 0, middleW, middleH));
			simple.push(ruler(middleW, 0, middleW, middleH));
			simple.push(ruler(0, middleH, tripleW, middleH));
			simple.push(ruler(tripleW, middleH, tripleW, middleH));
			simple.push(ruler(tripleW * 2, middleH, tripleW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		five3_2Hquare: function () {
			var simple = [];
			var middleW = Number.parseInt(conf.cvw / 2);
			var middleH = Number.parseInt(conf.cvh / 2);
			var tripleW = Number.parseInt(conf.cvw / 3);
			//Ruler
			simple.push(ruler(0, 0, tripleW, middleH));
			simple.push(ruler(tripleW, 0, tripleW, middleH));
			simple.push(ruler(tripleW * 2, 0, tripleW, middleH));
			simple.push(ruler(0, middleH, middleW, middleH));
			simple.push(ruler(middleW, middleH, middleW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		five1_2_2Hsquare: function () {
			var simple = [];
			var middleW = Number.parseInt(conf.cvw / 2);
			var tripleH = Number.parseInt(conf.cvh / 3);
			//Ruler
			simple.push(ruler(0, 0, conf.cvw, tripleH));
			simple.push(ruler(0, tripleH, middleW, tripleH));
			simple.push(ruler(middleW, tripleH, middleW, tripleH));
			simple.push(ruler(0, tripleH * 2, middleW, tripleH));
			simple.push(ruler(middleW, tripleH * 2, middleW, tripleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}
	};
	var sixSquare = {
		six2x3square: function () {
			var simple = [];
			var middleH = Number.parseInt(conf.cvh / 2);
			var tripleW = Number.parseInt(conf.cvw / 3);
			//Ruler
			simple.push(ruler(0, 0, tripleW, middleH));
			simple.push(ruler(tripleW, 0, tripleW, middleH));
			simple.push(ruler(tripleW * 2, 0, tripleW, middleH));
			simple.push(ruler(0, middleH, tripleW, middleH));
			simple.push(ruler(tripleW, middleH, tripleW, middleH));
			simple.push(ruler(tripleW * 2, middleH, tripleW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		six3x2square: function () {
			var simple = [];
			var tripleH = Number.parseInt(conf.cvh / 3);
			var middleW = Number.parseInt(conf.cvw / 2);
			//Ruler
			simple.push(ruler(0, 0, middleW, tripleH));
			simple.push(ruler(middleW, 0, middleW, tripleH));
			simple.push(ruler(0, tripleH, middleW, tripleH));
			simple.push(ruler(middleW, tripleH, middleW, tripleH));
			simple.push(ruler(0, tripleH * 2, middleW, tripleH));
			simple.push(ruler(middleW, tripleH * 2, middleW, tripleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}
	};
	var sevenSquare = {
		seven3_4Wsquare: function () {
			var simple = [];
			var middleH = Number.parseInt(conf.cvh / 2);
			var tripleW = Number.parseInt(conf.cvw / 3);
			var fourW = Number.parseInt(conf.cvw / 4);
			//Ruler
			simple.push(ruler(0, 0, tripleW, middleH));
			simple.push(ruler(tripleW, 0, tripleW, middleH));
			simple.push(ruler(tripleW * 2, 0, tripleW, middleH));
			simple.push(ruler(0, middleH, fourW, middleH));
			simple.push(ruler(fourW, middleH, fourW, middleH));
			simple.push(ruler(fourW * 2, middleH, fourW, middleH));
			simple.push(ruler(fourW * 3, middleH, fourW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		seven2_3_2Wsquare: function () {
			var simple = [];
			var tripleH = Number.parseInt(conf.cvh / 3);
			var middleW = Number.parseInt(conf.cvw / 2);
			var tripleW = Number.parseInt(conf.cvw / 3);
			//Ruler
			simple.push(ruler(0, 0, middleW, tripleH));
			simple.push(ruler(middleW, 0, middleW, tripleH));
			simple.push(ruler(0, tripleH, tripleW, tripleH));
			simple.push(ruler(tripleW, tripleH, tripleW, tripleH));
			simple.push(ruler(tripleW * 2, tripleH, tripleW, tripleH));
			simple.push(ruler(0, tripleH * 2, middleW, tripleH));
			simple.push(ruler(middleW, tripleH * 2, middleW, tripleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}
	};
	var eightSquare = {
		eight2x4square: function () {
			var simple = [];
			var middleH = Number.parseInt(conf.cvh / 2);
			var fourW = Number.parseInt(conf.cvw / 4);
			//Ruler
			simple.push(ruler(0, 0, fourW, middleH));
			simple.push(ruler(fourW, 0, fourW, middleH));
			simple.push(ruler(fourw * 2, 0, fourW, middleH));
			simple.push(ruler(fourW * 3, 0, fourW, middleH));
			simple.push(ruler(0, middleH, fourW, middleH));
			simple.push(ruler(fourW, middleH, fourW, middleH));
			simple.push(ruler(fourw * 2, middleH, fourW, middleH));
			simple.push(ruler(fourW * 3, middleH, fourW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		eight4x2square: function () {
			var simple = [];
			var fourH = Number.parseInt(conf.cvh / 4);
			var middleW = Number.parseInt(conf.cvw / 2);
			//Ruler
			simple.push(ruler(0, 0, middleW, fourH));
			simple.push(ruler(middleW, 0, middleW, fourH));
			simple.push(ruler(0, fourH, middleW, fourH));
			simple.push(ruler(middleW, fourH, middleW, fourH));
			simple.push(ruler(0, fourH * 2, middleW, fourH));
			simple.push(ruler(middleW, fourH * 2, middleW, fourH));
			simple.push(ruler(0, fourH * 3, middleW, fourH));
			simple.push(ruler(middleW, fourH * 3, middleW, fourH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}
	};
	var nineSquare = {
		nine3x3square: function () {
			var simple = [];
			var tripleH = Number.parseInt(conf.cvh / 3);
			var tripleW = Number.parseInt(conf.cvw / 3);
			//Ruler
			simple.push(ruler(0, 0, tripleW, tripleH));
			simple.push(ruler(tripleW, 0, tripleW, tripleH));
			simple.push(ruler(tripleW * 2, 0, tripleW, tripleH));
			simple.push(ruler(0, tripleH, tripleW, tripleH));
			simple.push(ruler(tripleW, tripleH, tripleW, tripleH));
			simple.push(ruler(tripleW * 2, tripleH, tripleW, tripleH));
			simple.push(ruler(0, tripleH * 2, tripleW, tripleH));
			simple.push(ruler(tripleW, tripleH * 2, tripleW, tripleH));
			simple.push(ruler(tripleW * 2, tripleH * 2, tripleW, tripleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		nine4_5Wsquare: function () {
			var simple = [];
			var middleH = Number.parseInt(conf.cvh / 2);
			var fourW = Number.parseInt(conf.cvh / 4);
			var fiveW = Number.parseInt(conf.cvw / 5);
			//Ruler
			simple.push(ruler(0, 0, fourW, middleH));
			simple.push(ruler(fourW, 0, fourW, middleH));
			simple.push(ruler(fourW * 2, 0, fourW, middleH));
			simple.push(ruler(fourW * 3, 0, fourW, middleH));
			simple.push(ruler(0, middleH, fiveW, middleleH));
			simple.push(ruler(fiveW, middleH, fiveW, middleleH));
			simple.push(ruler(fiveW * 2, middleH, fiveW, middleleH));
			simple.push(ruler(fiveW * 3, middleH, fiveW, middleleH));
			simple.push(ruler(five * 4, middleH, fiveW, middleleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		}
	};
	//Event for interact with user
	//Searcher of image
	this.setCurrentimage = function (x, y) {
		var len = imagenSorce.length;
		if (len > 0) {
			i = 0;
			for (; i < len; i++) {
				if (x > imagenSorce[i].x && x < imagenSorce[i].x + imagenSorce[i].w && y > imagenSorce[i].y && y < imagenSorce[i].y + imagenSorce[i].h) {
					if (currentImgae === imagenSorce[i]) {

						return currentImgae;
					} else {
						currentImgae = imagenSorce[i];
						imagenSorce[i].setCurrent();
						return currentImgae;
					}
				}
			}
		} else {
			currentImgae = null;
			return null;
		}
	};

	this.setCurrenttext = function (x, y) {
		var len = textsource.length;
		if (len > 0) {
			i = 0;
			for (; i < len; i++) {
				if (x > textsource[i].getPos().x && x < textsource[i].getPos().x + textsource[i].getPos().w && y > textsource[i].getPos().y && y < textsource[i].getPos().y + textsource[i].getPos().h) {
					if (currenttext === textsource[i]) {

						return currenttext;
					} else {
						currenttext = textsource[i];
						textsource[i].setCurrent();
						return textsource;
					}
				}
			}
		} else {
			currentImgae = null;
			return null;
		}
	};
	//**--------------- Finish event interact
	this.getCurrent = function () {
		return currentImgae;
	};
	//zomm of current image
	this.currentZoom = function (event) {
		if (currentImgae) {
			var pos = event;
			var x = pos.offsetX;
			var y = pos.offsetY;
			if (x > currentImgae.x && x < currentImgae.x + currentImgae.w && y > currentImgae.y && y < currentImgae.y + currentImgae.h) {
				var delta = event.deltaY;
				if (delta > 0) {
					currentImgae.zoomout();
				} else {

					currentImgae.zoomin();
				}
			} else {}
		} else {
			console.log("no current");
		}
		event.preventDefault();
	};
}).apply(MajoCreator);
//Style Element for the imagen jSX
var ImagenMeme = React.createClass({
	handleClick: function (evt) {

		if (MajoCreator.ableNew()) {
			MajoCreator.newImagenground(evt.target.src, evt.target.tabIndex);
			var minimg = [{
				id: this.props.onkey,
				src: evt.target.src,
				alt: evt.target.alt
			}];
			this.props.onNew(minimg);
		} else {
			//exced the limit of the image
		}
		evt.stopPropagation();
	},
	render: function () {
		return React.createElement("img", { src: this.props.data.img, tabIndex: this.props.data.id, alt: this.props.data.alt, onClick: this.handleClick });
	}
});
var Imagen = React.createClass({
	onMouseEnter: function (evt) {},
	onMouseLeave: function (evt) {},
	onClick: function (evt) {
		var remove = MajoCreator.deleteImage(evt.target.id);
		if (remove.state) {

			this.props.rmImage(remove.id);
		}
		evt.stopPropagation();
		evt.preventDefault();
	},
	render: function () {
		var dt = this.props.data;
		return React.createElement(
			"figure",
			{ className: "removeImage", key: dt.length, id: dt.id, onClick: this.onClick },
			React.createElement("img", { src: dt.src, alt: dt.alt, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave })
		);
	}
});
//Image container for the search
var ContentImage = React.createClass({
	onNewImagen: function (data) {
		this.props.onImageNew(data);
	},
	render: function () {
		var dataimage = this.props.srcDataImage;
		var self = this;
		return React.createElement(
			"div",
			{ id: "ImageSeacrhed" },
			dataimage.map(function (data) {
				return React.createElement(ImagenMeme, { key: data.id, onkey: data.id, data: data, onNew: self.onNewImagen });
			})
		);
	}
});
//First div of the search bar ss
var SearchElement = React.createClass({
	getInitialState: function () {
		return { inputDissable: false };
	},
	onSubmit: function (event) {
		var self = this;
		event.preventDefault();
		var valor = event.target[0].value;
		if (valor.trim().length > 0) {
			$.ajax({
				method: "POST",
				url: window.location.href + "index.php/majo/getImage/" + valor,
				success: function (data) {
					var dt = JSON.parse(data);
					self.props.onHandleSearch(dt, valor);
				},
				beforeSend: function () {},
				complete: function () {}
			});
		}
	},
	render: function () {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"form",
				{ id: "search", onSubmit: this.onSubmit },
				React.createElement("input", { type: "text",
					placeholder: "Search image ..",
					name: "txtsearch", required: true }),
				React.createElement("input", { type: "submit",
					value: "Search",
					name: "btnsearch", enable: "false" })
			)
		);
	}
});
//Bar searcher for to find the image
var Searcher = React.createClass({
	getInitialState: function () {
		return { sourceImage: [] };
	},
	handleUserSearch: function (data, srtTextSeacrh) {
		var dtImg = [];
		var i = 0;
		data.map(function (ds) {
			var obj = { id: ds.id, img: ds.source, alt: srtTextSeacrh };
			dtImg.push(obj);
			i++;
		});
		//Establish state of data
		this.setState({ sourceImage: dtImg });
	},
	onImageNew: function (data) {

		this.props.addImageList(data);
	},
	render: function () {
		return React.createElement(
			"div",
			{ id: "search", className: "create" },
			React.createElement(SearchElement, { onHandleSearch: this.handleUserSearch }),
			React.createElement(
				"div",
				null,
				"Click pra ver"
			),
			React.createElement(
				"div",
				null,
				"Recentes imagenes"
			),
			React.createElement(ContentImage, { srcDataImage: this.state.sourceImage, onImageNew: this.onImageNew })
		);
	}
});
//options of the grid canvas
var StyleGrid = React.createClass({
	render: function () {

		return React.createElement(
			"li",
			null,
			this.props.gstyle.name
		);
	}
});
var current = null;
//Principal layout for to create the meme
var Creator = React.createClass({
	getInitialState: function () {
		return { imglist: [] };
	},
	componentDidMount: function () {
		MajoCreator.initialize("canvas");
	},
	onMouseDown: function (evt) {
		var pos = evt.nativeEvent;
		var target = evt.target;
		var x = pos.offsetX;
		var y = pos.offsetY;
		current = MajoCreator.setCurrentimage(x, y);

		var btn = pos.button == 1 ? 0 : pos.button;
		if (current) {
			if (btn == 0) {
				//ask if the state of the image is true, then the image is able for to moving
				if (current.getCut().state) {
					target.style.cursor = "move";
					current.initMove(x, y);
				}
			} else {
				MajoCreator.setEdition(true);
				MajoCreator.initCut(x, y);
				target.style.cursor = "crosshair";
			}
		} else {
			target.style.cursor = "auto";
		}
	},
	onMouseMove: function (evt) {
		var pos = evt.nativeEvent;
		var target = evt.target;
		var x = pos.offsetX;
		var y = pos.offsetY;
		//current = (current!=null)?MajoCreator.getCurrent():null;
		//console.log(current);
		if (current) {
			//it's drawing a rectangle for the cut
			if (MajoCreator.getEdition()) {
				if (x < current.x) x = current.x;
				if (x > current.x + current.w) x = current.x + current.w;
				if (y < current.y) y = current.y;
				if (y > current.y + current.h) y = current.y + current.h;
				var w = x - current.getCut().sx;
				var h = y - current.getCut().sy;
				MajoCreator.setCut(w, h);
			}

			//put the cursor and move the image
			if (target.style.cursor != "move") {
				if (!MajoCreator.getEdition()) {
					target.style.cursor = "zoom-in";
				} else {
					target.style.cursor = "auto";
				}
			} else {
				current.move(x, y);
			}
			//change the cursor when it leaves of current image
			if (x > current.x && x < current.x + current.w && y > current.y && y < current.y + current.h) {} else {
				target.style.cursor = "auto";
			}
		} else {
			target.style.cursor = "auto";
		}
	},
	contextMenu: function (e) {

		e.preventDefault();
		// addMenu.popup(e.clientX, e.clientY);
	},
	//when the mouse up on image, it shows the menu for to cut the image
	onMouseUp: function (evt) {
		var pos = evt.nativeEvent;
		var target = evt.target;
		current = MajoCreator.getCurrent();
		var x = pos.offsetX;
		var y = pos.offsetY;
		if (MajoCreator.getEdition()) {
			current.endCut(x, y);
			MajoCreator.setEdition(false);
			$("#pruebadiv").css({ 'top': pos.offsetY - 60 + 'px' });
			$("#pruebadiv").css({ 'left': pos.offsetX - 20 + 'px' });
			$("#pruebadiv").css({ visibility: 'visible' });
		}
		target.style.cursor = "auto";
	}, //clicked the menu for to cut the image
	onClickcut: function (evt) {
		if (Number.parseInt(evt.target.id) == 1) {
			current.cut();
		} else {
			current.noCut();
			current = null;
			$("#pruebadiv").css({ visibility: 'hidden' });
		}
	},
	onWheel: function (evt) {},
	addImageList: function (data) {
		var newdata = this.state.imglist.concat(data);
		this.setState({
			imglist: newdata
		});
	},
	removeImageList: function (id) {
		var newdata = this.state.imglist;
		newdata.splice(id, 1);
		this.setState({
			imglist: newdata
		});
	},
	addNewTextMeme: function (evt) {
		if (MajoCreator.getImageLength() > 0) MajoCreator.newText(1);
	},
	addNewTextStandar: function (evt) {
		if (MajoCreator.getImageLength() > 0) MajoCreator.newText(2);
	},
	render: function () {
		var gridstyle = this.props.gridstyle;
		var rowstyle = [];
		var data = this.state.imglist;
		var self = this;
		return React.createElement(
			"div",
			{ id: "content" },
			React.createElement(
				"div",
				{ id: "textsyle" },
				"Add Text",
				React.createElement(
					"button",
					{ onClick: this.addNewTextMeme, className: "buttomtext", id: "memetext" },
					"A"
				),
				React.createElement(
					"button",
					{ onClick: this.addNewTextStandar, className: "buttomtext", id: "standard" },
					"A"
				)
			),
			React.createElement(
				"div",
				{ id: "make" },
				React.createElement(
					"div",
					{ id: "imagelist" },
					data.map(function (result) {
						return React.createElement(Imagen, { key: result.id, data: result, rmImage: self.removeImageList });
					})
				),
				React.createElement(
					"div",
					{ id: "pruebadiv" },
					React.createElement("br", null),
					React.createElement(
						"button",
						{ id: "1", onClick: this.onClickcut },
						"Yes"
					),
					React.createElement(
						"button",
						{ id: "0", onClick: this.onClickcut },
						"Not"
					)
				),
				React.createElement(
					"div",
					{ id: "contenttext" },
					React.createElement("canvas", { id: "canvas", onMouseUp: this.onMouseUp, onMouseMove: this.onMouseMove, onMouseDown: this.onMouseDown, onContextMenu: this.contextMenu })
				),
				React.createElement(
					"div",
					{ id: "layout" },
					React.createElement(
						"ul",
						null,
						gridstyle.map(function (style) {
							return React.createElement(StyleGrid, { key: style.id, gstyle: style });
						})
					)
				)
			),
			React.createElement(Searcher, { addImageList: this.addImageList })
		);
	}
});

var OptionsGrid = [{ id: 1, name: "Single", backgroundimg: "" }, { id: 2, name: "Sigle resplandor", backgroundimg: "" }, { id: 3, name: "double vertical", backgroundimg: "" }, { id: 4, name: "double horizontal", backgroundimg: "" }, { id: 5, name: "tripe vertical ", backgroundimg: "" }, { id: 6, name: "tripe Hirizontal", backgroundimg: "" }, { id: 7, name: "four grid", backgroundimg: "" }, { id: 8, name: "OtherOptions", backgroundimg: "" }];

ReactDOM.render(React.createElement(Creator, { gridstyle: OptionsGrid }), document.getElementById("middle"));