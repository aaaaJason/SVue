<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="Mname" label="商家名稱"></el-table-column>
      <el-table-column prop="MAccount" label="商家帳號"></el-table-column>
      <el-table-column prop="Discount" label="折抵方式"></el-table-column>
      <el-table-column prop="Voucher" label="折抵券張數"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">編輯</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 編輯對話框 -->
    <el-dialog title="编辑商家信息" :visible.sync="dialogVisible">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="商家名稱">
          <el-input v-model="editForm.Mname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商家帳號">
          <el-input v-model="editForm.MAccount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="折抵方式">
          <el-input v-model="editForm.Discount"></el-input>
        </el-form-item>
        <el-form-item label="折抵券張數">
          <el-input v-model="editForm.Voucher"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      tableData: [], // 用於存儲 API 返回的數據
      dialogVisible: false,
      editForm: {
        Mname: '',
        MAccount: '',
        Discount: '',
        Voucher: '',
      },
    };
  },
  created() {
    this.fetchTableData(); // 組件創建時調用 API
  },
  methods: {
    async fetchTableData() {
      try {
        const response = await fetch('https://192.168.1.150:443/maindata', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          this.tableData = await response.json();
        } else {
          console.error('API 請求失敗', response.statusText);
        }
      } catch (error) {
        console.error('請求錯誤', error);
      }
    },
    async saveAPI() {
      try {
        const response = await axios.put('https://192.168.1.150:443/updatestore', {
          MAccount: this.editForm.MAccount,
          Discount: this.editForm.Discount,
          Voucher: this.editForm.Voucher
        });

        if (response.data.success) {
          window.alert('更新成功');
          this.dialogVisible = false;
          window.location.reload();
        } else {
          window.alert(`更新失敗: ${response.data.message}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          window.alert('更新失敗: 未找到對應的商家');
        } else {
          console.error('更新出錯:', error);
          window.alert('更新失敗 請稍後再試');
        }
      }
    },
    handleEdit(row) {
      // 打開編輯對話框，並將行數據填充到編輯表單中
      this.dialogVisible = true;
      this.editForm = { ...row }; // 使用對象展開運算符複製行數據到編輯表單中
    },
    saveEdit() {
      // 保存編輯操作，可以在這裡處理保存邏輯，比如調用 API 更新數據
      console.log('保存編輯', this.editForm);
      this.saveAPI()
    },
  },
};
</script>

<style scoped>
.el-table {
  border: 2px solid #080808;
  background-color: #12597a;
}

/* 修改表頭的背景顏色和文字顏色 */
.table-container .el-table thead {
  background-color: #409EFF ;
  color: #ffffff;
}

/* 修改表格行的樣式 */
.el-table tr {
  border-bottom: 6px solid #f00c0c;
}

/* 修改表格列的樣式 */
.el-table td,
.el-table th {
  padding: 10px;
}

/* 滑過行時的樣式 */
.el-table tr:hover {
  background-color: #f0f0f0;
}
</style>
