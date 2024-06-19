<template>
  <button class="custom-button" @click="$emit('click')">
    <span class="icon-container">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'CustomButton'
};
</script>

<style scoped>
.custom-button {
  padding: 10px 20px;
  font-size: 50px;
  width: 400px; /* 固定寬度 */
  height: 100px; /* 固定高度 */
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: white;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}



.icon-container {
  display: flex;
  align-items: center;
}

</style>
