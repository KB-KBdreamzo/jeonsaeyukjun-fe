<template>
    <section class="flex flex-col px-2.5 py-5 mt-10 w-full bg-gray-200 bg-opacity-40 rounded-[30px]">
        <header class="flex gap-10 justify-between items-center px-2.5 w-full text-xl font-semibold leading-tight text-zinc-800">
            <h2 class="self-stretch my-auto">임대차계약의 내용</h2>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/418aa1bebc961b980e6f98c975a408ee93fde73ca20753cda4df25836b836210?apiKey=d111ac40a5bb4ce79c76d09fec0749df&" alt="" class="object-contain shrink-0 self-stretch my-auto w-8 aspect-square" />
        </header>
        <div class="flex flex-col px-1.5 mt-6 w-full">
            <!-- <h3 class="flex flex-col px-1.5 w-full text-base font-bold leading-none text-gray-400 uppercase">
                임대차 전세 계약기간
            </h3> -->

            <!-- 입금계좌 -->
            <div class="flex flex-col w-full min-h-[72px] mt-5">
				<label for="paymentAccount" class="text-base font-bold leading-none text-gray-400 uppercase">입금계좌</label>
				<input
					type="text"
					id="paymentAccount"
					v-model="paymentAccount"
					@input="updateFinancialInfo('paymentAccount', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="입금계좌"
				/>
			</div>

            <!-- 계약금 -->
            <div class="flex flex-col w-full min-h-[72px] mt-5">
				<label for="downPayment" class="text-base font-bold leading-none text-gray-400 uppercase">계약금</label>
				<input
					type="text"
					id="downPayment"
					v-model="downPayment"
					@input="updateFinancialInfo('downPayment', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="계약금"
				/>
			</div>

            <!-- 중도금 -->
            <div class="flex flex-col w-full min-h-[72px] mt-5">
				<label for="interimPayment" class="text-base font-bold leading-none text-gray-400 uppercase">중도금</label>
				<input
					type="text"
					id="interimPayment"
					v-model="interimPayment"
					@input="updateFinancialInfo('interimPayment', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="중도금"
				/>
			</div>

            <!-- 중도금 지불 날짜 -->
            <div class="flex flex-col mt-2.5 w-full whitespace-nowrap">
                <label for="interimPaymentDate" class="text-base font-bold leading-none text-gray-400 uppercase">중도금 지불 날짜</label>
                <DateInput 
                label="" 
                :date="interimPaymentDate" 
                @update:date="updateInterimPaymentDate" 
                />
            </div>

            <!-- 잔금 -->
            <div class="flex flex-col w-full min-h-[72px] mt-5">
				<label for="finalPayment" class="text-base font-bold leading-none text-gray-400 uppercase">잔금</label>
				<input
					type="text"
					id="finalPayment"
					v-model="finalPayment"
					@input="updateFinancialInfo('finalPayment', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="잔금"
				/>
			</div>

            <!-- 잔금 지불 날짜 -->
            <div class="flex flex-col mt-2.5 w-full whitespace-nowrap">
                <label for="finalPaymentDate" class="text-base font-bold leading-none text-gray-400 uppercase">잔금 지불 날짜</label>
                <DateInput 
                label="" 
                :date="finalPaymentDate" 
                @update:date="updateFinalPaymentDate"
                />
            </div>

            <!-- 관리비 -->
            <div class="flex flex-col w-full min-h-[72px] mt-5">
				<label for="managementFee" class="text-base font-bold leading-none text-gray-400 uppercase">관리비</label>
				<input
					type="text"
					id="managementFee"
					v-model="managementFee"
					@input="updateFinancialInfo('managementFee', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="관리비"
				/>
			</div>

            <!-- 수리할 내용 -->
            <div class="flex flex-col w-full min-h-[72px] mt-5">
				<label for="repairDetails" class="text-base font-bold leading-none text-gray-400 uppercase">수리할 내용</label>
				<input
                    type="text"
					id="repairDetails"
					v-model="repairDetails"
					@input="updateRepairDetails('repairDetails', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="수리할 내용"
				/>
			</div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DateInput from './DateInput.vue';

export default defineComponent({
    name: 'ContractContent',
    components: {
        DateInput
    },
    setup(props, { emit }) {
        // 상태 관리
        const paymentAccount = ref('');
        const downPayment = ref('');
        const interimPayment = ref('');
        const interimPaymentDate = ref('');
        const finalPayment = ref('');
        const finalPaymentDate = ref('');
        const managementFee = ref('');
        const repairDetails = ref('');

        // 날짜 업데이트 함수
        const updateInterimPaymentDate = (date: string) => {
            interimPaymentDate.value = date;
            emit('update-payment-dates', { type: 'interimPaymentDate', value: interimPaymentDate.value });
        };

        const updateFinalPaymentDate = (date: string) => {
            finalPaymentDate.value = date;
            emit('update-payment-dates', { type: 'finalPaymentDate', value: finalPaymentDate.value });
        };

        const updateFinancialDate = (type: string, date: string) => {
            switch (type) {
                case 'interimPaymentDate':
                    interimPayment.value = date;
                    emit('update-interim-payment-date', {type: 'interimPaymentDate', value: interimPaymentDate})
                    break;
                case 'finalPaymentDate':
                    finalPaymentDate.value = date;
                    emit('update-final-payment-date', {type: 'finalPaymentDate', value: finalPaymentDate})
                    break;
            }
        }

        // 추가 정보 업데이트 함수
        const updateFinancialInfo = (type: string, event: Event) => {
            const value = (event.target as HTMLInputElement).value;
            switch (type) {
                case 'paymentAccount':
                    paymentAccount.value = value;
                    emit('update-payment-account', {type: 'paymentAccount', value: paymentAccount});
                    break;
                case 'downPayment':
                    downPayment.value = value;
                    emit('update-down-payment', {type: 'downPayment', value: downPayment});
                    break;
                case 'interimPayment':
                    interimPayment.value = value;
                    emit('update-interim-payment', {type: 'interimPayment', value: interimPayment});
                    break;
                case 'finalPayment':
                    finalPayment.value = value;
                    emit('update-final-payment', {type: 'finalPayment', value: finalPayment});
                    break;
                case 'managementFee':
                    managementFee.value = value;
                    emit('update-management-fee', {type: 'managementFee', value: managementFee});
                    break;
            }
        }
        
        const updateRepairDetails = (type: string, event: Event) => {
            const value = (event.target as HTMLInputElement).value;
            if (type === 'repairDetails') {
                repairDetails.value = value;
                emit('update-repair-details', {type: 'repairDetails', value: repairDetails});
            }
        }
        ;

        return {
            paymentAccount,
            downPayment,
            interimPayment,
            interimPaymentDate,
            finalPayment,
            finalPaymentDate,
            managementFee,
            repairDetails,
            updateInterimPaymentDate,
            updateFinalPaymentDate,
            updateFinancialDate,
            updateFinancialInfo,
            updateRepairDetails
        };
    }
});
</script>
