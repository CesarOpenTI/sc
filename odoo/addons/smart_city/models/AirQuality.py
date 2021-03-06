# -*- coding: utf-8 -*-
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
from odoo import models, fields, api

class AirQuality(models.Model):
    _name = 'air_quality'

    name = fields.Char('Nombre', required=True)
    pM10 = fields.Integer(string="Particles Smaller Than 10 Micrometos")
    pM2_5 = fields.Integer(string="Particles Smaller Than 2.5 Micrometos")
    sO2 = fields.Integer(string="Sulfur Dioxide")
    cO = fields.Integer(string="Carbon Monoxide")
    nO2 = fields.Integer(string="Nitrogen Dioxide")
    o3 = fields.Integer(string="Ozone")
    points = fields.Many2many('points',string="Set of Points")
    levelQuality = fields.Selection([(1,'Low'),(2,'Medium'),(3,'High')],string="Level Quality",compute="_getLevelQuality")

    @api.one
    @api.depends('pM10','pM2_5','sO2','cO','nO2','o3')
    def _getLevelQuality(self):
        if self.pM10 < 3 and self.pM2_5 < 3 and self.sO2 < 3 and self.cO < 3 and self.nO2 < 3 and self.o3 < 3:
            self.levelQuality = 1
        elif self.pM10 > 3 and self.pM2_5 > 3 and self.sO2 > 3 and self.cO > 3 and self.nO2 > 3 and self.o3 > 3:
            self.levelQuality = 3
        else:
            self.levelQuality = 1
