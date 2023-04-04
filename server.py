#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler

class DefaultRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__=="__main__":
    HTTPServer(('', 8000), DefaultRequestHandler).serve_forever()
