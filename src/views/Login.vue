<template>
    <div class="container">
      <table class="login-table">
        <tr>
          <td align="center">
            <h2>系統登入</h2>
            <form @submit.prevent="login">
              <div class="input-container">
                <label for="username">帳號：</label>
                <input type="text" id="username" v-model="username" class="custom-input">
              </div>
              <div class="input-container">
                <label for="password">密碼：</label>
                <input type="password" id="password" v-model="password" class="custom-input">
              </div>
              <div class="button-container">
                <button type="submit" class="login-button">登入</button>
              </div>
            </form>
            <p v-if="error" style="color: red;">{{ error }}</p>
          </td>
        </tr>
      </table>
    </div>
  </template>
  
  <style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .login-table {
    width: 30%;
    height: 40%;
    background-color: #ccc;
  }
  
  .input-container,
  .button-container {
    padding: 10px;
  }
  
  .login-button {
    background-color: #470ceb;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-radius: 12px;
  }
  
  .login-button:hover {
    background-color:#1b28dd ;
  }
  
  /* 自定義輸入框樣式 */
  .custom-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    background-color: white; /* 將背景色設置為白色 */
  }
  
  /* 輸入框聚焦時的樣式 */
  .custom-input:focus {
    outline: none;
    border-color: #470ceb;
    box-shadow: 0 0 5px #470ceb;
  }
  </style>
  

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
        this.error = '帳密錯誤';
      }
    }
  }
};
</script>
