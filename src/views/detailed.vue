<template>
  <div>
    <h1 style="text-align: center;">會員 - {{ MemberName }}</h1>
    <span>會員帳號：{{ MemberAcc }}</span>
    <p>剩餘抵用券：<span class="VCount" style="color: red; font-size: larger;">{{ Voucher }}</span> 張</p>
    <el-button type="danger" @click="showCarNumberForm">新增車號</el-button>
    <el-table v-if="MemVUsage.length > 0" :data="MemVUsage"  class="custom-table">
      <el-table-column prop="VoucherCode" label="車號" :sortable="true"></el-table-column>
      <el-table-column label="折抵券張數">
        <template slot-scope="scope">
          <div class="text-button-container">
            <!-- 显示 VCount 的值 -->
            {{ scope.row.VCount }} 張
            <el-button type="success" size="small" @click="handleEdit(scope.row)">+</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="showDialog(scope.row)">查看預約</el-button>
            <el-button type="warning" @click="showcheck(scope.row)">預約停車</el-button>
          </template>
        </el-table-column>
  </el-table>     
  <div v-else style="text-align: center; color: red;">
    <h1>無車號資料</h1>
  </div>
   <!--車號的表單 -->
   <el-dialog title="新增車號" :visible.sync="CarView">
      <el-form ref="carNumberForm" :model="carNumberForm">
        <el-form-item label="車牌號碼">
          <el-input v-model="carNumberForm.carNumber" placeholder="請輸入車牌號碼"></el-input>
          <span  style="color: red; font-size: larger;">備註：輸入車號不必輸入"-"符號</span> 
          <p><span  style="color: red; font-size: larger;">例：ABC1234，DF1234，5678EG</span></p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CarView = false">取消</el-button>
        <el-button type="primary" @click="saveCarNumber">保存</el-button>
      </div>
    </el-dialog>
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
    <!-- 預約停車 -->
    <el-dialog
      title="預約停車"
      :visible.sync="check"
      width="30%"
      center
    >
      <el-form ref="editForm" :model="editForm"  label-width="120px">
        <el-form-item label="車號:" required>
          <el-input v-model="editForm.VoucherCode" placeholder="請輸入車號" disabled=true></el-input>
        </el-form-item>
        <el-form-item label="預約日期:" required>
          <el-date-picker v-model="editForm.VoucherDate"
            type="date"
            placeholder="選擇日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="預約時間:" required>
          <el-time-picker
            v-model="editForm.UsageStartTime"
            placeholder="開始時間"
            format="HH:mm"
            value-format="HH:mm"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="結束時間:" required>
          <el-time-picker
            v-model="editForm.UsageEndTime"
            placeholder="結束時間"
            format="HH:mm"
            value-format="HH:mm"
            disabled=true
          ></el-time-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="check = false">取消</el-button>
        <el-button type="primary" @click="submitReservation">確定預約</el-button>
      </div>
    </el-dialog>


    <!-- 查看預約日期 -->
    <el-dialog
      title="預約日期"
      :visible.sync="dialog"
      width="50%"
    >
      <el-calendar>
        <template #dateCell="{data}">
        <div style="margin:0px" @click="calendarOnClick(data)">
          {{ data.day.split('-').slice(2).join() }}
          <div v-for="(i, index) in dayTime" :key="index">
            <div v-if="data.day === i.VoucherDate" :class="i.UsageTime ? 'budge-used' : 'budge-reserved'">
              {{ i.UsageTime ? '已使用' : '已預約' }}
            </div>
          </div>
          
        </div>
      </template>
    </el-calendar>
    </el-dialog>

    <el-dialog
    title="預約資訊"
    :visible.sync="booking"
    width="30%"
    :show-close="false"
  >
    <p>{{ message }}</p>
    <el-button type="primary" @click="handleConfirm">確定</el-button>
  </el-dialog>
    
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  props: {
    MemberAcc: {
      type: String,
      required: true
    },
    MemberName: {
      type: String,
      required: true
    },
    Sid: { 
      type: Number,
      required: true
    },
    Discount: { 
      type: Number,
      required: true
    },
  },
  data() {
    return {
      check:false,
      booking:false,
      DateReserve: false,
      CarView: false,
      dialogVisible: false,
      dialog: false,
      message: '',
      one:0,
      errorCount:'',
      Count:'',
      Voucher:'',
      VSid:'',
      MerVSid:'',
      MemVUsage: [],
      dayTime: [],
      editForm: {
          VCount: 0,
          VoucherCode:'',
          VoucherDate:'',
          UsageStartTime:'',
          UsageEndTime:''
        },
        carNumberForm: {
        carNumber: ''
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择今天及之前的日期
          return time.getTime() < Date.now() - 86400000; 
        }
      }
    };
  },
  
  watch: {
    'editForm.Vcount': function(newValue) {
      this.validateVCount(newValue);
    },
    'editForm.UsageStartTime'(newVal) {
      if (newVal) {
        const startTime = moment(newVal, 'HH:mm');
        const endTime = startTime.add(this.Discount, 'hours').format('HH:mm');
        console.log(endTime)
        this.editForm.UsageEndTime = endTime;
      }
    }
  },
  created() {
    this.fetchUserData();
    console.log(this.MemberName);
  },
  methods: {
    async submitReservation() {
      if(!this.editForm.VoucherDate||!this.editForm.UsageEndTime||!this.editForm.UsageStartTime){
        alert("欄位不可為空")
        return
      }
        try {
          console.log("MerVSid"+this.MerVSid)
          const response = await axios.post('https://192.168.1.150:443/insertSuser', {
            table:'MemVouchers',
            MerVSid:this.MerVSid,
            VoucherCode: this.editForm.VoucherCode,
            VoucherDate:this.editForm.VoucherDate,
            UsageStartTime:this.editForm.UsageStartTime,
            UsageEndTime:this.editForm.UsageEndTime

          });
          if (response.status === 201) {
            alert('新增成功');
            this.check = false;
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error('新增發生錯誤:', error);
          alert('新增失敗，請稍後再試');
        }
    },
    showcheck(row) {
      this.editForm = { ...row }; 
      this.MerVSid=row.SId
      this.check = true; 
     
    },
    handleConfirm() {
      this.message = '';
      this.booking = false; 
    },
    async calendarOnClick(data){
      console.log(data.day)
      try {
        const response = await axios.post('https://192.168.1.150:443/storedata', {
          table:'MemVouchers',
          VSId: this.VSid,
          VoucherDate:data.day
        }, {
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (response.status === 200) {
          console.log(response.data)
          if(response.data.UsageTime){
              if(response.data.UsageEndTime<=response.data.UsageStartTime){
              this.message = "預約時間："+response.data.UsageStartTime+"~次日"+response.data.UsageEndTime+"。使用時間："+this.formatDateTime(response.data.UsageTime); 
            }else{
              this.message = "預約時間："+response.data.UsageStartTime+"~"+response.data.UsageEndTime+"。使用時間："+this.formatDateTime(response.data.UsageTime); 
            }
          }else if(response.data.UsageEndTime<=response.data.UsageStartTime){
            this.message = "預約時間："+response.data.UsageStartTime+"~次日"+response.data.UsageEndTime; 
          }else{
            this.message = "預約時間："+response.data.UsageStartTime+"~"+response.data.UsageEndTime; 
          }
          this.booking=true

        } else {
          console.error('數據獲取失敗:', response.status);
        }
      } catch (error) {
        console.error('伺服器有誤:', error);
      }
  },
    showDialog(row) {
      this.dayTime=[];
      this.dialog = true;
      console.log("車號:"+row.SId)
      this.fetchDates(row.SId); 
    },
    async saveCarNumber() {
      if(!this.carNumberForm.carNumber){
        alert("車牌號碼不可為空")
        return
      }
      if(this.carNumberForm.carNumber.includes('-')){
        alert("請確認車牌格式")
        return
      }
        try {
          const response = await axios.post('https://192.168.1.150:443/insertSuser', {
            table:'MemVUsage',
            MerSid:this.Sid,
            VoucherCode: this.carNumberForm.carNumber
          });
          if (response.data.message === '使用者新增成功') {
            alert('使用者新增成功');
            this.CarView = false;
            this.fetchUserData();
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error('新增使用者時發生錯誤:', error);
          alert('新增使用者失敗，請稍後再試');
        }
    },
    async fetchUserData() { 
      try {
        const response = await axios.post('https://192.168.1.150:443/storedata', {
          table:'MerMembers',
          MSId: this.Sid
        }, {
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (response.status === 200) {
          this.Voucher = response.data[0].VCount;
          this.fetchMembers();
        } else {
          console.error('數據獲取失敗:', response.status);
        }
      } catch (error) {
        console.error('伺服器有誤:', error);
      }
    },
    //
    async fetchDates(VSid) { 
      this.VSid=VSid
      try {
        const response = await axios.post('https://192.168.1.150:443/storedata', {
          table:'MemVouchers',
          VSId: this.VSid
        }, {
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (response.status === 200) {
        //  this.dayTime = response.data.map(item => item.VoucherDate);
         this.dayTime = response.data.map(item => ({
          VoucherDate: item.VoucherDate,
          UsageTime: item.UsageTime
          }));
          console.log(JSON.parse(JSON.stringify(this.dayTime)));
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
          table: 'MemVUsage'
        });

        if (response.status === 200) {
          this.MemVUsage = response.data;
        } 
      } catch (error) {
        if (error.response.status === 404) {
          console.log("查無資料");
        } else {
          console.error('請求失敗:', error);
        }
      }
    },
    formatTime(time) {
      const hours = time.substring(11,13);
      const minutes = time.substring(14,16);
      const seconds = time.substring(17,19);
      return `${hours}:${minutes}:${seconds}`;
    },
    formatDateTime(datetime) {
      const year = datetime.substring(0, 4);
      const month = datetime.substring(5, 7);
      const day = datetime.substring(8, 10);
      const hours = datetime.substring(11, 13);
      const minutes = datetime.substring(14, 16);
      const seconds = datetime.substring(17, 19);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    handleEdit(row) {
      if(this.Voucher==0){
        window.alert('已無抵用券可以使用');
        return
      }
      this.dialogVisible = true;
      this.editForm = {  ...row};
      this.one = 1;
      this.errorCount = '';
      this.Count=row.VCount+1
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
            table:'MemVUsage',
            VoucherCode: this.editForm.VoucherCode,
            NewVCount:this.Count,
            NewVoucher:this.NewVoucher,
            MemberAcc: this.MemberAcc
          });
          if (response.status==200) {
            window.alert('更新成功');
            this.dialogVisible = false;
            this.fetchUserData();
          } else {
            window.alert(`更新失敗: ${response.data.message}`);
          }
        } catch (error) {
            window.alert(`更新失敗: ${error.response.data.message}`);

        }
      },
      showCarNumberForm() {
      this.CarView = true; // 打開彈出框
    },
  }
};
</script>

<style>
.voucher {
  font-size: 25pt; 
  color: red; 
}
.custom-table {
  width: 100%;
  border: 2px solid #0a18d8;
  background-color: #12597a;
}
.budge-reserved {
  color: rgb(3, 116, 37);
  background-color: #40ff11;
  margin: 0 auto;
  margin-top: 10px;
  padding:5px 0 0 20px;
}

.budge-used {
  color: rgb(247, 41, 5);
  background-color: #ebb60a;
  margin: 0 auto;
  margin-top: 10px;
  padding:5px 0 0 20px;
}
</style>
