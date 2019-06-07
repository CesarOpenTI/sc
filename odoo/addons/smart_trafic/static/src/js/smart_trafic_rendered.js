odoo.define('Map.Renderer',function(require){
  'use strict';

  var AbstractRenderer = require('web.AbstractRenderer');
  var core = require('web.core');
  var qweb = core.qweb;


  var MapRenderer = AbstractRenderer.extend({
        events: _.extend({}, AbstractRenderer.prototype.events, {
            'click .o_primay_button': '_onClickButton',
        }),
        start: function(){
          return this._super.apply(this, arguments);

        },
        willStart: function(){
          // alert("willStartRendered");
          return this._super.apply(this, arguments);
        },
        /**
         * The graph view uses the Leaflet render the map. This lib requires
         * that the rendering is done directly into the DOM (so that it can correctly
         * compute positions). However, the views are always rendered in fragments,
         * and appended to the DOM once ready (to prevent them from flickering). We
         * here use the on_attach_callback hook, called when the widget is attached
         * to the DOM, to perform the rendering. This ensures that the rendering is
         * always done in the DOM.
         *
         * @override
         */
        on_attach_callback: function () {
            this._super.apply(this, arguments);
            this.isInDOM = true;
            this._render();
        },
        /**
         * @override
         */
        on_detach_callback: function () {
            this._super.apply(this, arguments);
            this.isInDOM = false;
        },
        _render: function () {
            var self = this;
            this.$el.empty();
            this.$el.append(qweb.render('ViewSmartTrafic', {
                'groups': this.state,
            }));
            
            if(this.isInDOM){
              this._renderMap();
            }

            return this._super.apply(this, arguments);
        },
        _onClickButton: function (ev) {
            ev.preventDefault();
            var target =  $(ev.currentTarget);
            var group_id = target.data('group');
            var children_ids = _.map(this.state[group_id].children, function (group_id) {
                return group_id.id;
            });
            this.trigger_up('btn_clicked', {
                'domain': [['id', 'in', children_ids]]
            });
        },
        _renderMap: function(){
          var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
          var map = L.map('mapId').setView([23.140445, -82.351644], 17).addLayer(osm);
        }
    });

    return MapRenderer;

});
