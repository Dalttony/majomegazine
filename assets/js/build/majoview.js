'use strict';
/* Global application Majo*/

var majo = majo || {};

/* Module view */
(function () {
	var _self = this;

	// variable for the differents styles of the canvas
	var OptionsGrid = [{ id: "1-1", name: "Single", backgroundimg: "", cls: "on" }, { id: "1-2", name: "Sigle resplandor", backgroundimg: "", cls: "on" }, { id: "2-1", name: "double vertical", backgroundimg: "", cls: "tw" }, { id: "2-2", name: "double horizontal", backgroundimg: "", cls: "tw" }, { id: "3-1", name: "tripe vertical ", backgroundimg: "", cls: "tr" }, { id: "3-2", name: "tripe Hirizontal", backgroundimg: "", cls: "tr" }, { id: "4-1", name: "four grid", backgroundimg: "", cls: "fr" }, { id: "4-2", name: "four vertical", backgroundimg: "", cls: "fr" }, { id: "4-3", name: "four horizontal", backgroundimg: "", cls: "fr" }, { id: "5-1", name: "five grid", backgroundimg: "", cls: "fv" }, { id: "6-1", name: "six grid", backgroundimg: "", cls: "sx" }, { id: "7-1", name: "seven grid", backgroundimg: "", cls: "sv" }, { id: "8-1", name: "eight grid", backgroundimg: "", cls: "eig" }, { id: "9-1", name: "none grid", backgroundimg: "", cls: "no" }];

	var imgType = {};

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
	var ImagenList = React.createClass({
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
			return { sourceImage: [],
				se_by: "Recent created",
				tmp_sourceImage: [] };
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
				this.setState({ se_by: valor.trim() });
				majo.observer.notify("Search", { strsearch: valor.trim() });
			}
			event.preventDefault();
		},
		searchStaticFiles: function (evt) {
			this.setState({ se_by: evt.target.innerText });
			majo.observer.notify("Search", { staticfile: evt.target.id.split('-')[1], strsearch: evt.target.innerText });
		},
		render: function () {
			return React.createElement(
				"div",
				{ id: "search", className: "create" },
				React.createElement(SearchElement, { onHandleSearch: this.handleUserSearch }),
				React.createElement(
					"div",
					{ id: "din-mic", className: "srch" },
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
					{ id: "sta-ic", className: "srch" },
					React.createElement(
						"p",
						null,
						" Search "
					),
					React.createElement(
						"span",
						{ onClick: this.searchStaticFiles, id: "sta-1" },
						"Sticker"
					),
					React.createElement(
						"span",
						{ onClick: this.searchStaticFiles, id: "sta-2" },
						"Backgroud"
					)
				),
				React.createElement(
					"div",
					{ className: "srch" },
					React.createElement(
						"p",
						null,
						" Image of ",
						this.state.se_by
					)
				),
				React.createElement(ContentImage, { srcDataImage: this.state.sourceImage, onImageNew: this.onImageNew }),
				React.createElement("div", { id: "ContentImage" })
			);
		}
	});
	//options of the grid canvas
	var StyleGrid = React.createClass({
		changeStyleGrid: function (evt) {
			var q_q = evt.target.id.split('-');
			//set the style grid
			majo.creator.setStyleGrid(q_q[0], q_q[1]);
		},
		render: function () {
			return React.createElement(
				"li",
				{ onClick: this.changeStyleGrid, id: this.props.gstyle.id, className: this.props.gstyle.cls },
				this.props.gstyle.name
			);
		}
	});
	var current = null;
	//Principal layout for to create the meme
	var Creator = React.createClass({
		getInitialState: function () {
			return { imglist: [],
				gridstyle: []
			};
		},
		componentDidMount: function () {
			majo.observer.attach("editimage");
			majo.observer.attach("share", this.sharedSucces);
			majo.observer.attach("newText", this.limitedText);
			majo.observer.attach("createdMeme", this.createdsucces);
			majo.observer.attach("newImagen", this.addImage);
			majo.observer.attach("removeImagen", this.removeImagen);
			this.setState({
				gridstyle: this.props.gridstyle
			});
			//MajoCreator.initialize("canvas");
		},
		addImage: function (data) {
			if (data.length) {
				var newdata = this.state.imglist.concat(data);
				this.setState({
					imglist: newdata
				});
				this.onablestyle(newdata.length);
			} else {}
		},
		removeImagen: function (id) {
			var newdata = this.state.imglist;
			newdata.splice(id, 1);

			this.setState({
				imglist: newdata
			});
			this.onablestyle(newdata.length);
		},
		addNewTextMeme: function (evt) {
			var d = majo.observer.notify("newText", 1);
		},
		addColorText: function (evt) {
			majo.creator.setColorText(evt.target.id);
		},
		addNewTextStandar: function (evt) {
			majo.observer.notify("newText", 2);
		},
		changeSize: function (evt) {
			majo.creator.setSizeText(evt.target.id.split('-')[1]);
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
		onablestyle: function (cls) {
			if (cls != 0) {
				var newstyles = this.props.gridstyle.filter(function (obj) {
					var q = parseInt(obj.id.split('-')[0]);
					return q === cls;
				});
				this.setState({
					gridstyle: newstyles
				});
			} else {
				this.setState({
					gridstyle: this.props.gridstyle
				});
			}
		},
		editimage: function (argument) {
			majo.observer.notify("editimage");
		},
		render: function () {
			var gridstyle = this.state.gridstyle;
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
						),
						React.createElement(
							"span",
							null,
							"Letter Size"
						),
						React.createElement(
							"button",
							{ onClick: this.changeSize, className: "sizetex bt", id: "sz-60" },
							"G"
						),
						React.createElement(
							"button",
							{ onClick: this.changeSize, className: "sizetex bt", id: "sz-40" },
							"M"
						),
						React.createElement(
							"button",
							{ onClick: this.changeSize, className: "sizetex bt", id: "sz-20" },
							"P"
						)
					),
					React.createElement(
						"div",
						{ id: "make" },
						React.createElement(
							"div",
							{ id: "imagelist" },
							data.map(function (result) {
								return React.createElement(ImagenList, { key: result.id, data: result });
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
								"span",
								null,
								"Frames"
							),
							React.createElement(
								"ul",
								null,
								this.state.gridstyle.map(function (style) {
									return React.createElement(StyleGrid, { onable: self.onablestyle, key: style.id, gstyle: style });
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
