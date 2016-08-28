'use strict'
/* Global application Majo*/
var majo = majo || {};

/* Module view */
(function () {
	var _self = this;

	// variable for the differents styles of the canvas 
	var OptionsGrid = [
		{id:1, name:"Single", backgroundimg:""},
		{id:2, name:"Sigle resplandor", backgroundimg:""},
		{id:3, name:"double vertical", backgroundimg:""},
		{id:4, name:"double horizontal", backgroundimg:""},
		{id:5, name:"tripe vertical ", backgroundimg:""},
		{id:6, name:"tripe Hirizontal", backgroundimg:""},
		{id:7, name:"four grid", backgroundimg:""},
		{id:8, name:"OtherOptions", backgroundimg:""}
		];


//Style Element for the imagen searched
var ImagenMeme = React.createClass({
	handleClick: function(evt){
		var imgdata = {
			id: evt.target.tabIndex,
        	src: evt.target.src,
        	alt: evt.target.alt,
        };

		majo.observer.notify("newImagen", imgdata);
		evt.stopPropagation();
	},
	render:function(){
		return <img src={this.props.data.source} tabIndex={this.props.data.id} title={this.props.data.alt} alt={this.props.data.alt} onClick={this.handleClick} />;
	}
});
//to create the imagen list that is using in the canvas
var Imagen = React.createClass({
	onMouseEnter :function(evt){

	},
	onMouseLeave:function(evt){

	},
	onClick:function(evt){
		majo.observer.notify("removeImagen", {id: parseInt(evt.target.id)});
		//when you clicked it, this is removed after of verify that the image exist in the canvas
		evt.preventDefault();
	},
	render:function(){
		var dt = this.props.data;
		return <figure className="removeImage" key={dt.length}  id={dt.id} onClick={this.onClick}><img src={dt.src} alt={dt.alt} title={dt.alt} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}  /></figure>;
	}
});
//Image container for the search
var ContentImage = React.createClass({
	onNewImagen:function(data){
		this.props.onImageNew(data);
	},
	render:function(){
		var dataimage = this.props.srcDataImage;
		var self=this;
		return (
			<div id="ImageSeacrhed">{dataimage.map(function(data){
				return <ImagenMeme  key={data.id} onkey={data.id} data={data} onNew={self.onNewImagen}/>
			})}</div>
		);
	}
});
//First div of the search bar ss
var SearchElement = React.createClass({
	getInitialState:function(){
		return ({inputDissable:false});
	},
  	onSubmit: function(event){
		var self = this;
		var valor = event.target[0].value;;
		if(valor.trim().length>0){
  			majo.observer.notify("Search", {strsearch : valor.trim()});
  		}
  		  event.preventDefault();
  	},
	render:function(){
		return (
			<div>
				<form  id="search" onSubmit={this.onSubmit}>
					<input type='text'
					 placeholder='Search image ..'
					 name='txtsearch'	 required/>
					 <input type='submit'
					  value ='Search'
					  name='btnsearch' enable="false"/>
				</form>
			</div>
		);
	}
});
//Bar searcher for to find the image
var Searcher = React.createClass({
	componentDidMount:function(){
		majo.observer.attach("Search", this.handleUserSearch);
	},
	getInitialState:function(){
		return ({sourceImage:[]})
	},
	handleUserSearch:function(data){
		this.setState({sourceImage : data})
	},
	onImageNew:function(data){
		this.props.addImageList(data);
	}, 
	searchBycategory:function(event){
		var self = this;
  		 	var valor =event.target.innerText;
  		 	if(valor.trim().length>0){
	  		 	majo.observer.notify("Search", {strsearch : valor.trim()});
	  		 }
  		  	event.preventDefault();
	},
	render: function(){
		return(
			<div id="search" className="create" >
				<SearchElement onHandleSearch={this.handleUserSearch}/>
				<div id='searchBycategory'><p>Click pra ver</p>
					<span onClick={this.searchBycategory}>Cat</span>
					<span onClick={this.searchBycategory}>Animales</span>
					<span onClick={this.searchBycategory}>Ranas</span>
					<span onClick={this.searchBycategory}>Cat</span>
					<span onClick={this.searchBycategory}>Cat</span>
					<span onClick={this.searchBycategory}>Cat</span>
					<span onClick={this.searchBycategory}>Cat</span>
					<span onClick={this.searchBycategory}>Cat</span>
					<span onClick={this.searchBycategory}>Cat</span>
					<span onClick={this.searchBycategory}>Cat</span>
				</div>
	 			<div>Recentes imagenes</div>
	 			<ContentImage srcDataImage={this.state.sourceImage}  onImageNew={this.onImageNew}/>
	 			<div id="ContentImage"></div>
			</div>
		);
	}
});
//options of the grid canvas
var StyleGrid = React.createClass({
	render:function(){

		return (
			<li>{this.props.gstyle.name}</li>
			);
	}
});
var current=null;
//Principal layout for to create the meme
var Creator =React.createClass({
	getInitialState:function(){
		return ({imglist:[]})
	},
	componentDidMount: function() {
		majo.observer.attach("editimage");
		majo.observer.attach("share", this.sharedSucces);
		majo.observer.attach("newText",this.limitedText);
		majo.observer.attach("createdMeme",this.createdsucces);
		majo.observer.attach("newImagen", this.addImage);
		majo.observer.attach("removeImagen", this.removeImagen);
    	//MajoCreator.initialize("canvas");
  	},  	
  	addImage:function(data){
  		var newdata = this.state.imglist.concat(data);
		this.setState({
			imglist: newdata
		});
  	},
  	removeImagen:function(id){
  			var newdata = this.state.imglist;
  			newdata.splice(id, 1);
  			this.setState({
				imglist: newdata
			});	
  	},
  	addNewTextMeme:function(evt){	
  		var d = majo.observer.notify("newText", 1);

  	},
  	addColorText:function(evt){
  		majo.creator.setColorText(evt.target.id);
  	},
  	addNewTextStandar:function(evt){
  		majo.observer.notify("newText", 2);
  	},
  	changeSize:function(evt){
  		majo.creator.setSizeText(evt.target.id.split('-')[1]);
  	},
  	limitedText: function(){

  	},
  	sharedSucces:function(data){

  	},
  	createdsucces:function(data){
  		majo.observer.notify("share", {nt:this.nt,data:data});
  	},
  	shareMeme:function(evt){
  		FB.ui(
		 {
		  method: 'share_open_graph',
		   action_type: 'og.likes',
		  href: 'http://localhost/majomegazine/'
		}, function(response){});
  		//majo.observer.notify("createdMeme", 1);
  		//this.nt = evt.target.id.split('-')[2]; //nt flag to know when the user select the social network to share
  		//majo.observer.notify("createdMeme");
  	},
  	editimage:function (argument) {
  		majo.observer.notify("editimage");
  	},
	render: function(){
		var gridstyle = this.props.gridstyle;
		var rowstyle = [];
		var data = this.state.imglist;
		var self = this;
		var clsname= 'coltex bt';
		return(
			<div>
			<div id='opacity'>
			</div>
			<div id="content">
				<div id="confirm">
					<img id="dataimage" />
					<div className='message' id="texto" contentEditable={true}></div>
					<span id='userdata'></span>
					<div className='buttons'>
						<div className='no simplemodal-close'>No</div><div className='yes'>Yes</div>
					</div>
				</div>
			<a id="op"></a>
			<div id="textsyle"><span>style text</span>
				<button onClick={this.addNewTextMeme} className="buttontext bt" id="memetext">A</button>
				<button onClick={this.addNewTextStandar} className="buttontext bt" id="standard">A</button>
				<span>Color text</span>
				<button onClick={this.addColorText} className="coltex bt" id="cl1">Black</button>
				<button onClick={this.addColorText} className="coltex bt" id="cl2">Blue</button>
				<button onClick={this.addColorText} className="coltex bt" id="cl3">Red</button>
				<button onClick={this.addColorText} className="coltex bt" id="cl4">yellow</button>
				<span>Letter Size</span>
				<button onClick={this.changeSize} className="sizetex bt" id="sz-60">G</button>
				<button onClick={this.changeSize} className="sizetex bt" id="sz-40">M</button>
				<button onClick={this.changeSize} className="sizetex bt" id="sz-20">P</button>
			</div>
			<div id="make" >
			<div id="imagelist">
				{data.map(function(result){
					return <Imagen key={result.id} data={result} />
				})}
			</div>			
				<div id="contenttext">
					<canvas id="canvas" >
					</canvas>
				</div>	
					<div id="layout">
						<ul>{gridstyle.map(function(style){
							return <StyleGrid key={style.id} gstyle={style} />
						})}
						</ul>
					</div>
					<div id="sc-nt-sh">
					<span id='stringshare'>compartilhar com</span>
						<button onClick={this.shareMeme} className="nt"  id='nt-tw-1'>twitter</button>
						<button onClick={this.shareMeme} className="nt"  id='nt-fc-2'>Facebook</button>
						<button onClick={this.shareMeme} className="nt"  id='nt-dw-3'>Download</button>
					</div>
			</div> 
			<Searcher addImageList={this.addImageList}/>
			</div>
			</div>
		);
	}
});

	this.view = {};
	this.view.show = function(data){
		ReactDOM.render(
			<Creator inData={data} gridstyle={OptionsGrid}/>,
   			document.getElementById("middle")
			);
	};
	this.view.showImage = function(data){
		ReactDOM.render(<ContentImage inData={data} />,document.getElementById("ContentImage"))
	}
}).apply(majo);