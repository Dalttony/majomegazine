/**
 * Javascript read plugind
 * This library allows to read document with csv, txt, excel, and convert in table document element
 * Autor: Evinton Antonio Cordoba Mosquera
 * Date: 30/03/2016
 * version: 0.0.1
 * @return {[data]} [description]
 */
(function(){
	'use strict'
	/**
	 * Configuration Type ruler  IETF RFC 4180
	 * Separator [sep default ',']: separator of the document file
	 * Header [TRUE OR FALSE]: if the file has header
	 * Type column[String, Number, Factor, Date][TRUE OR FALSE]: Identify the  column type, that to allows to do mathematical operation
	 * 	 	 * @type {Object}
	 */
	var conf = {
		sep: ',',
		header: false,
		headerType: { has: false, tye: ['Number', 'String','Factor','Date']},
		colName:[],
		file:''
	}
	
	/**
	 * Represent the type of column Number, 
	 */
	function HNumber (decimal){

	}
	/**
	 * Represent the type of column String, 
	 */
	function HString (){

	}
	/**
	 * Represent the type of column Factor, 
	 */
	function HFactor (){

	}
	/**
	 * Represent the type of column Factor, 
	 */
	function HDate (format){

	}

	/**
	 * Reader the file
	 * @return {Object} this can return object type json, array
	 */
	var reader ={
		on:function(){
			var fr;
			if(window.FileReader){
				fr = new FileReader()
				if(conf.file instanceof File){
					file.onload = this.onload;
					file.onprogress = this.onprogress;
					file.onloadend = this.onloadend;
					file.onerror = this.onerror;
				}
				else{
					if(typeof conf.file == 'string'){
						this.onreadhttp()
					}else{
						console.error("Incorrect file type!")
					}
				}
				
			}else{
				console.error("window doesn't support to read file")	
			}
		},

		onload:function(){},
		onprogress:function(){},
		onloadend:function(){},
		error:function(){},
		onreadhttp:function(){
			var xmlhttp;
			if (window.XMLHttpRequest)
			{
				// code for IE7+, Firefox, Chrome, Opera, Safari
				 xmlhttp = new XMLHttpRequest();
			}
			else
			{
				// code for IE6, IE5
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			if(xmlhttp != null){
				xmlhttp.open('GET',window.location.href+conf.file,true);
				xmlhttp.send();
			}

			xmlhttp.onreadystatechange = function() {
			 if (xhttp.readyState == 4 && xhttp.status == 200) {
			   
			  }
			};
		}
	}
});