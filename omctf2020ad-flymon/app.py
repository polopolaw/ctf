#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, render_template_string
from flask_mysqldb import MySQL
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from functools import wraps
from flask import send_from_directory
import hashlib
import random
import os
import random
from random import randint
import sqlite3
from flask import g
from datetime import datetime

app = Flask(__name__, static_url_path='')
DATABASE = 'flymon.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
def logger(a,b,c,d,e):
    now = datetime.now()
    log = str(now)+a+b+c+d+e
    print(log)
    with open('/var/log/flymon.log', 'a') as file:
        file.write(log)
        file.write('\n')
################################################################################
#######################CONFIGURATION############################################
################################################################################
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'flymon'
app.config['MYSQL_PASSWORD'] = '4eda46f06c516f1cdbb9311ad561bb85'
app.config['MYSQL_DB'] = 'flymon'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)
@app.route('/templates/<path:path>')
def send_tmp(path):
    return send_from_directory('templates', path)
class RegisterForm(Form):
    username = StringField('Username', [validators.Length(min=1, max=40)])
    password = StringField('Password', [validators.Length(min=1, max=40)])
    description = StringField('description', [validators.Length(min=1, max=40)])
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'templates'),'favicon.ico', mimetype='image/vnd.microsoft.icon')
class MonitoringForm(Form):
    hostname = StringField('hostname', [validators.Length(min=1, max=200)])
    type = TextAreaField('type', [validators.Length(min=1)])
class ShellForm(Form):
    cmd = StringField('cmd', [validators.Length(min=1, max=2)])
################################################################################
##############################ROUTES############################################
################################################################################
def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('Unauthorized, Please login', 'danger')
            return redirect(url_for('login'))
    return wrap

@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    flash('You are now logged out', 'success')
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm(request.form)
    if request.method == 'POST' and form.validate():
        username = form.username.data
        password = form.password.data
        avatar = randint(1,8)
        description = form.description.data
        conn=sqlite3.connect(DATABASE)
        cur=conn.cursor()
        try:
            cur.execute("INSERT INTO users(username,password,avatar,description) VALUES(?,?,?,?)",(username,password,avatar,description))
            conn.commit()
            cur.close()
            logger(' Info', ' user ', username, ' registered', ' complete')
        except:
            logger(' WARN', ' user ', username, ' registered', ' invalid_credentials')
        flash('You are now registered and can log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/dashboard')
@is_logged_in
def dashboard():
    conn=sqlite3.connect(DATABASE)
    cur=conn.cursor()
    result = cur.execute("SELECT * FROM monitoring")
    monitoring = cur.fetchall()
    cur.close()
    return render_template('dashboard.html', monitoring=monitoring)

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password_candidate = request.form['password']
        conn=sqlite3.connect(DATABASE)
        cur=conn.cursor()
        sql = "SELECT * FROM users WHERE username = ?"
        result = cur.execute(sql, [(username)])
        data = cur.fetchone()
        if username == 'admin':
            return redirect(url_for('register'))
        try:
            password = data[1]
            if (password_candidate == password):
                data = cur.fetchone()
                session['logged_in'] = True
                session['username'] = username
                cur.close()
                logger(' Info', ' user ', username, ' logged-in', ' complete')
                return redirect(url_for('hello'))
        except:
            logger(' WARN', ' user ', username, ' logged-in', ' bad_credentials')
        cur.close()
    return render_template('login.html')

@app.route('/add_monitoring', methods=['GET', 'POST'])
@is_logged_in
def add_monitoring():
    form = MonitoringForm(request.form)
    if request.method == 'POST':
        code_list = ['200', '418', '502', '504', '404']
        code = random.choice(code_list)
        if code in '200':
            response = 'ok'
        else:
            response = 'notok'
        hostname = request.form['hostname']
        type = request.form['type']
        timeout = request.form['timeout']
        agent = request.form['agent']
        desc(agent)
        try:
            conn=sqlite3.connect(DATABASE)
            cur=conn.cursor()
            cur.execute("INSERT INTO monitoring(hostname, type, timeout, agent, creator,code,response) VALUES(?, ?, ?, ?, ?, ?, ?)",(hostname, type, timeout, agent, session['username'],code,response))
            conn.commit()
            cur.close()
            values= hostname+'_'+type+'_'+timeout+'_'+agent+'_'+session['username']
            logger(' Info', ' monitoring_value ', values, ' create_host', ' complete')
        except:
            logger(' WARN', ' monitoring_value ', values, ' create_host', ' invalid_value')
        try:
            logger(' Info', ' user ', agent, ' change_session', ' complete')
            session['logged_in'] = True
            session['username'] = agent
        except:
            pass
        flash('Created', 'success')
        return redirect(url_for('dashboard'))
    return render_template('addmon.html', form=form)

@app.route('/users')
@is_logged_in
def users():
    conn=sqlite3.connect(DATABASE)
    cur=conn.cursor()
    result = cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    cur.close()
    return render_template('users.html', users=users)

@app.route('/profile')
@is_logged_in
def profile():
    conn=sqlite3.connect(DATABASE)
    cur=conn.cursor()
    names = session['username']
    result = cur.execute("SELECT * FROM users WHERE username = ?", [names])
    users = cur.fetchall()
    cur.close()
    return render_template('profile.html', users=users)

@app.route('/tables')
@is_logged_in
def tables():
    conn=sqlite3.connect(DATABASE)
    cur=conn.cursor()
    names = session['username']
    cur.execute("SELECT * FROM monitoring WHERE creator = ?", [names])
    tables = cur.fetchall()
    return render_template('tables.html', tables=tables)
    cur.close()

@app.route('/shell', methods=['GET', 'POST'])
@is_logged_in
def shell():
    form = ShellForm(request.form)
    if request.method == 'POST':
        cmd = form.cmd.data
        if cmd in 'ls':
            if session['username'] == 'admin':
                logger(' Info', ' user ', session['username'], ' execute', cmd)
                exec = cmd+' '+'temp/'
            else:
                exec = cmd
                logger(' WARN', ' user ', session['username'], ' fail execute', cmd)
            com = os.popen(exec).read()
            print(com)
            return(str(com))
    return redirect(url_for('register'))

def desc(info):
    with open('temp/'+info, 'a') as file:
        file.write('\n')
        file.write('cookie')
        file.write('\n')

@app.route('/hello')
def hello():
    username = session['username']
    if request.args.get('name'):
        person = request.args.get('name')
        template = '''Hello %s''' % person
        logger(' Info', ' user ', session['username'], ' GET ', person)
        return render_template_string(template, person=person)
    person = '''Hello %s''' % username
    return render_template('hello.html', person=person)

def get_user_file(f_name):
	with open(f_name) as f:
		return f.readlines()

app.jinja_env.globals['get_user_file'] = get_user_file

if __name__ == '__main__':
    app.secret_key='secret123'
    app.debug = False
    app.run(port=10000,host='0.0.0.0')
