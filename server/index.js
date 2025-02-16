const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Cambia esto por la URL del cliente
    methods: ["GET", "POST"], // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Encabezados permitidos
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Configura las rutas de tu API antes de las rutas de Vue
const api = require("./api/autocomplete");
app.use("/api/autocomplete", api);

const calcRoute = require("./api/calcRoute");
app.use("/api/calcRoute", calcRoute);

// si consulta api/route.json, regresamos el archivo route.json
app.use("/api/route", (req, res) => {
  res.sendFile(path.join(__dirname, "api/route.json"));
});

// Middleware para servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "dist")));

// Ruta para manejar todas las demás peticiones y devolver el index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Manejo de rutas no encontradas para la API
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
