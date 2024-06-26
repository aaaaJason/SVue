<template>
  <div class="user-registration">
    <h2>新增會員</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="MemberName">姓名</label>
        <input type="text" id="MemberName" v-model="MemberName" required>
      </div>
      <div class="form-group">
        <label for="MemberAcc">手機號碼</label>
        <input type="text" id="MemberAcc" v-model="MemberAcc" required pattern="[0-9]*" maxlength="10">
      </div>
      <div class="form-group">
        <label for="StartDate">抵用券起日</label>
        <input type="date" id="StartDate" v-model="StartDate" required @input="validateDates">
      </div>
      <div class="form-group">
        <label for="EndDate">抵用券迄日</label>
        <input type="date" id="EndDate" v-model="EndDate" required @input="validateEDates">
      </div>
      <div class="form-group">
        <label for="Remark">備註</label>
        <input type="text" id="Remark" v-model="Remark" maxlength="30">
      </div>
      <button type="submit">確認新增</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      MemberName:"",
      MemberAcc:"",
      Remark:"",
      StartDate: '',
      EndDate: '',
      username:''
    };
  },
  created() {
    // 在组件创建时获取 Cookie 中的用户名
    this.getUsernameFromCookie();
    this.fetchStoreData();
  },
  watch: {
    Remark(newValue) {
      if (newValue.length > 30) {
        this.Remark = newValue.slice(0, 30); // 截斷超過30個字符
      }
    }
  },
  methods: {
    getUsernameFromCookie() {
      // 使用 js-cookie 库从 Cookie 中获取存储的用户名
      const login = Cookies.get('login');
      if (login) {
        // 如果 Cookie 中存在用户名，将其赋值给组件的数据属性
        const parsedLogin = JSON.parse(login);//解析JSON
        this.username = parsedLogin.username;
        console.log(this.username)
      }
    },
    async fetchStoreData() { // 取商家Sid 新增庫戶資料
      try {
        const response = await axios.post('https://192.168.1.150:443/Storemaindata', {
          MAccount: this.username
        }, {
        headers: {
          'Content-Type': 'application/json'
        }
        });

        if (response.status === 200) {
          const data = response.data; 
          this.Sid=data.SId
          console.log(this.Sid)
        } else {
          console.error('數據獲取失敗:', response.status);
        }
      } catch (error) {
        console.error('伺服器有誤:', error);
      }
    },
    async handleSubmit() {
      if(this.MemberAcc.length<10){
        alert("手機位數輸入錯誤")
        return
      }
        try {
          const response = await axios.post('https://192.168.1.150:443/insertSuser', {
            table:'MerMembers',
            MerSNumber:this.Sid,
            MemberAcc: this.MemberAcc,
            MemberName: this.MemberName,
            StartDate: this.StartDate,
            EndDate:this.EndDate,
            Remark:this.Remark
          });
          if (response.data.message === '使用者新增成功') {
            alert('使用者新增成功');
            window.location.href = '/main';
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error('新增使用者時發生錯誤:', error);
          alert('新增使用者失敗，請稍後再試');
        }
    },
    validateDates() {
      // 確保起日不小於今天
      const today = new Date().toISOString().split('T')[0];
      if (this.StartDate < today) {
        this.StartDate = today;
        alert('起始日不可小於今天');
      }
    },
    validateEDates(){
      // 確保迄日不小於起日
      if (this.EndDate < this.StartDate) {
        this.EndDate = this.StartDate;
        alert('迄日不可小於起始日');
      }
    }
  }
};
</script>

<style scoped>
.user-registration {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-registration h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
