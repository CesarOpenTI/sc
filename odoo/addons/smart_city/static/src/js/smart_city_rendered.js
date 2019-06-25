odoo.define('Map.Renderer',function(require){
  'use strict';

  var AbstractRenderer = require('web.AbstractRenderer');
  var core = require('web.core');
  var qweb = core.qweb;
  var _t = core._t;

  var MapRenderer = AbstractRenderer.extend({

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
            self.$el.empty();
            self.$el.append(qweb.render('ViewSmartTrafic', {
                'groups': self.state,
            }));

            if(this.isInDOM){
              if(Object.keys(self.state).length > 2){
                self._renderMap(self.state);
              }else{
                self.$el.empty();
                self.$el.append(qweb.render('MapView.error', {
                    title: _t("No data to display"),
                    description: _t("No data available for this Map. " +
                        "Try to add some records, or make sure that " +
                        "there is no active filter in the search bar."),
                }));
              }
            }
            return this._super.apply(this, arguments);
        },
        _renderMap: function(state){
          self = this;
          if(state.mode=='default'){
            var tile_url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
            self._renderLine(state,tile_url);
          }else if (state.mode=='hum') {
            var tile_url = 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png';
            self._renderLine(state,tile_url);
          }else if (state.mode=='earth') {
            var tile_url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg"
            self._renderLine(state,tile_url);
          }else if(state.mode=='dark'){
            // var tile_url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png';
            // self._renderLine(state,tile_url);
            // self._renderExample();
            self._renderWindy();
          }
        },
        _renderWindy: function(){
          var options = {
            // Required: API key
            key: 'wYnQSnk1J6AXvU3HVdzdyeWbptgc33f5',
            lat: -36.78124222006407,
            lon: -73.07624816894531,
            zoom: 10,
          }
          windyInit( options, windyAPI => {
              const { picker, utils, broadcast } = windyAPI
              picker.on('pickerOpened', latLon => {
                  // picker has been opened at latLon coords
                  let { lat, lon, values, overlay } = picker.getParams()
                  // -> 50.4, 14.3, 'wind', [ U,V, ]
                  let windObject = utils.wind2obj( values )
                  console.log( windObject )
              })
              picker.on('pickerMoved', latLon => {
                  // picker was dragged by user to latLon coords
              })
              picker.on('pickerClosed', () => {
                  // picker was closed
              })
              // Wait since wather is rendered
              broadcast.once('redrawFinished', () => {
                  picker.open({ lat: -36.78124222006407, lon: -73.07624816894531 })
                  // Opening of a picker (async)
              })
          })
        },
        _renderLine: function(elements,tile_url){
          var map = new L.Map('windy');

      	 L.tileLayer(tile_url, {
            maxZoom: 18,
            minZoom: 0
         }).addTo(map);
         map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
         var polylineOptions = {
           weight: 12,
           opacity: 1.9
         };
          _.each(elements,function(element,index,field){
            if(typeof element.points != "undefined"){
              var polylinePoints = [];
              _.each(element.points,function(point,index2,field2){
                  polylinePoints.push(new L.LatLng(point.lng, point.lat));
                });
                if(polylinePoints.length > 0){
                    if(element[elements.fieldLevel]==3){
                      polylineOptions.color = '#ff3030';
                    }else if(element[elements.fieldLevel]==2){
                      polylineOptions.color = '#ffa332';
                    }else if(element[elements.fieldLevel]==1){
                      polylineOptions.color = '#3165ff';
                    }
                      var polyline = new L.Polyline(polylinePoints, polylineOptions);
                      map.addLayer(polyline);
                      // zoom the map to the polyline
                      map.fitBounds(polyline.getBounds());
                    }
                }
          });
          map.locate({setView: true, maxZoom: 16}).on('locationerror', function(e){
              map.setView([-36.78124222006407,-73.07624816894531],10);
          });
        },
    });

    return MapRenderer;

});
