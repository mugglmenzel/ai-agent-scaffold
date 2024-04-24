import os
import logging

from flask import Flask, request, abort, redirect, jsonify, render_template
from lib.agent import ReActChatAgent

agent = ReActChatAgent('gemini-pro', 2048)
app = Flask(__name__)

@app.route('/', methods=['GET'])
def root_to_index():
    return redirect('/index')

@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    if not request.data:
        abort(400)
    else:
        content = request.json
        res_message = agent.invoke(content['message'], content['image'], content['history'])
        return jsonify({'message': res_message['output']})

if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
