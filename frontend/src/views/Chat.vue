<template>
  <div class="chat-container">
    <!-- 側邊欄 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>聊天室</h2>
        <div style="display: flex; gap: 8px;">
          <div class="model-selector-wrapper">
            <button @click="showModelSelector = !showModelSelector" class="model-btn" :title="`當前模型: ${getModelLabel(selectedModel)}`">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
            <div v-if="showModelSelector" class="model-selector-dropdown">
              <div 
                v-for="model in availableModels" 
                :key="model.value"
                class="model-option"
                :class="{ active: selectedModel === model.value }"
                @click="selectModel(model.value)"
              >
                {{ model.label }}
              </div>
            </div>
          </div>
          <button @click="newChat" class="new-chat-btn" title="新對話">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="chat-history">
        <div 
          v-for="(chat, index) in chatHistory" 
          :key="index"
          class="chat-item"
          :class="{ active: currentChatIndex === index }"
          @click="selectChat(index)"
        >
          <span class="chat-title">{{ chat.title || `對話 ${index + 1}` }}</span>
          <button @click.stop="deleteChat(index)" class="delete-btn">×</button>
        </div>
      </div>
      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">登出</button>
      </div>
    </div>

    <!-- 主聊天區域 -->
    <div class="chat-main">
      <!-- 訊息列表 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="currentMessages.length === 0" class="welcome-message">
          <h1>歡迎使用聊天室</h1>
          <p>開始一個新的對話吧！</p>
        </div>
        
        <div 
          v-for="(message, index) in currentMessages" 
          :key="index"
          class="message"
          :class="{ 'user-message': message.role === 'user', 'assistant-message': message.role === 'assistant' }"
        >
          <div class="message-avatar">
            <div v-if="message.role === 'user'" class="avatar user-avatar">U</div>
            <div v-else class="avatar assistant-avatar">AI</div>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- 載入中指示器 -->
        <div v-if="isLoading" class="message assistant-message">
          <div class="message-avatar">
            <div class="avatar assistant-avatar">AI</div>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 輸入區域 -->
      <div class="input-container">
        <form @submit.prevent="sendMessage" class="input-form">
          <textarea
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.shift.enter.exact="inputMessage += '\n'"
            placeholder="輸入訊息... (Enter 發送, Shift+Enter 換行)"
            class="message-input"
            rows="1"
            ref="messageInput"
          ></textarea>
          <button 
            type="submit" 
            class="send-btn"
            :disabled="!inputMessage.trim() || isLoading"
            title="發送訊息 (Enter)"
          >
            <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <div v-else class="loading-spinner"></div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { chatAPI } from '../api/chat';

