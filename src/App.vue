<template>
  <v-app>
  <v-app-bar app color="green" dark>
    <v-btn v-if="$route.path !== '/'" icon @click="toggleDrawer">
       <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title>停車場帳號管理系統</v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="isAuthenticated">
    <span class="username">使用者：{{ username }}</span>
    <v-btn @click="handleLogout" class="logout-button">登出</v-btn>
    </div>
  </v-app-bar>
  <v-navigation-drawer v-if="$route.path !== '/'" app v-model="drawer" temporary>
      <!-- 添加關閉按鈕 -->
      <v-list-item>
        <v-list-item-action>
          <v-btn icon @click="toggleDrawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <!-- 導航抽屜內容 -->
      <v-list>
      <!-- 主页面链接 -->
      <v-list-item v-on:click="goTo('/main')">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>主畫面</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <!-- 使用者新增链接 -->
      <v-list-item v-on:click="goTo('/insertuser')">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>使用者新增</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <!-- 使用者变更密码链接 -->
      <v-list-item v-on:click="goTo('/updateuser')">
        <v-list-item-icon>
          <v-icon>mdi-lock-reset</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>更新使用者密碼</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <!-- 商家頁面 -->
      <v-list-item v-on:click="goTo('/storeedit')">
        <v-list-item-icon>
          <v-icon>mdi-storefront-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>商家管理</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>
    </v-navigation-drawer>

  <!-- 根据应用组件来调整你的内容 -->
  <v-main>
    <!-- 给应用提供合适的间距 -->
    <!-- <v-container fluid> -->
      <router-view></router-view>
    <!-- </v-container> -->
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>


<script>
import { isAuthenticated, getUsername, logout } from '@/LoginUser';
import { computed,ref } from 'vue';
export default {
  name: 'App',
  methods: {
    goTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      } else {
        console.log('已在當前路徑，無須前往');
      }
    }
  },
  setup() {
    const drawer = ref(false);
    const username = computed(() => getUsername.value);

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    const handleLogout = () => {
      logout();
      window.location.href = '/';
    };

    return {
      drawer,
      isAuthenticated,
      username,
      handleLogout,
      toggleDrawer,
    };
  },
  data: () => ({
    //
  }),
};
</script>
<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.username {
  margin-right: 20px; /* 你可以根據需求調整這裡的數值 */
}

.logout-button {
  margin-left: 20px; /* 這裡也可以根據需求調整 */
}


</style>
