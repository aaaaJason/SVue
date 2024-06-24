
<template>
    <div>
      <h1 style="text-align: center;">單位 - {{ Mname }}</h1>
      <span>商家帳號：{{ MAccount }}</span>
      <p>剩餘抵用券：<span class="voucher" style="color: red; font-size: larger;">{{ Voucher }}</span> 張</p>

      <el-table v-if="members.length > 0" :data="members" class="custom-table">
        <el-table-column prop="MemberName" label="會員名稱"></el-table-column>
        <el-table-column prop="MemberAcc" label="會員帳號"></el-table-column>
        <el-table-column label="折抵券張數">
          <template slot-scope="scope">
            <!-- 显示 VCount 的值 -->
            {{ scope.row.VCount }} 張
            <!-- 在 VCount 旁边添加一个按钮 -->
            <el-button type="success" size="small" @click="handleEdit(scope.row)">+</el-button>
          </template>
        </el-table-column>
      </el-table>
        <div v-else style="text-align: center; color: red;">
        <h1>無會員資料</h1>
        </div>

         <!-- 編輯商家資訊對話框 -->
         <el-dialog title="新增折抵券" :visible.sync="dialogVisible">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="將張數新增為">
          <el-input-number
            v-model.number="editForm.VCount"
            :min="editForm.VCount"
            :max="this.Voucher+this.editForm.originalVCount"
            :step="1"
            :controls="true"
            :precision="0"
            @change="validateVCount">
          </el-input-number>
          <br>
          <span v-if="errorCount" style="color: red;">{{ errorCount }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button> -->
      </div>
    </el-dialog>
         

    </div>
  </template>
  
  <script>
  import Cookies from 'js-cookie';
  import axios from 'axios';
  export default {
    
    data() {
      return {
        Mname:'',
        MAccount:'',
        Voucher:'',
        username:'',
        Sid:'',
        errorCount:'',
        members: [],
        dialogVisible: false,
        editForm: {
          VCount: '',
        },
        one:1,
      };
    },
    created() {
    // 在组件创建时获取 Cookie 中的用户名
    this.getUser();
    this.fetchStoreData();
  },
  watch: {
    'editForm.Vcount': function(newValue) {
      this.validateVCount(newValue);
    }
  },
  methods: {
    getUser() {
      const login = Cookies.get('login');
      if (login) {
        const parsedLogin = JSON.parse(login);
        this.username = parsedLogin.username;
      }
    },
    async fetchStoreData() { // 將 getAPI 改名為 fetchStoreData
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
          this.Sid=data.SId,
          this.Mname = data.Mname;
          this.MAccount = data.MAccount;
          this.Voucher = data.Voucher;
          this.fetchMembers();
        } else {
          console.error('數據獲取失敗:', response.status);
        }
      } catch (error) {
        console.error('伺服器有誤:', error);
      }
    },
    async fetchMembers() {
          try {
              console.log(this.Sid);
              const response = await axios.post('https://192.168.1.150:443/storedata', {
                  SId: this.Sid
          });
        
            if (response.status === 200) {
              this.members = response.data;
          } 
      } catch (error) {
          if(error.response.status === 404){
              console.log("查無資料");
          }else{
              console.error('請求失敗:', error);
          }
      }
      },
      handleEdit(row) {
      // 打開編輯對話框，並將行數據填充到編輯表單中
      this.dialogVisible = true;
       this.editForm = {  ...row};
      this.editForm.originalVCount = row.VCount; // 保存原始 VCount 值
    },
      validateVCount(value) {
        const newValue =this.Voucher+this.editForm.originalVCount
        if (value == newValue) {
          this.errorCount = '已達最大數量';
        } else {
          this.errorCount = '';
        }
      },
    }
 };
  </script>
  <style>
    .voucher {
    font-size: 25pt; 
    color: red; 
    }
  </style>