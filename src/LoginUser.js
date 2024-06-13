
import { reactive, computed } from 'vue';

export const state = reactive({
  user: null
});

export const setUser = (user) => {
  state.user = user;
};

export const logout = () => {
  state.user = null;
};

export const isAuthenticated = computed(() => !!state.user);
export const getUsername = computed(() => state.user?.Username);
