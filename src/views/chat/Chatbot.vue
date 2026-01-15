<template>
  <ChatView
    :webhook-url="webhookUrl"
    :show-chat-id="isDevelopment"
    welcome-message="¡Hola! 👋 Soy Marcela, tu asistente virtual. ¿En qué puedo ayudarte hoy?"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChatView from '@/components/chat/ChatWindows.vue'

// Get webhook URL from environment variables
const webhookUrl = 'https://n8n.srv891132.hstgr.cloud/webhook/fidu'

// 'https://jarzusa.app.n8n.cloud/webhook/80682c8a-1ef8-478f-869e-a0bbca587d5e'

// Show chat ID only in development mode
const isDevelopment = computed(() => {
  return true
})
</script>