export default {
  name: 'Chat',
  data() {
    return {
      inputMessage: '',
      isLoading: false,
      chatHistory: [],
      currentChatIndex: 0,
      currentConversationId: null,
      selectedModel: 'gpt-4o-mini',
      showModelSelector: false,
      availableModels: [
        { value: 'gpt-4o', label: 'GPT-4o' },
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      ],
    };
  },
  computed: {
    currentMessages() {
      return this.chatHistory[this.currentChatIndex]?.messages || [];
    }
  },
  async mounted() {
    await this.loadConversations();
    this.autoResizeTextarea();
  },
  watch: {
    currentMessages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) return;

      const messageText = this.inputMessage.trim();
      this.inputMessage = '';

      // 如果沒有當前對話，先創建一個
      if (!this.currentConversationId) {
        await this.createNewConversation();
      }

      // 添加用戶訊息到 UI
      const userMessage = {
        role: 'user',
        content: messageText,
        timestamp: new Date()
      };
      this.chatHistory[this.currentChatIndex].messages.push(userMessage);
      this.scrollToBottom();

      // 發送請求到後端
      this.isLoading = true;
      try {
        const response = await chatAPI.sendMessage(this.currentConversationId, messageText);
        
        const assistantMessage = {
          role: 'assistant',
          content: response.text || response.message || '抱歉，我無法理解您的問題。',
          timestamp: new Date()
        };

        this.chatHistory[this.currentChatIndex].messages.push(assistantMessage);
        
        // 更新對話標題（如果是第一條訊息）
        if (this.chatHistory[this.currentChatIndex].messages.length === 2) {
          this.chatHistory[this.currentChatIndex].title = 
            messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
        }
      } catch (error) {
        console.error('發送訊息錯誤:', error);
        const errorMessage = {
          role: 'assistant',
          content: `錯誤：${error.message || '無法連接到伺服器，請稍後再試'}`,
          timestamp: new Date()
        };
        this.chatHistory[this.currentChatIndex].messages.push(errorMessage);
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    async createNewConversation() {
      try {
        const conversation = await chatAPI.createConversation({
          title: null,
          model: this.selectedModel
        });
        this.currentConversationId = conversation.id;
        this.chatHistory[this.currentChatIndex].id = conversation.id;
        this.chatHistory[this.currentChatIndex].model = this.selectedModel;
      } catch (error) {
        console.error('創建對話錯誤:', error);
        throw new Error('無法創建新對話');
      }
    },
    selectModel(modelValue) {
      this.selectedModel = modelValue;
      this.showModelSelector = false;
      // 如果當前對話已存在，可以選擇更新模型（需要後端支持）
    },
    getModelLabel(modelValue) {
      const model = this.availableModels.find(m => m.value === modelValue);
      return model ? model.label : modelValue;
    },
    async loadConversations() {
      try {
        const conversations = await chatAPI.getMyConversations();
        if (conversations && conversations.length > 0) {
          // 轉換為前端格式
          this.chatHistory = conversations.map(conv => ({
            id: conv.id,
            title: conv.title || '新對話',
            messages: []
          }));
          // 載入第一個對話的訊息
          if (this.chatHistory.length > 0) {
            this.currentChatIndex = 0;
            this.currentConversationId = this.chatHistory[0].id;
            await this.loadConversationMessages(this.chatHistory[0].id);
          }
        } else {
          // 如果沒有對話，創建一個新的
          this.chatHistory = [{
            title: '新對話',
            messages: []
          }];
        }
      } catch (error) {
        console.error('載入對話列表錯誤:', error);
        // 如果載入失敗，至少顯示一個空對話
        this.chatHistory = [{
          title: '新對話',
          messages: []
        }];
      }
    },
    async loadConversationMessages(conversationId) {
      try {
        const conversation = await chatAPI.getConversation(conversationId);
        // 這裡需要後端返回訊息列表，暫時先不處理
        // 可以後續添加 messages API
      } catch (error) {
        console.error('載入對話訊息錯誤:', error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    formatMessage(content) {
      // 簡單的 Markdown 格式化
      return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return '剛剛';
      if (minutes < 60) return `${minutes} 分鐘前`;
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    async newChat() {
      this.chatHistory.unshift({
        title: '新對話',
        messages: []
      });
      this.currentChatIndex = 0;
      this.currentConversationId = null;
    },
    async selectChat(index) {
      this.currentChatIndex = index;
      const chat = this.chatHistory[index];
      if (chat.id) {
        this.currentConversationId = chat.id;
        // 更新選中的模型
        if (chat.model) {
          this.selectedModel = chat.model;
        }
        // 如果訊息列表為空，載入訊息
        if (chat.messages.length === 0) {
          await this.loadConversationMessages(chat.id);
        }
      } else {
        this.currentConversationId = null;
      }
    },
    deleteChat(index) {
      if (confirm('確定要刪除這個對話嗎？')) {
        this.chatHistory.splice(index, 1);
        if (this.currentChatIndex >= this.chatHistory.length) {
          this.currentChatIndex = Math.max(0, this.chatHistory.length - 1);
        }
        if (this.chatHistory.length === 0) {
          this.newChat();
        }
      }
    },
    autoResizeTextarea() {
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
          });
        }
      });
    },
    logout() {
      if (confirm('確定要登出嗎？')) {
        localStorage.removeItem('access_token');
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background: #f7f7f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* 側邊欄 */
.sidebar {
  width: 260px;
  background: #202123;
  color: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.new-chat-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.new-chat-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chat-item {
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
  position: relative;
}

.chat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-item.active {
  background: rgba(255, 255, 255, 0.15);
}

.chat-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.delete-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  display: none;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.chat-item:hover .delete-btn {
  display: flex;
}

.delete-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 模型選擇器 */
.model-selector-wrapper {
  position: relative;
}

.model-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.model-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.model-selector-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: #343541;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
  overflow: hidden;
}

.model-option {
  padding: 12px 16px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
}

.model-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.model-option.active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 500;
}

/* 主聊天區域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8e8ea0;
  text-align: center;
}

.welcome-message h1 {
  font-size: 32px;
  margin-bottom: 12px;
  color: #343541;
}

.welcome-message p {
  font-size: 16px;
}

.message {
  display: flex;
  gap: 16px;
  width: 100%;
}

.message.user-message {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.user-avatar {
  background: #19c37d;
}

.assistant-avatar {
  background: #ab68ff;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.6;
  word-wrap: break-word;
}

.user-message .message-text {
  background: #19c37d;
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant-message .message-text {
  background: #f7f7f8;
  color: #343541;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: #8e8ea0;
  margin-top: 4px;
  padding: 0 4px;
}

.user-message .message-time {
  text-align: right;
}

/* 載入指示器 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8e8ea0;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 輸入區域 */
.input-container {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e5e5;
}

.input-form {
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  max-height: 200px;
  overflow-y: auto;
  transition: border-color 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: #19c37d;
  box-shadow: 0 0 0 3px rgba(25, 195, 125, 0.1);
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #19c37d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #16a570;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 滾動條樣式 */
.messages-container::-webkit-scrollbar,
.chat-history::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track,
.chat-history::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb,
.chat-history::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover,
.chat-history::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
}
</style>

