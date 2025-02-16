<script setup>
import Lucide from '@/components/Base/Lucide'

const props = defineProps({
    deleteEndPoint: {
        type: Function,
        required: true
    },
    deleteStartPoint: {
        type: Function,
        required: true
    },
    startPoint: {
        type: Object,
        required: true
    },
    endPoint: {
        type: Object,
        required: true
    },
    waypoints: {
        type: Array,
        required: true
    }
});

function deleteWaypoint(index) {
    props.waypoints.splice(index, 1)
}

</script>
<template>
    <div class="col-span-4 xl:col-span-1">
        <div class="flex flex-col w-full h-full space-y-4">
            <ul id="deliveries-ul"
                class="flex-grow space-y-4 border border-gray-200 p-4 rounded-lgoverflow-y-auto min-h-[290px] max-h-[290px] h-full bg-blue-500/10 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                <template v-if="startPoint && startPoint.address">
                    <li class="flex flex-row items-center justify-start p-2 rounded-lg bg-blue-500/20">
                        <span class="text-sm font-medium text-gray-700">{{ startPoint.address }}</span>
                    </li>
                </template>
                <template v-if="waypoints && waypoints.length > 0">
                    <template v-for="(waypoint, index) in waypoints" :key="index">
                        <li
                            :class="['flex flex-row items-center justify-between p-2 rounded-lg', waypoints.length >= 3 ? 'bg-amber-500/50' : 'bg-yellow-500/20']">
                            <span class="text-sm font-medium text-gray-700">{{ waypoint.address }}</span>
                            <button type="button" @click="deleteWaypoint(index)"
                                class="flex items-center justify-center w-6 h-6 text-gray-700 rounded-full hover:bg-red-500 hover:text-white focus:outline-none">
                                <Lucide icon="X" class="w-8 h-8" />
                            </button>
                        </li>
                    </template>
                </template>
                <template v-if="endPoint && endPoint.address">
                    <li class="flex flex-row items-center justify-start p-2 rounded-lg bg-green-500/20">
                        <span class="text-sm font-medium text-gray-700">{{ endPoint.address }}</span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
