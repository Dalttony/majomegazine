'use strict'
//
var majo = majo || {};
majo.creator = majo.creator || {};
(function(){
	//variable of confinguration
	var conf = {
		cvw: 700, // Canvas Width
		cvh: 500, // Canvas Hieght
		squareli: 10, 
		square: 0,
		idcanvas: "canvas",
		idsvg: "sgvcanvas",
		padding:15, //Padding Canvas
		maximg:8 //Maximun number into canvas
	};
	var self = this;
	var sizsquad=10;
	var cr = document.createElement("canvas");
	var crx = cr.getContext("2d");
	var cvcache = document.createElement("canvas"); //Canvas cache for save the image before to be created
	var ctxcache; // Context canvas cache for save the image before to be created
	var imgtemp = new Image();
	var ctxfinally;
	var canvas;
	var ctx; // Initial canvas

	var svgcanvas;

	var i = 0;
	var edition = false;
	//Contaien the object imagen
	var imagenSorce = [];
	var imagenground = [];
	var textsource = [];
	var currenttext = null;
	var currentImage = null;
	//resizing the img
	var shar = false;
	this.getEdition = function(){
		return edition;
	}
	this.setEdition = function(state){
		edition = state;
	}
	//initialize function to get the canvas component
	this.initialize = function(){
		canvas = document.getElementById(conf.idcanvas);
		svgcanvas = document.getElementById(conf.idsvg);
		
		//svgcanvas.setAttribute("width", conf.cvw);
 		//svgcanvas.setAttribute("height", conf.cvh);

		canvas.width = conf.cvw;
		canvas.height = conf.cvh;
		canvas.addEventListener("wheel",this.currentZoom);
		canvas.addEventListener("mousemove",this.handler.mousemove);
		canvas.addEventListener("mousedown",this.handler.mousedown);
		canvas.addEventListener("mouseup",this.handler.mouseup);
		canvas.addEventListener("contextmenu",this.handler.contextmenu);
		canvas.addEventListener("drop",this.handler.drop);
		canvas.addEventListener("dragover",this.handler.dragover);
		canvas.addEventListener("dragleave",this.handler.dragleave);
		console.log(Object.create(canvas));
		//canvas.addEventListener("drop",dropImage,true);
		//canvas.addEventListener("dragover",overImage,true);
		ctx = canvas.getContext("2d");
		
		ctx.imageSmoothingEnabled = true;
    	ctx.mozImageSmoothingEnabled = true;
   		ctx.webkitImageSmoothingEnabled = true;
    	ctx.msImageSmoothingEnabled = true;
		tipsquare();
	};

	
	var Text=function(id){

		this.cvtext = document.createElement("canvas");
		this.cvtext.width = conf.cvw;
		this.cvtext.height = conf.cvh;
		this.ctx = this.cvtext.getContext("2d");
		this.root = document.getElementById("contenttext");
		this.ele = document.createElement("div");
		var self = this;
		var current =false;
		this.id=id;
		var color={
			white:"rgb(255,255,255)", //white
			black:"rgb(0,0,0)",
			fillStyle:true,
			strokeStyle:false,
			shadowStyle:false,
			current:"rgb(0,0,0)"
		};
		var font={
			size:60,
			color:"rgb(255,255,255)",
			letter:"Impact, Arial Black"
		};
		var pos={
			x:10,
			y:10,
			h:font.size + 10,
			w:conf.cvw
		}
		//square of the text meme
		var square = {
			minw:Math.floor(conf.cvw/2),
			minh:font.size+10,
			maxw:conf.cvw-90,
			maxh:Math.floor(conf.cvh/2)-100,
			minl:25
		};
		this.setCurrent = function(){
			current = true;
		};
		
		this.getSquare= function(){
			return square;
		}
		this.getPos = function(){
			return pos;
		};
		this.getLines = function(){
			return lines;
		}
		this.getFont=function(){
			return font;
		};

		this.drawTextMeme = function(){
			ctx.save();
			this.draw();
		}
		this.getColor = function(){
			return color;
		};
		this.getThis = function(){
			return this;
		};
		//when the div lost the focus, remove the object if it doesn't have contents
		this.onfocusout = function(evt){

			if(evt.target.textContent.trim().length==0){
				var len = textsource.length;
				i=0
				for (; i < len; i++) {
					var strid = evt.target.id.split("-")[1];

					if(self.id==parseInt(strid)){
						console.log(i,strid);
						textsource.splice(i,1);
						self.root.removeChild(evt.target);
						break;
					}
				}
			}else{
				self.str=evt.target.textContent.trim();
				self.str=self.str.toUpperCase();
				evt.target.style.overflow = "hidden";
				evt.target.removeAttribute("contentEditable");
				evt.target.className ="text "+self.getClass();
			}
			evt.stopPropagation();
		};
		this.dbClick = function(evt){
			
		};
		this.onClick = function(evt){

		};
		var x,y;

		this.onMouseMove = function(evt){
			/*self.getPos().x+=1;
			self.getPos().y+=1;
			evt.target.style.left = self.getPos().x+"px";
			evt.target.style.top = self.getPos().y+"px";*/
		//	console.log(evt);
			
			/*if(current){
				var x1=evt.offsetX;
				var y1=evt.offsetY;
				var mx,my;
				mx=x1-x;
				my=y1-y;
				if(mx>0){
					self.getPos().x+=mx;
					
				}
				else
				{
					if(mx<0){
						self.getPos().x-=mx;
						evt.target.style.left = self.getPos().x+"px";
					}
				}
				/*if(my>0){
					self.getPos().y+=my;
				}
				if(my<0){
					self.getPos().y-=my;
				}*/
				//evt.target.style.left = self.getPos().x+"px";
				//evt.target.style.top = self.getPos().y+"px";
					/*evt.target.style.left = evt.x+"px";
				evt.target.style.top =evt.y+"px";
				console.log(mx,my);
				x=x1;
				y=y1;
			}*/
		};	
		//move te text in the image 
		this.onMouseDown = function(evt){
			
			evt.target.className ="text "+self.getClass();
			evt.target.setAttribute("contentEditable","false");
			evt.target.removeAttribute("resize");
			current=true;
			x=evt.offsetX;
			y=evt.offsetY;
			evt.target.style.cursor ="move";
		};
		this.onMouseUp = function(evt){
			evt.target.style.cursor ="auto";
			current=false;
			
		};
		this.onClick = function(evt){
			evt.target.className +=" active";
			evt.target.setAttribute("contentEditable","true");
			evt.target.focus();
		};
		this.onMouseEnter = function(evt){
			evt.target.className +=" active";
		};
		this.onMouseLeave = function(evt){
			evt.target.className ="text "+self.getClass();
		};
		this.add();
	}
	Text.prototype = {
		measure:function(){
			var font = this.getFont();
			this.ctx.font = font.size+"px "+font.letter;
			//this.ctx.font = "60px Impact, Arial";
			w = this.ctx.measureText(this.str).width;
			//console.log(w)
			if(w>conf.cvw){
				var word = this.str.split(" ");

				var len = word.length;
				i=0;
				var sum=0;
				var s=0;//add new line for the draw word
				var line = [];
				line.push([]);
				do{
					word[i] = word[i].trim();
					sum+=this.ctx.measureText(word[i]).width;

					line[s].push(word[i]);
					if(sum>this.getPos().w){
						line.push([]);
						s++;
						sum = 0;
					}
					i++;	

				}while(i < word.length);
				//if the length of line is less than four, then drawing with the same letter size
				if(line.length<4){

				}else{
					//the diference between the text and general canvas
				var diff = w - conf.cvw;
				var font = this.getFont(); 
				//var newsize = ((diff*100)/this.getFont().size)/100;
				var newsize = this.getFont().size/diff;
				this.getFont().size = newsize;	
				}
				
			}
		},
		drawCurrent:function(){
			this.cvtext.width =this.cvtext.width;
			
			this.ctx.fillStyle = "rgba(255,255,255,0.3)";
			this.ctx.fillRect(this.getPos().x-5,this.getPos().y,this.getPos().w,this.getPos().h);
			this.ctx.strokeStyle = "rgb(0,0,0)";
			this.ctx.lineWidth = 3;
			this.ctx.setLineDash([1, 2]);
			this.ctx.rect(this.getPos().x-5,this.getPos().y,this.getPos().w,this.getPos().h);
			this.ctx.stroke(); 

			//resize
			var middle =Math.ceil(this.getPos().w/2);
			this.ctx.lineWidth = 5;
			this.ctx.fillStyle="rgb(255,255,255)";
			//top
			this.ctx.fillRect(this.getPos().x+middle,this.getPos().y-5,sizsquad,sizsquad);
			//bottom
			this.ctx.fillRect(this.getPos().x+middle,this.getPos().h-5,sizsquad,sizsquad);
			
			middle=Math.ceil(this.getPos().h/2);
			//right
			this.ctx.fillRect(this.getPos().x-5,this.getPos().y+middle,sizsquad,sizsquad);
			//left
			this.ctx.fillRect(this.getPos().x+5+this.getPos().w,this.getPos().y+middle,sizsquad,sizsquad);
		},
		getHead:function(w,h){
			return '<svg xmlns="http://www.w3.org/2000/svg" width="'+this.ele.offsetWidth+'" height="'+(this.ele.offsetHeight+10)+'"><foreignObject width="100%" height="100%">'
		},
		getFooter:function(){
			return '</foreignObject></svg>';
		},
		getBody:function(style){
			var stl = 'style="';
			var x=0;
			var len = style.length;
				for (; x < len ; x++) {
					stl+=style[x];
				}

			var str ='<div xmlns="http://www.w3.org/1999/xhtml" '+stl+' ">'
			str+=this.ele.innerText;
			str+="</div>";
			return str;
		},
		add:function(){
			this.ele.className = "text active "+this.getClass();
			this.ele.id="text-"+this.id;
			this.ele.setAttribute("contentEditable","true");
			this.ele.setAttribute("xmlns","http://www.w3.org/1999/xhtml");
			this.ele.style.minWidth="10px";
			this.ele.width = conf.cvw+"px";
			this.ele.style.minHeight=this.getSquare().minh+"px";
			this.ele.style.maxHeight=this.getSquare().maxh+"px";
			this.ele.style.maxWidth=this.getSquare().maxw+"px";
			//this.ele.style.lineHeight="55px"//size letter
			if(textsource.length==1){
				this.getPos().y= conf.cvh-this.getSquare().minh-20;
			}
			if(textsource.length>2){
				this.getPos().x = Math.floor(Math.random() * (conf.cvw - 100 + 1)) + 100;
				this.getPos().y = Math.floor(Math.random() * (conf.cvh - 100 + 1)) + 100;
			}
			this.ele.style.top=this.getPos().y+"px";
			this.ele.style.left=this.getPos().x+"px";
			this.root.appendChild(this.ele);
			this.ele.onblur = this.onfocusout;
			this.ele.onclick = this.onClick;
			this.ele.onmousemove = this.onMouseMove;
			this.ele.onmouseup=this.onMouseUp;
			this.root.onmousedown=this.onMouseDown;
			//this.ele.ondblclick = this.onMousedbClick;
			this.ele.onresize = this.onResize;
			this.ele.focus();
		},
		draw:function(){
			var img = new Image;
			var data = this.getHead(this.getPos().w,this.getPos().h);
			data +=this.getBody(this.getStyle());
			data +=this.getFooter();
			var reader = new window.FileReader();
			var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
			//parse to sgv to base64 encode
			reader.readAsDataURL(svg); 
			 reader.onloadend = function() {
			                base64data = reader.result;                
			            
			                img.src = base64data;
			  }
			var self = this;
			img.crossOrigin ="Anonymous";
			img.onload = function () {
			  ctx.drawImage(img, self.getPos().x, self.getPos().y,self.ele.offsetWidth,self.ele.offsetHeight);
			 // window.open(canvas.toDataURL());
			  self.root.removeChild(self.ele);
			}
		}
	};


	var TextMeme = function(id){
		
		
		/*this.draw = function(){
			this.drawCurrent();
			this.ctx.setLineDash([1, 0]);
			var font = this.getFont(); 
			this.ctx.font = font.size+"px "+font.letter;
			this.ctx.lineWidth = 6;
			this.ctx.strokeStyle = "rgb(0,0,0)"; 
			this.ctx.strokeText(this.str,this.getPos().x,this.getPos().h-5);
			this.ctx.fillStyle= "rgb(255,255,255)";
			this.ctx.fillText(this.str,this.getPos().x,this.getPos().h-5);
			ctxcache.drawImage(this.ctx.canvas,0,0);
			
		};*/
		this.getClass = function(){
			return "memetext";
		};
		this.getStyle = function(){
			var style = [
			"text-transform: uppercase;",
			"display: block;",
			"text-align: center;",
			"word-wrap: break-word;",
			"z-index: 1;",
			"font:"+this.getFont().size+"px Impact, Arial Black;",
			"font-weight: bold;",
			"color:"+this.getFont().color+";",
			"-webkit-text-fill-color: white;",
			"-webkit-text-stroke-width: 3px;",
   			"-webkit-text-stroke-color: black;",
   			"text-stroke-width: 1px;",		
   			"text-stroke-color: black;",
   			"width:"+this.ele.offsetWidth+"px",
   			"height:"+this.ele.offsetHeight+"px"
			];
			return style;
		};

		Text.call(this, id);
	}

	TextMeme.prototype = Text.prototype;
	TextMeme.prototype.constructor = TextMeme;
	

	var TextStandard = function(id){
		

		this.rotate = function(ang){
 
		};
		this.getClass = function(){
			return "standard";
		};

		this.getStyle = function(){
			return [
			"text-transform: uppercase;",
			"display: block;",
			"text-align: center;",
			"word-wrap: break-word;",
			"z-index: 1;",
			"font: "+this.getFont().size+"px Impact, Arial Black;",
			"color:"+this.getFont().color+";",
			"width:"+this.ele.offsetWidth+"px",
   			"height:"+this.ele.offsetHeight+"px"
			];
		};
		/*this.draw = function(){
			if(color.fillStyle){
				ctx.lineWidth = 6;
				ctx.strokeStyle = "rgb(0,0,0)";
				ctx.strokeText(str,x,y);
				ctx.fillStyle= "rgb(255,255,255)";
				ctx.fillText(str,x,y);
			}
			if(color.strokeStyle){
					
					ctx.fillStyle= "rgb(255,255,255)";
					ctx.fillText(str,x,y);
			}
			if(color.shadowStyle){
					ctx.shadowColor="#000000"
					ctx.shadowOffsetX = -1; 
					ctx.shadowOffsetY = 0; 
					ctx.shadowBlur = 5;
					ctx.fillText(str,x,y);
			}
		};*/
		this.setColorText = function(id){

		};
		Text.call(this,id);
	};

	TextStandard.prototype = Object.create(Text.prototype);

	//object image meme, this is instanced when the user click over the image
	var ImagenMeme = function(id, x , y, width, height){
		var img = new Image()
		var id =id;
		var NS = "http://www.w3.org/2000/svg";
		this.imgtemp;
		this.x= x;
		this.y= y;
		this.h= height;
		this.w= width;
		this.sx= x;
		this.sy= this.y;
		this.sx = this.w;
		var self = this;
		var currentSelect=false;
		//to cut of Image
		var cut={
			x:0,
			y:0,
			w:conf.cvw,
			h:conf.cvh,
			sx:this.x,
			sy:this.y,
			state:false
		};
		var tmpcut= {
			x:0,
			y:0,
			w:conf.cvw,
			h:conf.cvh
		}
		this.strictrender ={
			x:0,
			y:0,
			x1:0,
			y1:0
		};
		
		this.setImage = function(src){
		//	img.crossOrigin = "Anonymous";
			img.onload = function(){
				//console.log(this);
				//self.setImage(this);
			}
			img.src=src;
		};
		this.getId = function(){
			return id;
		}
		this.getImage = function(){
			return img;
		};
		var setImage = function(image){
			img = image;
		}
		this.getSx = function(){
			return cut.x;
		};
		this.getSy = function(){
			return cut.y;
		};
		this.getSheight = function(){
			return cut.h;
		};
		this.getSwidth = function(){
			return cut.w;
		};
		this.draw = function(){
			cvcache.width =conf.cvw;
			cvcache.height = conf.cvh;
			var ctx1 = cvcache.getContext("2d");
			var img =this.getImage();
			this.getImage().crossOrigin='Anonymous';
			//console.log(this.getImage().width+" "+this.getImage().height);
			ctx1.drawImage(this.getImage(),0,0,conf.cvw,conf.cvh);
			ctxcache = cvcache.getContext("2d");
			ctxfinally = cvcache.getContext("2d");
			ctx1.imageSmoothingEnabled = true;
    		ctx1.mozImageSmoothingEnabled = true;
   			ctx1.webkitImageSmoothingEnabled = true;
    		ctx1.msImageSmoothingEnabled = true;
    		
    		
			if(cut.state) ctx.drawImage(ctx1.canvas,cut.x,cut.y,cut.w,cut.h,this.x,this.y,this.w,this.h);//,this.w,this.h);
			else ctx.drawImage(ctx1.canvas,this.x,this.y,this.w,this.h);//,this.w,this.h);
			ctxcache.drawImage(ctx.canvas,0,0,conf.cvw,conf.cvh);
			ctxfinally.drawImage(ctx.canvas,0,0,conf.cvw,conf.cvh);
		};

		this.drawsvg = function(){

			var image = document.createElementNS(NS,"image");			
			image.href.baseVal = this.imgtemp;
			image.x.baseVal.value  = this.x;
			image.y.baseVal.value  = this.y;
			image.width.baseVal.value  = this.w;
			image.height.baseVal.value  = this.h;
			sgvcanvas.appendChild(image);

 			var svg = document.getElementById(conf.idsvg);
 			svg.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
 			console.log(Object.create(svg));

			var svgString = new XMLSerializer().serializeToString(document.getElementById(conf.idsvg));
		
  			console.log(svgString);
			//var svg = $("#"+conf.idsvg).html().replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(" xlink=", " xmlns:xlink=").replace(/\shref=/g, " xlink:href="); //retiramos todos os espaços entre as tags e substituímos " xlink=" por " xmlns:xlink=" e " href=" por " xlink:href=", caso o navegador tenha alterado (Chrome, por exemplo).
       		 canvg(canvas, svg.outerHTML);
			//var canvas = document.getElementById("canvas");
			//
			/*var img = new Image();
			img.crossOrigin ="Anonymous";
			var reader = new window.FileReader();
			var svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
			//parse to sgv to base64 encode
			reader.readAsDataURL(svg); 
			 reader.onloadend = function() {
			              var base64data = reader.result;   
			               img.src = reader.result;
			                img.onload = function () {
				
							 console.log(img);
						  	ctx.drawImage(img, 20,40);
						 // window.open(canvas.toDataURL());
						  //self.root.removeChild(self.ele);
						}
			  }*/
			
			
		};

		this.setCutState = function(state){
			conf.state=state;
		};
		this.setUp= function(pos){
			this.x = pos.x;
			this.y = pos.y;
			this.w= pos.xw;
			this.h = pos.yh;
		};
		this.getX = function(){
			return this.x;
		};
		this.setX = function(xs){
			this.x=xs;
		};
		this.getY = function(){
			return this.y;
		};
		this.setY = function(ys){
			this.y=ys;
		};
		this.setUpstrictrender = function(setup){
			this.strictrender.x = setup.x;
			this.strictrender.x1=setup.x1;
			this.strictrender.y=setup.y;
			this.strictrender.y1=setup.y1;
		}
		this.setCurrent = function(){
			currentSelect=true;
			renderCurrent();
		}
		//when the user begin to cut the image, set the temporal square 
		this.initCut = function(x,y){
			cut.sx = x;
			cut.sy = y; 
			//rule of three 
			var x1 = x - this.x;
			var y1 = y - this.y;
			
			var x2 = this.w;
			var y2 = this.h;

			var nx = (x1*100)/x2;
			var ny = (y1*100)/y2;
			
			var cx = Math.ceil((conf.cvw*nx)/100);
			var cy = Math.ceil((conf.cvh*ny)/100);

			tmpcut.x = cx,
			tmpcut.y = cy;
			//cut.state = true;
		}
		this.endCut = function(x, y){
			var x = (x*conf.cvw) / (this.x+this.w);
			var y = (y*conf.cvh)/(this.y+this.h);
			var w = x - tmpcut.x;
  			var h = y - tmpcut.y;
			tmpcut.w=w;
			tmpcut.h=h;
		};
		this.getInitCut = function(){
			return {x:tmp.x,y:tmp.y};
		};
		this.getCut = function(){
			return cut;
		};
		this.getcutState = function(){
			return cut.state;
		};
		this.cut = function(){
			cut.x = tmpcut.x;
			cut.y = tmpcut.y;
			cut.w = tmpcut.w;
			cut.h = tmpcut.h;
			cut.state = true;
			render();
		};
		this.noCut = function(){
			canvas.width = canvas.width;
			ctx.drawImage(ctxcache.canvas,0,0,conf.cvw,conf.cvh);
			currentImage = false;
			//render();	
		};
		//zooming for the current image (in) increase and (out) decrease  
		this.zoomin = function(){
			this.zoom = true;
			if(cut.h>50){
				cut.x+=2;
				cut.y+=2;
				cut.w-=4;
				cut.h-=4;
				cut.state=true;
				render();
			}

		};
		this.zoomout = function(){
			
			if(cut.x>0 || cut.y >0 || cut.w < conf.cvw || cut.h < conf.cvh)
			{
				if(cut.x>0) cut.x-=2;
				if(cut.y>0)	cut.y-=2;
				if(cut.w<conf.cvw) cut.w+=4;
				if(cut.h<conf.cvh) cut.h+=4;
				cut.state=true;
				render();
			}
		};
		this.stateZomm = function(){
			return this.zoom;
		};
		var mx,my;
		this.initMove = function(x,y){
			mx=x;
			my=y;
		};

		this.move = function(x,y){
			var mvx,mvy;
			mvx = mx - x;
			mvy = my - y;
			if(mvx>0){
				if((cut.x+cut.w)<conf.cvw)cut.x+=1;
			}else{
				if(cut.x>0) cut.x-=1;
					//cut.x-=1;
			}
			if(mvy>0){
				if((cut.y+cut.h)<conf.cvh)cut.y+=1;
			}else{
				if(cut.y>0) cut.y-=1;
			}
				render();
			mx=x;
			my=y;
		};


		this.toString = function(){
			console.log(this);
		};
	};
	ImagenMeme.prototype.constructor = ImagenMeme;
	ImagenMeme.prototype = {
		setSource:function(src){
			this.setImage(src);
		},
		tempimage:function(src){
			this.imgtemp = src;
			console.log(this.imgtemp);
		},
		setWidth:function(w){
			this.w=w;
		},
		setHeight:function(h){
			this.h=h;
		},
		setPosition:function(x,y){

		},
		getWidth:function(){
			return	this.w;
		},
		getHeight:function(){
			return this.h;
		}
		
	}; 
	/**
	 * [tipsquare Create line for to view the Image ]
	 * @return {[type]} [grid line]
	 */
	var tipsquare = function(){
		var y = 0
		var x = 0;
		conf.square = Math.floor(conf.cvh/conf.squareli);
		ctx.lineWidth=0.5;
		ctx.setLineDash([5, 15]);
		ctx.strokeStyle="#E1E1E1";
		for(; y < conf.cvh; y+=conf.square) {
				ctx.moveTo(0,y);
				ctx.lineTo(conf.cvw,y);
				ctx.stroke();
		}
		for (;x < conf.cvw; x+=conf.square) {
				ctx.moveTo(x,0);
				ctx.lineTo(x,conf.cvh);
				ctx.stroke();
		}
	}
	//draw the background image, to extend of image meme
	var ImagenGrounder = function(){
		ImagenMeme.apply(this);
		this.draw = function(){
			ctx.drawImage(this.getImage(),0,0,conf.cvw,conf.cvh);	
		}
	}
	ImagenGrounder.prototype = Object.create(ImagenMeme.prototype);

//section for to enable or to disable text and image
	
	this.newText = function(type){
		if(type==1){
			var text = new TextMeme(textsource.length);	
		}else{
			var text = new TextStandard(textsource.length);	
		}
		textsource.push(text);
		currenttext = text;
	};
	this.getImageLength = function(){
		return imagenSorce.length;
	};
	this.ableNew = function(){
		return (imagenSorce.length <= conf.maximg) ? true:false;
	};
	this.newImagenground = function(src,id){

		id = imagenSorce.length
		var img = new ImagenMeme(id)
		img.setSource(src);
		imagenSorce.push(img);
		selectGrid()
		/*var img = new ImagenGrounder(id)
		img.setSource(src);
		//imagenSorce.push(img);
		img.draw();*/
	}

	this.newImagen = function(data){
		//if imagen quantity is less than the quantity there are into canvas
		var returned ={};
		if(imagenSorce.length <= conf.maximg){

			var self = this;
        	
        	cr.width = conf.cvw;
        	cr.height = conf.cvh;
        	crx.imageSmoothingEnabled = true;
    		crx.mozImageSmoothingEnabled = true;
   			crx.webkitImageSmoothingEnabled = true;
    		crx.msImageSmoothingEnabled = true;

    		imgtemp.crossOrigin ="Anonymous";
			
				/*var img = new ImagenMeme(imagenSorce.length)
				//img.setSource(src);
				img.tempimage(data.source);
				imagenSorce.push(img);
				selectGrid();
				var minimg = [{
					id: self.getImageLength(),
					src: data.source,
					alt: data.alt
				}];
				majo.observer.reciveNotify("newImagen", minimg);*/
    		imgtemp.onload = function(){
                crx.drawImage(imgtemp, 0, 0, conf.cvw, conf.cvh);
                var src = cr.toDataURL();
				var minimg = [{
					id: self.getImageLength(),
					src: data.source,
					alt: data.alt
				}];
				var img = new ImagenMeme(imagenSorce.length)
				img.setSource(src);
				img.tempimage(imgtemp.src);
				imagenSorce.push(img);
				selectGrid();
				majo.observer.reciveNotify("newImagen", minimg);
				//self.model.cacheImage(newdata, "newImage");
            }
            imgtemp.src = data.source; 
		}
		else{
			returned.created = false;
			returned.execedImage = true;
		}
		return returned;
	}

	this.share = function(){
		var len = textsource.length;
		i=0;
		for (; i < len; i++) {
			textsource[i].draw();			
		}
		textsource.splice(0,textsource.length);
	}
	this.send = function(){
		
		/*window.open("http://[::1]/Majocod/index.php/share/sess/","Confirmando share","status=1,height=500,width=500,location=1,status=1,scrollbars=1,modal");*/
		var img = canvas.toDataURL();
		
			/*$('#loadshare').load(window.location.href+"index.php/share",{dataimage:img},function( response, status, xhr ){

			});*/
	
		$.post(window.location.href+"index.php/share",function(data){
			data = JSON.parse(data);
			if(data.share){	
				$('#confirm').modal({
					overlayId: 'confirm-overlay',
					containerId: 'confirm-container',
					onShow: function (dialog) {
						var modal = this;
						dialog.container[0].style.width = conf.cvw+"px";
						dialog.container[0].style.height = "auto";
						dialog.data[0].style.width = conf.cvw+"px";
						dialog.data[0].style.height = conf.cvh+"px";
						$("#dataimage").attr("src", img);
						$("#dataimage").attr("width", conf.cvw);
						$("#dataimage").attr("height", conf.cvh);
						$('.yes', dialog.data[0]).click(function () {
							$.post(window.location.href+"index.php/share/postimage",{dataimage:img,texto:$("#texto").text()},function(dt){
								
								if(dt.shared){
									modal.close();
								}else{
									//show the error
								}
								 // or $.modal.close();
							});
							
						});
					}
				});
			}

			if(data.request && !data.error){
				share=true;

				// $( "#opacity" ).show();
				 var w = conf.cvw;
				 var h = conf.cvh;
				 var left = (screen.width/2)-(w/2);
  				var top = (screen.height/2)-(h/2);
  				var a = document.createElement("a");
				//     $("#op").attr("href", data.redirectTo).attr("target", "_blank")[0].click();
				  //   console.log($("#op"));
				window.open(data.redirectTo,'_blank',"Confirmando share",'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
				window.addEventListener('focus',function(){
					var self = this;
					
					if(share){
						$.post(window.location.href+"index.php/share/",function(data){
							data = JSON.parse(data);
							if(data.share){
								//open modal container
								$('#confirm').modal({
									position: ["20%"],
									overlayId: 'confirm-overlay',
									containerId: 'confirm-container',
									onShow: function (dialog) {
										share=false;
										var modal = this;

										this.close(); // or $.modal.close();
										dialog.container[0].style.width = conf.cvw+"px";
										dialog.container[0].style.height = "auto";
										dialog.data[0].style.width = conf.cvw+"px";
										dialog.data[0].style.height = conf.cvh+"px";
										$("#dataimage").attr("src", img);
										$("#dataimage").attr("width", conf.cvw);
										$("#dataimage").attr("height", conf.cvh);
										$('.yes', dialog.data[0]).click(function () {
											

											$.post(window.location.href+"index.php/share/postimage",{dataimage:img,texto:$("#texto").text()},function(data){
												data = JSON.parse(data)
												if(data.shared){

												}else{

												}
												
											});
											
										});
									}
								});
							}else{

							}
							window.removeEventListener('click',self);
						});
					}
				});
			}
		});
	};

	//-----------------fin section
	function selectGrid (){
		currentImage=false;
		switch(imagenSorce.length){
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
	this.deleteImage = function(id){
		i=0;
		var len = imagenSorce.length;
		for (; i < len; i++) {
			if(imagenSorce[i].getId() == id){
				var id= i;
				imagenSorce.splice(i,1);
				selectGrid();
				return { state: true, id: id};
			}
		}
		return {state:false};
	}
	/*
	//Rendering of aplication Majo
	 */
	//indentify the style for to draw simpleSquare, rendering of objct.
	var squareDraw;
	var render = function(){
		

		/*var len = imagenSorce.length;
		var i = 0;
		for (; i < len; i++) {
			imagenSorce[i].drawsvg();
		};*/

		var len = imagenSorce.length;
		var i = 0;
		canvas.width = canvas.width;
		for (; i < len; i++) {
			imagenSorce[i].draw();
		}
	}

	var renderCurrent = function(){
		canvas.width = canvas.width;
		ctx.drawImage(ctxcache.canvas,0,0,conf.cvw,conf.cvh);
		ctx.strokeStyle="#FF0000";
		ctx.lineWidth = 4;
		ctx.lineCap = "round";
		ctx.rect(currentImage.x,currentImage.y,currentImage.w,currentImage.h);
		ctx.stroke()
		
		
		
		var middle =Math.ceil(currentImage.w/2);
		ctx.lineWidth = 5;
		//top
		ctx.rect(currentImage.x+middle,currentImage.y,sizsquad,sizsquad);
		//bottom
		ctx.rect(currentImage.x+middle,currentImage.y+currentImage.h-sizsquad,sizsquad,sizsquad);
		
		middle=Math.ceil(currentImage.h/2);
		//right
		ctx.rect(currentImage.x,currentImage.y+middle,sizsquad,sizsquad);
		//left
		ctx.rect(currentImage.x+currentImage.w-sizsquad,currentImage.y+middle,sizsquad,sizsquad);

		ctx.stroke()


		
		//ctxcache.drawImage(ctx.canvas,0,0,conf.cvw,conf.cvh);
	}
	//-----------------------Finish rendering
	
	//the square for to show the cutting
	this.setCut = function(w,h){
		canvas.width = canvas.width;
		ctx.drawImage(ctxcache.canvas,0,0,conf.cvw,conf.cvh);
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.fillRect(currentImage.getCut().sx,currentImage.getCut().sy,w,h);
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.setLineDash([5, 9]);
		ctx.rect(currentImage.getCut().sx,currentImage.getCut().sy,w,h);
		ctx.stroke();
	}
	this.initCut = function(x,y){
		currentImage.initCut(x,y);
	}
	//__________________________________
	//style general of object
	var ruler  = function(x,y,xw,yh){
		
		return {x:x,
				y:y,
				yh:yh,
				xw:xw };
	};

	var simpleSquare = function(imgsource){
		//Ruler
		var dataimg = imgsource;
		imagenSorce[0].setUp(ruler(0, 0, conf.cvw, conf.cvh));
	};
	var CenterSquare = function(){
			var simple = ruler(20,20,conf.height-20,conf.width-20);		
	}
	var doubleSquare = {
	 doubleVsquare:function(){
		 	var simple = [];
		 	var middle = Number.parseInt(conf.cvw/2);
		 	simple.push(ruler(0,0,middle,conf.cvh));
		 	simple.push(ruler(middle,0,middle,conf.cvh));
			i=0
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
	 },
	 doubleHsquare:function(){
	 		var simple = [];
		 	var middle = Number.parseInt(conf.cvh/2);
		 	//console.log(ruler(0,0,conf.cvw,middle));
		 	//Ruler
		 	simple.push(ruler(0,0,conf.cvw,middle));
		 	simple.push(ruler(0,middle,conf.cvw,middle));
			i = 0;
			for (;i < simple.length; i++) {
				//console.log(imagenSorce[i]);
					imagenSorce[i].setUp(simple[i]);
			}
		}
	};
	
	//
	var tripleSquare = {
		tripleVsquare:function(){
			var simple = [];
		 	var triple = Number.parseInt(conf.cvw/3);
		 	//Ruler
		 	simple.push(ruler(0,0,triple,conf.cvh));
		 	simple.push(ruler(triple,0,triple,conf.cvh));
		 	simple.push(ruler((triple*2),0,triple,conf.cvh));
			i = 0;
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
		},
		tripleonetwoVsquare:function(){
			var simple = [];
			var dbl = Number.parseInt(conf.cvw/2)
		 	var dblh = Number.parseInt(conf.cvh/2);
		 	//Ruler
		 	simple.push(ruler(0,0,dbl,conf.cvh));
		 	simple.push(ruler(dbl,0,dbl,conf.cvh-dblh));
		 	simple.push(ruler(dbl,dblh,dbl,conf.cvh));
			i = 0;
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
		},//two images on the right and one on the left
		tripletwooneVsquare:function(){
			var simple = [];
			var dbl = Number.parseInt(conf.cvw/2)
		 	var dblh = Number.parseInt(conf.cvh/2);
		 	//Ruler
		 	simple.push(ruler(0,0,dbl,dblh));
		 	simple.push(ruler(0,dblh,dbl,conf.cvh-dblh));
		 	simple.push(ruler(dbl,0,dbl,conf.cvh));
			i = 0;
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
		},//two images on the left and one on the right
		tripleHSquare:function(){
			var simple = [];
		 	var triple = Number.parseInt(conf.cvh/3);
		 	//Ruler
		 	simple.push(ruler(0,0,conf.cvw,triple));
		 	simple.push(ruler(0,triple,conf.cvw,triple));
		 	simple.push(ruler(0,(triple*2),conf.cvw,triple));
			i = 0;
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
		}, //two images above and one below
		tripleonetwoHsquare:function(){
			var simple = [];
			var dbl = Number.parseInt(conf.cvw/2);//widht of img
		 	var dblh = Number.parseInt(conf.cvh/2);//height of img
		 	//Ruler
		 	simple.push(ruler(0,0,conf.cvw,dblh));
		 	simple.push(ruler(0,dblh,dbl,dblh));
		 	simple.push(ruler(dbl,dblh,dbl,dblh));
		 	
			i = 0;
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
		},//two images below and one above
		tripletwooneHsquare:function(){
			var simple = [];
			var dbl = Number.parseInt(conf.cvw/2) //divido la imgaen en ancho
		 	var dblh = Number.parseInt(conf.cvh/2); //divido la imagen en alto
		 	//Ruler
		 	simple.push(ruler(0,0,dbl,dblh)); 
		 	simple.push(ruler(dbl,0,dbl,dblh));
		 	simple.push(ruler(0,dblh,conf.cvw,dblh));
			i = 0;
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
		}//two images above and one below
	};
	//
	var fourSquare={
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
		fourVsquare: function(){
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
		four2x2square: function(){
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
		four1x3Hsquare: function(){
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
		four3x1Hsquare: function(){
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
	var fiveSquare={
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
		fiveVsquare: function(){
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
		five2_3Hsquare: function(){
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
		five3_2Hquare: function(){
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
		five1_2_2Hsquare: function(){
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
	var sixSquare={
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
		six3x2square: function(){
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
	var sevenSquare={
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
		seven2_3_2Wsquare: function(){
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
	var eightSquare={
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
		eight4x2square: function(){
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
	var nineSquare={
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
		nine4_5Wsquare: function(){
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
	this.setCurrentimage = function(x,y){
		var len = imagenSorce.length;
		if( len > 0)
		{	
			i=0;
			for (; i < len; i++) {
				if((x > imagenSorce[i].x && x < (imagenSorce[i].x+imagenSorce[i].w)) && (y > imagenSorce[i].y && y < (imagenSorce[i].y + imagenSorce[i].h))){
					if(currentImage === imagenSorce[i]){
						
						return currentImage;
					}
					else{
						currentImage = imagenSorce[i];
						imagenSorce[i].setCurrent();
						return currentImage;
					}
				}
			}
		}
		else
		{
			currentImage = null;
			return null;
		}
	};

	this.setCurrenttext = function(x,y){
		var len = textsource.length;
		if( len > 0)
		{	
			i=0;
			for (; i < len; i++) {
				if((x > textsource[i].getPos().x && x < (textsource[i].getPos().x+textsource[i].getPos().w)) && (y > textsource[i].getPos().y && y < (textsource[i].getPos().y + textsource[i].getPos().h))){
					if(currenttext === textsource[i]){
						
						return currenttext;
					}
					else{
						currenttext = textsource[i];
						textsource[i].setCurrent();
						return textsource;
					}
				}
			}
		}
		else
		{
			currentImage = null;
			return null;
		}
	};
//**--------------- Finish event interact
	this.getCurrent = function(){
		return currentImage;
	}
	//zomm of current image
	this.currentZoom = function(event){
		if(currentImage){
			var pos = event;
  			var x = pos.offsetX;
  			var y = pos.offsetY;
			if((x > currentImage.x && x < (currentImage.x + currentImage.w)) && (y > currentImage.y && y < (currentImage.y + currentImage.h))){
				var delta = event.deltaY;
				if(delta>0){
					currentImage.zoomout();
				}else{
					
					currentImage.zoomin();
				}
			}else{

			}
		}else{
			console.log("no current");
		}
		event.preventDefault();
	}

	/**
	 * Search Data 
	 */
	this.searchData = function(value){
		
	};


	this.handler = {
		cut:false,
		mousedown:function(evt){
		  		var target = evt.target;
		  		var x = evt.offsetX;
		  		var y = evt.offsetY;
		  		var btn = (evt.button==1)? 0: evt.button;
		  		
		  		if(currentImage){
		  			
		  				//ask if the state of the image is true, then the image is able for to moving 
		  				/*if(currentImage.getCut().state){
		  					target.style.cursor="move";
		  					currentImage.initMove(x,y);
		  				}*/
		  			self.setEdition(true);
		  				self.initCut(x,y);
		  				target.style.cursor="crosshair";
		  		}
		  		else{
		  			(evt.button==0)&&self.setCurrentimage(x, y); // if the buttom clicked is the left
		  			target.style.cursor="auto";	
		  		}
	  	},
	  	mousemove:function(evt){
	  		var target = evt.target;
	  		if(currentImage){

		  		var x = evt.offsetX;
		  		var y = evt.offsetY;
	  			//it's drawing a rectangle for the cut
	  			if(self.getEdition()){
		  			if( x < currentImage.x) x = currentImage.x;
		  			if( x > (currentImage.x + currentImage.w)) x = currentImage.x + currentImage.w;
		  			if( y < currentImage.y) y = currentImage.y;
		  			if( y > (currentImage.y + currentImage.h)) y = currentImage.y + currentImage.h;
		  			var w = x - currentImage.getCut().sx;
		  			var h = y - currentImage.getCut().sy;
		  			self.setCut(w,h);
	  			}
	  			//put the cursor and move the image
	  			if(target.style.cursor!="move"){
					if(!self.getEdition()){
						target.style.cursor="zoom-in";
					}else{
						target.style.cursor="auto"
					}
	   			}else{
	   				//currentImage.move(x,y);
	   			}
	   			//change the cursor when it's leaving  the current image
	   			if((x > currentImage.x && x < (currentImage.x+currentImage.w)) && (y > currentImage.y && y < (currentImage.y + currentImage.h))){

	  			}else{
	  				self.setEdition(false);
	  				currentImage = null;
	  				target.style.cursor="auto"
		  		}
	  		}else{
	  			target.style.cursor="auto";
	  		}
	  	},
	  	contextmenu: function(e) {
	    	
	    	e.preventDefault();
	   	// addMenu.popup(e.clientX, e.clientY);
		},
		//when the mouse up on image, it shows the menu for to cut the image
	  	mouseup:function(evt){
	  		
	  		var target = evt.target;
	  		var x = evt.offsetX;
	  		var y = evt.offsetY;
	  		if(self.getEdition()){
	  			currentImage.endCut(x,y);
	  			self.setEdition(false);
	  			currentImage.cut();
	  			/*$("#pruebadiv").css({'top' : y - 60 + 'px'});
	  			$("#pruebadiv").css({'left' : x -20 + 'px'});
	  			$("#pruebadiv").css({visibility : 'visible'});*/
			}
	  		target.style.cursor="auto";
	  	},//clicked the menu for to cut the image
	  	clickcut:function(evt){
	  		if(Number.parseInt(evt.target.id)==1){
	  			current.cut();
	  		}else{
	  			current.noCut();
	  			current = null;
	  			$("#pruebadiv").css({visibility : 'hidden'});
	  			
	  		}
	  	},
	  	wheel:function(evt){
	  		
	  	},
	  	drop:function(evt){
	  		evt.preventDefault();
	  		// evt.stopPropagation();
	  		var self = this;
	        var c = document.createElement("canvas");
	        c.width = 700;
	        c.height = 500;
	        var ct = c.getContext("2d");
	        ct.imageSmoothingEnabled = true;
	    	ct.mozImageSmoothingEnabled = true;
	   		ct.webkitImageSmoothingEnabled = true;
	    	ct.msImageSmoothingEnabled = true;
			var files = evt.dataTransfer.files;
			var len = files.length;
			if( len > 0){

				var i=0;
				var fr = new FileReader();
				var name='';
				fr.onload = function(evt){
						
						self.newImagen(evt.target.result);
		                /*var urlimage = evt.target.result;
						var minimg = [{
							id:l,
							src:urlimage,
							alt:name
						}];
						self.addImageList(minimg);*/
						if(i<len){
							if(files[i].type.indexOf("image")>=0){
								name = files[i].name.split(".")[0];
								fr.readAsDataURL(files[i]);
							}
						}
						i++;
				};
					if(files[i].type.indexOf("image")>=0){
						name = files[i].name.split(".")[0];
						fr.readAsDataURL(files[i]);
						i++;
					}
			}else{
				if(evt.dataTransfer.getData("text")){
					var strimage = evt.dataTransfer.getData("text");
					//veryfy if the source type if jgp or png
					if(strimage.match(/jpg|png/)){
						var img = new Image();
						img.crossOrigin ="Anonymous";
						img.onload = function(){
							ct.drawImage(img,0,0,700,500);
			                var src = c.toDataURL();
			                 var len = MajoCreator.getImageLength();
			                MajoCreator.newImagenground(src,len);
			                var urlimage =src;
			                var altext = "Majo Meme"
							var minimg = [{
								id:len,
								src:urlimage,
								alt:altext
							}];
							self.addImageList(minimg);
						}
						img.src = evt.dataTransfer.getData("text");
					}else{
						//show the msgbox for to indicate the error
						alert("Don't load this type, the image sorce is inadequate")
					}
				}
			}
			evt.target.style.cursor = 'auto'
			evt.target.className = ''
	  	},
	  	dragover:function(evt){
	  		evt.target.className = 'copy'
	  		evt.preventDefault();
	  	},
	  	dragleave:function(evt){
	  		evt.target.style.cursor='not-allowed'
	  		evt.preventDefault();
	  	},
	  	shareMeme:function(evt){
	  		self.share();
	  	},
	  	send:function(){
	  		self.send();
	  	},
 	 }
}).apply(majo.creator);