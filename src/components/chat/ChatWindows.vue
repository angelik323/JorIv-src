<template>
  <div class="chatbot">
    <!-- Navbar -->
    <nav class="chatbot__navbar">
      <q-img
        src="@/assets/images/fiduprevisora-logo.svg"
        style="width: 80%; max-width: 180px"
      />
    </nav>

    <!-- Vista principal del chat -->
    <div class="chatbot__view">
      <div class="chat">
        <!-- Header del chat -->
        <header class="chat__header row justify-between items-center">
          <!-- <div class="header "> -->
          <div class="header__content">
            <q-avatar size="50px" class="bot__avatar">
              <img src="@/assets/images/chatbot.png" alt="Avatar del bot" />
            </q-avatar>
            <div class="header__info">
              <div class="bot__name">Asistente Virtual</div>
              <div class="bot__status">
                <span class="status__dot"></span>
                En línea
              </div>
            </div>
          </div>
          <div class="header__actions">
            <Button
              flat
              :icon="'RefreshCw'"
              outline
              @click="resetChat"
              tooltip="Nueva conversación"
              color-icon="white"
              class="action-btn"
            />
          </div>
          <!-- </div> -->
        </header>

        <!-- Contenedor de mensajes -->
        <div ref="messagesContainer" class="chat__messages">
          <!-- Lista de mensajes -->
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="`message--${message.type}`"
          >
            <!-- Avatar del bot (solo para mensajes del bot) -->
            <q-avatar
              v-if="message.type === 'bot'"
              size="36px"
              class="message__avatar"
            >
              <img src="@/assets/images/chatbot.png" alt="Bot" />
            </q-avatar>

            <!-- Contenido del mensaje -->
            <div class="message__content">
              <div class="message__bubble">
                <!-- Indicador de escritura -->
                <div v-if="message.isTyping" class="typing">
                  <span class="typing__dot"></span>
                  <span class="typing__dot"></span>
                  <span class="typing__dot"></span>
                </div>
                <!-- Texto del mensaje -->
                <div v-else>{{ message.text }}</div>
              </div>
              <div class="message__time">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>

            <!-- Avatar del usuario (solo para mensajes del usuario) -->
            <q-avatar
              v-if="message.type === 'user'"
              size="36px"
              class="message__avatar"
              color="primary"
              text-color="white"
            >
              <q-icon name="mdi-account" />
            </q-avatar>
          </div>

          <!-- Estado vacío (sin mensajes) -->
          <div v-if="messages.length === 0" class="empty-state">
            <q-icon name="chat_bubble_outline" size="64px" color="grey-5" />
            <p class="empty-state__text">Inicia una conversación</p>
          </div>
        </div>

        <!-- Área de entrada de mensajes -->
        <div class="chat__input">
          <form class="input-form">
            <q-input
              v-model="userInput"
              placeholder="Escribe tu mensaje..."
              outlined
              dense
              type="text"
              class="full-width"
              :maxlength="1000"
              :disable="isLoading"
              @keydown.enter.prevent="sendMessage"
              clearable
              @update:model-value="userInput = ($event as string) ?? ''"
            >
              <template #append>
                <q-spinner-dots v-if="isLoading" color="primary" size="20px" />
              </template>
            </q-input>

            <Button
              size="md"
              :outline="false"
              :icon="'Send'"
              color-icon="white"
              color="#660033"
              class="send-btn"
              :disable="!userInput.trim() || isLoading"
              aria-label="Enviar mensaje"
              @click="sendMessage"
            />
          </form>
        </div>

        <!-- Display del ID del chat (solo en desarrollo) -->
        <div v-if="showChatId" class="chat__id-display">
          <small>Chat ID: {{ chatId }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Button from '@/components/common/Button/Button.vue'

// Props
const props = withDefaults(
  defineProps<{
    webhookUrl: string
    showChatId?: boolean
    welcomeMessage?: string
  }>(),
  {
    showChatId: false,
    welcomeMessage:
      '¡Hola! 👋 Soy Marcela, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
  }
)

// State
const chatId = ref<string>('')
const userInput = ref('')
const messages = ref<
  {
    text: string
    type: 'user' | 'bot'
    timestamp: Date
    isTyping?: boolean
  }[]
>([])
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// Methods
const generateChatId = (): string => {
  return 'temp-' + new Date().getTime() + '-' + new Date().getMilliseconds()
}

const initializeChat = () => {
  // Check if there's a stored chat_id in localStorage
  const storedChatId = localStorage.getItem('chat_id')

  if (storedChatId) {
    chatId.value = storedChatId
  } else {
    chatId.value = generateChatId()
    localStorage.setItem('chat_id', chatId.value)
  }

  // Load previous messages if any
  const storedMessages = localStorage.getItem(`chat_messages_${chatId.value}`)
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }))
  } else {
    // Add welcome message
    if (props.welcomeMessage) {
      addBotMessage(props.welcomeMessage)
    }
  }
}

