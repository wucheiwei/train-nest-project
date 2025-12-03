<template>
  <div class="container">
    <h1>歡迎！</h1>
    <p class="subtitle">您已成功登入</p>
    <div style="margin-top: 20px;">
      <button @click="logout" class="btn" style="background: #e74c3c;">登出</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    logout() {
      localStorage.removeItem('access_token');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

h1 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  margin-bottom: 32px;
  font-size: 14px;
}

.btn {
  width: 100%;
  padding: 14px;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
}

.btn:active {
  transform: translateY(0);
}
</style>

