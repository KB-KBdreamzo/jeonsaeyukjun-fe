<template>
    <section class="flex flex-col px-2.5 py-5 mt-10 w-full bg-gray-200 bg-opacity-40 max-w-[378px] rounded-[30px]">
      <header class="flex gap-10 justify-between items-center px-2.5 w-full text-xl font-semibold leading-tight text-zinc-800">
        <h2 class="self-stretch my-auto">집주인 및 세입자</h2>
      </header>
      <div class="flex flex-col px-2.5 mt-6 w-full whitespace-nowrap">
        <div class="flex flex-col w-full min-h-[72px]">
          <label for="ownerName" class="text-base font-bold leading-none text-gray-400 uppercase">집주인</label>
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
            <label for="tenantName" class="text-base font-bold leading-none text-gray-400 uppercase">세입자</label>
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
      tenantName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        localLandlordName: this.landlordName,
        localTenantName: this.tenantName
      };
    },
    methods: {
      updateInput(type, event) {
        const input = event.target.value;
        this.$emit('update-input', type, input);
      }
    }
  };
  </script>
  