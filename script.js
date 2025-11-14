async function predecir() {
  const modelo = document.getElementById("modelo").value;
  const data = {
    modelo: modelo,
    gender: document.getElementById("gender").value,
    age: parseInt(document.getElementById("age").value),
    country: document.getElementById("country").value,
    subscription_type: document.getElementById("subscription_type").value,
    listening_time: parseFloat(document.getElementById("listening_time").value),
    songs_played_per_day: parseFloat(document.getElementById("songs_played_per_day").value),
    skip_rate: parseFloat(document.getElementById("skip_rate").value),
    device_type: document.getElementById("device_type").value,
    ads_listened_per_week: parseFloat(document.getElementById("ads_listened_per_week").value),
    offline_listening: parseInt(document.getElementById("offline_listening").value)
  };

  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = `
    <div class="text-center text-light mt-3">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-2">Procesando predicción...</p>
    </div>
  `;

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Error al obtener la predicción del servidor");

    const resultados = await response.json();

    // Explicaciones de los modelos
    const descripciones = {
      KNN: "El modelo KNN (K-Nearest Neighbors) compara el usuario actual con los más similares para predecir su comportamiento.",
      MLP: "El modelo MLP (Multi-Layer Perceptron) es una red neuronal que aprende patrones complejos de comportamiento.",
      "Regresión Lineal": "La regresión lineal evalúa la relación directa entre las variables del usuario y la probabilidad de abandono."
    };

    resultados.forEach(r => r.descripcion = descripciones[r.nombre] || "");

    mostrarResultados(resultados);

  } catch (error) {
    console.error("Error:", error);
    contenedor.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        Ocurrió un error al comunicarse con el servidor. Verifica que Flask esté en ejecución.
      </div>
    `;
  }
}

function mostrarResultados(resultados) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = "";

  const fila = document.createElement("div");
  fila.className = "row g-4 justify-content-center";

  resultados.forEach(r => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    const color = r.resultado.includes("No") ? "success" : "danger";

    card.innerHTML = `
      <div class="card border-${color} shadow-sm h-100 text-center">
        <div class="card-body">
          <h5 class="card-title fw-bold">${r.nombre}</h5>
          <p class="text-muted small mb-2">${r.descripcion}</p>
          <p class="card-text mb-1">Precisión: <strong>${r.precision}</strong></p>
          <div class="alert alert-${color} fw-semibold mt-3 mb-0" role="alert">
            ${r.resultado}
          </div>
        </div>
      </div>
    `;

    fila.appendChild(card);
  });

  contenedor.appendChild(fila);
}
