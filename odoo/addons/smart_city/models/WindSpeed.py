# -*- coding: utf-8 -*-
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
from odoo import models, fields, api

class WindSpeed(models.Model):
    _name = 'wind_speed'

    name = fields.Char('Nombre', required=True)
    speed = fields.Integer(string="Wind Speed (Km/h)")
    levelSpeed = fields.Selection([(1,'Low'),(2,'Medium'),(3,'High')],string="Level of Wind Speed",compute="_getWindSpeed")
    points = fields.Many2many('points',string='Set of Points')

    @api.one
    @api.depends('speed')
    def _getWindSpeed(self):
        if self.speed < 38:
            self.levelSpeed = 1
        elif self.speed > 39 and self.speed < 60:
            self.levelSpeed = 2
        else:
            self.levelSpeed = 3
