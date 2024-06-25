<template>
  <div>
    <h1 style="text-align: center;">會員 - {{ MemberName }}</h1>
    <span>會員帳號：{{ MemberAcc }}</span>
    <p>剩餘抵用券：<span class="voucher" style="color: red; font-size: larger;">{{ VCount }}</span> 張</p>

    <el-table v-if="MemVUsage.length > 0" :data="MemVUsage"  class="custom-table">
      <el-table-column prop="VoucherCode" label="折抵車號"></el-table-column>
      <el-table-column prop="VoucherDate" label="折抵日期"></el-table-column>
      <el-table-column prop="UsageStartTime" label="折抵起時間">
        <template slot-scope="scope">
          {{ formatTime(scope.row.UsageStartTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="UsageEndTime" label="折抵迄時間">
        <template slot-scope="scope">
          {{ formatTime(scope.row.UsageEndTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="UsageTime" label="使用時間">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.UsageTime) }}
        </template>
      </el-table-column>
    </el-table>     

    <div v-else style="text-align: center; color: red;">
      <h1>無會員資料</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
    VCount: { 
      type: Number,
      required: true
    },
  },
  data() {
    return {
      MemVUsage: []
    };
  },
  created() {
    this.fetchMembers();
    console.log(this.MemberName);
  },
  methods: {
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
      const day = datetime.substring(7, 10);
      const hours = datetime.substring(11, 13);
      const minutes = datetime.substring(14, 16);
      const seconds = datetime.substring(17, 19);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
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
</style>
