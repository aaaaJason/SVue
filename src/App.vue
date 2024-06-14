<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>停車場帳號管理系統</v-toolbar-title>
      <v-spacer></v-spacer>
    <div v-if="isAuthenticated">
      <span class="username">使用者：{{ username }}</span>
    <v-btn @click="handleLogout" class="logout-button">登出</v-btn>
    </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { isAuthenticated, getUsername, logout } from '@/LoginUser';
import { computed } from 'vue';
export default {
  name: 'App',
  setup() {
    const username = computed(() => getUsername.value);

    const handleLogout = () => {
      logout();
      window.location.href = '/';
    };

    return {
      isAuthenticated,
      username,
      handleLogout
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
