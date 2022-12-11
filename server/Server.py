import flask
from flask_cors import CORS
import time
import datetime
import requests
from googletrans import Translator

from Database import Database
from Socket import Socket


class Server():
    def __init__(self):
        # server
        self.app = flask.Flask(__name__)
        CORS(self.app)

        # database
        self.db = Database()
        self.db.createTables()

        # sockets
        self.socket = Socket(self.app, self.db)

        # data
        self.indexData = {
            'affirmation': None
        }
        self.fetchDay = None
        self.translator = Translator()

        # routes
        self.app.add_url_rule('/', 'index', self.indexRoute, methods=['GET'])
        self.app.add_url_rule('/affirmation', 'affirmation', self.affirmationRoute, methods=['GET'])

        self.app.add_url_rule('/articles', 'articles', self.articlesRoute, methods=['GET'])
        self.app.add_url_rule('/articles/<int:id>', 'articlesExact', self.articlesExactRoute, methods=['GET'])
        self.app.add_url_rule('/articles/latest', 'articlesLatest', self.articlesLatestRoute, methods=['GET'])

        self.app.add_url_rule('/meditations', 'meditations', self.meditationsRoute, methods=['GET'])
        self.app.add_url_rule('/meditations/<int:id>', 'meditationsExact', self.meditationsExactRoute, methods=['GET'])

        self.app.add_url_rule('/messagesExact/<int:id>', 'messages', self.messagesExactRoute, methods=['GET'])

        self.app.add_url_rule('/login', 'login', self.loginRoute, methods=['POST'])
        self.app.add_url_rule('/register', 'register', self.registerRoute, methods=['POST'])

    # === === === === === === === === === ===

    def run(self):
        self.socket.run(self.app)
        self.app.run()

    # === === === === === === === === === ===

    def indexRoute(self):
        curDate = datetime.date.today().strftime("%B %d, %Y")
        curTime = time.strftime('%H:%M:%S', time.localtime())
        return f'{curDate}, {curTime} | Working'

    def affirmationRoute(self):
        return {
            'affirmation': self.getAffirmation()
        }

    def articlesRoute(self):
        return self.db.getAllArticles()

    def articlesExactRoute(self, id):
        error = {
            'error': 'Такої статті не існує'
        }
        if not isinstance(id, int):
            return error

        amount = self.db.checkArticlesAmount()
        if id > amount:
            return error

        return self.db.getArticleById(id)

    def articlesLatestRoute(self):
        return self.db.getLatestArticle()
    
    def meditationsRoute(self):
        return self.db.getAllMeditations()

    def meditationsExactRoute(self, id):
        error = {
            'error': 'Такої медитації не існує'
        }
        if not isinstance(id, int):
            return error

        amount = self.db.checkMeditationsAmount()
        if id > amount:
            return error

        return flask.send_file(f'./assets/meditations/{id}.mp3', mimetype='audio/mpeg')

    def messagesExactRoute(self, id):
        error = {
            'error': 'Такої медитації не існує'
        }
        if not isinstance(id, int):
            return error

        amount = self.db.checkUsersAmount()
        if id > amount:
            return error
        
        return self.db.getAllMessages(id)

    def loginRoute(self):
        req = flask.request.json
        username = req['username']
        password = req['password']
        isUserExists = self.db.isUserExists(username)

        if not isUserExists:
            return {
                'error': 'Такого користувача не існує'
            }

        checkPassword = self.db.checkPassword(username, password)

        if not checkPassword:
            return {
                'error': 'Неправильний пароль'
            }

        return {
            'success': 'Вхід виконано успішно',
            'id': self.db.getUserId(username),
            'username': username
        }

    def registerRoute(self):
        req = flask.request.json
        username = req['username']
        password = req['password']
        email = req['email']

        isUserExists = self.db.isUserExists(username)
        if isUserExists:
            return {
                'error': 'Користувач з таким іменем вже існує'
            }
        
        isEmailExists = self.db.isEmailExists(email)
        if isEmailExists:
            return {
                'error': 'Вказана пошта вже використовується'
            }
         
        if not self.db.createUser(username, password, email):
            return {
                'error': 'Виникла помилка при реєстрації'
            }
        
        return {
            'success': 'Реєстрація виконана успішно',
            'id': self.db.getUserId(username),
            'username': username
        }

    # === === === === === === === === === ===

    def getAffirmation(self):
        currentDay = datetime.date.today().strftime("%d")

        if currentDay == self.fetchDay:
            return self.indexData['affirmation']

        res = requests.get('https://www.affirmations.dev')
        affirmationEng = res.json()['affirmation']
        self.indexData['affirmation'] = self.translate(affirmationEng, 'uk')
        self.fetchDay = currentDay
        return self.indexData['affirmation']

    # === === === === === === === === === ===

    def translate(self, text, lang):
        return self.translator.translate(text, dest=lang).text.replace('.', '. ').replace('-', '- ')
