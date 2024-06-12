// Login.vue

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password">
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    login() {
      // 在這裡進行簡單的登錄模擬
      if (this.username === 'user' && this.password === '1234') {
        // 登錄成功，跳轉到首頁或其他頁面
        this.$router.push('/main');
      } else {
        // 登錄失敗，顯示錯誤信息
        this.error = 'Invalid username or password';
      }
    }
  }
};
</script>
