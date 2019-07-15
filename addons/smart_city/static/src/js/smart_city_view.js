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
    config:{
      Model: MapModel,
      Controller: MapController,
      Renderer: MapRenderer,
    },
    view_type:'map',
    enableTimeRangeMenu: 'true',
    init: function(viewInfo,params){
      this._super.apply(this,arguments);
      var attrs = this.arch.attrs;
      if (!attrs.fieldLevel) {
          throw new Error('Map view has not defined "Field of level" attribute.');
      }
      console.log(attrs.fieldLevel+" "+this.arch.attrs.type);
      // Model Parameters
      this.loadParams.fieldLevel = attrs.fieldLevel;
      this.loadParams.mode = attrs.type || 'earth';
    },
  });

  view_registry.add('map', MapView);
  return MapView;

});