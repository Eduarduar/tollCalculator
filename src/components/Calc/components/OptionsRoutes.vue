<script setup>
import Lucide from '@/components/Base/Lucide';
import { ref } from 'vue';

const props = defineProps({
    routes: {
        type: Object || null,
        required: true
    },
    activeRoute: {
        type: Object || null,
        required: true
    },
    showRoute: {
        type: Function,
        required: true
    }
});

</script>

<template>
    <div class="flex flex-col col-span-12 gap-2" id="headerResponse">
        <h2 class="flex flex-col gap-1 mb-0">
            <span class="flex flex-row items-center justify-start gap-1 mb-0 text-2xl font-bold text-blue-600">
                Rutas
                <Lucide icon="ListChecks" class="w-8 h-8" />
            </span>
            <span class="flex items-center mb-0 text-sm font-semibold text-gray-500">
                (Selecciona una
                ruta para ver la información)
            </span>
        </h2>
        <div class="flex flex-row gap-4">
            <template v-for="(route, index) in routes" :key="index">
                <div @click="showRoute(route)"
                    :class="['flex flex-col rounded px-6 py-2 transition-all ease-in-out duration-300 transform select-none hover:bg-blue-500/10 cursor-pointer ', route === activeRoute ? 'bg-blue-500/20 scale-110' : 'bg-gray-500/20 hover:scale-105']"
                    id="route-0">
                    Ruta {{ index + 1 }}
                </div>
            </template>
        </div>
    </div>
</template>