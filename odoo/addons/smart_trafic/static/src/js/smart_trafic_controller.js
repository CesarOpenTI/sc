odoo.define('Map.Controller',function(require){
  'use strict';
  var AbstractController = require('web.AbstractController');
  var MapRenderer = require('Map.Renderer');
  var core = require('web.core');
  var qweb = core.qweb;

  var MapController = AbstractController.extend({
        /**
         * @override
         * @param {Widget} parent
         * @param {GraphModel} model
         * @param {GraphRenderer} renderer
         * @param {Object} params
         * @param {string[]} params.measures
         */
        init: function (parent, model, renderer, params) {
            this._super.apply(this, arguments);
            this.measures = params.measures;
        },
       renderButtons: function ($node) {
         // alert("renderButtonsController");
           if ($node) {
               this.$buttons = $(qweb.render('ViewSmartTrafic.buttons'));
               this.$buttons.appendTo($node);
               this.$buttons.on('click', 'button#add', this._onAddButtonClick.bind(this));
               this._updateButtons();
               // this.$buttons.on('click', 'button#map1', this._onMapButtonClick.bind(this));
               // this.$buttons.on('click', 'button#map2', this._onMapButtonClick.bind(this));
               // this.$buttons.on('click', 'button#map3', this._onMapButtonClick.bind(this));
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
         MapRenderer._render();
       },
       _updateButtons: function(){
         if (!this.$buttons) {
             return;
         }
         var state = this.model.get();
         this.$buttons.find('.o_map_button').addClass('active');

       }
  });

  return MapController;

});
