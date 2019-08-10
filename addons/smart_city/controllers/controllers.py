# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
# -*- coding: utf-8 -*-
from odoo import http
import cv2
import tensorflow as tf

class SmartTrafic(http.Controller):
    def gen(self):
        video = cv2.VideoCapture("rtsp://admin:hv729183@200.111.182.35/Streaming/channels/101/httpPreview")
        font = cv2.FONT_HERSHEY_SIMPLEX
        while True:
            rval, frame = video.read()
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            cv2.putText(frame,'-Vehicle Size/Type: ',(14, 332),font,0.4,(0xFF, 0xFF, 0xFF),1,cv2.FONT_HERSHEY_COMPLEX_SMALL,)
            cv2.imwrite('addons/smart_city/static/camera.jpg', gray)
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + open('addons/smart_city/static/camera.jpg', 'rb').read() + b'\r\n')

    @http.route('/smart_city', auth='public')
    def index(self, **kw):
        return http.Response(self.gen(),mimetype='multipart/x-mixed-replace; boundary=frame')

    @http.route('/videoo', auth='public')
    def videoo(self,**kw):
        return http.request.render('smart_city.hello')
