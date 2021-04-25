<template>
  <div class="modal">
    <div class="overlay" @click="emit('closedModal')"></div>
    <div class="modal-card">
      <slot></slot>
    </div>
  </div>
</template>

<script>

import useKeydown from '../composables/use-keydown'

export default {
  emits: ["closedModal"],
  setup(props, { emit }) {
    useKeydown([
      {
        key: "Escape",
        fn: () => {
          emit("closedModal");
        },
      },
    ]);
  },
};
</script>

<style>
</style>