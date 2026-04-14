<template>
  <div class="ai-chat-overlay" v-if="visible">
    <div class="ai-chat-panel">
      <div class="ai-chat-header">
        <h2 class="ai-chat-title">{{ locale === 'zh' ? 'AI 助手' : 'AI Assistant' }}</h2>
        <button class="close-btn" @click="handleClose" title="Close">
          <span class="close-icon">×</span>
        </button>
      </div>
      
      <!-- 聊天内容区域 -->
      <div class="chat-content" ref="chatContent">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          class="chat-message"
          :class="msg.role"
        >
          <div class="message-avatar">
            {{ msg.role === 'user' ? (locale === 'zh' ? '你' : 'You') : 'AI' }}
          </div>
          <div class="message-bubble">
            <div class="message-text">{{ msg.content }}</div>
          </div>
        </div>
        
        <!-- AI思考中状态（只在加载中且没有AI消息时显示） -->
        <div v-if="isLoading && !hasLastAIMessage" class="chat-message ai loading">
          <div class="message-avatar">AI</div>
          <div class="message-bubble loading-bubble">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="chat-input-area">
        <input
          ref="inputRef"
          v-model="inputMessage"
          type="text"
          :placeholder="locale === 'zh' ? '输入消息...' : 'Type a message...'"
          @keyup.enter="sendMessage"
          :disabled="isLoading || isInputDisabled"
        />
        <button 
          class="send-btn" 
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading || isInputDisabled"
        >
          {{ locale === 'zh' ? '发送' : 'Send' }}
        </button>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIChat',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      default: 'zh'
    }
  },
  emits: ['close'],
  data() {
    return {
      inputMessage: '',
      messages: [],
      isLoading: false,
      isInputDisabled: false
    };
  },
  computed: {
    hasLastAIMessage() {
      const lastMsg = this.messages[this.messages.length - 1];
      return lastMsg && lastMsg.role === 'assistant';
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.isInputDisabled = true;
        this.inputMessage = '';
        this.$nextTick(() => {
          this.$refs.inputRef?.focus();
          this.scrollToBottom();
        });
        // 0.5秒后允许输入
        setTimeout(() => {
          this.isInputDisabled = false;
        }, 500);
      }
    },
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  },
  methods: {
    async sendMessage() {
      const message = this.inputMessage.trim();
      if (!message || this.isLoading) return;

      // 添加用户消息
      this.messages.push({
        role: 'user',
        content: message
      });

      this.inputMessage = '';
      this.isLoading = true;

      try {
        const response = await fetch(`http://36.151.149.186:8081/api/ai-chat/deepseek?message=${encodeURIComponent(message)}`, {
          method: 'POST'
        });

        const result = await response.json();
        const fullText = result.data || result.result || result.message || result.response || result;

        if (fullText && typeof fullText === 'string') {
          // 添加空的AI消息用于逐字显示
          const aiMessageIndex = this.messages.length;
          this.messages.push({
            role: 'assistant',
            content: ''
          });
          // 逐字显示效果
          for (let i = 0; i < fullText.length; i++) {
            this.messages[aiMessageIndex].content = fullText.slice(0, i + 1);
            this.scrollToBottom();
            // 每字延迟 30ms
            await new Promise(resolve => setTimeout(resolve, 30));
          }
        } else {
          this.messages.push({
            role: 'assistant',
            content: this.locale === 'zh'
              ? '抱歉，服务暂时不可用。'
              : 'Sorry, the service is temporarily unavailable.'
          });
        }
      } catch (error) {
        this.messages.push({
          role: 'assistant',
          content: this.locale === 'zh'
            ? '网络连接失败，请稍后重试。'
            : 'Network connection failed. Please try again later.'
        });
      } finally {
        this.isLoading = false;
      }
    },
    scrollToBottom() {
      const content = this.$refs.chatContent;
      if (content) {
        content.scrollTop = content.scrollHeight;
      }
    },
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.ai-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.ai-chat-panel {
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  height: 70vh;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid #d4c4a8;
  overflow: hidden;
}

.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px 15px 30px;
  border-bottom: 1px solid rgba(139, 69, 19, 0.2);
  background: rgba(139, 69, 19, 0.05);
}

.ai-chat-title {
  margin: 0;
  color: #5c4a32;
  font-size: 24px;
  font-weight: 600;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(139, 69, 19, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(139, 69, 19, 0.25);
  transform: scale(1.05);
}

.close-icon {
  font-size: 24px;
  color: #5c4a32;
  font-weight: 300;
  line-height: 1;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: messageEnter 0.3s ease;
}

.chat-message.user {
  flex-direction: row-reverse;
}

@keyframes messageEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #8b4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.chat-message.user .message-avatar {
  background: #d4a574;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 20px;
}

.message-bubble.empty {
  min-height: 20px;
  min-width: 40px;
}

.chat-message.user .message-bubble {
  background: #8b4513;
  color: white;
}

.chat-message.ai .message-bubble {
  background: white;
  color: #5c4a32;
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

/* 加载动画 */
.loading-dots {
  display: flex;
  gap: 6px;
  padding: 4px 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #8b4513;
  border-radius: 50%;
  animation: dotBounce 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotBounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.loading-bubble {
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input-area {
  display: flex;
  gap: 12px;
  padding: 20px 30px;
  border-top: 1px solid rgba(139, 69, 19, 0.2);
  background: rgba(139, 69, 19, 0.05);
}

.chat-input-area input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #d4c4a8;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  color: #5c4a32;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input-area input:focus {
  border-color: #8b4513;
}

.chat-input-area input::placeholder {
  color: #999;
}

.chat-input-area input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  padding: 12px 24px;
  background: #8b4513;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: #6b3410;
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 滚动条样式 */
.chat-content::-webkit-scrollbar {
  width: 6px;
}

.chat-content::-webkit-scrollbar-track {
  background: transparent;
}

.chat-content::-webkit-scrollbar-thumb {
  background: rgba(139, 69, 19, 0.3);
  border-radius: 3px;
}

.chat-content::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 69, 19, 0.5);
}
</style>
