# -*- coding: utf-8 -*-
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
from odoo import models, fields, api

class congested_roads(models.Model):
    _name = 'smart_trafic.roads'

    name = fields.Char('Nombre', required=True)
    Lat = fields.Float(string="Latitude")
    Lng = fields.Float(string="Longitude")
    levelCongested = fields.Selection([(1,'Low'),(2,'Medium'),(3,'High')])
