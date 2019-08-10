from odoo import models, fields, api

class Camera(models.Model):
    _name = 'camera'
    _description = 'Camera'

    ip = fields.Char('Ip', required=True)
    user = fields.Char('User')
    passw = fields.Char('Password')
    model = fields.Selection([('hikvision','Hikvision')])
    url = fields.Char(string="Url",compute="_getUrl")

    @api.one
    @api.depends('ip','user','passw','model')
    def _getUrl(self):
        if self.model == 'hikvision':
            self.url = 'rtsp://{user}:{passw}@{ip}/Streaming/channels/101/httpPreview'.format(user=self.user, passw=self.passw, ip=self.ip)
