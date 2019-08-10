odoo.define('VideoSource',function(require){
  'use strict';

  var AbstractController = require('web.AbstractController');
  var AbstractModel = require('web.AbstractModel');
  var AbstractRenderer = require('web.AbstractRenderer');
  var AbstractView = require('web.AbstractView');
  var view_registry = require('web.view_registry');
  var core = require('web.core');
  var qweb = core.qweb;
  var _t = core._t;

  // var VideoSourceController = AbstractController.extend({});

  var VideoSourceRenderer = AbstractRenderer.extend({
    className:"o_vs_container",
    _render: function(){
        this.$el.append(
          qweb.render('ViewVideoSource')
        );
    }
  });

  // var VideoSourceModel = AbstractModel.extend({});

  var VideoSourceView = AbstractView.extend({
    display_name:'VideoSource',
    icon:'fa-map',
    config: {
      // Model: VideoSourceModel,
      // Controller: VideoSourceController,
      Renderer: VideoSourceRenderer,
    },
    viewType:'videoSource',
    enableTimeRangeMenu:'true',
    init: function(viewInfo,params){
      this._super.apply(this,arguments);
    },
  });

  view_registry.add('videoSource', VideoSourceView);
  return VideoSourceView;

});
