<script setup lang="ts">
// Utils
import { ref, watch, computed } from 'vue'
import { useIdle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Stores
import { useLogin } from '@/stores'

// Composables
import { useMainLoader } from '@/composables'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

const { _logoutAction } = useLogin()
const { session_timeout } = storeToRefs(useLogin())

const { openMainLoader } = useMainLoader()

// Tiempo de inactividad configurable
const userIdleTimeoutMs = ref(session_timeout.value ?? 10000) // 10 segundos

// Activamos la detección
let idleInstance = useIdle(userIdleTimeoutMs.value) // Instancia inicial
const idle = computed(() => idleInstance.idle) // Reactividad para el estado de inactividad

// Referencia al modal
const alertModalRef = ref<InstanceType<typeof AlertModalComponent> | null>(null)

// Router para redirigir
const router = useRouter()

// Detectamos inactividad
watch(idle.value, async (isIdle) => {
  if (isIdle) {
    await alertModalRef.value?.openModal()

    // Si el usuario sigue inactivo, forzamos logout luego de 10 segundos;
    setTimeout(() => {
      if (userIdleTimeoutMs.value === 0) {
        return
      }
      handleCloseModal()
    }, 10000)
  }
})

watch(session_timeout, () => {
  userIdleTimeoutMs.value = session_timeout.value ?? 10000 // 10 segundos

  idleInstance = useIdle(userIdleTimeoutMs.value)
})

// Cuando el usuario cierra el modal, forzamos logout
const handleCloseModal = async () => {
  openMainLoader(true)

  if (await _logoutAction()) {
    userIdleTimeoutMs.value = 0
    await alertModalRef.value?.closeModal()
    await router.push({ name: 'LoginView' })
  }
  openMainLoader(false)
}
</script>

<template>
  <div>
    <!-- Modal de inactividad -->
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="Alerta de inactividad"
      :description_message="'Su tiempo de inactividad ha sido superado, su sesión se cerrará automáticamente en 10 segundos. '"
      :show-btn-cancel="false"
      :show-close-btn="false"
      @confirm="handleCloseModal"
    />
  </div>
</template>
