odoo.define('Map.Model',function(require){
  'use strict';

  var AbstractModel = require('web.AbstractModel');
  var core = require('web.core');

  var MapModel = AbstractModel.extend({
    get: function(){
      // alert("getModel");
      return this.data;
    },
    load: function(params){
      // alert("loadModel");
      this.modelName = params.modelName;
      this.domain = params.domain;
      this.fieldLevel = params.fieldLevel;
      return this._fetchData();
    },
    reload: function (handle, params) {
      // alert("reloadModel");
        if ('domain' in params) {
            this.domain = params.domain;
        }
        return this._fetchData();
    },
    _fetchData: function () {
      // alert("_fetchDataModel");
        var self = this;
        var retorno = this._rpc({
            model: this.modelName,
            method: 'get_map_group_data',
            kwargs: {
                domain: this.domain,
                fieldLevel: this.fieldLevel
            }
        }).then(function (result) {
            self.data = [result,self.fieldLevel];
        });
        return retorno;
    },
  });

  return MapModel;

});
