from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
database = SQLAlchemy()
stringSize = 64

class Member(database.Model):
    memberID = database.Column(database.Integer, primary_key = True)
    name = database.Column(database.String(stringSize),  nullable = False)
    password = database.Column(database.String(stringSize), nullable = False)
    room = database.Column(database.Integer, database.ForeignKey("room.roomID"), nullable = False, default = 0)

    def __init__(self, name, password):
        self.name = name
        self.password = password
        self.room = 0
    
class Chat(database.Model):
    chatID = database.Column(database.Integer, primary_key = True)
    chatTitle = database.Column(database.String(stringSize), nullable = False)
    displayTime = database.Column(database.String(stringSize), nullable = False)
    intTime = database.Column(database.Integer, nullable=False)
    user = database.Column(database.String(stringSize), database.ForeignKey("member.name"), nullable = False)
    content = database.Column(database.String(stringSize), nullable = False)

    def __init__(self, chatTitle, user, content, displayTime, intTime):
        self.chatTitle = chatTitle
        self.user = user
        self.content = content
        self.displayTime = displayTime
        self.intTime = intTime
    
class Room(database.Model):
    roomID = database.Column(database.Integer, primary_key = True)
    roomTitle = database.Column(database.String(stringSize), nullable = False)
    member = database.Column(database.Integer, nullable = False)

    def __init__(self, roomTitle, member):
        self.roomTitle = roomTitle
        self.member = member
