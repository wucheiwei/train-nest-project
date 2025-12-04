// 模擬聊天 API - 不需要後端支援
// 使用簡單的關鍵字匹配來生成回應

const simulateDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const generateResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  // 簡單的關鍵字回應邏輯
  if (message.includes('你好') || message.includes('hello') || message.includes('hi')) {
    return '你好！很高興為您服務。有什麼我可以幫助您的嗎？';
  } else if (message.includes('時間') || message.includes('time')) {
    return `現在時間是：${new Date().toLocaleString('zh-TW')}`;
  } else if (message.includes('天氣') || message.includes('weather')) {
    return '抱歉，我目前無法查詢天氣資訊。建議您查看天氣應用程式或網站。';
  } else if (message.includes('幫助') || message.includes('help')) {
    return '我可以幫助您：\n- 回答問題\n- 提供資訊\n- 進行對話\n\n請告訴我您需要什麼幫助！';
  } else if (message.includes('再見') || message.includes('bye') || message.includes('bye bye')) {
    return '再見！祝您有美好的一天！';
  } else if (message.includes('謝謝') || message.includes('thank')) {
    return '不客氣！很高興能幫助您。還有其他問題嗎？';
  } else if (message.includes('名字') || message.includes('name')) {
    return '我是一個簡單的聊天機器人示範。您可以叫我 AI 助手！';
  } else if (message.includes('功能') || message.includes('能做什麼')) {
    return '我目前可以：\n1. 回答簡單問題\n2. 進行基本對話\n3. 提供時間資訊\n\n這是一個前端示範，所有回應都在瀏覽器中生成，無需後端支援。';
  } else if (message.includes('前端') || message.includes('frontend')) {
    return '是的！這個聊天室完全在前端運行，使用 Vue.js 構建。所有功能都在瀏覽器中實現，包括訊息處理和回應生成。';
  } else {
    // 預設回應 - 更智能的回應
    const responses = [
      `我理解您說：「${userMessage}」\n\n這是一個前端聊天機器人示範。所有回應都在瀏覽器中生成，無需後端支援。`,
      `關於「${userMessage}」，這是一個很好的問題！\n\n目前這是一個前端示範版本，您可以嘗試問我：\n- 你好\n- 時間\n- 幫助\n- 功能`,
      `我收到了您的訊息：「${userMessage}」\n\n這是一個純前端的聊天介面，所有處理都在瀏覽器中完成。您可以嘗試不同的問題來測試功能！`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

export const chatAPI = {
  // 發送訊息 - 模擬 API 調用
  sendMessage: async (messages) => {
    // 模擬網路延遲
    await simulateDelay(500 + Math.random() * 1000);
    
    // 獲取最後一條用戶訊息
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role !== 'user') {
      throw new Error('最後一條訊息必須是用戶訊息');
    }
    
    // 生成回應
    const response = generateResponse(lastMessage.content);
    
    return {
      message: response,
      timestamp: new Date().toISOString(),
    };
  },

  // 獲取聊天歷史（可選）- 目前返回空，因為歷史存在 localStorage
  getChatHistory: async () => {
    await simulateDelay(200);
    return {
      history: [],
    };
  },
};

