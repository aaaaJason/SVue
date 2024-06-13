<template>
    <div class="button-container">
      <CustomButton class="store-button"  @click="useredit">
        <v-icon color="error" :size="60">mdi mdi-lock-check</v-icon>
        商家變更密碼
      </CustomButton>
      <br>
      <CustomButton class="store-button" @click="storeedit">
        <v-icon color="error" :size="60">mdi mdi-account-multiple-plus</v-icon>
        商家新增帳號
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
      useredit() {
        console.log('Redirecting to User Management');
        // 實現導航或其他邏輯
      },
      storeedit() {
        console.log('Redirecting to Merchant Management');
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
  .store-button {
  background-color: #fff9c4; /* 自定義背景色 */
  color: #f57f17; /* 自定義文本顏色 */
}
.store-button:hover {
  background-color: #fff176; /* 鼠標懸停時的背景色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 鼠標懸停時的陰影效果 */
}
  
  </style>
  