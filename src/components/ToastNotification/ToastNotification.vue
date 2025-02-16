<template>
  <div
    class="fixed top-0 left-1/2 transform -translate-x-1/2 p-4 transition-opacity w-screen sm:w-fit duration-300 z-[2147483647] flex flex-col gap-3">
    <!-- Usamos transition-group para controlar las animaciones -->
    <transition-group name="toast" tag="div" class="flex flex-col gap-3 justify-end items-center max-w-[550px]">
      <div v-for="(toast, index) in toastMessages" :key="toast.id" ref="container" :class="[
        'p-2 rounded-xl shadow-lg transition-opacity duration-300 flex items-center gap-2 min-w-[350px] w-full sm:w-fit max-w-[550px]',
        getToastTypeClass(toast.tipo),  // Aplicar la clase basada en el tipo de mensaje
        toast.moveClass
      ]">
        <!-- Ícono dinámico según el tipo de mensaje -->
        <component :is="getIconComponent(toast.tipo)" class="w-6 h-6" />

        <!-- Mensaje -->
        <p class="break-words !max-w-[calc(100%-70px)] text-center w-full">{{ toast.message }}</p>

        <!-- Botón de cierre si el mensaje es persistente -->
        <button v-if="toast.persistente" @click="removeToast(toast.id)"
          class="ml-auto text-2xl font-bold text-gray-600 hover:text-gray-900">
          <component :is="X" class="w-6 h-6" />
        </button>
      </div>
    </transition-group>
  </div>

  <slot></slot>
</template>

<script setup lang="ts">
import { ref, nextTick, provide } from 'vue'
import { Info, AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-vue-next'

interface Toast {
  id: string;
  message: string;
  tipo: 'info' | 'error' | 'warning' | 'success';
  persistente: boolean;
  moveClass: string;
}

const toastMessages = ref<Toast[]>([])

const generateId = (): string => '_' + Math.random().toString(36).substr(2, 9)

const showToast = ({ message, tipo = 'info', duration = 3000, persistente = false }: { message: string; tipo?: 'info' | 'error' | 'warning' | 'success'; duration?: number; persistente?: boolean }) => {
  const toast: Toast = {
    id: generateId(),
    message,
    tipo,
    persistente,
    moveClass: 'transition-all duration-500 ease-in-out',
  }

  toastMessages.value.push(toast)

  if (!persistente) {
    setTimeout(() => {
      const index = toastMessages.value.findIndex(t => t.id === toast.id)
      if (index !== -1) {
        toastMessages.value.splice(index, 1)
      }
    }, duration)
  }
}

const removeToast = (id: string) => {
  const index = toastMessages.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toastMessages.value.splice(index, 1)
  }
}

provide('showToast', showToast)

const getToastTypeClass = (tipo: 'info' | 'error' | 'warning' | 'success'): string => {
  switch (tipo) {
    case 'error':
      return 'bg-red-100 text-red-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

const getIconComponent = (tipo: 'info' | 'error' | 'warning' | 'success') => {
  switch (tipo) {
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'success':
      return CheckCircle
    case 'info':
    default:
      return Info
  }
}
</script>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
</style>
