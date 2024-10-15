<template>
    <section class="flex flex-col px-2.5 py-5 mt-10 w-full bg-gray-200 bg-opacity-40 rounded-[30px]">
        <header class="flex gap-10 justify-between items-center px-2.5 w-full text-xl font-semibold leading-tight text-zinc-800">
            <h2 class="self-stretch my-auto">특약 사항</h2>
            <img 
                loading="lazy" 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/418aa1bebc961b980e6f98c975a408ee93fde73ca20753cda4df25836b836210?apiKey=d111ac40a5bb4ce79c76d09fec0749df&" 
                alt="" 
                class="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
                @click="openModal"  
            />
        </header>
        <div class="flex flex-col px-1.5 mt-6 w-full">

            <!-- 동의/미동의 선택 -->
            <div class="flex flex-col w-full mt-5">
                <label class="text-base font-bold leading-none text-gray-400 uppercase">
                    분쟁 발생 시 분쟁조정위원회 조정 신청 (동의/미동의)
                </label>
                <div class="flex gap-5 mt-2.5">
                    <label class="flex items-center text-sm font-medium">
                        <input type="radio" v-model="agreement" value="동의" class="mr-2" />
                        동의
                    </label>
                    <label class="flex items-center text-sm font-medium">
                        <input type="radio" v-model="agreement" value="미동의" class="mr-2" />
                        미동의
                    </label>
                </div>
            </div>

            <!-- 주택 철거 또는 재건축 계획 -->
            <div class="flex flex-col w-full mt-5">
                <label class="text-base font-bold leading-none text-gray-400 uppercase">
                    주택의 철거 또는 재건축에 관한 구체적 계획
                </label>
                <div class="flex gap-5 mt-2.5">
                    <label class="flex items-center text-sm font-medium">
                        <input type="radio" v-model="constructionPlan" value="없음" class="mr-2" />
                        없음
                    </label>
                    <label class="flex items-center text-sm font-medium">
                        <input type="radio" v-model="constructionPlan" value="있음" class="mr-2" />
                        있음
                    </label>
                </div>
                <div v-if="constructionPlan === '있음'" class="flex flex-col mt-4">
                    <label class="text-sm font-medium">공사 시기:</label>
                    <input
                        type="text"
                        v-model="constructionTime"
                        class="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="예: 2024년 1월"
                    />
                    <label class="text-sm font-medium mt-2">소요 기간 (개월):</label>
                    <input
                        type="number"
                        v-model="constructionDuration"
                        class="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="개월 수 입력"
                    />
                </div>
            </div>

            <!-- 상세주소 부여 신청에 대한 소유자 동의 여부 -->
            <div class="flex flex-col w-full mt-5">
                <label class="text-base font-bold leading-none text-gray-400 uppercase">
                    상세주소가 없는 경우 임차인의 상세주소부여 신청에 대한 소유자 동의 여부
                </label>
                <div class="flex gap-5 mt-2.5">
                    <label class="flex items-center text-sm font-medium">
                        <input type="radio" v-model="addressAgreement" value="동의" class="mr-2" />
                        동의
                    </label>
                    <label class="flex items-center text-sm font-medium">
                        <input type="radio" v-model="addressAgreement" value="미동의" class="mr-2" />
                        미동의
                    </label>
                </div>
            </div>

        </div>

        <SpecialContractModal v-if="isModalOpen" @close="closeModal" />
    </section>
</template>

<script setup>
import { ref } from 'vue';
import SpecialContractModal from './SpecialContractModal.vue'; 

// 상태 관리
const agreement = ref('');
const constructionPlan = ref('');
const constructionTime = ref('');
const constructionDuration = ref('');
const addressAgreement = ref('');
const isModalOpen = ref(false); 

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>
