<template>
  <div class="container">
    <div class="section">
      <LandlordInfo />
    </div>
    <div class="section">
      <OwnershipInfo />
    </div>
    <div class="section">
      <OtherInfo />
    </div>
  </div>
</template>

<script setup>
import LandlordInfo from "@/components/InfoSections/LandlordInfo.vue";
import OwnershipInfo from "@/components/InfoSections/OwnershipInfo.vue";
import OtherInfo from "@/components/InfoSections/OtherInfo.vue";
</script>

<style scoped>
body {
  margin: 0;
  padding-top: 60px;
}
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.section {
  background-color: #fff;
  padding: 20px;

  border: none;
}
.item {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.status {
  background-color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
}
</style>
