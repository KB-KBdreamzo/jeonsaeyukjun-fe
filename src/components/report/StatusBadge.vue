<template>
  <span
    :class="[
      'status', 
      'py-2', 'px-4', 'rounded-full', 'text-center', 
      { 'bg-yellow-200 text-yellow-600': hasRecord, 'bg-gray-200 text-gray-600': !hasRecord }
    ]"
    style="min-width: 90px;"
  >
    {{ hasRecord ? statusMessage : '없음' }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: [Number, Boolean],
    required: true
  }
});

const hasRecord = props.status > 0 || props.status === true;
const statusMessage = props.status > 0 ? `${props.status}건` : '있음';
</script>

<style scoped>
.status {
  display: inline-block;
  width: 90px;
  text-align: center;
}
</style>
