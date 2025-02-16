<script setup>
import Lucide from '@/components/Base/Lucide';
import { defineProps, ref, onMounted, watch } from 'vue';

const props = defineProps({
    route: {
        type: Object,
        required: true
    },
    summary: {
        type: Object,
        required: true
    },
    extraData: {
        type: Object,
        required: true
    }
});

const showTolls = ref(false);
const peajesMarkers = ref([]); // Almacenará los marcadores de peajes

onMounted(() => {
    initializeMap(props.route, props.summary, props.extraData);
});

// Si la ruta cambia, se vuelve a inicializar el mapa
watch(() => props.route, (newValue) => {
    peajesMarkers.value.forEach(({ marker }) => marker.setMap(null)); // Eliminar marcadores anteriores
    initializeMap(newValue, props.summary, props.extraData);
});

// Actualizar visibilidad de los marcadores cuando cambia showTolls
watch(showTolls, (newValue) => {
    peajesMarkers.value.forEach(({ content }) => {
        toggleMarkerVisibility(content, newValue);
    });
});

function initializeMap(route, summary, extraData) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 23.6345, lng: -102.5528 }, // Centro aproximado de México
        mapId: "f2b1ba56dadcf216",
    });

    if (route.polyline) {
        const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline);

        const polyline = new google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#0f53ff",
            strokeOpacity: 0.8,
            strokeWeight: 4,
        });

        polyline.setMap(map);

        const bounds = new google.maps.LatLngBounds();
        decodedPath.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);

        createMarkerPoints(summary, map, extraData);
        createPeajesMarkers(route, map);
    } else {
        console.error("No se encontró una polilínea en el objeto de la ruta.");
    }
}

function createMarkerPoints(summary, map, extraData) {
    const coordinates = summary.route;
    coordinates.forEach((coordinate, index) => {
        let text;
        if (index === 0) {
            text = "Inicio";
        } else if (index === coordinates.length - 2 && extraData.RIV) {
            text = "Destino";
        } else if (index === coordinates.length - 1 && !extraData.RIV) {
            text = "Destino";
        } else {
            return;
        }

        const markerContent = createCustomMarkerTemplate({ text });

        new google.maps.marker.AdvancedMarkerElement({
            position: coordinate.location,
            map: map,
            title: `Punto ${index + 1}`,
            content: markerContent,
        });
    });
}

function createPeajesMarkers(route, map) {
    if (!route.tolls || !Array.isArray(route.tolls)) {
        console.error("La ruta no contiene un listado válido de peajes.");
        return;
    }

    peajesMarkers.value = []; // Limpiar marcadores anteriores

    route.tolls.forEach((toll) => {
        if (toll.type === "ticketSystem2" && toll.start && toll.end) {
            const startMarkerContent = createTollMarkerTemplate(toll.start, "blue");
            const endMarkerContent = createTollMarkerTemplate(toll.end, "red");

            const startMarker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: toll.start.lat, lng: toll.start.lng },
                map: map,
                title: `Inicio: ${toll.start.name}`,
                content: startMarkerContent,
            });

            const endMarker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: toll.end.lat, lng: toll.end.lng },
                map: map,
                title: `Fin: ${toll.end.name}`,
                content: endMarkerContent,
            });

            peajesMarkers.value.push({ marker: startMarker, content: startMarkerContent });
            peajesMarkers.value.push({ marker: endMarker, content: endMarkerContent });

            toggleMarkerVisibility(startMarkerContent, showTolls.value);
            toggleMarkerVisibility(endMarkerContent, showTolls.value);
        } else {
            const markerContent = createTollMarkerTemplate(toll, "orange");
            const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: toll.lat, lng: toll.lng },
                map: map,
                title: toll.name,
                content: markerContent,
            });

            peajesMarkers.value.push({ marker: advancedMarker, content: markerContent });

            toggleMarkerVisibility(markerContent, showTolls.value);
        }
    });
}

function createCustomMarkerTemplate({ text }) {
    const container = document.createElement("div");
    container.className = "bg-teal-500 text-white px-3 py-1 rounded-lg shadow-md text-center";
    container.style.position = "relative";
    container.title = text;

    const textElement = document.createElement("div");
    textElement.textContent = text;
    textElement.className = "font-medium text-sm";
    container.appendChild(textElement);

    const triangle = document.createElement("div");
    triangle.className = "absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#38b2ac]";
    container.appendChild(triangle);

    return container;
}

function createTollMarkerTemplate(toll, color) {
    const markerContent = document.createElement("div");
    markerContent.className = `bg-${color}-500 text-white px-3 py-2 rounded-lg shadow-md text-center relative cursor-pointer transition-all ease-in-out duration-300 whitespace-nowrap !pointer-events-auto group markerPoint ${showTolls.value ? '' : 'hidden'}`;

    const tollName = document.createElement("p");
    tollName.className = "font-bold text-sm mb-0";
    tollName.textContent = toll.name;
    markerContent.appendChild(tollName);

    const extraInfo = document.createElement("div");
    extraInfo.className = "hidden group-hover:block bg-white text-black rounded-lg shadow-md p-2 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10";

    const roadInfo = document.createElement("p");
    roadInfo.className = "text-xs mb-0";
    roadInfo.textContent = toll.road;
    extraInfo.appendChild(roadInfo);

    if (toll.cashCost) {
        const cashCost = document.createElement("p");
        cashCost.className = "text-xs mb-0";
        cashCost.textContent = `Costo: ${toll.cashCost} ${toll.currency}`;
        extraInfo.appendChild(cashCost);
    }

    markerContent.appendChild(extraInfo);

    const triangle = document.createElement("div");
    triangle.className = `absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-${color}-500`;
    markerContent.appendChild(triangle);

    return markerContent;
}

function toggleMarkerVisibility(markerContent, show) {
    if (show) {
        markerContent.classList.remove("hidden");
    } else {
        markerContent.classList.add("hidden");
    }
}

function copyLink() {
    navigator.clipboard.writeText(props.route.summary.url).then(() => {
        // Aquí puedes agregar alguna animación o feedback visual
    });
}
</script>

<template>
    <div class="w-full h-[650px] mb-4 containerMapRoute col-span-12">
        <div class="relative flex flex-col items-center justify-center w-full" id="containerMapRoute">
            <div class="flex flex-row items-center justify-between w-full gap-2">
                <div class="flex flex-row items-center justify-between w-full">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="hiddenCheckbox-view-tolls" v-model="showTolls" class="hidden">
                        <label for="hiddenCheckbox-view-tolls"
                            class="flex items-center justify-center w-6 h-6 mb-0 border border-gray-400 rounded cursor-pointer">
                            <span :class="{ 'hidden': !showTolls, 'w-4 h-4 bg-blue-600 rounded': true }"></span>
                        </label>
                        <span class="flex items-center font-medium text-gray-700">
                            Mostrar peajes
                        </span>
                    </div>
                </div>
                <button class="z-10 p-2 text-white bg-yellow-600 rounded focus:outline-none" @click="copyLink">
                    <Lucide icon="Link" class="w-6 h-6" />
                </button>
            </div>
            <div id="map" class="w-full h-[600px] mt-2 rounded-2xl shadow-lg"
                style="border: 0px; position: relative; overflow: hidden;"></div>
        </div>
    </div>
</template>