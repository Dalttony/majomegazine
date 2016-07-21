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
				source: evt.target.src,
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
			majo.observer.notify("removeImagen", { id: evt.target.id });
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
			majo.observer.attach("send");
			majo.observer.attach("newText", this.limitedText);
			majo.observer.attach("shareMeme");
			majo.observer.attach("shareMeme");
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
		addNewTextStandar: function (evt) {
			majo.observer.notify("newText", 1);
		},
		limitedText: function () {},
		shareMeme: function (evt) {
			MajoCreator.share();
		},
		send: function () {
			MajoCreator.send();
		},

		render: function () {
			var gridstyle = this.props.gridstyle;
			var rowstyle = [];
			var data = this.state.imglist;
			var self = this;
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
						),
						React.createElement(
							"button",
							{ onClick: this.shareMeme, className: "buttomtext", id: "share" },
							"S"
						),
						React.createElement(
							"button",
							{ onClick: this.send, className: "buttomtext", id: "share" },
							"T"
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
							React.createElement("canvas", { id: "canvas", onMouseUp: this.onMouseUp, onMouseMove: this.onMouseMove, onMouseDown: this.onMouseDown, onContextMenu: this.contextMenu, onDrop: this.ondrop, onDragOver: this.dragover, onDragLeave: this.dragleave })
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
