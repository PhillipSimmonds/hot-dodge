from flask import Flask, render_template, request, jsonify
from azure.cosmosdb.table.tableservice import TableService
import os

app = Flask(__name__)

# Step 5: Load Azure Storage key from environment variable
#AZURE_STORAGE_KEY = os.environ.get("AZURE_STORAGE_KEY")

# Step 4: Connect to Azure Table Storage
#table_service = TableService(account_name='your_account_name', account_key=AZURE_STORAGE_KEY)

# Step 3: Set up Flask routes
@app.route('/game')
def game():
    # Add your game logic here
    return render_template('game.html')


@app.route('/scoreboard')
def leaderboard():
    # Add your game logic here
    return render_template('scoreboard.html')


@app.route('/')
def menu():
    # Add your menu logic here
    return render_template('index.html')


@app.route('/send-score', methods=['POST'])
def send_score():
    data = request.get_json()
    score = data.get('score')
    name = data.get('name')
    print(f"Name: {name}, Score: {score}")
    return jsonify({"message": "Score received successfully"})


if __name__ == '__main__':
    app.run(debug=True, port = 8080)
