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
            self._renderExample();
          }
        },
        _renderExample: function(){
          var map = L.map('mapId');

        /* Basemap */
        var url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png';
        L.tileLayer(url, {
            attribution: 'OSM & Carto',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        /* Default vectorfield animation, from two ASCIIGrid files with u|v current velocity */
        d3.text('https://ihcantabria.github.io/Leaflet.CanvasLayer.Field/data/Bay_U.asc', function (u) {
            d3.text('https://ihcantabria.github.io/Leaflet.CanvasLayer.Field/data/Bay_V.asc', function (v) {
                var vf = L.VectorField.fromASCIIGrids(u, v);
                var layer = L.canvasLayer.vectorFieldAnim(vf).addTo(map);
                map.fitBounds(layer.getBounds());

                layer.on('click', function (e) {
                    if (e.value !== null) {
                        var vector = e.value;
                        var v = vector.magnitude().toFixed(2);
                        var d = vector.directionTo().toFixed(0);
                        var html = (`<span class="popupText">${v} m/s to ${d}&deg</span>`);
                        var popup = L.popup()
                            .setLatLng(e.latlng)
                            .setContent(html)
                            .openOn(map);
                    }
                }); // {onClick: callback} inside 'options' is also supported when using layer contructor
            });
        });
        },
        _renderLine: function(elements,tile_url){
          var map = new L.Map('mapId');

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
        },
        _renderRouting: function(){
          // var map = L.map('mapId');
          // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
            //     attribution: '© OpenStreetMap contributors'
            // }).addTo(map);
            //
            // L.Routing.control({
              //   waypoints: [
                //       L.latLng(-36.829351, -73.055239),
                //       L.latLng(-36.825347, -73.056914),
                //       L.latLng(-36.82790528395412, -73.05685043334961)
                //   ],
                //   routeWhileDragging: true
                // }).addTo(map);
        },
        _getLocation: function(points){
          var loadMap = function (id) {
          var map = L.map("mapId");
          var tile_url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
          var layer = L.tileLayer(tile_url, {
              attribution: 'OSM'
          });

          map.addLayer(layer);
          _.each(points,function(point,value,field){
            _.each(point['points'],function(key,value2,field2){
              L.marker([key.lat, key.lng])
              .addTo(map);
            });
            L.bindPopup(key["name"]);
          });

          map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
              .on('locationfound', function(e){
                  var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
                  var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
                      weight: 1,
                      color: 'red',
                      fillColor: '#cacaca',
                      fillOpacity: 0.2
                  });
              })
             .on('locationerror', function(e){
                  console.log(e);
                  alert("Location access denied.");
              });
          };


          loadMap('map');
        }
    });

    return MapRenderer;

});
