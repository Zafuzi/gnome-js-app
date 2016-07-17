#!/usr/bin/gjs

const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Webkit = imports.gi.WebKit;

// We start out with 0 cookies
var cookies = 0;

const GettingTheSignal = new Lang.Class({
	Name: 'Getting the Signal',

	// Create the application itself
	_init: function() {
		this.application = new Gtk.Application();

		// Connect 'activate' and 'startup' signals to the callback functions
		this.application.connect('activate', Lang.bind(this, this._onActivate));
		this.application.connect('startup', Lang.bind(this, this._onStartup));
	},

	// Callback function for 'activate' signal presents window when active
	_onActivate: function() {
		this._window.present();
	},

	// Callback function for 'startup' signal builds the UI
	_onStartup: function() {
		this._buildUI();
	},
	// Build the application's UI
	_buildUI: function() {
		var self = this;
		// Create the application window
		self._window = new Gtk.ApplicationWindow({
			application: this.application,
			window_position: Gtk.WindowPosition.CENTER,
			default_height: 600,
			default_width: 800,
			border_width: 0,
			title: "Click the button to get a cookie!"
		});

		self._mainGrid = new Gtk.Grid({
			row_homogeneous: false,
			column_homogeneous: false
		});

		this._main = new Gtk.ScrolledWindow();
		this._main.set_border_width(0);
		// there is always the scrollbar (otherwise: AUTOMATIC - only if needed - or NEVER)
		this._main.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
		// Create a webview to show the web app

		this._webGrid = new Gtk.Grid({
			row_homogeneous: false,
			column_homogeneous: false
		});
		this._webView = new Webkit.WebView({
			"self-scrolling": true
		});
		this._webView.connect('viewport-attributes-changed', Lang.bind(this, this._getACookie));
		// Put the web app into the webview
		this._webView.load_uri(GLib.filename_to_uri(GLib.get_current_dir() +
			"/hellognome.html", null));

		// Menu Panel
		this._menuGrid = new Gtk.Grid({
			halign: Gtk.Align.CENTER,
			valign: Gtk.Align.CENTER
		});
		// For search bar items
		this._inputGrid = new Gtk.Grid({
			halign: Gtk.Align.START,
			valign: Gtk.Align.CENTER,
			row_spacing: 20,
			column_spacing: 20
		});
		// Create the text entry field
		this._searchBar = new Gtk.Entry({
			"max-width-chars": 64000
		});
		//this._searchBar.connect('key-press-event', Lang.bind(this, this._validateEmail));
		this._verificationLabel = new Gtk.Label({
			label: "" + this._webView.get_viewport_attributes().height
		});
		this._inputGrid.attach(this._searchBar, 0, 0, 10, 1);
		this._inputGrid.attach(this._verificationLabel, 11, 0, 1, 1);
		this._menuGrid.attach(this._inputGrid, 0, 0, 1, 1);

		this._webGrid.attach(this._webView, 0, 0, 1, 1);

		this._box = new Gtk.Box({
			spacing: 0,
			homogeneous: false
		});

		self._mainGrid.attach(this._menuGrid, 0, 0, 1, 1);
		self._mainGrid.attach(this._webGrid, 0, 1, 1, 1);

		this._box.pack_start(this._mainGrid, true, true, 0);
		self._window.add(this._box);
		self._window.show_all();
	},

	_getACookie: function() {
		this._verificationLabel.set_label("" + this._webView.get_viewport_attributes().height);
	}

});



// Run the application
let app = new GettingTheSignal();
app.application.run(ARGV);
