<template>
  <div class="container">
    <h1>註冊</h1>
    <p class="subtitle">建立新帳號，開始使用我們的服務</p>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">姓名</label>
        <input id="name" v-model="form.name" type="text" placeholder="請輸入您的姓名" required />
      </div>
      <div class="form-group">
        <label for="email">電子郵件</label>
        <input id="email" v-model="form.email" type="email" placeholder="請輸入您的電子郵件" required />
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input id="password" v-model="form.password" type="password" placeholder="請輸入密碼（至少 6 個字元）" required minlength="6" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">確認密碼</label>
        <input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="請再次輸入密碼" required />
        <div v-if="passwordMismatch" class="error-message">密碼不一致</div>
      </div>
      <button type="submit" class="btn" :disabled="loading || passwordMismatch">
        <span v-if="loading" class="loading"></span>
        {{ loading ? '註冊中...' : '註冊' }}
      </button>
    </form>
    <div class="link">
      已經有帳號了？<router-link to="/login">立即登入</router-link>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../api/auth';

export default {
  name: 'Register',
  data() {
    return {
      form: { name: '', email: '', password: '', confirmPassword: '' },
      loading: false,
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    passwordMismatch() {
      return this.form.password && this.form.confirmPassword && 
             this.form.password !== this.form.confirmPassword;
    },
  },
  methods: {
    async handleRegister() {
      if (this.passwordMismatch) {
        this.errorMessage = '密碼不一致，請重新輸入';
        return;
      }
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const { confirmPassword, ...registerData } = this.form;
        await authAPI.register(registerData);
        this.successMessage = '註冊成功！正在跳轉到登入頁面...';
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      } catch (error) {
        this.errorMessage = error.response?.data?.message || '註冊失敗，請稍後再試';
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
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
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

