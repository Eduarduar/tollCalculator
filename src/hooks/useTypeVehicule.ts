import { ref, watch } from "vue";
import { vehicles } from "@/stores/vehicle";
import { VehicleParams } from "@/types";

export function useTypeVehicle() {
  const calculateImageDefault = ({
    selectTypeVehicle,
    selectSubTypeVehicle,
    imageVehicle,
  }: VehicleParams) => {
    const updateImage = (value: string, typeInput: number) => {
      const type = vehicles.find((type) => {
        if (typeInput === 1) {
          return type.type === value;
        } else {
          return type.id === value;
        }
      });
      selectSubTypeVehicle.value = type?.id || "";
      imageVehicle.value.src = type?.image || "";
    };

    watch(
      () => selectTypeVehicle.value,
      (newValue) => {
        updateImage(newValue, 1);
      },
      { immediate: true }
    );
    watch(
      () => selectSubTypeVehicle.value,
      (newValue) => {
        updateImage(newValue, 2);
      }
    );
  };

  return {
    calculateImageDefault,
  };
}
