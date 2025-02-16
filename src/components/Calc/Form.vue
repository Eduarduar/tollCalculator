<script setup>
import LoadingIcon from '@/components/Base/LoadingIcon/'
import Lucide from '@/components/Base/Lucide'
import ListRute from './components/ListRute.vue'
import Response from './Response.vue'
import { handleNumberInput, handleNumberBlur } from '@/utils/formatNumber'
import { types, vehicles } from '@/stores/vehicle'
import { useRefs } from '@/hooks/useRefs'
import { useAutocomplete } from '@/hooks/useGoogleAutocomplete'
import { useTypeVehicle } from '@/hooks/useTypeVehicule'
import { onMounted, watch } from 'vue'
import { useValidatedForm } from '@/hooks/useValidForm'

const { inStart, inEnd, inWaypoints, selectTypeVehicle, selectSubTypeVehicle, imageVehicle, inFuelEficience, inConstFuel, checkCost, checkFuelEfficiency } = useRefs()
const { deleteStartPoint, deleteEndPoint, autocompleteInputs, startPoint, endPoint, waypoints } = useAutocomplete()
const { calculateImageDefault } = useTypeVehicle()
const { validated, loadResponse, success, loading: loadingResult } = useValidatedForm()

function validForm() {
    const data = {
        selectSubTypeVehicle,
        inFuelEficience,
        inConstFuel,
        startPoint,
        endPoint,
        waypoints,
        checkCost,
        checkFuelEfficiency
    }
    if (!validated(data)) return;
    loadResponse(data);
}

watch(() => inConstFuel.value, () => {
    handleNumberInput(inConstFuel)
})
watch(() => inFuelEficience.value, () => {
    handleNumberInput(inFuelEficience)
})

onMounted(() => {
    autocompleteInputs({ inStart, inEnd, inWaypoints })
    calculateImageDefault({ selectTypeVehicle, selectSubTypeVehicle, imageVehicle })
})

</script>

