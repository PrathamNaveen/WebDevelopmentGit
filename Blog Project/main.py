# Program To Implement the Blog Post Project but this time using BootStrap and Flask

from flask import Flask, render_template
import requests

URL = "https://api.npoint.io/e8a327984c791831d9fe"

response = requests.get(URL)
posts = response.json()
app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('index.html', all_posts=posts)

@app.route('/about')
def about_page():
    return render_template('about.html')

@app.route('/contact')
def contact_page():
    return render_template('contact.html')

@app.route('/post/<int:id>')
def show_post(id):
    requested_post = None
    for post in posts:
        if post["id"] == id:
            requested_post = post
    return render_template("post.html", post=requested_post)

if __name__ == "__main__":
    app.run(debug=True)