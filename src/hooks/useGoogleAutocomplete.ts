import { url } from "@/utils/BaseUrl";
import { ref, inject } from "vue";
import { ToastOptions, AutocompleteInputs, Location } from "@/types";

declare global {
  interface Window {
    google: any;
  }
}

const loadingAPI = ref(false);
const errorAPI = ref(false);
const successAPI = ref(false);
const startPoint = ref<Partial<Location>>({});
const endPoint = ref<Partial<Location>>({});
const waypoints = ref<Location[]>([]);

const autocompleteOptions = {
  fields: ["formatted_address", "geometry", "name", "place_id"],
};

export function useAutocomplete() {
  return {
    deleteStartPoint,
    deleteEndPoint,
    autocompleteInputs,
    startPoint,
    endPoint,
    waypoints,
    loadingAPI,
    errorAPI,
    successAPI,
  };
}

function deleteStartPoint() {
  startPoint.value = {};
}

function deleteEndPoint() {
  endPoint.value = {};
}

function validAdress(
  address: string,
  showToast: (options: ToastOptions) => void
): boolean {
  if (!address.includes("Mexico")) {
    showToast({
      message: "The address must be in Mexico",
      tipo: "error",
      duration: 5000,
    });
    return false;
  }
  return true;
}

async function autocompleteInputs({
  inStart,
  inEnd,
  inWaypoints,
}: AutocompleteInputs) {
  loadingAPI.value = true;
  errorAPI.value = false;
  const showToast = inject("showToast") as (options: ToastOptions) => void;

  try {
    await new Promise((resolve, reject) => {
      fetch(`${url}/api/autocomplete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => response.text())
      .then((scriptContent) => {
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.innerHTML = scriptContent;
        document.head.appendChild(script);
        setTimeout(() => {
          successAPI.value = true;
          resolve(0);
        }, 5000);
      })
      .catch((error) => {
        reject(error);
      });
    });
  } catch (error) {
    errorAPI.value = true;
    successAPI.value = false;
    console.error("Error al cargar el script de Google Maps:", error);
    showToast({
      message: "Ocurrio un error al iniciar la aplicación",
      tipo: "error",
      duration: 5000,
    });
    throw new Error("Google Maps not available");
  } finally {
    loadingAPI.value = false;
  }

  if (!window.google) {
    errorAPI.value = true;
    successAPI.value = false;
    showToast({
      message: "Ocurrio un error al iniciar la aplicación",
      tipo: "error",
      duration: 5000,
    });
    throw new Error("Google Maps not available");
  }
  errorAPI.value = false;

  const google = window.google;

  const startAutocomplete = new google.maps.places.Autocomplete(
    inStart.value,
    autocompleteOptions
  );
  const destinationAutocomplete = new google.maps.places.Autocomplete(
    inEnd.value,
    autocompleteOptions
  );
  const deliveryAutocomplete = new google.maps.places.Autocomplete(
    inWaypoints.value,
    autocompleteOptions
  );

  startAutocomplete.addListener("place_changed", () => {
    const place = startAutocomplete.getPlace();
    if (place.geometry) {
      if (!validAdress(place.formatted_address, showToast)) return;
      startPoint.value = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address,
        name: place.name,
      };
    }
  });

  destinationAutocomplete.addListener("place_changed", () => {
    const place = destinationAutocomplete.getPlace();
    if (place.geometry) {
      if (!validAdress(place.formatted_address, showToast)) return;
      endPoint.value = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address,
        name: place.name,
      };
    }
  });

  deliveryAutocomplete.addListener("place_changed", () => {
    if (waypoints.value.length >= 3) {
      showToast({
        message: "No more than 3 waypoints can be added",
        tipo: "error",
        duration: 3000,
      });
      return;
    }

    const place = deliveryAutocomplete.getPlace();
    if (place.geometry) {
      if (!validAdress(place.formatted_address, showToast)) return;
      waypoints.value.push({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address,
        name: place.name,
      });
      inWaypoints.value.value = "";
    } else {
      showToast({
        message: "Could not get the location",
        tipo: "error",
        duration: 3000,
      });
    }
  });
}
