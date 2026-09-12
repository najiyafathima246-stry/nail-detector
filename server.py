import http.server
import socketserver
import os
import sys

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable caching for rapid development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def find_available_server(ports=(8080, 8000, 8088, 5000)):
    for port in ports:
        try:
            server = ThreadedTCPServer(("0.0.0.0", port), Handler)
            return server, port
        except Exception:
            continue
    raise RuntimeError("No available ports found")

if __name__ == "__main__":
    server, port = find_available_server()
    print(f"Server started at http://localhost:{port}")
    print(f"Serving files from: {DIRECTORY}")
    sys.stdout.flush()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
