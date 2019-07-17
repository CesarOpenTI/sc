# -*- coding: utf-8 -*-
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
from odoo import models, fields, api

class Points(models.Model):
    _name = 'points'
    _rec_name = 'lat'
    _description = 'Points'

    lng = fields.Char(string="Longitude")
    lat = fields.Char(string="Latitude")

    @api.multi
    def name_get(self):
        res = []
        for point in self:
            res.append((point.id, point.lng+'  x  '+point.lat))
        return res
