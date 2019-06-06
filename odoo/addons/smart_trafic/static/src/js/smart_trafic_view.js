odoo.define('Map.View',function(require){
  'use strict';

  var AbstractView = require('web.AbstractView');
  var view_registry = require('web.view_registry');
  var MapController = require('Map.Controller');
  var MapModel = require('Map.Model');
  var MapRenderer = require('Map.Renderer');

  var core = require('web.core');

  var MapView = AbstractView.extend({
    display_name: 'Maps',
    icon:'fa-map',
    cssLibs: [
        '/smart_trafic/static/libs/leaflet/leaflet.css'
    ],
    jsLibs: [
        '/smart_trafic/static/libs/leaflet/leaflet.js',
    ],
    config:{
      Model: MapModel,
      Controller: MapController,
      Renderer: MapRenderer,
    },
    view_type:'map',
    groupable:false,
    init: function(viewInfo,params){
      //alert("initView");
      this._super.apply(this,arguments);
      var attrs = viewInfo.arch.attrs;
      if (!attrs.Lat) {
          throw new Error('Map view has not defined "Lat" attribute.');
      }else if (!attrs.Lng) {
          throw new Error('Map view has not defined "Lng" attribute.');
      }
      // Model Parameters
      this.loadParams.LatLng = [attrs.Lat,attrs.Lng];
    },
  });

  view_registry.add('map', MapView);
  return MapView;

});
