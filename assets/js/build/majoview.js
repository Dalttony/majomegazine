'use strict';
/* Global application Majo*/

var majo = majo || {};

/* Module view */
(function () {
	var _self = this;

	// variable for the differents styles of the canvas
	var OptionsGrid = [{ id: 1, name: "Single", backgroundimg: "" }, { id: 2, name: "Sigle resplandor", backgroundimg: "" }, { id: 3, name: "double vertical", backgroundimg: "" }, { id: 4, name: "double horizontal", backgroundimg: "" }, { id: 5, name: "tripe vertical ", backgroundimg: "" }, { id: 6, name: "tripe Hirizontal", backgroundimg: "" }, { id: 7, name: "four grid", backgroundimg: "" }, { id: 8, name: "OtherOptions", backgroundimg: "" }];

	//Style Element for the imagen searched
	var ImagenMeme = React.createClass({
		handleClick: function (evt) {
			var imgdata = {
				id: evt.target.tabIndex,
				src: evt.target.src,
				alt: evt.target.alt
			};

			majo.observer.notify("newImagen", imgdata);
			evt.stopPropagation();
		},
		render: function () {
			return React.createElement("img", { src: this.props.data.source, tabIndex: this.props.data.id, title: this.props.data.alt, alt: this.props.data.alt, onClick: this.handleClick });
		}
	});
	//to create the imagen list that is using in the canvas
	var Imagen = React.createClass({
		onMouseEnter: function (evt) {},
		onMouseLeave: function (evt) {},
		onClick: function (evt) {
			majo.observer.notify("removeImagen", { id: parseInt(evt.target.id) });
			//when you clicked it, this is removed after of verify that the image exist in the canvas
			evt.preventDefault();
		},
		render: function () {
			var dt = this.props.data;
			return React.createElement(
				"figure",
				{ className: "removeImage", key: dt.length, id: dt.id, onClick: this.onClick },
				React.createElement("img", { src: dt.src, alt: dt.alt, title: dt.alt, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave })
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
			var valor = event.target[0].value;;
			if (valor.trim().length > 0) {
				majo.observer.notify("Search", { strsearch: valor.trim() });
			}
			event.preventDefault();
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
		componentDidMount: function () {
			majo.observer.attach("Search", this.handleUserSearch);
		},
		getInitialState: function () {
			return { sourceImage: [] };
		},
		handleUserSearch: function (data) {
			this.setState({ sourceImage: data });
		},
		onImageNew: function (data) {
			this.props.addImageList(data);
		},
		searchBycategory: function (event) {
			var self = this;
			var valor = event.target.innerText;
			if (valor.trim().length > 0) {
				majo.observer.notify("Search", { strsearch: valor.trim() });
			}
			event.preventDefault();
		},
		render: function () {
			return React.createElement(
				"div",
				{ id: "search", className: "create" },
				React.createElement(SearchElement, { onHandleSearch: this.handleUserSearch }),
				React.createElement(
					"div",
					{ id: "searchBycategory" },
					React.createElement(
						"p",
						null,
						"Click pra ver"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Animales"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Ranas"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					),
					React.createElement(
						"span",
						{ onClick: this.searchBycategory },
						"Cat"
					)
				),
				React.createElement(
					"div",
					null,
					"Recentes imagenes"
				),
				React.createElement(ContentImage, { srcDataImage: this.state.sourceImage, onImageNew: this.onImageNew }),
				React.createElement("div", { id: "ContentImage" })
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
			majo.observer.attach("editimage");
			majo.observer.attach("share", this.sharedSucces);
			majo.observer.attach("newText", this.limitedText);
			majo.observer.attach("createdMeme", this.createdsucces);
			majo.observer.attach("newImagen", this.addImage);
			majo.observer.attach("removeImagen", this.removeImagen);
			//MajoCreator.initialize("canvas");
		},
		addImage: function (data) {
			var newdata = this.state.imglist.concat(data);
			this.setState({
				imglist: newdata
			});
		},
		removeImagen: function (id) {
			var newdata = this.state.imglist;
			newdata.splice(id, 1);
			this.setState({
				imglist: newdata
			});
		},
		addNewTextMeme: function (evt) {
			majo.observer.notify("newText", 1);
		},
		addColorText: function (evt) {
			majo.creator.setColorText(evt.target.id);
		},
		addNewTextStandar: function (evt) {
			majo.observer.notify("newText", 2);
		},
		limitedText: function () {},
		sharedSucces: function (data) {},
		createdsucces: function (data) {
			majo.observer.notify("share", { nt: this.nt, data: data });
		},
		shareMeme: function (evt) {
			FB.ui({
				method: 'share_open_graph',
				action_type: 'og.likes',
				href: 'http://localhost/majomegazine/'
			}, function (response) {});
			//majo.observer.notify("createdMeme", 1);
			//this.nt = evt.target.id.split('-')[2]; //nt flag to know when the user select the social network to share
			//majo.observer.notify("createdMeme");
		},
		editimage: function (argument) {
			majo.observer.notify("editimage");
		},
		render: function () {
			var gridstyle = this.props.gridstyle;
			var rowstyle = [];
			var data = this.state.imglist;
			var self = this;
			var clsname = 'coltex bt';
			return React.createElement(
				"div",
				null,
				React.createElement("div", { id: "opacity" }),
				React.createElement(
					"div",
					{ id: "content" },
					React.createElement(
						"div",
						{ id: "confirm" },
						React.createElement("img", { id: "dataimage" }),
						React.createElement("div", { className: "message", id: "texto", contentEditable: true }),
						React.createElement("span", { id: "userdata" }),
						React.createElement(
							"div",
							{ className: "buttons" },
							React.createElement(
								"div",
								{ className: "no simplemodal-close" },
								"No"
							),
							React.createElement(
								"div",
								{ className: "yes" },
								"Yes"
							)
						)
					),
					React.createElement("a", { id: "op" }),
					React.createElement(
						"div",
						{ id: "textsyle" },
						React.createElement(
							"span",
							null,
							"style text"
						),
						React.createElement(
							"button",
							{ onClick: this.addNewTextMeme, className: "buttontext bt", id: "memetext" },
							"A"
						),
						React.createElement(
							"button",
							{ onClick: this.addNewTextStandar, className: "buttontext bt", id: "standard" },
							"A"
						),
						React.createElement(
							"button",
							{ onClick: this.editimage, className: "buttontext bt", id: "share" },
							"E"
						),
						React.createElement(
							"span",
							null,
							"Color text"
						),
						React.createElement(
							"button",
							{ onClick: this.addColorText, className: "coltex bt", id: "cl1" },
							"Black"
						),
						React.createElement(
							"button",
							{ onClick: this.addColorText, className: "coltex bt", id: "cl2" },
							"Blue"
						),
						React.createElement(
							"button",
							{ onClick: this.addColorText, className: "coltex bt", id: "cl3" },
							"Red"
						),
						React.createElement(
							"button",
							{ onClick: this.addColorText, className: "coltex bt", id: "cl4" },
							"yellow"
						)
					),
					React.createElement(
						"div",
						{ id: "make" },
						React.createElement(
							"div",
							{ id: "imagelist" },
							data.map(function (result) {
								return React.createElement(Imagen, { key: result.id, data: result });
							})
						),
						React.createElement(
							"div",
							{ id: "contenttext" },
							React.createElement("canvas", { id: "canvas" })
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
						),
						React.createElement(
							"div",
							{ id: "sc-nt-sh" },
							React.createElement(
								"span",
								{ id: "stringshare" },
								"compartilhar com"
							),
							React.createElement(
								"button",
								{ onClick: this.shareMeme, className: "nt", id: "nt-tw-1" },
								"twitter"
							),
							React.createElement(
								"button",
								{ onClick: this.shareMeme, className: "nt", id: "nt-fc-2" },
								"Facebook"
							),
							React.createElement(
								"button",
								{ onClick: this.shareMeme, className: "nt", id: "nt-dw-3" },
								"Download"
							)
						)
					),
					React.createElement(Searcher, { addImageList: this.addImageList })
				)
			);
		}
	});

	this.view = {};
	this.view.show = function (data) {
		ReactDOM.render(React.createElement(Creator, { inData: data, gridstyle: OptionsGrid }), document.getElementById("middle"));
	};
	this.view.showImage = function (data) {
		ReactDOM.render(React.createElement(ContentImage, { inData: data }), document.getElementById("ContentImage"));
	};
}).apply(majo);
