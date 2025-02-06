import json
from http.server import BaseHTTPRequestHandler
import cgi

from helper import main


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            if self.path != "/upload":
                self._send_error(404, "404 Not Found")
                return

            content_type_header = self.headers.get("Content-Type", "")
            if not content_type_header.startswith("multipart/form-data"):
                self._send_error(400, "Bad Request: Use multipart/form-data")
                return

            form = cgi.FieldStorage(
                fp=self.rfile,  # type: ignore[arg-type]
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": content_type_header,
                },
            )

            files = {}
            body_data = {}

            file_field = next(
                (field for field in form.keys() if form[field].filename), None
            )
            if file_field:
                field = form[file_field]
                files = {
                    "filename": field.filename,
                    "content": field.file.read(),
                    "type": field.type,
                }

            for field_name in form:
                field = form[field_name]
                if not field.filename:
                    try:
                        parsed_value = json.loads(field.value) if field.value else {}
                        if isinstance(parsed_value, dict):
                            body_data.update(parsed_value)
                        else:
                            body_data[field_name] = field.value
                    except json.JSONDecodeError:
                        body_data[field_name] = field.value

            result = main(body_data, files)

            self._send_success(result)

        except Exception as e:
            self._send_error(500, f"Internal Server Error: {str(e)}")

    def _send_error(self, code, message):
        self.send_response(code)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(f"<html><body><h1>{message}</h1></body></html>".encode())

    def _send_success(self, result):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(result.encode("utf-8"))
