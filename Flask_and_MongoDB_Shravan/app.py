from flask import Flask,jsonify,json,render_template,request,redirect,url_for
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

URI=os.getenv('MONGO_URI')
client=MongoClient(URI)

db=client['flask_mongodb']
collection=db['users']

app=Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api')
def api():
    with open('data.json','r')as file:
        data=json.load(file)
    
    return jsonify(data)

@app.route('/submit',methods=['POST'])
def submit():
    try:
        if request.method=='POST':
            name=request.form.get('name')
            age=request.form.get('age')

            data={
                'name':name,
                'age':age
            }
            
            collection.insert_one(data)
        return redirect(url_for('success'))
    except Exception as e:
        return render_template('index.html',error=str(e))

@app.route('/success')
def success():
    return render_template('success.html')
if __name__=="__main__":
    app.run(debug=True)