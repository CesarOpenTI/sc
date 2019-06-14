odoo.define('Map.Renderer',function(require){
  'use strict';

  var AbstractRenderer = require('web.AbstractRenderer');
  var core = require('web.core');
  var qweb = core.qweb;


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
          // alert("Renderer_render");
            var self = this;
            this.$el.empty();
            this.$el.append(qweb.render('ViewSmartTrafic', {
                'groups': this.state,
            }));

            if(this.isInDOM){
              self._renderLine(self.state[0],self.state[1]);
            }

            return this._super.apply(this, arguments);
        },
        _renderMap: function(points){
          // alert(JSON.stringify(points));

          var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
          var map = L.map('mapId').setView([-36.829351, -73.055239], 6).addLayer(osm);

          _.each(points,function(key,value,field){
            L.marker([key["points"][0].lat, key["points"][0].lng])
            .addTo(map)
            .bindPopup(key["name"])
            .openPopup();
          });

        },
        _renderLine: function(elements,fieldLevel){
          var map = new L.Map('mapId');
          var tile_url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
      	 L.tileLayer(tile_url, {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18,
            minZoom: 0
         }).addTo(map);
         map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
         var polylineOptions = {
           weight: 12,
           opacity: 1.9
         };

        _.each(elements,function(element,index,field){
          _.each(element,function(points,index2,field2){
            var polylinePoints = [];
            _.each(points,function(point,index3,field3){
              polylinePoints.push(new L.LatLng(point.lng, point.lat));
            });

            if(polylinePoints.length > 0){
              // alert(JSON.stringify(element[fieldLevel]));

              if(element[fieldLevel]==3){
                polylineOptions.color = '#ff3030';
              }else if(element[fieldLevel]==2){
                polylineOptions.color = '#ffa332';
              }else if(element[fieldLevel]==1){
                polylineOptions.color = '#3165ff';
              }
              var polyline = new L.Polyline(polylinePoints, polylineOptions);
              map.addLayer(polyline);
              // zoom the map to the polyline
              map.fitBounds(polyline.getBounds());
            }
          });
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
