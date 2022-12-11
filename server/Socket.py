from flask_socketio import SocketIO, emit, join_room


class Socket():
    def __init__(self, app, db):
        self.db = db
        self.socket = SocketIO(app, cors_allowed_origins='*')

        self.socket.on_event('join_room', self.join_room_by_id)
        self.socket.on_event('send_message', self.message)

    def join_room_by_id(self, room):
        join_room(int(room))

    def message(self, data):
        emit('recieve_message', data, broadcast=True)
        self.db.create_message(data['id'], data['content'], int(data['isFromUser']))

    def run(self, app):
        self.socket.run(app)
