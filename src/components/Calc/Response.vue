<script setup>
import { defineProps, ref, watch } from 'vue';
import OptionsRoutes from './components/OptionsRoutes.vue';
import OptionRoute from './components/OptionRoute.vue';
import MapView from './components/MapView.vue';

const props = defineProps({
    data: {
        type: Object || null,
        required: true
    },
});

const activeRoute = ref(props.data.routes[0]);
const showRoute = (route) => {
    activeRoute.value = route;
}

watch(() => props.data.routes, (newValue) => {
    activeRoute.value = newValue[0];
});

</script>

<template>
    <OptionsRoutes :routes="data.routes" :activeRoute="activeRoute" :showRoute="showRoute" />
    <MapView :route="activeRoute" :summary="data.summary" :extraData="data.extraData" />
    <OptionRoute :route="activeRoute" :summary="data.summary" />
</template>