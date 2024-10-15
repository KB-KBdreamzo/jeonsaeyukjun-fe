<template>
  <span
    :class="[
      'status', 'py-2', 'px-4', 'rounded-full', 'text-center', 'font-bold', 'tracking-widest',
      { 'text-badge-txt-yes bg-badge-bg-yes': hasRecord, 'text-badge-txt-no bg-badge-bg-no': !hasRecord }
    ]"
    style="min-width: 90px;"
  >
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: [String, Boolean], 
    required: true
  }
});

const hasRecord = computed(() => {
  return props.status && props.status !== '없 음';
});
</script>