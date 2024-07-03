<template>
  <div>
    <h1 style="text-align: center;">會員 - {{ MemberName }}</h1>
    <span>會員帳號：{{ MemberAcc }}</span>
    <p>剩餘抵用券：<span class="VCount" style="color: red; font-size: larger;">{{ Voucher }}</span> 張</p>
    <el-button type="warning" @click="showcheck">預約停車</el-button>
    <el-table v-if="filteredMemVUsage.length > 0" :data="filteredMemVUsage"  class="custom-table">
      <el-table-column prop="VoucherCode" label="車號" :sortable="true"></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="showDialog(scope.row)">查看預約</el-button>
          </template>
        </el-table-column>
  </el-table>     
  <div v-else style="text-align: center; color: red;">
    <h1>無車號資料</h1>
  </div>
  
    <!-- 預約停車 -->
    <el-dialog
      title="預約停車"
      :visible.sync="check"
      width="30%"
      center
    >
      <el-form ref="editForm" :model="editForm"  label-width="120px">
        <el-form-item label="車號:" required>
          <el-input v-model="editForm.VoucherCode" placeholder="請輸入車號" ></el-input>
          <span  style="color: red; font-size: larger;">備註：輸入車號不必輸入"-"符號</span> 
          <p><span  style="color: red; font-size: larger;">例：ABC1234，DF1234，5678EG</span></p>
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
    <p>{{ UseAcc }}</p>
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
      dialog: false,
      message: '',
      UseAcc: '',
      errorCount:'',
      Count:'',
      Voucher:'',
      NewVCount:"",
      VSid:'',
      VoucherCode:'',
      MemVUsage: [],
      dayTime: [],
      editForm: {
          VCount: 0,
          VoucherCode:'',
          VoucherDate:'',
          UsageStartTime:'',
          UsageEndTime:'',
        },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择今天及之前的日期
          return time.getTime() < Date.now() - 86400000; 
        }
      }
    };
  },
  computed: {
    filteredMemVUsage() {
      // 使用 JavaScript 的 Set 來過濾重複的車號
      const uniqueCodes = new Set();
      return this.MemVUsage.filter(item => {
        if (uniqueCodes.has(item.VoucherCode)) {
          return false;
        } else {
          uniqueCodes.add(item.VoucherCode);
          return true;
        }
      });
    }
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
    async saveEdit() {
        this.NewVCount=this.Voucher-1
        console.log("扣除折抵券:"+this.Sid+""+this.NewVcount+"張")
        try {
          const response = await axios.put('https://192.168.1.150:443/voucher', {
            table:'MerMembers',
            Sid:this.Sid,
            NewVCount:this.NewVCount
          });
          if (response.status==200) {
            console.log("折抵張數成功")
          } else {
            console.log("折抵張數失敗")
          }
        } catch (error) {
          console.log("折抵張數失敗")
        }
      },
    async submitReservation() {
      if(this.editForm.VoucherCode.includes('-')){
        alert("請確認車牌格式")
        return
      }
      if(!this.editForm.VoucherCode||!this.editForm.VoucherDate||!this.editForm.UsageEndTime||!this.editForm.UsageStartTime){
        alert("欄位不可為空")
        return
      }
        try {
          console.log("MerSid"+this.Sid)
          const response = await axios.post('https://192.168.1.150:443/insertSuser', {
            table:'MemVUsage',
            MerVSid:this.Sid,
            VoucherCode: this.editForm.VoucherCode,
            VoucherDate:this.editForm.VoucherDate,
            UsageStartTime:this.editForm.UsageStartTime,
            UsageEndTime:this.editForm.UsageEndTime

          });
          if (response.status === 201) {
            alert('新增成功');
            this.check = false;
            this.saveEdit();
            location.reload();
            
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error('新增發生錯誤:', error);
          alert('新增失敗，請稍後再試');
        }
    },
    showcheck() {
      if(this.Voucher==0){
        alert("已無折抵券可使用");
        return
      }
      this.check = true; 
     
    },
    handleConfirm() {
      this.message = '';
      this.booking = false; 
    },
    async fetchUseAcc() { 
      try {
        const response = await axios.post('https://192.168.1.150:443/storedata', {
          table:'MerMembers',
          ASId: this.UseAccType
        }, {
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (response.status === 200) {
          this.UseAcc = "預約帳號："+response.data.MemberAcc+"，預約姓名："+response.data.MemberName;
        } else {
          console.error('數據獲取失敗:', response.status);
        }
      } catch (error) {
        console.error('伺服器有誤:', error);
      }
    },
    async calendarOnClick(data){
      console.log(data.day)
      console.log(this.VoucherCode)
      try {
        const response = await axios.post('https://192.168.1.150:443/storedata', {
          table:'MemVUsage',
          VoucherCode: this.VoucherCode,
          VoucherDate:data.day
        }, {
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (response.status === 200) {
          this.UseAccType=response.data.MerSid
          console.log("編號:"+this.UseAccType)
          this.fetchUseAcc();
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
      this.VoucherCode=row.VoucherCode
      console.log("車號:"+this.VoucherCode)
      this.fetchDates(this.VoucherCode); 
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
    
    async fetchDates(VoucherCode) { 
      console.log(VoucherCode)
      try {
        const response = await axios.post('https://192.168.1.150:443/storedata', {
          table:'MemVUsage',
          VoucherCode:VoucherCode
        }, {
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (response.status === 200) {
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
    validateVCount(value) {
        this.Count=value+this.editForm.VCount
        if (value == this.Voucher) {
          this.errorCount = '已達最大折抵數量';
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