<template>
    <div class="grid justify-center grid-cols-4 col-span-12 gap-4 px-4 pt-4">
        <div class="grid grid-cols-2 col-span-4 gap-2 xl:col-span-3">
            <div class="grid col-span-2 gap-8 lg:grid-cols-2">
                <div class="col-span-2 space-y-6 lg:col-span-1">
                    <h2 class="flex flex-row items-center justify-start gap-1 text-2xl font-bold text-blue-600">
                        Locations
                        <Lucide icon="MapPin" class="w-8 h-8" />
                    </h2>
                    <div>
                        <label for="start-input" class="block text-sm font-medium text-gray-700">
                            Start Location
                        </label>
                        <input id="start-input" type="text" placeholder="Enter start location" ref="inStart"
                            class="w-full p-3 transition-all border border-gray-300 outline-none rounded-lgshadow-sm focus:border-blue-500 focus:ring-blue-200 autofill:bg-transparent" />
                    </div>
                    <div>
                        <label for="destination-input" class="block text-sm font-medium text-gray-700">
                            Destination Location
                        </label>
                        <input id="destination-input" type="text" placeholder="Enter destination" ref="inEnd"
                            class="w-full p-3 transition-all border border-gray-300 outline-none rounded-lgshadow-sm focus:border-blue-500 focus:ring-blue-200 autofill:bg-transparent" />
                    </div>
                </div>
                <div class="col-span-2 space-y-6 lg:col-span-1">
                    <h2 class="flex flex-row items-center justify-start gap-1 text-2xl font-bold text-green-600">
                        Add Stops
                        <Lucide icon="MapPinCheck" class="w-8 h-8" />
                    </h2>
                    <div>
                        <label for="delivery-input" class="block text-sm font-medium text-gray-700">
                            Stop Location
                        </label>
                        <input id="delivery-input" type="text" placeholder="Enter stop location" ref="inWaypoints"
                            class="w-full p-3 transition-all border border-gray-300 outline-none rounded-lgshadow-sm focus:border-green-500 focus:ring-green-200 autofill:bg-transparent" />
                    </div>
                </div>
            </div>
        </div>

        <ListRute :startPoint="startPoint" :endPoint="endPoint" :waypoints="waypoints"
            :deleteStartPoint="deleteStartPoint" :deleteEndPoint="deleteEndPoint" />

    </div>

    <div class="grid grid-cols-2 col-span-12 gap-4 px-4">
        <div class="grid grid-cols-2 col-span-12 gap-4">
            <h2 class="flex flex-row items-center justify-start col-span-2 gap-1 text-2xl font-bold text-blue-600">
                Vehicle
                <Lucide icon="Truck" class="w-8 h-8" />
            </h2>

            <div class="grid grid-cols-2 col-span-2 gap-8 md:col-span-1 gap-y-2">
                <div class="col-span-2 gap-8 lg:col-span-2 ">
                    <label for="rendimiento-input" class="block text-sm font-medium text-gray-700">
                        Type of Vehicle
                    </label>
                    <select v-model="selectTypeVehicle"
                        class="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <template v-for="type in types" :key="type">
                            <option :value="type.type">{{ type.description }}</option>
                        </template>
                    </select>
                </div>
                <div class="col-span-2 gap-8 lg:col-span-2">
                    <div class="flex flex-col-reverse gap-2 lg:flex-row lg:items-center">
                        <div
                            class="flex-[0.3] flex justify-center items-center min-h-[100px] border py-2 rounded bg-blue-500/10">
                            <img id="vehicle-image" src="/img/vehicles/Truck/2AxlesTruck.png" alt="truck"
                                ref="imageVehicle" class="max-h-[100px]" />
                        </div>
                        <div class="flex-[0.7]">
                            <label for="select-type-vehicle" class="block text-sm font-medium text-gray-700">
                                Number of Axles
                            </label>
                            <select id="select-type-vehicle" v-model="selectSubTypeVehicle"
                                class="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <template v-for="vehicle in vehicles" :key="vehicle.id">
                                    <option v-if="vehicle.type == selectTypeVehicle" :value="vehicle.id">
                                        {{ vehicle.description }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 col-span-2 md:col-span-1 gap-y-4">
                <div class="col-span-2 lg:col-span-1">
                    <label for="rendimiento-input" class="block text-sm font-medium text-gray-700">
                        Fuel Efficiency
                    </label>
                    <div class="flex flex-row items-center justify-between bg-gray-200 rounded ">
                        <input id="rendimiento-input" type="text" placeholder="0.00" value="0.00"
                            :disabled="checkFuelEfficiency" v-model="inFuelEficience" onfocus="this.select();"
                            @blur="handleNumberBlur"
                            class="flex-[0.9] w-full p-3 border border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-blue-200 transition-all outline-none autofill:bg-transparent disabled:bg-gray-200" />
                        <div class="flex-[0.1] flex items-center justify-center">
                            <label for="rendimiento-input" class="mb-0 text-gray-900 ">km/l</label>
                        </div>
                    </div>
                    <div class="col-span-2 pr-3 mt-2 ml-2 lg:col-span-1 lg:pr-8">
                        <label class="flex flex-row-reverse items-center justify-end gap-4 cursor-pointer"
                            for="use-app-fuel-efficiency">
                            <span class="text-sm font-medium text-gray-700">
                                Use app-provided efficiency
                            </span>
                            <input id="use-app-fuel-efficiency" type="checkbox" checked v-model="checkFuelEfficiency"
                                class="relative flex items-center justify-center w-5 h-5 transition-all duration-300 ease-in-out bg-white border-2 border-gray-300 rounded outline-none appearance-none cursor-pointer hover:border-green-300 checked:bg-green-500 checked:border-green-500 checked:text-white checked:hover:bg-green-600 checked:hover:border-green-600 checked:checked:bg-green-500 checked:checked:border-green-500 checked:checked:text-white checked:checked:hover:bg-green-600 checked:checked:hover:border-green-600" />
                        </label>
                    </div>
                </div>

                <div class="flex flex-col col-span-1 lg:col-span-1">
                    <label for="precioFuel-input" class="block text-sm font-medium text-gray-700">
                        Price per Liter
                    </label>
                    <div class="flex flex-row items-center justify-between bg-gray-200 rounded ">
                        <div class="flex-[0.05] flex items-center justify-center">
                            <label for="precioFuel-input" class="mb-0 text-gray-900">$</label>
                        </div>
                        <input id="precioFuel-input" type="text" placeholder="0.00" value="0.00" :disabled="checkCost"
                            onfocus="this.select();" v-model="inConstFuel" @blur="handleNumberBlur"
                            class="flex-[0.85] w-full p-3 border border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-blue-200 transition-all outline-none autofill:bg-transparent disabled:bg-gray-200" />
                        <div class="flex-[0.1] flex items-center justify-center">
                            <label for="precioFuel-input" class="mb-0 text-gray-900">MXN</label>
                        </div>
                    </div>
                    <div class="col-span-2 pr-3 mt-2 ml-2 lg:col-span-1 lg:pr-8">
                        <label class="flex flex-row-reverse items-center justify-end gap-4 cursor-pointer"
                            for="use-app-price">
                            <span class="text-sm font-medium text-gray-700">
                                Use app-provided price
                            </span>
                            <input id="use-app-price" type="checkbox" checked v-model="checkCost"
                                class="relative flex items-center justify-center w-5 h-5 transition-all duration-300 ease-in-out bg-white border-2 border-gray-300 rounded outline-none appearance-none cursor-pointer hover:border-green-300 checked:bg-green-500 checked:border-green-500 checked:text-white checked:hover:bg-green-600 checked:hover:border-green-600 checked:checked:bg-green-500 checked:checked:border-green-500 checked:checked:text-white checked:checked:hover:bg-green-600 checked:checked:hover:border-green-600" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-end col-span-12 mt-4">
        <button id="finalize-button" type="button" @click="validForm"
            class="bg-blue-500 text-white py-2 px-6 rounded font-semibold hover:bg-blue-600 transition flex flex-row justify-center items-center gap-2 min-h-[40px] min-w-[180px] focus:outline-none">
            <span id="iconLoading" v-if="loadingResult">
                <LoadingIcon icon="three-dots" />
            </span>
            <span id="textButton" v-else
                class="flex flex-row items-center justify-between w-full transition-all focus:border-blue-500 focus:ring-blue-200 ">
                <Lucide icon="Check" />
                Calculate Route
            </span>
        </button>
    </div>

    <Response v-if="success" :data="success" />
</template>
