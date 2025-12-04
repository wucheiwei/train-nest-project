<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 聊天室頁面不需要背景漸變 */
body:has(.chat-container) {
  background: #f7f7f8;
  padding: 0;
  align-items: stretch;
}

/* 確保聊天容器佔滿整個視窗 */
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app:has(.chat-container) {
  width: 100%;
  height: 100vh;
  display: block;
  align-items: stretch;
}
</style>

