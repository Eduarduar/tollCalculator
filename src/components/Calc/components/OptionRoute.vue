<script setup>
import Lucide from '@/components/Base/Lucide';
import ModalTolls from '@/components/Calc/modal/showTollsModal.vue';
import { ref, computed } from 'vue';
import { formatNumber } from '@/utils/formatNumber';
import { useDialogTolls } from '@/hooks/useModalTolls.ts'

const { modalTolls, setModalTolls, tollsProvide } = useDialogTolls()

const props = defineProps({
    route: {
        type: Object || null,
        required: true
    },
    summary: {
        type: Object || null,
        required: true
    },
    extraData: {
        type: Object || null,
        required: true
    }
});

const fuelUsed = computed(() => {
    const distance = props.route.summary.distance.value / 1000; // en km
    const fuelEfficiency = props.extraData.useEficience ? props.extraData.rendimientoFuel : props.summary.fuelEfficiency.hwy; // en km/l
    return Math.round(distance / fuelEfficiency);
});

const fuelCost = computed(() => {
    const fuelPrice = props.extraData.useCost ? props.extraData.precioFuel : props.summary.fuelPrice.value; // en MXN
    return fuelUsed.value.toFixed(2) * fuelPrice.toFixed(2);
});
</script>

<template>

    <ModalTolls :ModalTolls="modalTolls" :setModalTolls="setModalTolls" :tolls="tollsProvide" />

    <h2 class="col-span-12 text-xl font-bold text-blue-600">Información de la ruta</h2>
    <div class="grid grid-cols-1 col-span-12 gap-6 xl:grid-cols-2">
        <div class="flex items-center justify-between p-4 bg-gray-200 rounded">
            <h3 class="m-0 text-lg font-semibold text-gray-800">Distancia</h3>
            <p class="m-0 text-xl font-bold text-blue-600">{{ route.summary.distance.metric }}</p>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-200 rounded">
            <h3 class="m-0 text-lg font-semibold text-gray-800">Duración</h3>
            <p class="m-0 text-xl font-bold text-blue-600">{{ route.summary.duration.text }}</p>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-200 rounded">
            <h3 class="m-0 text-lg font-semibold text-gray-800">Costo de combustible</h3>
            <p class="m-0 text-xl font-bold text-blue-600">${{ formatNumber(fuelCost) }} MXN</p>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-200 rounded">
            <h3 class="m-0 text-lg font-semibold text-gray-800">Consumo de combustible</h3>
            <p class="m-0 text-xl font-bold text-blue-600">{{ formatNumber(fuelUsed) }} litros</p>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-200 rounded">
            <h3 class="m-0 text-lg font-semibold text-gray-800">Costo de peajes</h3>
            <p class="m-0 text-xl font-bold text-blue-600">${{ formatNumber(route.costs.tagAndCash) }} MXN</p>
        </div>
        <button @click="setModalTolls({ open: true, tolls: route.tolls })"
            class="flex items-center justify-between p-4 rounded bg-blue-500/10 hover:bg-blue-100 transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <h3 class="text-lg font-semibold text-gray-800">Ver información de peajes</h3>
            <Lucide icon="Logs" class="w-8 h-8" />
        </button>
    </div>
</template>