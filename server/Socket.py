from flask_socketio import SocketIO, emit, send, join_room

class Socket():
    def __init__(self, app, db):
        self.db = db
        self.socket = SocketIO(app, cors_allowed_origins='*')

        self.socket.on_event('join_room', self.joinRoom)
        self.socket.on_event('send_message', self.message)

    def joinRoom(self, data):
        join_room(data)
        print('room', data)

    def message(self, data):
        emit('recieve_message', data['content'])
        print('recieve_message', data)



    def run(self, app):
        self.socket.run(app)