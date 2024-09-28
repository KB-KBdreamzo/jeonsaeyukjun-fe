<template>
    <main class="flex overflow-hidden flex-row items-start bg-white">
        <!-- Left Side: 계약서 작성 섹션 -->
        <section class="flex flex-col justify-between items-center p-5 max-w-full bg-white shadow-[4px_0px_15px_rgba(0,0,0,0.15)] w-[480px]">
            <div class="flex flex-col flex-1 max-w-full w-[378px]">
                <header class="flex gap-10 items-center py-8 w-full font-bold">
                    <h1 class="self-stretch my-auto text-5xl tracking-tighter leading-none text-zinc-800 max-md:text-4xl whitespace-nowrap">
                        계약서 작성
                    </h1>
                    <button class="gap-3 self-stretch px-6 py-4 my-auto text-base leading-none text-center text-gray-50 whitespace-nowrap bg-neutral-900 rounded-[90px] max-md:px-5">
                        저장하기
                    </button>
                </header>
                <!-- 입력받은 이름을 LandlordTenantInfo로 전달 -->
                <LandlordTenantInfo 
                    title="집주인 및 세입자"
                    :landlordName="landlordName"
                    :tenantName="tenantName"
                    @update-input="handleInput"
                />
                <PropertyDescription 
                    title="부동산의 표시" 
                    @update-property="handlePropertyInput"
                />
                <ContractSection title="임대차계약의 내용" />
                <ContractSection title="특약 사항" />
            </div>
        </section>
        
        <!-- Right Side: Contract Display 섹션 -->
        <section class="w-full p-4 border border-gray-300">
            <!-- LandlordTenantInfo의 이름을 ContractDisplay에 전달 -->
            <ContractDisplay 
                :landlordName="landlordName" 
                :tenantName="tenantName" 
                :propertyAddress="propertyAddress"
                :landUsage="landUsage"
                :landArea="landArea"
                :buildingStructure="buildingStructure"
                :buildingArea="buildingArea"
                :rentalPortion="rentalPortion"
                :rentalArea="rentalArea"
            />
        </section>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContractSection from '../components/ContractSection.vue';
import LandlordTenantInfo from '@/components/LandlordTenantInfo.vue';
import PropertyDescription from '@/components/PropertyDescription.vue';
import ContractDisplay from '@/components/ContractDisplay.vue';

export default defineComponent({
    name: 'ContractCreation',
    components: {
        ContractDisplay,
        LandlordTenantInfo,
        PropertyDescription,
        ContractSection,
    },
    data() {
        return {
            landlordName: '',
            tenantName: '',
            propertyAddress: '', // 추가된 부분
            landUsage: '', // 추가된 부분
            landArea: '', // 추가된 부분
            buildingStructure: '', // 추가된 부분
            buildingArea: '', // 추가된 부분
            rentalPortion: '', // 추가된 부분
            rentalArea: '' // 추가된 부분
        };
    },
    methods: {
        handleInput(type, value) {
            if (type === 'landlord') {
                this.landlordName = value;
            } else if (type === 'tenant') {
                this.tenantName = value;
            }
        },
        handlePropertyInput(type, value) { // 추가된 부분
            if (type === 'propertyAddress') {
                this.propertyAddress = value;
            } else if (type === 'landUsage') {
                this.landUsage = value;
            } else if (type === 'landArea') {
                this.landArea = value;
            } else if (type === 'buildingStructure') {
                this.buildingStructure = value;
            } else if (type === 'buildingArea') {
                this.buildingArea = value;
            } else if (type === 'rentalPortion') {
                this.rentalPortion = value;
            } else if (type === 'rentalArea') {
                this.rentalArea = value;
            }
        }
    }
});
</script>
