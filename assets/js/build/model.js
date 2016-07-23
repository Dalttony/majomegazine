'use strict'
var majo = majo || {};

(function(){
	var images = Backbone.Model.extend({
		url: function(){
			return "index.php/majo/getImage/"+this.strseacrch;
		},
		defaults: {
			id: "",
			src: "",
			alt: ""
		}
	});

	var user = Backbone.Model.extend({
		url: "account/",
		defaults: {
			name: "", 
			image: "",
			session: ""
		},
	});

	var modelogeneral = Backbone.Model.extend({

		urlRoot: window.location.href+"index.php/majo/",

		defaults: {
			useractive: false,
			imagechaced: []
		},

		constructor:function(){
			this.dataImage = new images();
			this.user = new user();
			Backbone.Model.apply(this, arguments);
		},		

  		getDataImage:function (strsearch, notify){
  			this.dataImage.strseacrch = strsearch;
  			var self = this;
  			this.dataImage.fetch({
  				success:function(response,data){
  					self.notify(notify,data)
  				}
  			});
  		},

  		notify:function(notify,data){
  			majo.observer.receiveNotify(notify,data)
  		},
  		setUser: function(data){
  			console.log("Data");
  		},
  		cacheImage:function(data, notify){
  			if(this.get("imagechaced").push(data))
  				this.notify(notify, data)
  		},
  		share:function (data) {
  			console.log(data);
  			var img = data;
				$.post(window.location.href+"index.php/share", function(data){
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
				var share=true;

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
  		}
	});

	this.model = new modelogeneral();
}).apply(majo);


