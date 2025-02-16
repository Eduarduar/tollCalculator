export function createCustomMarkerTemplate({ text }: { text: string }) {
  // Contenedor principal
  const container = document.createElement("div");
  container.className =
    "px-3 py-1 text-center text-white bg-teal-500 rounded-lg shadow-md";
  container.style.position = "relative";
  container.title = text;

  // Texto del marcador
  const textElement = document.createElement("div");
  textElement.textContent = text;
  textElement.className = "text-sm font-medium";
  container.appendChild(textElement);

  // Triángulo apuntando hacia abajo
  const triangle = document.createElement("div");
  triangle.className =
    "absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#38b2ac]";
  container.appendChild(triangle);

  return container;
}

export function createMarkerPoins(summary: any, map: any, extraData: any) {
  // Agregar marcadores en las coordenadas de la ruta
  const coordinates = summary.route;
  coordinates.forEach((coordinate: any, index: any) => {
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

    // Crear el contenido personalizado usando la plantilla
    const markerContent = createCustomMarkerTemplate({ text });

    if (!window.google) return;
    const google = window.google;
    // Usar AdvancedMarkerElement
    new google.maps.marker.AdvancedMarkerElement({
      position: coordinate.location,
      map: map,
      title: `Punto ${index + 1}`,
      content: markerContent, // Reemplaza el icono con contenido personalizado
    });
  });
}

export function createPeajesMarkers(route: any, map: any) {
  if (!route.tolls || !Array.isArray(route.tolls)) {
    console.error("La ruta no contiene un listado válido de peajes.");
    return;
  }

  route.tolls.forEach((toll: any) => {
    if (toll.type === "ticketSystem2" && toll.start && toll.end) {
      // Peaje tipo tramo
      const startMarkerContent = document.createElement("div");
      startMarkerContent.className =
        "bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md text-center relative cursor-pointer transition-all ease-in-out duration-300 whitespace-nowrap !pointer-events-auto group markerPoint hidden";

      const startTollName = document.createElement("p");
      startTollName.className = "mb-0 text-sm font-bold";
      startTollName.textContent = `Inicio: ${toll.start.name}`;
      startMarkerContent.appendChild(startTollName);

      const startExtraInfo = document.createElement("div");
      startExtraInfo.className =
        "absolute z-10 hidden p-2 mt-2 text-black transform -translate-x-1/2 bg-white rounded-lg shadow-md group-hover:block top-full left-1/2";

      const startRoadInfo = document.createElement("p");
      startRoadInfo.className = "mb-0 text-xs";
      startRoadInfo.textContent = toll.start.road;
      startExtraInfo.appendChild(startRoadInfo);

      startMarkerContent.appendChild(startExtraInfo);

      // Triángulo apuntando hacia abajo
      const startTriangle = document.createElement("div");
      startTriangle.className =
        "absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-blue-500";

      startMarkerContent.appendChild(startTriangle);

      if (!window.google) return;
      const google = window.google;

      const startMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: toll.start.lat, lng: toll.start.lng },
        map: map,
        title: `Inicio: ${toll.start.name}`,
        content: startMarkerContent,
      });

      const markerContainerStart = startMarker.element;
      if (markerContainerStart) {
        markerContainerStart.style.pointerEvents = "auto";
        markerContainerStart.childNodes[0].style.pointerEvents = "auto";
      }

      const endMarkerContent = document.createElement("div");
      endMarkerContent.className =
        "bg-red-500 text-white px-3 py-2 rounded-lg shadow-md text-center relative cursor-pointer transition-all ease-in-out duration-300 whitespace-nowrap !pointer-events-auto group markerPoint hidden";

      const endTollName = document.createElement("p");
      endTollName.className = "mb-0 text-sm font-bold";
      endTollName.textContent = `Fin: ${toll.end.name}`;
      endMarkerContent.appendChild(endTollName);

      const endExtraInfo = document.createElement("div");
      endExtraInfo.className =
        "absolute z-10 hidden p-2 mt-2 text-black transform -translate-x-1/2 bg-white rounded-lg shadow-md group-hover:block top-full left-1/2";

      const endRoadInfo = document.createElement("p");
      endRoadInfo.className = "mb-0 text-xs";
      endRoadInfo.textContent = toll.end.road;
      endExtraInfo.appendChild(endRoadInfo);

      endMarkerContent.appendChild(endExtraInfo);

      // Triángulo apuntando hacia abajo
      const endTriangle = document.createElement("div");
      endTriangle.className =
        "absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-red-500";

      endMarkerContent.appendChild(endTriangle);

      const endMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: toll.end.lat, lng: toll.end.lng },
        map: map,
        title: `Fin: ${toll.end.name}`,
        content: endMarkerContent,
      });

      const markerContainerEnd = endMarker.element;
      if (markerContainerEnd) {
        markerContainerEnd.style.pointerEvents = "auto";
        markerContainerEnd.childNodes[0].style.pointerEvents = "auto";
      }

      $("#hiddenCheckbox-view-tolls").on("change", function () {
        if ($(this).is(":checked")) {
          startMarkerContent.classList.remove("hidden");
          endMarkerContent.classList.remove("hidden");
        } else {
          startMarkerContent.classList.add("hidden");
          endMarkerContent.classList.add("hidden");
        }
      });
    } else {
      // Peaje individual
      const markerContent = document.createElement("div");
      markerContent.className =
        "bg-orange-500 text-white px-3 py-2 rounded-lg shadow-md text-center relative cursor-pointer transition-all ease-in-out duration-300 whitespace-nowrap !pointer-events-auto group markerPoint hidden";

      const tollName = document.createElement("p");
      tollName.className = "mb-0 text-sm font-bold";
      tollName.textContent = toll.name;
      markerContent.appendChild(tollName);

      const extraInfo = document.createElement("div");
      extraInfo.className =
        "absolute z-10 hidden p-2 mt-2 text-black transform -translate-x-1/2 bg-white rounded-lg shadow-md group-hover:block top-full left-1/2";

      const roadInfo = document.createElement("p");
      roadInfo.className = "mb-0 text-xs";
      roadInfo.textContent = toll.road;
      extraInfo.appendChild(roadInfo);

      const cashCost = document.createElement("p");
      cashCost.className = "mb-0 text-xs";
      cashCost.textContent = `Costo: ${toll.cashCost} ${toll.currency}`;
      extraInfo.appendChild(cashCost);

      markerContent.appendChild(extraInfo);

      // Triángulo apuntando hacia abajo
      const triangle = document.createElement("div");
      triangle.className =
        "absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-orange-500";

      markerContent.appendChild(triangle);

      if (!window.google) return;
      const google = window.google;

      const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: toll.lat, lng: toll.lng },
        map: map,
        title: toll.name,
        content: markerContent,
      });

      const markerContainer = advancedMarker.element;
      if (markerContainer) {
        markerContainer.style.pointerEvents = "auto";
        markerContainer.childNodes[0].style.pointerEvents = "auto";
      }

      $("#hiddenCheckbox-view-tolls").on("change", function () {
        if ($(this).is(":checked")) {
          markerContent.classList.remove("hidden");
        } else {
          markerContent.classList.add("hidden");
        }
      });
    }
  });
}
