from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
database = SQLAlchemy()
stringSize = 64

class Client(database.Model):
    clientID = database.Column(database.Integer, primary_key=True)
    clientName = database.Column(database.String(stringSize), nullable=False)
    password = database.Column(database.String(stringSize), nullable=False)
    view = database.Column(database.String(stringSize), nullable=False)

    def __init__(self, clientName, password, view):
        self.clientName = clientName
        self.password = password
        self.view = view
    
class Event(database.Model):
    eventID = database.Column(database.Integer, primary_key=True)
    eventName = database.Column(database.String(stringSize), nullable=False)
    date = database.Column(database.String(stringSize), nullable=False)
    customer = database.Column(database.Integer, database.ForeignKey("client.clientID"), nullable=False)
    staffID1 = database.Column(database.Integer, database.ForeignKey("client.clientID"), nullable=False, default = -1)
    staffID2 = database.Column(database.Integer, database.ForeignKey("client.clientID"), nullable=False, default = -1)
    staffID3 = database.Column(database.Integer, database.ForeignKey("client.clientID"), nullable=False, default = -1)

    def __init__(self, eventName, date, customer):
        self.eventName = eventName
        self.date = date
        self.customer = customer