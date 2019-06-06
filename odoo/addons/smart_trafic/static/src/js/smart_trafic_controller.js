odoo.define('Map.Controller',function(require){
  'use strict';
  var AbstractController = require('web.AbstractController');
  var core = require('web.core');
  var qweb = core.qweb;

  var MapController = AbstractController.extend({
       renderButtons: function ($node) {
         // alert("renderButtonsController");
           if ($node) {
               this.$buttons = $(qweb.render('ViewSmartTrafic.buttons'));
               this.$buttons.appendTo($node);
               this.$buttons.on('click', 'button#add', this._onAddButtonClick.bind(this));
               this.$buttons.on('click', 'button#map1', this._onMapButtonClick.bind(this));
               this.$buttons.on('click', 'button#map2', this._onMapButtonClick.bind(this));
               this.$buttons.on('click', 'button#map3', this._onMapButtonClick.bind(this));
           }

       },
       _onAddButtonClick: function (ev) {
         // alert("_onAddButtonClickController");
           this.do_action({
               type: 'ir.actions.act_window',
               name: this.title,
               res_model: this.modelName,
               views: [[false, 'form']],
               target: 'new'
           });

       },
       _onMapButtonClick: function(ev){
        this.$el.find(".o_view_manager_content").empty();
        this.$el.find(".o_view_manager_content").html('<div><div><div class="row ml16 mr16"><div id="mapId" class="map map-home" style="margin:12px 0 12px 0;height:500px;"></div></div></div></div>');
        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
        var map = L.map('mapId').setView([23.140445, -82.351644], 17).addLayer(osm);
       }
  });

  return MapController;

});
