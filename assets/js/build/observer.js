'use strict'
var majo = majo || {};

(function(majo){
	this.observer = {};
	var self = this;
	var listeners = {};
	var subject = {}
	var i=0;
	//to aggregate new Image in canvas 
	subject.newImagen = function(data){
		var newdata = self.creator.newImagen(data);	
	};
	//to notify the function to run
	this.observer.notify = function(handler, data){
		if(listeners.hasOwnProperty(handler)){
			subject[handler](data);
		}else{
			throw(sender +"dosen't have notifier");
		}
	}
	//add object that need to be notified
	this.observer.attach = function(handler, callback){

		if (!listeners.hasOwnProperty(handler)){
			listeners[handler] = []
		}
		if(_.isFunction(callback)){
			listeners[handler].push(callback);
			}
		else
			listeners[handler].push(null);
	}
	subject.Search = function(data){
		//call to model 
		self.model.getDataImage(data.strsearch,"Search");
	};
	this.observer.reciveNotify= function(handler, data){
		if(listeners.hasOwnProperty(handler)){
			i=0;
			var len = listeners[handler].length
				for (; i < len; i++) {
					listeners[handler][i](data);
				};
		}else{
			throw(sender +"dosen't have notifier");
		}
	}
	subject.removeImagen = function(data){
		var remove = self.creator.deleteImage(data.id);
		(remove.state)&&self.observer.reciveNotify("removeImagen", remove.id);
	}

	subject.newText = function(data){
		var text = self.creator.newText(data);
		(!text.let)&&self.observer.reciveNotify("newText", text);
	};
	this.view.show();
	this.creator.initialize();
}).apply(majo);

