<script setup>
import { Dialog } from "@/components/Base/Headless";
import LoadingIcon from '@/components/Base/LoadingIcon'
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { ref } from "vue";

const props = defineProps({
    ModalTolls: Boolean,
    setModalTolls: Function,
    tolls: Object
})

</script>

<template>
    <Dialog size="lg" :open="ModalTolls" @close="() => {
        setModalTolls({ open: false })
    }">
        <Dialog.Panel>
            <div class="p-5 text-center max-h-[calc(100vh-250px)] overflow-y-auto">
                <div class="mt-5 text-3xl dark:text-slate-200">Información de Casetas y Tramos</div>
                <div class="mt-2 text-slate-500 dark:text-slate-400">
                    <div v-for="toll in tolls" :key="toll.id" class="px-4 py-2 mb-3 border rounded shadow-sm bg-light">
                        <div class="text-left fw-bold">
                            {{ toll.type === 'ticketSystem2' ? `Tramo: ${toll.start.name} ➡ ${toll.end.name}` : `Caseta:
                            ${toll.name || 'Información no disponible'}` }}
                        </div>
                        <div v-if="toll.type === 'ticketSystem2'" class="text-left text-muted">
                            Carretera: {{ toll.start.road }} ({{ toll.start.state }}, {{ toll.start.country }})
                        </div>
                        <div class="flex flex-col text-left">
                            <div class="mb-1 text-blue-500">
                                Costo Efectivo: {{ toll.cashCost ? `${toll.cashCost} ${toll.currency}` : 'N/A' }}
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-success">
                                    Costo TAG: {{ toll.tagPriCost ? `${toll.tagPriCost} ${toll.currency}` : 'N/A' }}
                                </span>
                                <span class="text-right text-muted fst-italic">
                                    {{ toll.type === 'ticketSystem2' ? `Distancia:
                                    ${Math.round(toll.end.arrival.distance / 1000)} km`
                                        : 'Información adicional: No aplica' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-5 pb-8 mt-5 space-x-8 text-center">
                <Button type="button" variant="outline-secondary" @click="setModalTolls({ open: false })"
                    class="w-24 mr-1 dark:text-slate-200">
                    Cerrar
                </Button>
            </div>
        </Dialog.Panel>
    </Dialog>
</template>
