from flask import Flask, render_template, jsonify, request
from flask_cors import CORS 
import random

app = Flask(__name__, template_folder="templates")
CORS(app)  # Enable CORS for your Flask app

def predict_traffic(date_time,model):
    print(date_time)
    print(model)
    return {
        'lane1' : random.randint(0, 160),
        'lane2' : random.randint(0, 160),
        'lane3' : random.randint(0, 160),
        'lane4' : random.randint(0, 160)
    }

@app.route("/update-predictions", methods=["GET"])
def update_predictions():
    # Get date_time and model from the query parameters
    date_time = request.args.get("date_time")
    model = request.args.get("model")

    # Check if date_time and model are provided, and if not, return an error response
    if date_time is None or model is None:
        error_message = "Both 'date_time' and 'model' must be provided in the query parameters."
        return jsonify({"error": error_message}), 400  # Return a 400 Bad Request status

    # Call your predict_traffic function with date_time and model
    updated_predictions = predict_traffic(date_time, model)

    return jsonify(updated_predictions)


# @app.route('/')
# def index():
#     predictions = {'lane1': 50, 'lane2': 60, 'lane3': 70, 'lane4': 80}
#     return render_template("index.html", predictions=predictions)


if __name__ == '__main__':
    app.run(debug=True)