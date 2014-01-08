// PowerDashboard depedencies
// var $ = require('../bower_components/jquery/jquery');
// var _ = require('../bower_components/underscore/underscore', {expose: 'underscore'});
// var Backbone = require('../bower_components/backbone/backbone');
// var TWEEN = require('../bower_components/tweenjs/src/tween')
// var Modernizr = require('../bower_components/modernizr/modernizr');
// var d3 = require('../bower_components/d3/d3');
// var Class = require('./graph_components/class');

var WheelGraphComposite = require('./graph_components/wheel_graph_composite');
var HistogramsComposite = require('./graph_components/histograms_composite');

var PowerDashboard = Class.extend({
	defaults: {
		wheelGraphEndpointAlias: '24-hours',
		wheelGraph: true,
		histograms: true,
		apiConfig: null,
		metrics: null
	},
	init: function(options) {
		var wheelGraph, histograms;

		this.config = _.extend({ }, this.defaults, options);

		if(!Modernizr.svg) {
			return false;
		}

		if(!this.config.apiConfig || !this.config.metrics || !this.config.metrics.length) {
			return false;
		}

		if(this.config.wheelGraph) {
			wheelGraph = new WheelGraphComposite({
				endpointAlias: this.config.wheelGraphEndpointAlias,
				metrics: this.config.metrics,
				apiConfig: this.config.apiConfig
			});
			window.wheelGraph = wheelGraph;
		}

		if(this.config.histograms) {
			histograms = new HistogramsComposite({
				metrics: this.config.metrics,
				apiConfig: this.config.apiConfig
			});
			window.histograms = histograms;
		}

		// Handle all graph animations (minimise animation requests)
		window.requestAnimationFrame(function doRedraw() {
			window.requestAnimationFrame(doRedraw);
			if(wheelGraph.eventCloak.isMouseOver) wheelGraph.eventCloak.trackMovement.call(wheelGraph.eventCloak);
			if(histograms.eventCloak.isMouseOver) histograms.eventCloak.trackMovement.call(histograms.eventCloak);
			TWEEN.update();
		});
	}
});

window.PowerDashboard = PowerDashboard;

exports = PowerDashboard;