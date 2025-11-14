from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained models
knn = joblib.load('backend/knn.pkl')
mlp = joblib.load('backend/mlp.pkl')
regresion = joblib.load('backend/regresion.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    modelo = data.get("modelo")
    gender = data.get("gender")
    age = data.get("age")
    country = data.get("country")
    subscription_type = data.get("subscription_type")
    listening_time = data.get("listening_time")
    songs_played_per_day = data.get("songs_played_per_day")
    skip_rate = data.get("skip_rate")
    device_type = data.get("device_type")
    ads_listened_per_week = data.get("ads_listened_per_week")
    offline_listening = data.get("offline_listening")

    # Aquí prepara las features en el formato que necesita tu modelo
    features = pd.DataFrame([{
    "gender": gender,
    "age": float(age),
    "country": country,
    "subscription_type": subscription_type,
    "listening_time": float(listening_time),
    "songs_played_per_day": float(songs_played_per_day),
    "skip_rate": float(skip_rate),
    "device_type": device_type,
    "ads_listened_per_week": float(ads_listened_per_week),
    "offline_listening": int(offline_listening)
}])


    # Ejemplo: selecciona modelo según lo elegido
    if modelo == "KNN":
        resultado = knn.predict(features)[0]
        precision = 0.75
        nombre = "KNN"
    elif modelo == "MLP":
        resultado = mlp.predict(features)[0]
        precision = 0.75
        nombre = "MLP"
    elif modelo == "Regresión Lineal":
        resultado = regresion.predict(features)[0]
        precision = 0.75
        nombre = "Regresión Lineal"
    else:
        # si selecciona "Todos", ejecuta los tres
        resultados = []
        for nombre, modelo_usado in [
            ("KNN", knn),
            ("MLP", mlp),
            ("Regresión Lineal", regresion)
        ]:
            pred = modelo_usado.predict(features)[0]
            texto = "No abandona Spotify" if pred == 0 else "Abandona Spotify"
            resultados.append({
                "nombre": nombre,
                "precision": "75%",
                "resultado": texto
            })
        return jsonify(resultados)

    texto = "No abandona Spotify" if resultado == 0 else "Abandona Spotify"
    return jsonify([{
        "nombre": nombre,
        "precision": "75%",
        "resultado": texto
    }])

if __name__ == '__main__':
    app.run(debug=True)
