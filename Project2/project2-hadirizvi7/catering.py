import os
from models import database, Client, Event
from flask import Flask, request, session, url_for, redirect, render_template, flash, g
app = Flask(__name__)

app.config.update(dict(
	DEBUG=True,
	SECRET_KEY='secret key',
    SQLALCHEMY_TRACK_MODIFICATIONS = True,
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'catering.db'),
))
database.init_app(app)

@app.cli.command('initdb')
def initialize():
    OWNER_NAME = "owner"
    OWNER_PASS = "pass"

    database.drop_all()
    database.create_all()
    database.session.add(Client(OWNER_NAME, OWNER_PASS, 'owner'))
    database.session.commit()

@app.before_request
def preprocess():
    g.client = None
    if 'clientID' in session:
        g.client = Client.query.filter_by(clientID = session['clientID']).first()

@app.route('/login', methods=['GET', 'POST'])
def login():
    if not g.client:
        if request.method == "POST":
            person = Client.query.filter_by(clientName=request.form['clientName']).first()
            if person and person.password == request.form['password']:
                session['clientID'] = person.clientID
                if person.view == "customer":
                    return redirect(url_for("customerProfile"))

                elif person.view == "staff":
                    return redirect(url_for("staffProfile"))
                
                elif person.view == "owner":
                    return redirect(url_for("ownerProfile"))
            
            elif not person:
                flash("Incorrect Username. Try again.")
                return render_template('login.html')
            
            else:
                flash("Incorrect Password. Try again.")
                return render_template('login.html')

        
        else:
            return render_template('login.html')
    
    if g.client.view == "customer":
        flash("Redirecting to your Profile")
        return redirect(url_for('customerProfile'))
    
    elif g.client.view == "staff":
        flash("Redirecting to your Profile")
        return redirect(url_for('staffProfile'))

    elif g.client.view == "owner":
        flash("Redirecting to your Profile")
        return redirect(url_for('ownerProfile'))

@app.route('/addUser', methods=['GET', 'POST'])
def addUser():
    if request.method == "POST":
        if not g.client:
            newName = request.form['clientName']
            newPassword = request.form['password']
            if newName and newPassword:
                flash("Account Created. Redirecting to Login Page.")
                database.session.add(Client(request.form['clientName'], request.form['password'], "customer"))
                database.session.commit()
                return redirect(url_for('login'))
            
            elif not newName:
                flash("Username not entered. Try again.")
                return render_template("addUser.html")
            
            elif not newPassword:
                flash("Password not entered. Try again.")
                return render_template("addUser.html")
            
        else:
            newName = request.form['clientName']
            newPassword = request.form['password']
            if newName and newPassword:
                flash("Account Created. Redirecting to Login Page.")
                database.session.add(Client(request.form['clientName'], request.form['password'], "staff"))
                database.session.commit()
                return redirect(url_for('login'))
            
            elif not newName:
                flash("Username not entered. Try again.")
                return render_template("addUser.html")

            elif not newPassword:
                flash("Password not entered. Try again.")
                return render_template("addUser.html")

    return render_template("addUser.html")

@app.route('/leave')
def leave():
    session.pop('clientID', None)
    return redirect(url_for('home'))

@app.route('/customerProfile', methods=['GET', 'POST'])
def customerProfile():
    #add order_by here?
    eventList = Event.query.filter_by(customer=g.client.clientID).all()
    print(eventList)
    return render_template("customerProfile.html", eventList=eventList)

@app.route('/staffProfile', methods=['GET', 'POST'])
def staffProfile():
    assignedEvents = []
    allEvents = Event.query.all()
    availableEvents = []
    '''
    if staff.staffID1 == "None" or staff.staffID1 == "None" or staff.staffID1 == "None":
    '''

    for event in allEvents:
        inEvent = event.staffID1 == g.client.clientID or event.staffID2 == g.client.clientID or event.staffID3 == g.client.clientID
        if inEvent:
            assignedEvents.append(event)
        
        elif event.staffID1 == -1 or event.staffID2 == -1 or event.staffID3 == -1:
            availableEvents.append(event)

    return render_template('staffProfile.html', allEvents=availableEvents, assignedEvents=assignedEvents)
    
@app.route('/ownerProfile', methods=['GET', 'POST'])
def ownerProfile():
    eventList = Event.query.order_by(Event.date).all()
    return render_template("ownerProfile.html", eventList = eventList)

@app.route('/addStaff', methods=['POST'])
def addStaff():
    event = Event.query.filter_by(eventID=request.form['eventID']).first()

    if event.staffID1 == -1:
        event.staffID1 = g.client.clientID
    
    elif event.staffID2 == -1:
        event.staffID2 = g.client.clientID
    
    elif event.staffID3 == -1:
        event.staffID3 = g.client.clientID
    
    database.session.commit()
    return redirect(url_for('staffProfile'))

@app.route('/addEvent', methods=['GET', 'POST'])
def addEvent():
    if Event.query.filter_by(date=request.form['date']).first():
        flash("Company is booked on this Date. Pick another Date")
        print("DATE RESERVED")
    else:
        flash("Successfully Created Event")
        newEvent = Event(eventName=request.form['eventName'], date=request.form['date'], customer=request.form['clientID'])
        database.session.add(newEvent)
        database.session.commit()

    return redirect(url_for('customerProfile'))

@app.route('/removeEvent', methods=['POST'])
def removeEvent():
    eventToRemove = Event.query.filter_by(eventID=request.form['eventID']).first()
    database.session.delete(eventToRemove)
    database.session.commit()
    flash("Successfuly Removed Event")
    return redirect(url_for('customerProfile'))

@app.route('/')
def home():
    return render_template('home.html')


if __name__ == "__main__":
	app.run()