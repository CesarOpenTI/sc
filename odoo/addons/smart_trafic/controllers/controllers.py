# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
# -*- coding: utf-8 -*-
from odoo import http

# class SmartTrafic(http.Controller):
#     @http.route('/smart_trafic/smart_trafic/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/smart_trafic/smart_trafic/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('smart_trafic.listing', {
#             'root': '/smart_trafic/smart_trafic',
#             'objects': http.request.env['smart_trafic.smart_trafic'].search([]),
#         })

#     @http.route('/smart_trafic/smart_trafic/objects/<model("smart_trafic.smart_trafic"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('smart_trafic.object', {
#             'object': obj
#         })