require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const router = express.Router();

const TOLLGURU_KEY = process.env.API_KEY;

router.use(
  cors({
    origin: "https://tollcalculator.onrender.com", // Cambia esto por el dominio de tu frontend
    methods: ["POST"],
  })
);

router.post("/", async (req, res) => {
  const apiKey = TOLLGURU_KEY;
  if (!apiKey) {
    return res.status(500).json({
      status: "error",
      message: "Configuración faltante. Por favor, contacte al administrador.",
      error: "Falta API_KEY en el archivo .env",
      data: [],
    });
  }

  const data = req.body;
  const requiredFields = [
    "startPoint",
    "endPoint",
    "waypoints",
    "typeVehicle",
    "useCost",
    "useEficience",
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      return res.status(400).json({
        status: "error",
        message:
          "Faltan algunos datos necesarios. Por favor, revise su entrada.",
        error: `Parámetro faltante: ${field}`,
        data: [],
      });
    }
  }

  if (
    data.eficience === undefined ||
    data.eficience === null ||
    data.costFuel === undefined ||
    data.costFuel === null
  ) {
    return res.status(400).json({
      status: "error",
      message: "Faltan algunos datos necesarios. Por favor, revise su entrada.",
      error: "Parámetro faltante: eficience o costFuel",
      data: [],
    });
  }

  const {
    startPoint,
    endPoint,
    waypoints,
    typeVehicle,
    eficience,
    costFuel,
    useCost,
    useEficience,
  } = data;

  const axles = typeVehicle.charAt(0);
  const type = typeVehicle.slice(1);

  const extraData = {
    useCost: !useCost,
    useEficience: !useEficience,
  };

  if (!useCost) {
    extraData.precioFuel = costFuel;
  }

  if (!useEficience) {
    extraData.rendimientoFuel = eficience;
  }

  const requestData = {
    from: {
      lat: startPoint.latitude,
      lng: startPoint.longitude,
    },
    to: {
      lat: endPoint.latitude,
      lng: endPoint.longitude,
    },
    serviceProvider: "here",
    waypoints: waypoints.map((point) => ({
      lat: point.latitude,
      lng: point.longitude,
    })),
    vehicle: {
      type: `${axles}Axles${type}`,
    },
  };

  try {
    const response = await axios.post(
      "https://apis.tollguru.com/toll/v2/origin-destination-waypoints",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );

    const decodedResponse = response.data;
    decodedResponse.extraData = extraData;

    res.status(200).json({
      status: "success",
      message: "Solicitud procesada con éxito.",
      data: decodedResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "No se pudo conectar al servidor. Inténtelo más tarde.",
      error: error.message,
      data: [],
    });
  }
});

module.exports = router;
