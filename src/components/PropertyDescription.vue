<template>
    <section class="flex flex-col px-2.5 py-5 mt-10 w-full bg-gray-200 bg-opacity-40 rounded-[30px]">
        <header class="flex gap-10 justify-between items-center px-2.5 w-full text-xl font-semibold leading-tight text-zinc-800">
            <h2 class="self-stretch my-auto w-[152px]">임차주택의 표시</h2>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/418aa1bebc961b980e6f98c975a408ee93fde73ca20753cda4df25836b836210?apiKey=d111ac40a5bb4ce79c76d09fec0749df&" class="object-contain shrink-0 self-stretch my-auto w-8 aspect-square" alt="" />
        </header>
        <div class="flex flex-col px-1.5 mt-6 w-full">
            <label for="propertyAddress" class="w-full text-base font-bold leading-none text-gray-400 uppercase whitespace-nowrap">
                소재지
            </label>
            <input
                id="propertyAddress"
                type="text"
                v-model="localPropertyAddress"
                @input="updateInput('propertyAddress', $event)"
                class="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-4 py-3.5 my-auto w-full bg-white rounded-xl min-h-[50px] min-w-[240px]"
                placeholder="도로명 주소를 입력해주세요"
            />
        </div>
        <div class="flex flex-col mt-6 w-full">
            <label for="landUsage" class="text-base font-bold leading-none text-gray-400 uppercase">
                토지 용도
            </label>
            <input
                id="landUsage"
                type="text"
                v-model="localLandUsage"
                @input="updateInput('landUsage', $event)"
                class="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-4 py-3.5 my-auto bg-white rounded-xl min-h-[50px] text-slate-500 mt-2"
                placeholder="대"
            />
            <div class="flex overflow-hidden flex-1 shrink gap-10 justify-between items-center self-stretch px-4 py-3.5 my-auto whitespace-nowrap bg-white rounded-xl basis-0 min-h-[50px] mt-2">
                <label for="landArea" class="self-stretch my-auto text-black">면적</label>
                <input
                    id="landArea"
                    type="text"
                    v-model="localLandArea"
                    @input="updateInput('landArea', $event)"
                    class="self-stretch my-auto text-slate-500 bg-transparent"
                    placeholder="m2"
                />
            </div>
        </div>
        <div class="flex flex-col px-1.5 mt-6 w-full">
            <label for="buildingStructure" class="text-base font-bold leading-none text-gray-400 uppercase">
                건물 구조 및 용도
            </label>
            <input
                id="buildingStructure"
                type="text"
                v-model="localBuildingStructure"
                @input="updateInput('buildingStructure', $event)"
                class="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-4 py-3.5 my-auto bg-white rounded-xl min-h-[50px] text-slate-500 mt-2"
                placeholder="다세대 주택"
            />
            <div class="flex overflow-hidden flex-1 shrink gap-10 justify-between items-center self-stretch px-4 py-3.5 my-auto whitespace-nowrap bg-white rounded-xl basis-0 min-h-[50px] mt-2">
                <label for="buildingArea" class="self-stretch my-auto text-black">면적</label>
                <input
                    id="buildingArea"
                    type="text"
                    v-model="localBuildingArea"
                    @input="updateInput('buildingArea', $event)"
                    class="self-stretch my-auto text-slate-500 bg-transparent"
                    placeholder="m2"
                />
            </div>
        </div>
        <div class="flex flex-col px-1.5 mt-6 w-full">
            <label for="rentalPortion" class="text-base font-bold leading-none text-gray-400 uppercase">
                임대할 부분
            </label>
            <input
                id="rentalPortion"
                type="text"
                v-model="localRentalPortion"
                @input="updateInput('rentalPortion', $event)"
                class="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-4 py-3.5 my-auto bg-white rounded-xl min-h-[50px] text-slate-500 mt-2"
                placeholder="2층 203호"
            />
            <div class="flex overflow-hidden flex-1 shrink gap-10 justify-between items-center self-stretch px-4 py-3.5 my-auto whitespace-nowrap bg-white rounded-xl basis-0 min-h-[50px] mt-2">
                <label for="rentalArea" class="self-stretch my-auto text-black">면적</label>
                <input
                    id="rentalArea"
                    type="text"
                    v-model="localRentalArea"
                    @input="updateInput('rentalArea', $event)"
                    class="self-stretch my-auto text-slate-500 bg-transparent"
                    placeholder="m2"
                />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PropertyDescription',
    props: {
        propertyAddress: {
            type: String,
            default: ''
        },
        landUsage: {
            type: String,
            default: ''
        },
        landArea: {
            type: String,
            default: ''
        },
        buildingStructure: {
            type: String,
            default: ''
        },
        buildingArea: {
            type: String,
            default: ''
        },
        rentalPortion: {
            type: String,
            default: ''
        },
        rentalArea: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            localPropertyAddress: this.propertyAddress,
            localLandUsage: this.landUsage,
            localLandArea: this.landArea,
            localBuildingStructure: this.buildingStructure,
            localBuildingArea: this.buildingArea,
            localRentalPortion: this.rentalPortion,
            localRentalArea: this.rentalArea
        };
    },
    methods: {
        updateInput(type, event) {
            const input = event.target.value;
            this.$emit('update-property', type, input);
        }
    },
    watch: {
        propertyAddress(newValue) {
            this.localPropertyAddress = newValue;
        },
        landUsage(newValue) {
            this.localLandUsage = newValue;
        },
        landArea(newValue) {
            this.localLandArea = newValue;
        },
        buildingStructure(newValue) {
            this.localBuildingStructure = newValue;
        },
        buildingArea(newValue) {
            this.localBuildingArea = newValue;
        },
        rentalPortion(newValue) {
            this.localRentalPortion = newValue;
        },
        rentalArea(newValue) {
            this.localRentalArea = newValue;
        }
    }
});
</script>
