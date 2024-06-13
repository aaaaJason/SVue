<template>
  <div class="button-container">
    <CustomButton class="user-button"  @click="updateuser">
      <v-icon color="error" :size="60">mdi mdi-lock-check</v-icon>
      使用者變更密碼
    </CustomButton>
    <br>
    <CustomButton class="user-button" @click="insertuser">
      <v-icon color="error" :size="60">mdi mdi-account-multiple-plus</v-icon>
      使用者新增帳號
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue';

export default {
  components: {
    CustomButton
  },
  methods: {
    insertuser() {
      console.log('Redirecting to insertuser');
      this.$router.push('/insertuser');
      // 實現導航或其他邏輯
    },
    updateuser() {
      console.log('Redirecting to updateuser');
      this.$router.push('/updateuser');
      // 實現導航或其他邏輯
    }
  }
};
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中對齊 */
}
.user-button {
background-color: #e0f7fa; /* 自定義背景色 */
color: #f57f17; /* 自定義文本顏色 */
}
.user-button:hover {
background-color: #b2ebf2; /* 鼠標懸停時的背景色 */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 鼠標懸停時的陰影效果 */
}

</style>
