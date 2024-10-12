<template>
    <section class="flex flex-col px-2.5 py-5 mt-10 w-full bg-gray-200 bg-opacity-40 rounded-[30px]">
        <header class="flex gap-10 justify-between items-center px-2.5 w-full text-xl font-semibold leading-tight text-zinc-800">
            <h2 class="self-stretch my-auto">임대차계약의 내용</h2>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/418aa1bebc961b980e6f98c975a408ee93fde73ca20753cda4df25836b836210?apiKey=d111ac40a5bb4ce79c76d09fec0749df&" alt="" class="object-contain shrink-0 self-stretch my-auto w-8 aspect-square" />
        </header>
        <div class="flex flex-col px-1.5 mt-6 w-full">
            <h3 class="flex flex-col px-1.5 w-full text-base font-bold leading-none text-gray-400 uppercase">
                임대차 전세 계약기간
            </h3>
            <div class="flex flex-col mt-2.5 w-full whitespace-nowrap">
                <DateInput 
                label="부터" 
                :date="leaseStartDate" 
                @update:date="updateLeaseStartDate" 
                />
                <DateInput 
                label="까지" 
                :date="leaseEndDate" 
                @update:date="updateLeaseEndDate" 
                />
            </div>
            <div class="flex flex-col w-full min-h-[72px]">
				<label for="depositAmount" class="text-base font-bold leading-none text-gray-400 uppercase">보증금</label>
				<input
					type="number"
					id="depositAmount"
					v-model="depositAmount"
					@input="updateAdditionalInfo('deposit', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="원"
                    step="1"
                    min="0"
				/>
			</div>
			<div class="flex gap-5 items-start mt-5 w-full">
				<div class="flex flex-col flex-1 shrink w-full basis-0 min-h-[72px] min-w-[240px]">
					<label for="unpaidNationalAndLocalTax" class="text-base font-bold leading-none text-gray-400 uppercase">미납 국세/지방세</label>
					<input
						type="text"
						id="unpaidNationalAndLocalTax"
						v-model="unpaidNationalAndLocalTax"
						@input="updateAdditionalInfo('unpaid', $event)"
						class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
						placeholder="없음 (임대인 서명 또는 날인)"
					/>
				</div>
			</div>
            <div class="flex gap-5 items-start mt-5 w-full">
				<div class="flex flex-col flex-1 shrink w-full basis-0 min-h-[72px] min-w-[240px]">
					<label for="priorityConfirmedDateDetails" class="text-base font-bold leading-none text-gray-400 uppercase">선순위 확정일자 현황</label>
					<input
						type="text"
						id="priorityConfirmedDateDetails"
						v-model="priorityConfirmedDateDetails"
						@input="updateAdditionalInfo('priority', $event)"
						class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
						placeholder="없음 (임대인 서명 또는 날인)"
					/>
				</div>
			</div>
        </div>
    </section>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import DateInput from './DateInput.vue';
  
  export default defineComponent({
    name: 'LeaseContractContent',
    components: {
      DateInput
    },
    setup(props, { emit }) {
        // 임대차 계약 기간 상태 관리
        const leaseStartDate = ref(''); // 초기 날짜 형식에 맞게 설정
        const leaseEndDate = ref(''); // 초기 날짜 형식에 맞게 설정
        const depositAmount = ref('');
        const unpaidNationalAndLocalTax = ref('');
        const priorityConfirmedDateDetails = ref('');

        // 날짜 업데이트 함수
        const updateLeaseStartDate = (date: string) => {
            leaseStartDate.value = date;
            emit('update-lease-dates', {type: 'leaseStartDate', value: leaseStartDate.value}); // 부모에게 업데이트
        };

        const updateLeaseEndDate = (date: string) => {
            leaseEndDate.value = date;
            emit('update-lease-dates', {type: 'leaseEndDate', value: leaseEndDate.value}); // 부모에게 업데이트
        };

        const updateAdditionalInfo = (type: string, event: Event) => {
            const value = (event.target as HTMLInputElement).value;
            if (type === 'deposit') {
                depositAmount.value = value;
                emit('update-deposit', depositAmount.value); // 'update-deposit' 이벤트로 개별 전달
            } else if (type === 'unpaid') {
                unpaidNationalAndLocalTax.value = value === '' ? '없음 (임대인 서명 또는 날인)' : value;
                emit('update-unpaid', unpaidNationalAndLocalTax.value); // 'update-unpaid' 이벤트로 개별 전달
            } else if (type === 'priority') {
                priorityConfirmedDateDetails.value = value === '' ? '없음 (임대인 서명 또는 날인)' : value;
                emit('update-priority', priorityConfirmedDateDetails.value); // 'update-priority' 이벤트로 개별 전달
            }
        }

        return {
            leaseStartDate,
            leaseEndDate,
            depositAmount,
            unpaidNationalAndLocalTax,
            priorityConfirmedDateDetails,
            updateLeaseStartDate,
            updateLeaseEndDate,
            updateAdditionalInfo
            // 다른 필요한 상태 및 함수 추가
        };
    },
});
</script>