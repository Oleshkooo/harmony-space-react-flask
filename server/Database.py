import sqlite3

class Database():
    def __init__(self):
        self.db = sqlite3.connect('db.db', check_same_thread=False)
        self.cur = self.db.cursor()
    
    # === === === === === === === === === ===
    
    def createTables(self):
        # users
        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            )
        ''')
        # articles
        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                content VARCHAR NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                authorID INTEGER NOT NULL,
                FOREIGN KEY (authorID) REFERENCES users(id)
            )
        ''')
        # meditations
        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS meditations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                content VARCHAR NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # trigger to delete all articles of user when user deleted
        self.cur.execute('''
            CREATE TRIGGER IF NOT EXISTS delete_user
            AFTER DELETE ON users
            FOR EACH ROW
            BEGIN
                DELETE FROM articles WHERE authorID = OLD.id;
            END
        ''')
        # trigger to abort insert if user not exists
        self.cur.execute('''
            CREATE TRIGGER IF NOT EXISTS insert_article
            BEFORE INSERT ON articles
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'There are no users with this id')
                WHERE (SELECT id FROM users WHERE id = NEW.authorID) IS NULL;
            END
        ''')
        self.db.commit()
    
    # === === === === === === === === === ===
    
    def getAllArticles(self):
        self.cur.execute('''
            SELECT articles.id, articles.title, articles.content, articles.date, users.username
            FROM articles
            INNER JOIN users ON articles.authorID = users.id
            ORDER BY articles.id DESC
        ''')
        data = self.cur.fetchall()
        articles = []
        for article in data:
            articles.append(self.makeArticleObject(article))
        return articles

    def getArticleById(self, id):
        self.cur.execute('''
            SELECT articles.id, articles.title, articles.content, articles.date, users.username
            FROM articles
            INNER JOIN users ON articles.authorID = users.id
            WHERE articles.id = ?
        ''', [id])
        data = self.cur.fetchone()
        return self.makeArticleObject(data)


    def getLatestArticle(self):
        self.cur.execute('''
            SELECT articles.id, articles.title, articles.content, articles.date, users.username
            FROM articles
            INNER JOIN users ON articles.authorID = users.id
            ORDER BY articles.id DESC
            LIMIT 1
        ''')
        data = self.cur.fetchone()
        return self.makeArticleObject(data)
    
    def checkArticlesAmount(self):
        self.cur.execute('SELECT COUNT(*) FROM articles')
        return self.cur.fetchone()[0]
        # data = self.cur.fetchone()[0]
        # return {
        #     'amount': data
        # }

    def makeArticleObject(self, data):
        return {
            'id': data[0],
            'title': data[1],
            'content': data[2],
            'date': data[3],
            'author': data[4]
        }
    
    # === === === === === === === === === ===

    def getAllMeditations(self):
        self.cur.execute('SELECT * FROM meditations ORDER BY id DESC')
        data = self.cur.fetchall()
        meditations = []
        for meditation in data:
            meditations.append(self.makeMeditationObject(meditation))
        return meditations

    def getMeditationById(self, id):
        self.cur.execute('SELECT * FROM meditations WHERE id = ?', [id])
        data = self.cur.fetchone()
        return self.makeMeditationObject(data)
    
    def checkMeditationsAmount(self):
        self.cur.execute('SELECT COUNT(*) FROM meditations')
        return self.cur.fetchone()[0]
        # data = self.cur.fetchone()[0]
        # return {
        #     'amount': data
        # }

    def makeMeditationObject(self, data):
        return {
            'id': data[0],
            'title': data[1],
            'content': data[2],
            'date': data[3]
        }

    # === === === === === === === === === ===

    def isUserExists(self, username):
        self.cur.execute('SELECT * FROM users WHERE username = ?', [username])
        data = self.cur.fetchone()
        return True if data else False
    
    def isEmailExists(self, email):
        self.cur.execute('SELECT * FROM users WHERE email = ?', [email])
        data = self.cur.fetchone()
        return True if data else False
    
    def checkPassword(self, username, password):
        self.cur.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password])
        data = self.cur.fetchone()
        return True if data else False
    
    def createUser(self, username, password, email):
        self.cur.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email])
        self.db.commit()
        return True

    # === === === === === === === === === ===

    def addArticle(self, title, content, author):
        self.cur.execute('INSERT INTO articles (title, content, authorID) VALUES (?, ?, ?)', [title, content, author])
        self.db.commit()
    
    def exec(self, query, params = []):
        self.cur.execute(query, params)
        self.db.commit()

if __name__ == '__main__':
    db = Database()
    db.createTables()



    pass