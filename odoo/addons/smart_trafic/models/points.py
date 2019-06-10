# -*- coding: utf-8 -*-
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
from odoo import models, fields, api

class congested_roads(models.Model):
    _name = 'smart_trafic.points'

    lat = fields.Float(string="Latitude")
    lng = fields.Float(string="Longitude")
