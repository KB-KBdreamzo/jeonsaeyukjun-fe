<template>
    <section class="flex flex-col px-2.5 py-5 mt-10 w-full bg-gray-200 bg-opacity-40 max-w-[378px] rounded-[30px]">
		<header class="flex gap-10 justify-between items-center px-2.5 w-full text-xl font-semibold leading-tight text-zinc-800">
			<h2 class="self-stretch my-auto">집주인 및 세입자</h2>
		</header>
		<div class="flex flex-col px-2.5 mt-6 w-full whitespace-nowrap">
			<div class="flex flex-col w-full min-h-[72px]">
				<label for="ownerName" class="text-base font-bold leading-none text-gray-400 uppercase">집주인(임대인)</label>
				<input
					type="text"
					id="ownerName"
					v-model="localLandlordName"
					@input="updateInput('landlord', $event)"
					class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
					placeholder="성명"
				/>
			</div>
			<div class="flex gap-5 items-start mt-5 w-full">
				<div class="flex flex-col flex-1 shrink w-full basis-0 min-h-[72px] min-w-[240px]">
					<label for="landlordAddress" class="text-base font-bold leading-none text-gray-400 uppercase">임대인 주소</label>
					<input
						type="text"
						id="landlordAddress"
						v-model="localLandlordAddress"
						@input="updateInput('landlordAddress', $event)"
						class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
						placeholder="주소"
					/>
				</div>
				<div v-if="isModalVisible" class="modal">
					<div class="modal-content">
						<h3>상세 주소 선택</h3>
						<ul>
							<li v-for="(address, index) in searchResults" :key="index">
								<button @click="selectAddress(address, selectedType)">{{ address }}</button>
							</li>
						</ul>
						<button @click="closeModal">닫기</button>
					</div>
				</div>
			</div>
			<div class="flex gap-5 items-start mt-5 w-full">
				<div class="flex flex-col flex-1 shrink w-full basis-0 min-h-[72px] min-w-[240px]">
					<label for="landlordResidentId" class="text-base font-bold leading-none text-gray-400 uppercase">임대인 주민등록번호 앞자리</label>
					<input
						type="text"
						id="landlordResidentId"
						v-model="localLandlordResidentId"
						@input="validateResidentId('landlordResidentId', $event)"
						class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
						placeholder="주민등록번호"
					/>
				</div>
			</div>
			<div class="flex gap-5 items-start mt-5 w-full">
				<div class="flex flex-col flex-1 shrink w-full basis-0 min-h-[72px] min-w-[240px]">
					<label for="tenantName" class="text-base font-bold leading-none text-gray-400 uppercase">세입자(임차인)</label>
					<input
						type="text"
						id="tenantName"
						v-model="localTenantName"
						@input="updateInput('tenant', $event)"
						class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
						placeholder="성명"
					/>
				</div>
			</div>
			<div class="flex gap-5 items-start mt-5 w-full">
				<div class="flex flex-col flex-1 shrink w-full basis-0 min-h-[72px] min-w-[240px]">
					<label for="tenantAddress" class="text-base font-bold leading-none text-gray-400 uppercase">임차인 주소</label>
					<input
						type="text"
						id="tenantAddress"
						v-model="localTenantAddress"
						@input="updateInput('tenantAddress', $event)"
						class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
						placeholder="주소"
					/>
				</div>
			</div>
			<div class="flex gap-5 items-start mt-5 w-full">
				<div class="flex flex-col flex-1 shrink w-full basis-0 min-h-[72px] min-w-[240px]">
					<label for="tenantResidentId" class="text-base font-bold leading-none text-gray-400 uppercase">임차인 주민등록번호 앞자리</label>
					<input
						type="text"
						id="tenantResidentId"
						v-model="localTenantResidentId"
						@input="validateResidentId('tenantResidentId', $event)"
						class="overflow-hidden flex-1 shrink gap-2.5 px-4 py-3 mt-2.5 text-sm font-medium leading-6 bg-white rounded-xl size-full text-slate-500"
						placeholder="주민등록번호"
					/>
				</div>
			</div>
      	</div>
    </section>
</template>
  
<script lang="ts">
export default {
    name: 'LandlordTenantInfo',
    props: {
		landlordName: {
			type: String,
			default: ''
		},
		landlordAddress: {
			type: String,
			default: ''
		},
		landlordResidentId: {
			type: String,
			default: ''
		},
		tenantName: {
			type: String,
			default: ''
		},
		tenantAddress: {
			type: String,
			default: ''
		},
		tenantResidentId: {
			type: String,
			default: ''
		}
    },
    data() {
		return {
			localLandlordName: this.landlordName,
			localLandlordAddress: this.landlordAddress,
			localLandlordResidentId: this.landlordResidentId,
			localTenantName: this.tenantName,
			localTenantAddress: this.tenantAddress,
			localTenantResidentId: this.tenantResidentId,
		};
    },
    methods: {
		updateInput(type, event) {
			const input = event.target.value;
			this.$emit('update-input', type, input);
		},
		validateResidentId(type, event) {
			const input = event.target.value;
			// 숫자만 허용하고 6자리를 초과하지 않도록 필터링
			const filteredValue = input.replace(/[^0-9]/g, '').slice(0, 6);

			// 포맷: 'XXXXXX-' (여기서 'X'는 숫자)
			const formattedValue = filteredValue.length > 0 ? filteredValue + '-_ _ _ _ _ _ _' : '';

			event.target.value = formattedValue; // 필터링된 값으로 설정

			// v-model 값을 업데이트
			if (type === 'landlordResidentId') {
				this.localLandlordResidentId = this.localLandlordResidentId === input ? filteredValue : this.localLandlordResidentId;
			} else if (type === 'tenantResidentId') {
				this.localTenantResidentId = this.localTenantResidentId === input ? filteredValue : this.localTenantResidentId;
			}
			
			// updateInput을 통해 상위 컴포넌트에 알림
			this.$emit('update-input', type, formattedValue);
		}
    }
  };
</script>