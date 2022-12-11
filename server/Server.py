import flask
import time
import datetime
import requests
from flask_cors import CORS
from googletrans import Translator

from Database import Database
from Socket import Socket


class Server():
    def __init__(self):
        self.app = flask.Flask(__name__)
        CORS(self.app)

        self.db = Database()
        self.db.create_tables()

        self.socket = Socket(self.app, self.db)

        self.affirmation = None
        self.fetch_day = None
        self.translator = Translator()

        self.app.add_url_rule('/', 'index', self.index_route, methods=['GET'])
        self.app.add_url_rule('/affirmation', 'affirmation', self.affirmation_route, methods=['GET'])

        self.app.add_url_rule('/articles', 'articles', self.articles_route, methods=['GET'])
        self.app.add_url_rule('/articles/<int:id>', 'articlesExact', self.articles_exact_route, methods=['GET'])
        self.app.add_url_rule('/articles/latest', 'articlesLatest', self.articles_latest_route, methods=['GET'])

        self.app.add_url_rule('/meditations', 'meditations', self.meditations_route, methods=['GET'])
        self.app.add_url_rule('/meditations/<int:id>', 'meditationsExact', self.meditations_exact_route, methods=['GET'])

        self.app.add_url_rule('/messages/<int:id>', 'messages', self.messages_exact_route, methods=['GET'])

        self.app.add_url_rule('/users/', 'users', self.users_route, methods=['GET'])
        self.app.add_url_rule('/users/<int:id>', 'usersExact', self.users_exact_route, methods=['GET'])

        self.app.add_url_rule('/login', 'login', self.login_route, methods=['POST'])
        self.app.add_url_rule('/register', 'register', self.register_route, methods=['POST'])

    def run(self):
        self.socket.run(self.app)
        self.app.run()

    def index_route(self):
        curDate = datetime.date.today().strftime("%B %d, %Y")
        curTime = time.strftime('%H:%M:%S', time.localtime())
        return f'{curDate}, {curTime} | Working'

    def affirmation_route(self):
        return {
            'affirmation': self.get_affirmation()
        }

    def articles_route(self):
        return self.db.get_all_articles()

    def articles_exact_route(self, id):
        error = {
            'error': 'Такої статті не існує'
        }
        if not isinstance(id, int):
            return error

        amount = self.db.check_articles_amount()
        if id > amount:
            return error

        return self.db.get_article_by_id(id)

    def articles_latest_route(self):
        return self.db.get_latest_article()

    def meditations_route(self):
        return self.db.get_all_meditations()

    def meditations_exact_route(self, id):
        error = {
            'error': 'Такої медитації не існує'
        }
        if not isinstance(id, int):
            return error

        amount = self.db.check_meditations_amount()
        if id > amount:
            return error

        return flask.send_file(f'./assets/meditations/{id}.mp3', mimetype='audio/mpeg')

    def messages_exact_route(self, id):
        error = {
            'error': 'Такої медитації не існує'
        }
        if not isinstance(id, int):
            return error

        amount = self.db.check_users_amount()
        if id > amount:
            return error

        return self.db.get_all_messages(id)

    def users_route(self):
        return self.db.get_all_users()

    def users_exact_route(self, id):
        error = {
            'error': 'Такого користувача не існує'
        }
        if not isinstance(id, int):
            return error

        amount = self.db.check_users_amount()
        if id > amount:
            return error

        return self.db.get_user_by_id(id)

    def login_route(self):
        req = flask.request.json
        username = req['username']
        password = req['password']
        is_user_exists = self.db.is_user_exists(username)

        if not is_user_exists:
            return {
                'error': 'Такого користувача не існує'
            }

        check_password = self.db.check_password(username, password)

        if not check_password:
            return {
                'error': 'Неправильний пароль'
            }

        return {
            'success': 'Вхід виконано успішно',
            'id': self.db.get_user_id(username),
            'username': username,
            'isAdmin': self.db.is_user_admin(username)
        }

    def register_route(self):
        req = flask.request.json
        username = req['username']
        password = req['password']
        email = req['email']

        is_user_exists = self.db.is_user_exists(username)
        if is_user_exists:
            return {
                'error': 'Користувач з таким іменем вже існує'
            }

        is_email_exists = self.db.is_email_exists(email)
        if is_email_exists:
            return {
                'error': 'Вказана пошта вже використовується'
            }

        if not self.db.create_user(username, password, email):
            return {
                'error': 'Виникла помилка при реєстрації'
            }

        return {
            'success': 'Реєстрація виконана успішно',
            'id': self.db.get_user_id(username),
            'username': username,
            'isAdmin': self.db.is_user_admin(username)
        }

    def get_affirmation(self):
        current_day = datetime.date.today().strftime("%d")

        if current_day == self.fetch_day:
            return self.affirmation

        res = requests.get('https://www.affirmations.dev')
        affirmation_eng = res.json()['affirmation']
        self.affirmation = self.translate(affirmation_eng, 'uk')
        self.fetch_day = current_day
        return self.affirmation

    def translate(self, text, lang):
        return self.translator.translate(text, dest=lang).text.replace('.', '. ').replace('-', '- ')
