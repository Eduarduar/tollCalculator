import { Ref } from "vue";

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

export interface ToastOptions {
  message: string;
  tipo?: "info" | "error" | "warning" | "success";
  duration?: number;
  persistente?: boolean;
}

export interface AutocompleteInputs {
  inStart: Ref<HTMLInputElement>;
  inEnd: Ref<HTMLInputElement>;
  inWaypoints: Ref<HTMLInputElement>;
}

export interface FormFields {
  selectSubTypeVehicle: Ref<string>;
  inFuelEficience: Ref<string>;
  inConstFuel: Ref<string>;
  startPoint: Ref<Location>;
  endPoint: Ref<Location>;
  waypoints: Ref<Location[]>;
  checkCost: Ref<boolean>;
  checkFuelEfficiency: Ref<boolean>;
}

export interface VehicleParams {
  selectTypeVehicle: Ref<string>;
  selectSubTypeVehicle: Ref<string>;
  imageVehicle: Ref<HTMLImageElement>;
}
