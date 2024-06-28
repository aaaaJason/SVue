
<template>
    <div>
      <h1 style="text-align: center;">單位 - {{ Mname }}</h1>
      <span>商家帳號：{{ MAccount }}</span>
      <p>剩餘抵用券：<span class="voucher" style="color: red; font-size: larger;">{{ Voucher }}</span> 張</p>

      <el-table v-if="members.length > 0" :data="members" class="custom-table">
        <el-table-column prop="MemberName" label="會員名稱"></el-table-column>
        <el-table-column prop="MemberAcc" label="會員帳號" ></el-table-column>
        <el-table-column label="折抵券張數">
          <template slot-scope="scope">
             <div class="text-button-container">
            <!-- 显示 VCount 的值 -->
            {{ scope.row.VCount }} 張
            <el-button type="success" size="small" @click="handleEdit(scope.row)">+</el-button>
          </div>
          </template>
        </el-table-column>
        <el-table-column prop="StartDate" label="折抵券起日" :sortable="true"></el-table-column>
        <el-table-column prop="EndDate" label="折抵券迄日" :sortable="true"></el-table-column>
        <el-table-column prop="Remark" label="備註"></el-table-column>
        <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="handle(scope.row)">編輯</el-button>
        <el-button type="warning" @click="detailed(scope.row)">查看詳細</el-button>
      </template>
    </el-table-column>
      </el-table>
        <div v-else style="text-align: center; color: red;">
        <h1>無會員資料</h1>
        </div>

         <!-- 新增折抵券 -->
         <el-dialog title="新增折抵券" :visible.sync="dialogVisible">
          <el-form ref="editForm" :model="editForm">
          <el-form-item label="新增張數：">
          <el-input-number
            v-model.number="one"
            :min="1"
            :max="Voucher"
            :step="1"
            :controls="true"
            :precision="0"
            @change="validateVCount">
          </el-input-number>
          <br>
          <span v-if="errorCount" style="color: red;">{{ errorCount }}</span>
          <br>
          <p>新增後為<span v-if="Count" style="color: red; font-size: larger" >{{ Count }}</span>張</p>
          </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEdit">保存</el-button>
          </div>
    </el-dialog>

     <!-- 編輯會員資料 -->
     <el-dialog title="編輯會員資料" :visible.sync="PassdialogVisible">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="會員名稱" >
          <el-input v-model="editForm.MemberName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item  label="會員帳號">
          <el-input v-model="editForm.MemberAcc" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="抵用券起日" >
          <el-input v-model="editForm.StartDate"  type="date"></el-input>
        </el-form-item>
        <el-form-item label="抵用券迄日" >
          <el-input v-model="editForm.EndDate"  type="date"></el-input>
        </el-form-item>
        <el-form-item label="備註">
          <el-input v-model="editForm.Remark" type="text" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="PassdialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">送出</el-button>
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
        Count:'',
        one:1,
        NewVoucher:'',
        dialogVisible: false,
        PassdialogVisible: false,
        members: [],
        editForm: {
          VCount: '',
          MemberAcc:'',
          StartDate:'',
          EndDate:'',
          Remark:''
        },
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
    handle(row) {
      // 打開編輯對話框，並將行數據填充到編輯表單中
      this.PassdialogVisible = true;
      this.editForm = { ...row }; // 使用對象展開運算符複製行數據到編輯表單中
    },
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
                  SId: this.Sid,
                  table:'MerMembers'
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
      if(this.Voucher==0){
        window.alert('已無抵用券可以使用');
        return
      }
      this.dialogVisible = true;
      this.editForm = {  ...row};
      this.editForm.originalVCount = row.VCount; // 保存原始 VCount 值
      this.one = 1;
      this.errorCount = '';
      this.Count=row.VCount+1
    },
    detailed(row) {
      this.$router.push({ 
        name: 'detailed',
        query: {
          MemberAcc: row.MemberAcc,
          MemberName:row.MemberName,
          VCount:row.VCount,
          Sid: row.SId 
        }
      });
    },
      validateVCount(value) {
        this.Count=value+this.editForm.VCount
        if (value == this.Voucher) {
          this.errorCount = '已達最大折抵數量';
        } else {
          this.errorCount = '';
        }
      },
      async saveEdit() {
        if (!this.one) {
          window.alert('請確認資料輸入無誤');
          return;
        }
        this.NewVoucher=this.Voucher-this.one
        try {
          const response = await axios.put('https://192.168.1.150:443/voucher', {
            table:'MerMembers',
            MemberAcc: this.editForm.MemberAcc,
            NewVCount:this.Count,
            NewVoucher:this.NewVoucher,
            MAccount: this.username
          });
          if (response.status==200) {
            window.alert('更新成功');
            this.dialogVisible = false;
            this.fetchStoreData()
          } else {
            window.alert(`更新失敗: ${response.data.message}`);
          }
        } catch (error) {
            window.alert(`更新失敗: ${error.response.data.message}`);

        }
      },
      async save() {
        const today = new Date().toISOString().split('T')[0];
        if (this.editForm.StartDate < today) {
          alert('起始日不可小於今天');
          return
        }else if(this.editForm.EndDate < this.editForm.StartDate){
          alert('迄日不可小於起始日');
          return
        }
        try {
          const response = await axios.put('https://192.168.1.150:443/updateSuser', {
            MemberAcc: this.editForm.MemberAcc,
            StartDate: this.editForm.StartDate,
            EndDate: this.editForm.EndDate,
            Remark: this.editForm.Remark,
          });
          if (response.status==200) {
            window.alert('更新成功');
            this.PassdialogVisible = false;
            this.fetchStoreData()
          } else {
            window.alert(`更新失敗: ${response.data.message}`);
          }
        } catch (error) {
            window.alert(`更新失敗: ${error.response.data.message}`);

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
    .text-button-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 120px; /* 设置固定宽度，视需要调整 */
      padding: 0 10px; /* 根据需要调整内边距 */
    }

  .text-button-container span {
      display: inline-block;
      text-align: left;
      flex: 1;
    }
  </style>