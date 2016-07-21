'use strict'
var majo = majo || {};

(function(){
	var images = Backbone.Model.extend({
		url: function(){
			return "index.php/majo/getImage/"+this.strseacrch;
		},
		defaults: {
			id: "",
			source: "",
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
  			majo.observer.reciveNotify(notify,data)
  		},
  		setUser: function(){
  			console.log("Data");
  		},
  		cacheImage:function(data, notify){
  			console.log(data);
  			if(this.get("imagechaced").push(data))
  				this.notify(notify, data)
  		}
	});

	this.model = new modelogeneral();
}).apply(majo);


