<script setup>
import LandlordInfo from "@/components/report/LandlordInfo.vue"
import OwnershipInfo from "@/components/report/OwnershipInfo.vue";
import OtherInfo from "@/components/report/OtherInfo.vue";
import Score from "@/components/report/score.vue";
import Money from "@/components/report/money.vue";
import { useReportStore } from "@/stores/reportStore";

const reportStore = useReportStore();
</script>

<template>
  <div class="container flex flex-col gap-10">
    <Score/>
    <Money />
    <div class = "detail w-full p-10 grid grid-cols-2 gap-x-20 gap-y-10">
      <LandlordInfo />
      <OwnershipInfo />
      <OtherInfo />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 70%;
  min-width: 900px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
