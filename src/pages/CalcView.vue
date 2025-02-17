<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Form } from '@/components/Calc'
import Lucide from '@/components/Base/Lucide'
import Tippy from '@/components/Base/Tippy'

const icon1 = ref<HTMLElement | null>(null)
const icon2 = ref<HTMLElement | null>(null)

onMounted(() => {
    setTimeout(() => {
        icon2.value?.classList.remove('2xl:!w-0')
        icon1.value?.classList.remove('!w-0')
    }, 1000)
})

</script>

<template>
    <div class="flex-col items-center justify-center min-h-screen pt-20 sm:p-10 xl:flex max-w-screen">
        <div class="container relative grid grid-cols-12 p-4 xl:shadow-lg bg-slate-100 rounded-xl gap-y-4">
            <div ref="icon1"
                class="animate-despawn overflow-hidden pointer-events-none 2xl:pointer-events-auto 2xl:!w-[64px] 2xl:animate-spawn absolute -rotate-[30deg] -left-[3rem] -top-16 transition-all duration-300 hover:rotate-0 hover:-top-[4.5rem] cursor-pointer !w-0 ">
                <Tippy content="Go to portfolio" placement="right" as="a" href="https://eduardoar.onrender.com/">
                    <Lucide icon="MapPin" class="w-16 h-16 stroke-red-500" />
                </Tippy>
            </div>

            <div class="flex flex-row items-center justify-start col-span-12 p-2 pt-0 border-b border-gray-300">
                <div class="relative flex flex-row justify-between w-full col-span-12 text-3xl font-bold">
                    <div class="flex flex-row items-center">
                        <div class="overflow-hidden animate-expand 2xl:animate-collapse w-fit 2xl:!w-0" ref="icon2">
                            <Tippy content="Go to portfolio" placement="right" as="a"
                                href="https://eduardoar.onrender.com/">
                                <Lucide icon="MapPin"
                                    class="w-16 h-16 stroke-red-500 -rotate-[30deg] transition-all duration-300 hover:rotate-0 cursor-pointer" />
                            </Tippy>
                        </div>
                        <h1 class="pl-2 text-xl border-l 2xl:border-none border-slate-300 md:text-3xl">
                            <span class="mr-1 text-blue-500">Toll</span> Calculator
                        </h1>
                    </div>
                    <div class="flex flex-col items-start justify-center">
                        <div class="text-xs text-gray-500">Developed</div>
                        <div class="text-xs text-gray-400">By Edurduar</div>
                    </div>
                </div>
            </div>

            <Form />

        </div>
    </div>

</template>