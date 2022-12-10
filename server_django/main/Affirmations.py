import time
import datetime
import requests
from googletrans import Translator


class Affirmations():
    def __init__(self):
        self.indexData = {
            'affirmation': None
        }
        self.fetchDay = None
        self.translator = Translator()

    def getData(self):
        return {
            'affirmation': self.getAffirmation()
        }

    def getAffirmation(self):
        currentDay = datetime.date.today().strftime("%d")

        if currentDay == self.fetchDay:
            return self.indexData['affirmation']

        res = requests.get('https://www.affirmations.dev')
        affirmationEng = res.json()['affirmation']
        self.indexData['affirmation'] = self.translate(affirmationEng, 'uk')
        self.fetchDay = currentDay
        return self.indexData['affirmation']

    def translate(self, text, lang):
        return self.translator.translate(text, dest=lang).text.replace('.', '. ')
