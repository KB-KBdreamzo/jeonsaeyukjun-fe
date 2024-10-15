<template>
    <section class="flex flex-col px-2.5 py-5 mt-10 w-full bg-gray-200 bg-opacity-40 rounded-[30px]">
        <header class="flex gap-10 justify-between items-center px-2.5 w-full text-xl font-semibold leading-tight text-zinc-800">
            <h2 class="self-stretch my-auto w-[152px]">임차주택의 표시</h2>
            <img loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/418aa1bebc961b980e6f98c975a408ee93fde73ca20753cda4df25836b836210?apiKey=d111ac40a5bb4ce79c76d09fec0749df&"
            class="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
            alt=""
            @click="openPropertyDescriptionModal"
            style="cursor: pointer;"
            />
            <PropertyDescriptionModal v-if="isPropertyDescriptionModalOpen" @close="closePropertyDescriptionModal" />

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
                disabled
            />

            <!-- 상단에 입력받지 못하게 disabled 설정을 하고 하단에 주소 입력 API 추가 -->
            <!-- 주소지 및 상세주소 입력 부분 -->
			<div class="flex flex-col mt-5 w-full">
                <div class="mb-4 relative">
                    <label class="block text-base font-bold leading-none text-gray-400 uppercase">주소지</label>
                    <div class="flex items-center gap-2.5 border border-gray-300 rounded-lg p-2 mt-2.5 h-10">
                        <input
                            type="text"
                            v-model="addressInput"
                            placeholder="예) 역삼 푸르지오"
                            class="flex-1 h-full px-4 text-sm font-medium leading-6 text-slate-500 focus:outline-none"
                            @keyup.enter="onSearchClick"
                        />
                        <button class="flex justify-center items-center" @click="clearInput">     
                            <img src="/src/assets/cancel.png" class="h-4 w-4">
                        </button>
                        <button class="flex justify-center items-center" @click="onSearchClick">
                            <img src="/src/assets/search.png" class="h-6 w-6">
                        </button>
                    </div>

                    <!-- 절대 위치를 사용해 ul 리스트를 input 바로 아래에 표시 -->
                    <ul
                    v-if="showResults && addressStore.addressResults.length"
                    class="absolute left-0 w-full bg-white border border-gray-300 max-h-48 overflow-y-auto mt-2 z-10"
                    >
                        <li
                            v-for="(result, index) in addressStore.addressResults"
                            :key="index"
                            @click="selectAddress(result)"
                            class="p-2 hover:bg-gray-200"
                        >
                            {{ result.jibunAddr }} / {{ result.roadAddr }}
                        </li>
                    </ul>
                </div>

                <div class="mb-4">
                    <label class="mb-4 block text-base font-bold leading-none text-gray-400 uppercase">상세주소</label>
                    <input
                    type="text"
                    v-model="detailedAddress"
                    placeholder="동, 호수 입력 (동 없을 경우 호수만 입력)"
                    class="w-full h-10 px-4 text-sm font-medium leading-6 text-slate-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>
        
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
                placeholder="대(대지: 건물이 세워진 땅)"
            />
            <div class="flex overflow-hidden flex-1 shrink gap-10 justify-between items-center self-stretch px-4 py-3.5 my-auto whitespace-nowrap bg-white rounded-xl basis-0 min-h-[50px] mt-2">
                <label for="landArea" class="self-stretch my-auto text-black">면적</label>
                <input
                    id="landArea"
                    type="number"
                    v-model="localLandArea"
                    @input="updateInput('landArea', $event)"
                    class="self-stretch my-auto text-slate-500 bg-transparent"
                    placeholder="m2"
                    step="0.01"
                    min="0"
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
                    type="number"
                    v-model="localBuildingArea"
                    @input="updateInput('buildingArea', $event)"
                    class="self-stretch my-auto text-slate-500 bg-transparent"
                    placeholder="m2"
                    step="0.01"
                    min="0"
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
                    type="number"
                    v-model="localRentalArea"
                    @input="updateInput('rentalArea', $event)"
                    class="self-stretch my-auto text-slate-500 bg-transparent"
                    placeholder="m2"
                    step="0.01"
                    min="0"
                />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import PropertyDescriptionModal from './PropertyDescriptionModal.vue';
import { useAddressStore } from '@/stores/addressStore';

export default defineComponent({
    name: 'PropertyDescription',
    components: {
        PropertyDescriptionModal
    },
    props: {
        isPropertyDescriptionModalOpen: {
            type: Boolean,
            default: false
        },
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
    setup(props, { emit }) {

        const addressStore = useAddressStore();
		const addressInput = ref('');
		const showResults = ref(false);
		const detailedAddress = ref('');
        const isPropertyDescriptionModalOpen = ref(false);

        const localPropertyAddress = ref(props.propertyAddress);
        const localLandUsage = ref(props.landUsage);
        const localLandArea = ref(props.landArea);
        const localBuildingStructure = ref(props.buildingStructure);
        const localBuildingArea = ref(props.buildingArea);
        const localRentalPortion = ref(props.rentalPortion);
        const localRentalArea = ref(props.rentalArea);

        const onSearchClick = async () => {
			if (addressInput.value) {
				await addressStore.fetchAddress(addressInput.value);
				showResults.value = true;
			}
		};

        const clearInput = () => {
			addressInput.value = '';
			addressStore.addressResults = [];
			showResults.value = false;
		};

        const selectAddress = (result) => {
			addressStore.selectAddress(result);
			addressInput.value = result.roadAddr;
			showResults.value = false;
		};

        const updateInput = (type: string, event: Event) => {
            const input = (event.target as HTMLInputElement).value;
            emit('update-property', type, input);
        };

        const openPropertyDescriptionModal = () => {
            isPropertyDescriptionModalOpen.value = true;
        }

        const closePropertyDescriptionModal = () => {
            isPropertyDescriptionModalOpen.value = false;
        }

        // detailedAddress와 addressInput의 변화를 감지하여 localLandlordAddress 업데이트
		watch([addressInput, detailedAddress], ([newAddressInput, newDetailedAddress]) => {
			localPropertyAddress.value = `${newAddressInput} ${newDetailedAddress}`.trim();

			// 업데이트된 주소 값을 부모 컴포넌트로 전달
			emit('update-input', 'landlordAddress', localPropertyAddress.value);
		});
        watch(() => props.propertyAddress, (newValue) => {
            localPropertyAddress.value = newValue;
        });
        watch(() => props.landUsage, (newValue) => {
            localLandUsage.value = newValue;
        });
        watch(() => props.landArea, (newValue) => {
            localLandArea.value = newValue;
        });
        watch(() => props.buildingStructure, (newValue) => {
            localBuildingStructure.value = newValue;
        });
        watch(() => props.buildingArea, (newValue) => {
            localBuildingArea.value = newValue;
        });
        watch(() => props.rentalPortion, (newValue) => {
            localRentalPortion.value = newValue;
        });
        watch(() => props.rentalArea, (newValue) => {
            localRentalArea.value = newValue;
        });

        return {
            addressStore,
            addressInput,
            showResults,
            detailedAddress,
            isPropertyDescriptionModalOpen,
            localPropertyAddress,
            localLandUsage,
            localLandArea,
            localBuildingStructure,
            localBuildingArea,
            localRentalPortion,
            localRentalArea,
            onSearchClick,
            clearInput,
            selectAddress,
            openPropertyDescriptionModal,
            closePropertyDescriptionModal,
            updateInput
        };
    }
});
</script>