odoo.define('Map.Controller',function(require){
  'use strict';
  var AbstractController = require('web.AbstractController');
  var MapRenderer = require('Map.Renderer');
  var core = require('web.core');
  var qweb = core.qweb;

  var MapController = AbstractController.extend({
        /** //
         * @override
         * @param {Widget} parent
         * @param {GraphModel} model
         * @param {GraphRenderer} renderer
         * @param {Object} params
         * @param {string[]} params.measures
         */
        init: function (parent, model, renderer, params) {
          this._super.apply(this, arguments);
        },
        getContext: function () {
            var state = this.model.get();
            return {
                graph_mode: state.mode,
            };
        },
       renderButtons: function ($node) {
         self = this;
           if ($node) {
               self.$buttons = $(qweb.render('ViewSmartTrafic.buttons'));
               self.$buttons.on('click', 'button#add', self._onAddButtonClick.bind(self));
               self.$buttons.on('click', 'button.o_map_button', self._onMapClick.bind(self));
               self.$buttons.appendTo($node);
               self._updateButtons();
           }

       },
       _onAddButtonClick: function (ev) {
         var $target = $(event.target);
           this.do_action({
               type: 'ir.actions.act_window',
               name: this.title,
               res_model: this.modelName,
               views: [[false, 'form']],
               target: 'new'
           });

       },
       _onMapClick: function(event){
         self = this;
         var $target = $(event.target);
         if($target.hasClass('o_map_button')){
           self._setMode($target.data('mode'));
         }
       },
       _setMode: function(mode){
         this.update({mode: mode});
         self._updateButtons();
       },
       _updateButtons: function(){
         if (!this.$buttons) {
             return;
         }
         var state = this.model.get();
         this.$buttons.find('.o_map_button').removeClass('active');
         this.$buttons
            .find('.o_map_button[data-mode="' + state.mode + '"]')
            .addClass('active');
       },
  });
  return MapController;

});
