import axios from "axios";
import { ref, inject } from "vue";
import { url } from "@/utils/BaseUrl";
import { FormFields, ToastOptions } from "@/types";
import { unformatNumber } from "@/utils/formatNumber";

export function useValidatedForm() {
  const showToast = inject("showToast") as (options: ToastOptions) => void;
  const loading = ref(false);
  const success = ref(false);

  const validated = ({
    selectSubTypeVehicle,
    inFuelEficience,
    inConstFuel,
    startPoint,
    endPoint,
    waypoints,
    checkCost,
    checkFuelEfficiency,
  }: FormFields) => {
    if (
      !startPoint.value.latitude ||
      !startPoint.value.longitude ||
      !startPoint.value.address ||
      !startPoint.value.name
    ) {
      showToast({
        message: "Start point is incomplete",
        tipo: "error",
        duration: 5000,
      });
      return false;
    }

    if (
      !endPoint.value.latitude ||
      !endPoint.value.longitude ||
      !endPoint.value.address ||
      !endPoint.value.name
    ) {
      showToast({
        message: "End point is incomplete",
        tipo: "error",
        duration: 5000,
      });
      return false;
    }

    for (const waypoint of waypoints.value) {
      if (
        !waypoint.latitude ||
        !waypoint.longitude ||
        !waypoint.address ||
        !waypoint.name
      ) {
        showToast({
          message: "Waypoint is incomplete",
          tipo: "error",
          duration: 5000,
        });
        return false;
      }
    }

    if (selectSubTypeVehicle.value.length < 3) {
      showToast({
        message: "Vehicle not allowed",
        tipo: "error",
        duration: 5000,
      });
      return false;
    }

    if (
      !checkFuelEfficiency.value &&
      parseFloat(unformatNumber(inFuelEficience.value)) < 1.7
    ) {
      showToast({
        message: "Fuel efficiency must be at least 1.7",
        tipo: "error",
        duration: 5000,
      });
      return false;
    }

    if (!checkCost.value && parseFloat(unformatNumber(inConstFuel.value)) < 1) {
      showToast({
        message: "Fuel consumption must be at least 1",
        tipo: "error",
        duration: 5000,
      });
      return false;
    }

    return true;
  };

  const loadResponse = async ({
    selectSubTypeVehicle,
    inFuelEficience,
    inConstFuel,
    startPoint,
    endPoint,
    waypoints,
    checkCost,
    checkFuelEfficiency,
  }: FormFields) => {
    loading.value = true;
    const data = {
      typeVehicle: selectSubTypeVehicle.value,
      eficience: parseFloat(inFuelEficience.value),
      costFuel: parseFloat(inConstFuel.value),
      startPoint: startPoint.value,
      endPoint: endPoint.value,
      waypoints: waypoints.value,
      useCost: checkCost.value,
      useEficience: checkFuelEfficiency.value,
    };

    try {
      const response = await axios.post(`${url}/api/calcRoute`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        success.value = response.data.data;
      } else {
        success.value = false;
        showToast({
          message: "An error occurred while trying to calculate",
          tipo: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      success.value = false;
      console.error("Error sending data:", error);
      showToast({
        message: "An error occurred while trying to calculate",
        tipo: "error",
        duration: 5000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { validated, loadResponse, loading, success };
}
