import os
from models import database, Member, Chat, Room
from flask import jsonify, Flask, request, session, url_for, redirect, render_template, flash, g
import json
import time
from datetime import datetime, timedelta
app = Flask(__name__)

app.config.update(dict(
	DEBUG=True,
	SECRET_KEY='secret key',
    SQLALCHEMY_TRACK_MODIFICATIONS = True,
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'chat.db'),
))
database.init_app(app)

@app.cli.command('initdb')
def initialize():
    database.drop_all()
    database.create_all()

@app.before_request
def preprocess():
    g.client = None
    if 'memberID' in session:
        g.client = Member.query.filter_by(memberID=session['memberID']).first()

@app.route('/main/<roomID>')
def main(roomID):
    currentRoom = Room.query.filter_by(roomID=roomID).first()
    if not currentRoom:
        flash("Chat Room deleted.")
        return redirect(url_for('profile'))

    messages = Chat.query.filter_by(chatTitle=currentRoom.roomTitle).all()

    if not g.client:
        return render_template('main.html', messageList = messages, room = currentRoom)
    else:
        clientToChange = Member.query.filter_by(memberID=g.client.memberID).first()
        clientToChange.room = roomID
        database.session.commit()
        g.client.room = roomID
        return render_template('main.html', messageList = messages, room = currentRoom)

@app.route('/')
@app.route('/profile')
def profile():
    roomList = Room.query.all()

    if g.client != None:
        currentMember = Member.query.filter_by(memberID=g.client.memberID).first()
        currentMember.room = 0
        database.session.commit()
        return render_template('profile.html', roomList=roomList)
    
    else:
        return render_template('profile.html', roomList=roomList)

@app.route('/enter', methods=['GET','POST'])
def enter():
    if request.method == 'POST':
        member = Member.query.filter_by(name=request.form['name']).first()

        if not member:
            flash("No Matching Username")
        elif member.password != request.form['password']:
            flash("Incorrent Password.")
        else:
            flash("Login Successful")
            session['memberID'] = member.memberID
            if member.room == 0:
                return redirect(url_for('profile'))
            
            else:
                return redirect(url_for('main', roomID = member.room))

        return render_template('enter.html')
    else:
        return render_template('enter.html')

@app.route('/exit')
def exit():
    session.pop('memberID', None)
    flash("Successfully logged out")
    return redirect(url_for('profile'))

@app.route('/addUser', methods=['GET','POST'])
def addUser():
    if request.method == 'POST':
        newName = request.form['name']
        newPass = request.form['password']

        if not newName:
            flash("No Username Entered")
        
        if not newPass:
            flash("No Password Entered")
        
        else:
            flash("Account Created")
            database.session.add(Member(name=newName, password=newPass))
            database.session.commit()
            return redirect(url_for('enter'))
        
        return render_template('addUser.html')

    else:
        return render_template('addUser.html')

@app.route('/addMsg', methods=['POST'])
def addMsg():
    currentTime = datetime.now()
    message = Chat(
        chatTitle = request.form['chatTitle'], 
        user = request.form['user'], 
        content = request.form['content'],
        displayTime = currentTime.strftime("%H:%M:%S"),
        intTime = currentTime.timestamp() * 1000
    )
    database.session.add(message)
    database.session.commit()
    return redirect(url_for('main', roomID = g.client.room))

@app.route('/getMsg', methods=['POST'])
def getMsg():
    if 'roomID' in session and not Room.query.filter_by(roomID=session['roomID']).first():
        flash("Chat Room deleted.")
        session.pop('roomID', None)
        return jsonify({})

    messageList = Chat.query.filter_by(chatTitle=request.form['chatTitle']).all()
    if not messageList:
        return jsonify({})
    
    currentTime = float(request.form['intTime'])
    for message in messageList:
        if message.intTime >= currentTime-1000:
            return jsonify({
                "chatTitle":message.chatTitle,
                "user":message.user,
                "content":message.content,
                "displayTime":message.displayTime,
                "intTime":message.intTime
            })
    return jsonify({})

@app.route('/newRoom', methods=['POST'])
def newRoom():
    roomToAdd = Room(roomTitle=request.form['roomTitle'], member = g.client.memberID)
    database.session.add(roomToAdd)
    database.session.commit()
    session['roomID'] = roomToAdd.roomID
    return redirect(url_for('profile'))

@app.route('/deleteRoom', methods=['POST'])
def deleteRoom():
    roomToDelete = Room.query.filter_by(roomID=request.form['roomID']).first()
    database.session.delete(roomToDelete)
    database.session.commit()
    session.pop('roomID', None)
    return redirect(url_for('profile'))

if __name__ == "__main__":
	app.run()
