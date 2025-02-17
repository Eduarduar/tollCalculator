# Toll Calculator

Toll Calculator es una aplicación web que utiliza la API de "TollGuru" para calcular datos sobre rutas. Además, incluye APIs de Google para el autocompletado de direcciones y para proporcionar las coordenadas (latitud y longitud) necesarias para que TollGuru realice los cálculos correspondientes.

## Características

- **Cálculo de peajes**: Utiliza la API de TollGuru para calcular los costos de peaje en diferentes rutas.
- **Autocompletado de direcciones**: Implementa la API de Google Places para facilitar la entrada de direcciones.
- **Conversión de direcciones a coordenadas**: Utiliza la API de Google Geocoding para obtener las coordenadas de las direcciones ingresadas.

## Requisitos

- Node.js
- Una cuenta y clave API de TollGuru
- Una cuenta y clave API de Google (Places y Geocoding)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tollCalc.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd tollCalc
   ```
3. Instala las dependencias del frontend:
   ```bash
   npm install
   ```
4. Navega al directorio del servidor:
   ```bash
   cd server
   ```
5. Instala las dependencias del backend:
   ```bash
   npm install
   ```

## Configuración

1. Crea un archivo `.env` dentro de la carpeta `server` y agrega tus claves API:
   ```env
   API_KEY=tu_tollguru_api_key
   API_KEY_GOOGLE=tu_google_api_key
   ```

## Uso

1. Inicia el frontend:
   ```bash
   npm run dev
   ```
2. Navega al directorio del servidor:
   ```bash
   cd server
   ```
3. Inicia el backend:
   ```bash
   npm run dev
   ```
4. Abre tu navegador y navega a `http://localhost:5173`.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
