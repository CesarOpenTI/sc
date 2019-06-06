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
          // alert("startRendered");
          return this._super.apply(this, arguments);
        },
        willStart: function(){
          // alert("willStartRendered");
          return this._super.apply(this, arguments);
        },
        _render: function () {
          // alert("renderRendered");
            var self = this;
            this.$el.empty();
            this.$el.append(qweb.render('ViewSmartTrafic', {
                'groups': this.state,
            }));
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
        }
    });

    return MapRenderer;

});
