<template>
  <div class="container">
    <h1>登入</h1>
    <p class="subtitle">歡迎回來！請登入您的帳號</p>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">電子郵件</label>
        <input id="email" v-model="form.email" type="email" placeholder="請輸入您的電子郵件" required />
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input id="password" v-model="form.password" type="password" placeholder="請輸入您的密碼" required />
      </div>
      <button type="submit" class="btn" :disabled="loading">
        <span v-if="loading" class="loading"></span>
        {{ loading ? '登入中...' : '登入' }}
      </button>
    </form>
    <div class="link">
      還沒有帳號？<router-link to="/register">立即註冊</router-link>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../api/auth';

export default {
  name: 'Login',
  data() {
    return {
      form: { email: '', password: '' },
      loading: false,
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await authAPI.login(this.form);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.$router.push('/dashboard');
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || '登入失敗，請檢查您的帳號密碼';
      } finally {
        this.loading = false;
      }
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

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 6px;
  min-height: 20px;
  margin-bottom: 12px;
}

.btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 8px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.link {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;
}

.link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.link a:hover {
  text-decoration: underline;
}

.loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

