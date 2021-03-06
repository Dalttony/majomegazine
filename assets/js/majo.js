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
		padding:10, //Padding Canvas
		maximg:8 //Maximun number into canvas
	};
	var colortext = {
		cl1: "#000000",
		cl2: "#FF0000",
		cl3: "#FFFF00",
		cl4: "#008000"
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
	var down=false; //know when the user clicked 
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
		window.addEventListener('paste',this.handler.paste,false);
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
		var x,y;
		var maxword = 100;
		var countword = 0;
		this.id = id;
		var self = this;
		var color = {
			white: "rgb(255,255,255)", //white
			black: "rgb(0,0,0)",
			fillStyle: true,
			strokeStyle: false,
			shadowStyle: false,
			current: "rgb(0,0,0)"
		};
		var font={
			size: 50,
			color: "rgb(255,255,255)",
			letter: "Impact, Arial Black",
			weight: "normal",
		};
		var pos={
			x:10,
			y:10,
			h:font.size + 10,
			w:conf.cvw
		}
		//square of the text meme
		var square = {
			minw: Math.floor(conf.cvw/2),
			minh: font.size+10,
			maxw: conf.cvw-90,
			maxh: Math.floor(conf.cvh/2)-100,
			minl: 25
		};
		this.setCurrent = function(){
			current = true;
		};
		
		this.getSquare= function(){
			return square;
		};

		this.getPos = function(){
			return pos;
		};

		this.getLines = function(){
			return lines;
		};

		this.getFont = function(){
			return font;
		};

		this.drawTextMeme = function(){
			ctx.save();
			this.draw();
		};

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
						textsource.splice(i,1);
						self.root.removeChild(evt.target);
						break;
					}
				}
			}else{
				self.str = evt.target.textContent.trim();
				self.str = self.str.toUpperCase();
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
		
		this.onMouseMove = function(evt){
			//console.log(evt.offsetHeight+"-h w-"+evt.offsetWidth);
			if(down){
				if((currenttext.getPos().x > 0  &&  currenttext.getPos().x + evt.target.offsetWidth <= conf.cvw ) && (currenttext.getPos().y > 0  &&  currenttext.getPos().y + evt.target.offsetHeight <= conf.cvh)){
						x = currenttext.getPos().x;
						y = currenttext.getPos().y
						currenttext.getPos().x = evt.clientX - this.parentx - this.disxw;
						currenttext.getPos().y = evt.clientY - this.parenty - this.disyh;
				}else{
					currenttext.getPos().x = x;
					currenttext.getPos().y = y;
				}
				evt.target.style.left = currenttext.getPos().x+"px";
				evt.target.style.top = currenttext.getPos().y+"px";
			}	
		};	
		//move te text in the image 
		this.onMouseDown = function(evt){
			
//			evt.target.className ="text "+self.getClass();
			//establishing the current text
			self.setCurrenttext(evt.target.id.split("-")[1]);
			if(currenttext){

				evt.target.setAttribute("contentEditable","false");
				evt.target.removeAttribute("resize");
				//calculate distance of mouse position event and text bound 
				this.disxw =  evt.target.offsetWidth - evt.offsetX;
				this.disyh = evt.target.offsetHeight - evt.offsetY;
				
				this.disxw = evt.target.offsetWidth -  this.disxw;
				this.disyh = evt.target.offsetHeight -  this.disyh;
				
				this.parentx = evt.clientX - evt.target.offsetLeft - evt.offsetX ;
				this.parenty = evt.clientY - evt.target.offsetTop - evt.offsetY;
				
				evt.target.style.cursor ="move";
			}else{
				down=false;
			}
		};
		this.onMouseUp = function(evt){
			
			down = false;
			evt.target.className +=" active";
			evt.target.setAttribute("contentEditable","true");
			evt.target.style.cursor ="auto";
			evt.target.focus();

		};

		this.onClick = function(evt){
			
		};

		this.onResize = function(evt){

			countword++;
			if(maxword < countword) return false;
			if( square.minh * 2 < evt.target.offsetHeight){
				font.size = font.size * 0.9;
				evt.target.style.fontSize= font.size + "px";
			}

		};

		this.onMouseEnter = function(evt){
			evt.target.className +=" active";
		};
		this.onMouseLeave = function(evt){
			evt.target.className ="text "+self.getClass();
		};

		this.setCurrenttext = function(id){
			var len = textsource.length;
			if( len > 0)
			{	
				i=0;
				for (; i < len; i++) {
					//if((x > textsource[i].getPos().x && x < (textsource[i].getPos().x+textsource[i].getPos().w)) && (y > textsource[i].getPos().y && y < (textsource[i].getPos().y + textsource[i].getPos().h))){
					if(id == textsource[i].id){
						if(currenttext === textsource[i]){
						}
						else{
							currenttext = textsource[i];							
						}
						down = true;
						return currenttext;
					}
				}
			}
			down = false;
			currenttext = null;
			return null;
		
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
		add : function(){
			this.ele.className = "text active "+this.getClass();

			this.ele.id="text-"+this.id;
			this.ele.setAttribute("contentEditable","true");
			this.ele.setAttribute("xmlns","http://www.w3.org/1999/xhtml");
			this.ele.style.color = this.getFont().color;
			this.ele.style.minWidth="10px";
			this.ele.width = conf.cvw+"px";
			this.ele.style.fontFamily =  this.getFont().letter;
			this.ele.style.fontSize = this.getFont().size + "px";// Impact, 'Arial Black';
			this.ele.style.lineHeight = "1"
			this.ele.style.fontWeight = this.getFont().weight;
			this.ele.style.minHeight=this.getSquare().minh+"px";
			this.ele.style.maxHeight=this.getSquare().maxh+"px";
			this.ele.style.maxWidth=this.getSquare().maxw+"px";
			//this.ele.style.lineHeight="55px"//size letter
			if(textsource.length==1){
				this.getPos().y= conf.cvh-this.getSquare().minh-100;
			}
			//place of text when it has more than 3
			if(textsource.length>2){
				this.getPos().x = Math.floor(Math.random() * (conf.cvw - 100 + 1)) + 100;
				this.getPos().y = Math.floor(Math.random() * (conf.cvh - 100 + 1)) + 100;
			}
			this.ele.style.top=this.getPos().y+"px";
			this.ele.style.left=this.getPos().x+"px";
			this.root.appendChild(this.ele);
			this.ele.onblur = this.onfocusout;
			this.ele.onclick = this.onClick;
			this.root.addEventListener("mousemove", this.onMouseMove);
			this.ele.onmouseup = this.onMouseUp;
			this.root.onmousedown = this.onMouseDown;
//			this.root.onmousemove = this.onMouseDown;
			//this.ele.ondblclick = this.onMousedbClick;
			this.ele.onkeypress = this.onResize;
			this.ele.focus();
		},
		draw : function(id){
			var d = document.getElementById("middle");
			d.setAttribute("xmlns","http://www.w3.org/1999/xhtml");
			
			var img = new Image;
			var data = this.getHead(this.getPos().w,this.getPos().h);
			data +=this.getBody(this.getStyle());
			data += "<div xmlns='http://www.w3.org/2000/svg'>Hola menor</div>";
			data +=this.getFooter();
			var reader = new window.FileReader();
			var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
			//parse to sgv to base64 encode
			reader.readAsDataURL(svg); 
			reader.onloadend = function() {

			                var base64data = reader.result;  
			                console.log(reader.result);           
			                img.src = base64data;
			}
			var self = this;
			img.crossOrigin ="Anonymous";
			img.onload = function () {
				id++;
			 ctx.drawImage(img, self.getPos().x, self.getPos().y,self.ele.offsetWidth,self.ele.offsetHeight);
				 if(id < textsource.length){
				 	console.log(id);
				 	textsource[id].draw(id);
				 }else{

				 	//majo.observer.receiveNotify("createdMeme", canvas.toDataURL());
				 	window.open(canvas.toDataURL());
				 }

			 //window.open(canvas.toDataURL());
			 // self.root.removeChild(self.ele);
			}
		},
		setColor : function(color){
			this.getFont()['color'] = color;
			this.ele.style.color = colortext[color];
		},
		setSize : function(size){
			this.getFont()['size'] = parseInt(size);
			this.ele.style.fontSize = size +"px";
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
			"font:"+this.getFont().size+"px Impact, 'Arial Black';",
			"font-weight: bold;",
			"color:"+this.getFont().color+";",
			"-webkit-text-fill-color: white;",
			"-webkit-text-stroke-width: 2px;",
   			"-webkit-text-stroke-color: black;",
   			"text-stroke-width: 1px;",		
   			"text-stroke-color: black;",
   			//"width:"+this.ele.offsetWidth+"px",
   			//"height:"+this.ele.offsetHeight+"px"
			];
			return style;
		};

		Text.call(this, id);
	}

	TextMeme.prototype = Text.prototype;
	TextMeme.prototype.constructor = TextMeme;
	

	var TextStandard = function(id){

		
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
	var ImagenGround = function(){
		
		this.draw = function(){
			ctx.drawImage(this.getImage(),0,0,conf.cvw,conf.cvh);	
		}
		ImagenMeme.apply(this);
	}
	ImagenGround.prototype = Object.create(ImagenMeme.prototype);

//section for to enable or to disable text and image
	
	this.newText = function(type){

		if(type==1){//TYPE variable indicates if text is type general meme or normal 
			currenttext = new TextMeme(textsource.length);	
		}else{
			currenttext = new TextStandard(textsource.length);	
		}
		textsource.push(currenttext);
	};
	this.getImageLength = function(){
		return imagenSorce.length;
	};
	this.ableNew = function(){
		return (imagenSorce.length <= conf.maximg) ? true:false;
	};
	this.newImagenfactory = function(data){
		
		if(imagenSorce.length <= conf.maximg){
			//id = imagenSorce.length
			var img = new ImagenMeme(data.id)
			img.setSource(data.src);
			img.tempimage(data.tmpsrc);
			imagenSorce.push(img);
			selectGrid(imagenSorce.length)
			var minimg = [{
						id: data.id,
						src: data.src,
						tmpsrc: data.tmpsrc,
						alt: data.alt
					}];
					majo.observer.receiveNotify("newImagen", minimg);
			//this.setStyleGrid(imagenSorce.length);
			
			}
		else{
			majo.observer.receiveNotify("newImagen", {created: false,
													  execedImage: true
														});
		}
	};
	
	this.newImageBackGround = function(){
			var img = new ImagenMeme(data.id);
	};
	//depending of type image, url or file.
	this.newImagen = function(data){

		//if imagen quantity is less than the quantity there are into canvas
		
		

			var self = this;
        	
        	cr.width = conf.cvw;
        	cr.height = conf.cvh;
        	crx.imageSmoothingEnabled = true;
    		crx.mozImageSmoothingEnabled = true;
   			crx.webkitImageSmoothingEnabled = true;
    		crx.msImageSmoothingEnabled = true;

    		imgtemp.crossOrigin ="Anonymous";
			
    		imgtemp.onload = function(){
                crx.drawImage(imgtemp, 0, 0, conf.cvw, conf.cvh);
                var src = cr.toDataURL();
				var minimg = {
					id: data.id,
					src: src,
					tmpsrc: data.source,
					alt: data.alt
				};
				self.newImagenfactory(minimg)
            }
            imgtemp.src = data.src; 
		
	}

	this.create = function(){
		if(textsource.length == 0)
		{
			majo.observer.receiveNotify("createdMeme", canvas.toDataURL());
		}else{

			textsource[0].draw(0);	
		}
		
		/*var len = textsource.length;
		i=0;
		for (; i < len; i++) {
			textsource[0].draw();			
		}
		textsource.splice( 0, textsource.length);

		return canvas.toDataURL();*/
	}
	this.setStyleGrid = function(q,_q){
		var q = parseInt(q);
		if(q <=  imagenSorce.length){
			selectGrid (q,_q);
		}
	};

	//-----------------fin section
	function selectGrid (q,_q){
		currentImage=false;
		var _q = _q || 1;
		switch(q){
			case 1: 
				if(simpleSquare.hasOwnProperty("gs"+q+_q)){
						simpleSquare["gs"+q+_q]()
					}else{
						simpleSquare["gs11"]()
					}
				break;
			case 2: 
				if(doubleSquare.hasOwnProperty("gs"+q+_q)){
					doubleSquare["gs"+q+_q]()
				}else{
						doubleSquare["gs21"]()
				}
				//doubleSquare.oubleVsquare();
				break;
			case 3: 
				if(tripleSquare.hasOwnProperty("gs"+q+_q)){
						tripleSquare["gs"+q+_q]()
					}else{
						fiveSquare["gs31"]()
					}
				
				break;
			case 4:
				if(fourSquare.hasOwnProperty("gs"+q+_q)){
						fourSquare["gs"+q+_q]()
					}else{
						fourSquare["gs41"]()
					}
				
				break;
			case 5:
				if(fiveSquare.hasOwnProperty("gs"+q+_q)){
						fiveSquare["gs"+q+_q]()
					}else{
						fiveSquare["gs51"]()
					}
				
				break;
			case 6:
				if(sixSquare.hasOwnProperty("gs"+q+_q)){
						sixSquare["gs"+q+_q]()
					}else{
						sixSquare["gs61"]()
					}
				
				break;
			case 7:
				if(sevenSquare.hasOwnProperty("gs"+q+_q)){
						sevenSquare["gs"+q+_q]()
					}else{
						sevenSquare["gs71"]()
					}
				break;
			case 8:
				if(eightSquare.hasOwnProperty("gs"+q+_q)){
						eightSquare["gs"+q+_q]()
					}else{
						eightSquare["gs81"]()
					}
				break;
			case 9:
				if(nineSquare.hasOwnProperty("gs"+q+_q)){
						nineSquare["gs"+q+_q]()
				}else{
					nineSquare["gs91"]()
				}
				break;
		}
		render();
	}

	//action over Image
	this.deleteImage = function(id){
		i=0;
		var len = imagenSorce.length;
		for (; i < len; i++) {
			console.log(imagenSorce[i].getId(),id);
			if(imagenSorce[i].getId() == id){
				var id= i;
				imagenSorce.splice(i,1);
				selectGrid(imagenSorce.length);
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

	var simpleSquare = {
		//simple one 
		gs11: function(imgsource){
		//Ruler
			var dataimg = imgsource;
			imagenSorce[0].setUp(ruler(0, 0, conf.cvw, conf.cvh));
		},
		//simple one center
		gs12: function(){
			var simple = ruler(20,20,conf.height-20,conf.width-20);		
		}
	}
	
	var doubleSquare = {
		//doubleVsquare
	 gs21:function(){
		 	var simple = [];
		 	var middle = Number.parseInt(conf.cvw/2);
		 	simple.push(ruler(0,0,middle,conf.cvh));
		 	simple.push(ruler(middle,0,middle,conf.cvh));
			i=0
			for (;i < simple.length; i++) {
					imagenSorce[i].setUp(simple[i]);
			}
	 },
	 //doubleHsquare
	 gs22:function(){
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
		//tripleVsquare
		gs31:function(){
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
		//tripleonetwoVsquare
		gs32:function(){
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
		//tripletwooneVsquare
		gs33:function(){
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
		//tripleHSquare
		gs34:function(){
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
		//tripleonetwoHsquare
		gs35:function(){
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
		//tripletwooneHsquare
		gs36:function(){
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
		//fourHsquare
		gs41: function () {
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
		//fourVsquare
		gs42: function(){
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
		//four2x2square
		gs43: function(){
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
		//four1x3Hsquare
		gs44: function(){
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
		//four3x1Hsquare
		gs44: function(){
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
		//fiveHsquare
		gs51: function () {
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
		//fiveVsquare
		gs52: function(){
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
		//five2_3Hsquare
		gs53: function(){
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
		//five3_2Hquare
		gs54: function(){
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
		//five1_2_2Hsquare
		gs55: function(){
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
		//six2x3square
		gs61: function () {
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
		//six3x2square
		gs62: function(){
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
		//seven3_4Wsquare
		gs71: function () {
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
		//seven2_3_2Wsquare
		gs72: function(){
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
		//eight2x4square
		gs81: function () {
			var simple = [];
			var middleH = Number.parseInt(conf.cvh / 2);
			var fourW = Number.parseInt(conf.cvw / 4);
			//Ruler
			simple.push(ruler(0, 0, fourW, middleH));
			simple.push(ruler(fourW, 0, fourW, middleH));
			simple.push(ruler(fourW * 2, 0, fourW, middleH));
			simple.push(ruler(fourW * 3, 0, fourW, middleH));
			simple.push(ruler(0, middleH, fourW, middleH));
			simple.push(ruler(fourW, middleH, fourW, middleH));
			simple.push(ruler(fourW * 2, middleH, fourW, middleH));
			simple.push(ruler(fourW * 3, middleH, fourW, middleH));
			i = 0;
			for (; i < simple.length; i++) {
				imagenSorce[i].setUp(simple[i]);
			}
		},
		//eight4x2square
		gs82: function(){
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
		//nine3x3square
		gs91: function () {
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
		//nine4_5Wsquare
		gs92: function(){
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
	
	//Event for interact with user*/
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

	this.setColorText = function(color){
		if(currenttext){
			currenttext.setColor(color);
		}else{
			console.log("There isn't current Text");
		}
	};
	
	this.setSizeText = function(size){
		if(currenttext){
			currenttext.setSize(size);
		}else{
			console.log("There isn't current Text");
		}
	}
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
	  		evt.stopPropagation();
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
	  	// this event handles the drag and drop into canvas
	  	drop:function(evt){
	  		
			var files = evt.dataTransfer.files;
			var len = files.length;
			if( len > 0){
				var i=0;
				var fr = new FileReader();
				var name='';
				fr.onload = function(evt){
						var imgdata = {
								id: self.getImageLength(),
					        	src: evt.target.result,
					        	tmpsrc: evt.target.result,
					        	alt: "",
					        };
						self.newImagenfactory(imgdata)
						
						if(i<len){
							if(files[i].type.indexOf("image")>=0){
								name = files[i].name.split(".")[0];
								//when the user drops several images into canvas, it iterated the images for drawing
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


				/*evt.dataTransfer.items.forEach(function(ele,i){
					console.log(ele);
					console.log(i);
				});*/
				//ONLY WORK WITH CHROME
					if(evt.dataTransfer["items"]){
						var datas = evt.dataTransfer.items;
						for(var i=0; i< datas.length;i++){
							if(datas[i].type.match('^text/html')){
								datas[i].getAsString(function(e){
									var parser = new DOMParser();
									var doc = parser.parseFromString(e, "text/html");
									var img = doc.getElementsByTagName('img');
									if(img.length > 0){										
										 var imgdata = {
									 		id: self.getImageLength(),
								        	src: img[0].src,
								        	tmpsrc: img[0].src,
								        	alt: "",
								        };
										self.newImagen(imgdata)
									}
								});
							}
						}	
					}

				if(evt.dataTransfer.getData("text")){
					var strimage = evt.dataTransfer.getData("text");
					//veryfy if the source type if jgp or png
					if(strimage.match(/jpg|png/)){

						 var imgdata = {
						 		id: self.getImageLength(),
					        	src: evt.dataTransfer.getData("text"),
					        	tmpsrc: evt.dataTransfer.getData("text"),
					        	alt: "",
					        };
						self.newImagen(imgdata)
					}else{
						//show the msgbox for to indicate the error
						alert("Don't load this type, the image sorce is inadequate")
					}
				}
			}
			evt.target.style.cursor = 'auto'
			evt.target.className = ''
			evt.preventDefault();
	  		evt.stopPropagation();
	  	},
	  	dragover:function(evt){
	  		evt.target.className = 'copy'
	  		evt.preventDefault();
	  	},
	  	dragleave:function(evt){
	  		evt.target.style.cursor='not-allowed'
	  		evt.preventDefault();
	  	},
	  	paste:function(evt){
	  		var imgPreviewFragment = document.createDocumentFragment();//this part for loading imagen
	  		document.onmouseenter = function(evt){
	  			var clipboard = window.clipboardData;
	  			console.log(window.clipboardData.getData('Text'));
	  		};
	  		document.onblur = function(evt){
	  			console.log("focus");
	  		};
	  		
	  		var clipboard = evt.clipboardData || window.clipboardData || evt.originalEvent.clipboardData;
	  		 	var reader = new FileReader();
	  		clipboard.types.forEach(function(ele,i){
	  			if(clipboard.items[i].type.match(/image.*/)){
	  				reader.readAsDataURL(clipboard.items[i].getAsFile());
	  			}
	  		});

	  		reader.onload = function(evt){
	  			var imgdata = {
								id: self.getImageLength(),
					        	src: evt.target.result,
					        	tmpsrc: evt.target.result,
					        	alt: "",
					        };
						self.newImagenfactory(imgdata)
	  		}
	  		evt.preventDefault();
	  	},
	  	shareMeme:function(data){
	  		self.share();
	  	},
	  	send:function(){
	  		self.send();
	  	},
 	 }
}).apply(majo.creator);