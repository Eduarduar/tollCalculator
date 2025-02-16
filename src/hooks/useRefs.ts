import { ref } from "vue";

const inStart = ref(null);
const inEnd = ref(null);
const inWaypoints = ref(null);
const selectTypeVehicle = ref("Auto");
const selectSubTypeVehicle = ref("2Auto");
const imageVehicle = ref(null);
const inFuelEficience = ref("0.00");
const inConstFuel = ref("0.00");
const checkCost = ref(true);
const checkFuelEfficiency = ref(true);

export function useRefs() {
  return {
    inStart,
    inEnd,
    inWaypoints,
    selectTypeVehicle,
    imageVehicle,
    selectSubTypeVehicle,
    inFuelEficience,
    inConstFuel,
    checkCost,
    checkFuelEfficiency,
  };
}
