from collections import defaultdict
from datetime import datetime
from dateutil.relativedelta import relativedelta
from odoo import api, fields, models
import json

class Base(models.AbstractModel):
    _inherit = 'base'

    @api.model
    def get_map_group_data(self, domain, latLng):
        records = self.search(domain)
        roads = {}
        for record in records:
            roads = {
                'lat':record.lat,
                'lng':record.lng
            }
        return roads
