import Back.settings
from rtl_ltr.tasks import *
import pytest
import sqlite3

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Back.settings")


# Create your tests here.

class DB:
    def __init__(self, dbname=Back.settings.DATABASES['default']['NAME']):
        try:
            self.connection = sqlite3.connect(dbname)
        except Exception as e:
            print(e)
        finally:
            pass

def hi(self):
    db = DB('test.db')
    cursor = db.connection.cursor()

db = DB('test.db')
h = Hello() # make our instance
h.hi() # use the method "hi" associated with the class (our function name within the class)