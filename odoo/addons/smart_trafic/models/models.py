from collections import defaultdict
from datetime import datetime
from dateutil.relativedelta import relativedelta
from odoo import api, fields, models

class Base(models.AbstractModel):
    _inherit = 'base'

    @api.model
    def get_map_group_data(self, domain, LatLng):
        result_dict = 1
        return result_dict
