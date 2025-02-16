require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const router = express.Router();

// Middleware para configurar CORS (usando el paquete `cors`)
router.use(
  cors({
    origin: "https://tollcalculator.onrender.com", // Cambia esto por el dominio de tu frontend
    methods: ["POST"], // Métodos permitidos
  })
);

// Ruta GET para obtener el script de Google Maps desde un archivo local
router.post("/", (req, res) => {
  const filePath = path.join(__dirname, "apiGoogle.js");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo apiGoogle.js:", err.message);
      return res.status(500).json({
        error:
          "Error al obtener el script de Google Maps. Inténtalo más tarde.",
      });
    }

    res.set("Content-Type", "application/javascript");
    res.send(data);
  });
});

module.exports = router;

// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const router = express.Router();

// const API_KEY = process.env.API_KEY_GOOGLE;

// // Middleware para configurar CORS (usando el paquete `cors`)
// router.use(
//   cors({
//     origin: "http://localhost:5173", // Cambia esto por el dominio de tu frontend
//     methods: ["GET"], // Métodos permitidos
//   })
// );

// // Ruta GET para obtener el script de Google Maps
// router.get("/", async (req, res) => {
//   if (!API_KEY) {
//     return res.status(500).json({
//       error: "La clave de API de Google no está configurada.",
//     });
//   }

//   const apiUrl = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
//     API_KEY
//   )}&libraries=places,geometry,marker`;

//   try {
//     const response = await axios.get(apiUrl, {
//       responseType: "text", // Asegura que se reciba como texto
//     });
//     res.set("Content-Type", "application/javascript");
//     res.send(response.data);
//   } catch (error) {
//     console.error("Error al obtener el script de Google Maps:", error.message);
//     res.status(500).json({
//       error: "Error al obtener el script de Google Maps. Inténtalo más tarde.",
//     });
//   }
// });

// module.exports = router;