const saveMessages = () => {
  localStorage.setItem(
    `chat_messages_${chatId.value}`,
    JSON.stringify(messages.value)
  )
}

const addBotMessage = async (text: string, typing: boolean = false) => {
  messages.value.push({
    text,
    type: 'bot',
    timestamp: new Date(),
    isTyping: typing,
  })
  saveMessages()

  // Ensure the messages container scrolls to the bottom after the DOM updates
  await scrollToBottom()
}

const addUserMessage = (text: string) => {
  messages.value.push({
    text,
    type: 'user',
    timestamp: new Date(),
  })
  saveMessages()
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const messageText = userInput.value.trim()
  userInput.value = ''

  // Add user message to UI
  addUserMessage(messageText)
  await scrollToBottom()

  // Show typing indicator
  isLoading.value = true
  const typingIndex = messages.value.length
  addBotMessage('', true)
  await scrollToBottom()

  try {
    // Send to n8n webhook
    const response = await fetch(props.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId.value,
        message: messageText,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()

    // Remove typing indicator
    messages.value = messages.value.filter((_, index) => index !== typingIndex)

    // Add bot response
    const botResponse = data || 'Gracias por tu mensaje. Te responderé pronto.'
    await addBotMessage(botResponse)
    playNotificationSound()
  } catch (error) {
    // Remove typing indicator
    messages.value = messages.value.filter((_, index) => index !== typingIndex)

    // Show error message
    await addBotMessage(
      'Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.'
    )
    playNotificationSound()
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const clearMessages = () => {
  messages.value = []
  localStorage.removeItem(`chat_messages_${chatId.value}`)
}

const clearLocalStorage = () => {
  localStorage.removeItem('chat_id')
  localStorage.removeItem(`chat_messages_${chatId.value}`)
  messages.value = []
}

const resetChat = () => {
  if (confirm('¿Estás seguro de que deseas iniciar una nueva conversación?')) {
    // Generate new chat ID
    chatId.value = generateChatId()
    localStorage.setItem('chat_id', chatId.value)

    // Clear messages
    clearMessages()

    // Add welcome message
    if (props.welcomeMessage) {
      addBotMessage(props.welcomeMessage)
    }
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Google Chat: sonido suave que sube de tono
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime) // Si5
    oscillator.frequency.exponentialRampToValueAtTime(
      987,
      audioContext.currentTime + 0.2
    ) // Si5 a Si6
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(1.0, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2
    )

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  } catch (e) {
    throw new Error('Web Audio API is not supported in this browser')
  }
}

onMounted(() => {
  clearLocalStorage()
  initializeChat()
  scrollToBottom()
})
</script>

<style scoped lang="scss">
.chatbot {
  background: #f8fafc;
  height: 100vh;

  // Navbar del chatbot
  &__navbar {
    background: linear-gradient(135deg, #660033 0%, #240113 100%);
    color: white;
    padding: 30px 20px;
    font-size: 18px;
    font-weight: 600;
  }

  // Vista principal del chat
  &__view {
    overflow: hidden;
    height: calc(100vh - 100px);
    align-content: center;

    @media (min-width: 1200px) {
      padding: 0px;
    }

    @media (min-width: 768px) {
      padding: 70px;
    }
  }
}

.chat {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  margin: 0 auto;
  height: 100%;

  @media (min-width: 768px) {
    max-width: 500px;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
    border-radius: 20px 20px 20px 20px;
  }

  @media (min-width: 1200px) {
    border-radius: 20px 20px 0 0;
    max-width: 500px;
  }

  // Header del chat
  &__header {
    background: linear-gradient(135deg, #660033 0%, #240113 100%);
    color: white;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    @media (min-width: 768px) {
      border-radius: 20px 20px 0 0;
    }

    @media (max-width: 600px) {
      border-radius: 0px;
    }
  }

  // Área de mensajes
  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 600px) {
      padding: 16px;
      gap: 16px;
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;

      &:hover {
        background: #94a3b8;
      }
    }
  }

  // Input del chat
  &__input {
    padding: 20px;
    background: white;
    border-top: 1px solid #e2e8f0;
    flex-shrink: 0;
    border-radius: 0px 0px 10px 10px;

    @media (max-width: 600px) {
      padding: 16px;
    }
  }

  // Display del ID del chat
  &__id-display {
    padding: 8px 20px;
    background: #f1f5f9;
    text-align: center;
    border-top: 1px solid #e2e8f0;
    font-family: monospace;
    color: #64748b;
    font-size: 11px;
  }
}

// ==============================================
// HEADER (bloque del encabezado)
// ==============================================
.header {
  // Contenido principal del header
  &__content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  // Información del header (nombre + estado)
  &__info {
    display: flex;
    flex-direction: column;
  }

  // Acciones del header (botones)
  &__actions {
    display: flex;
    gap: 8px;
  }
}

// ==============================================
// BOT (bloque de información del bot)
// ==============================================
.bot {
  // Avatar del bot
  &__avatar {
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  // Nombre del bot
  &__name {
    font-weight: 600;
    font-size: 18px;
    letter-spacing: -0.01em;

    @media (max-width: 600px) {
      font-size: 16px;
    }
  }

  // Estado del bot (online/offline)
  &__status {
    font-size: 13px;
    opacity: 0.95;
    display: flex;
    align-items: center;
    gap: 6px;

    @media (max-width: 600px) {
      font-size: 12px;
    }
  }
}

// ==============================================
// STATUS (bloque de indicador de estado)
// ==============================================
.status {
  &__dot {
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// ==============================================
// ACTION-BTN (bloque de botones de acción)
// ==============================================
.action-btn {
  color: white;
  opacity: 0.9;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
  }
}

// ==============================================
// EMPTY-STATE (bloque de estado vacío)
// ==============================================
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.5;

  &__text {
    font-size: 18px;
    color: #64748b;
    margin-top: 16px;
  }
}

// ==============================================
// MESSAGE (bloque de mensaje)
// ==============================================
.message {
  display: flex;
  gap: 12px;
  animation: messageSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 85%;

  @media (max-width: 600px) {
    max-width: 90%;
  }

  // Avatar del mensaje
  &__avatar {
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  // Contenedor de contenido del mensaje
  &__content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  // Burbuja del mensaje
  &__bubble {
    padding: 14px 18px;
    border-radius: 18px;
    word-wrap: break-word;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    max-width: 100%;

    @media (max-width: 600px) {
      padding: 12px 16px;
      font-size: 15px;
    }
  }

  // Hora del mensaje
  &__time {
    font-size: 11px;
    color: #64748b;
    padding: 0 8px;
    font-weight: 500;
  }

  // Modificador: mensaje del usuario
  &--user {
    flex-direction: row;
    align-self: flex-end;

    .message__content {
      align-items: flex-end;
    }

    .message__bubble {
      background: white;
      color: black;
      border-bottom-right-radius: 6px;
    }
  }

  // Modificador: mensaje del bot
  &--bot {
    align-self: flex-start;

    .message__bubble {
      background: black;
      color: #f4f5f6;
      border-bottom-left-radius: 6px;
    }
  }
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ==============================================
// TYPING (bloque de indicador de escritura)
// ==============================================
.typing {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 4px 0;

  &__dot {
    width: 8px;
    height: 8px;
    background: #cbd5e1;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

// ==============================================
// INPUT-FORM (bloque del formulario de entrada)
// ==============================================
.input-form {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

// ==============================================
// SEND-BTN (bloque del botón de envío)
// ==============================================
.send-btn {
  border-radius: 30px;
  width: 48px;
  height: 40px;
  // flex-shrink: 0;
  // transition: all 0.2s;
  // box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:not(:disabled):hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:not(:disabled):active {
    transform: scale(0.95);
  }
}
</style>
