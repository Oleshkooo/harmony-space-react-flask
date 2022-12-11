import sqlite3


class Database():
    def __init__(self):
        self.db = sqlite3.connect('db.db', check_same_thread=False)
        self.cur = self.db.cursor()

    def create_tables(self):
        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                isAdmin INTEGER DEFAULT 0
            )
        ''')

        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                content VARCHAR NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                authorId INTEGER NOT NULL,
                FOREIGN KEY (authorId) REFERENCES users(id)
            )
        ''')

        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS meditations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                content VARCHAR NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                content VARCHAR NOT NULL,
                isFromUser INTEGER NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        ''')

        self.cur.execute('''
            CREATE TRIGGER IF NOT EXISTS delete_user
            AFTER DELETE ON users
            FOR EACH ROW
            BEGIN
                DELETE FROM articles WHERE authorId = OLD.id;
            END
        ''')

        self.cur.execute('''
            CREATE TRIGGER IF NOT EXISTS insert_article
            BEFORE INSERT ON articles
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'There are no users with this id')
                WHERE (SELECT id FROM users WHERE id = NEW.authorId) IS NULL;
            END
        ''')

        self.cur.execute('''
            CREATE TRIGGER IF NOT EXISTS delete_user
            AFTER DELETE ON users
            FOR EACH ROW
            BEGIN
                DELETE FROM chat WHERE userId = OLD.id;
            END
        ''')
        self.db.commit()

    def get_all_articles(self):
        self.cur.execute('''
            SELECT articles.id, articles.title, articles.content, articles.date, users.username
            FROM articles
            INNER JOIN users ON articles.authorId = users.id
            ORDER BY articles.id DESC
        ''')
        data = self.cur.fetchall()
        articles = []
        for article in data:
            articles.append(self.make_article_object(article))
        return articles

    def get_article_by_id(self, id):
        self.cur.execute('''
            SELECT articles.id, articles.title, articles.content, articles.date, users.username
            FROM articles
            INNER JOIN users ON articles.authorId = users.id
            WHERE articles.id = ?
        ''', [id])
        data = self.cur.fetchone()
        return self.make_article_object(data)

    def get_latest_article(self):
        self.cur.execute('''
            SELECT articles.id, articles.title, articles.content, articles.date, users.username
            FROM articles
            INNER JOIN users ON articles.authorId= users.id
            ORDER BY articles.id DESC
            LIMIT 1
        ''')
        data = self.cur.fetchone()
        return self.make_article_object(data)

    def check_articles_amount(self):
        self.cur.execute('SELECT COUNT(*) FROM articles')
        return self.cur.fetchone()[0]

    def make_article_object(self, data):
        return {
            'id': data[0],
            'title': data[1],
            'content': data[2],
            'date': data[3],
            'author': data[4]
        }

    def get_all_meditations(self):
        self.cur.execute('SELECT * FROM meditations ORDER BY id DESC')
        data = self.cur.fetchall()
        meditations = []
        for meditation in data:
            meditations.append(self.make_meditation_object(meditation))
        return meditations

    def get_meditation_by_id(self, id):
        self.cur.execute('SELECT * FROM meditations WHERE id = ?', [id])
        data = self.cur.fetchone()
        return self.make_meditation_object(data)

    def check_meditations_amount(self):
        self.cur.execute('SELECT COUNT(*) FROM meditations')
        return self.cur.fetchone()[0]

    def make_meditation_object(self, data):
        return {
            'id': data[0],
            'title': data[1],
            'content': data[2],
            'date': data[3]
        }

    def is_user_exists(self, username):
        self.cur.execute('SELECT * FROM users WHERE username = ?', [username])
        data = self.cur.fetchone()
        return True if data else False

    def is_email_exists(self, email):
        self.cur.execute('SELECT * FROM users WHERE email = ?', [email])
        data = self.cur.fetchone()
        return True if data else False

    def is_user_admin(self, username):
        self.cur.execute('SELECT * FROM users WHERE username = ? AND isAdmin = 1', [username])
        data = self.cur.fetchone()
        return True if data else False

    def check_password(self, username, password):
        self.cur.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password])
        data = self.cur.fetchone()
        return True if data else False

    def create_user(self, username, password, email):
        self.cur.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email])
        self.db.commit()
        return True

    def get_user_id(self, username):
        self.cur.execute('SELECT id FROM users WHERE username = ?', [username])
        return self.cur.fetchone()[0]

    def get_all_users(self):
        self.cur.execute('SELECT * FROM users')
        data = self.cur.fetchall()
        users = []
        for user in data:
            users.append(self.make_user_object(user))
        return users

    def get_user_by_id(self, id):
        self.cur.execute('SELECT * FROM users WHERE id = ?', [id])
        data = self.cur.fetchone()
        return self.make_user_object(data)

    def check_users_amount(self):
        self.cur.execute('SELECT COUNT(*) FROM users')
        return self.cur.fetchone()[0]

    def make_user_object(self, data):
        return {
            'id': data[0],
            'username': data[1],
            'password': data[2],
            'email': data[3],
            'isAdmin': data[4]
        }

    def get_all_messages(self, id):
        self.cur.execute('SELECT * FROM chat WHERE userId = ? ORDER BY id DESC', [id])
        data = self.cur.fetchall()
        messages = []
        for message in data:
            messages.append(self.make_message_object(message))
        return messages

    def create_message(self, user_id, content, is_from_user):
        self.cur.execute('INSERT INTO chat (userId, content, isFromUser) VALUES (?, ?, ?)', [user_id, content, int(is_from_user)])
        self.db.commit()
        return True

    def make_message_object(self, data):
        return {
            'id': data[0],
            'userId': data[1],
            'content': data[2],
            'isFromUser': data[3],
            'date': data[4]
        }

    def exec(self, query, params=[]):
        self.cur.execute(query, params)
        self.db.commit()
