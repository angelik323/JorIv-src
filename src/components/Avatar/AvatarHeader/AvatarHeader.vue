<template>
  <div class="header-actions__container">
    <!-- Notificaciones -->
    <div class="notifications">
      <q-btn
        class="q-pa-none q-ma-none"
        round
        flat
        aria-label="Abrir panel de notificaciones"
        @click="emits('click:notification')"
      >
        <q-avatar class="cursor-pointer">
          <Icon name="Bell" :size="25" color="black" />
          <q-badge color="red" floating transparent rounded class="bell-badge">
            {{ count_notification_pending }}
          </q-badge>
        </q-avatar>
      </q-btn>
    </div>

    <q-separator vertical color="black" aria-hidden="true" />

    <div class="profile-container">
      <q-avatar
        class="non-selectable"
        color="primary_fiduciaria"
        text-color="white"
        size="40px"
        aria-hidden="true"
      >
        <img
          v-if="loggedUser?.user?.photo"
          :src="loggedUser?.user?.photo"
          alt="Foto de perfil"
        />
        <div v-else>
          {{ initials }}
        </div>
      </q-avatar>

      <dl v-if="!$q.screen.lt.sm" class="user-info">
        <div class="user-info-name">
          <dt class="sr-only">Nombre de usuario</dt>
          <dd>{{ fullName }}</dd>
        </div>

        <div class="user-info-role">
          <dt class="sr-only">Rol de usuario</dt>
          <dd>{{ loggedUser?.role ?? 'No registrado' }}</dd>
        </div>
      </dl>

      <q-btn
        class="q-ml-lg"
        color="black"
        flat
        round
        dense
        :icon="showMenuProfile ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        :aria-label="`${showMenuProfile ? 'Cerrar' : 'Abrir'} menú del perfil`"
      >
        <q-menu
          class="profile-menu"
          v-model="showMenuProfile"
          :offset="[0, 20]"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          aria-label="Menú del perfil"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              aria-label="Cambiar contraseña"
              @click="$router.push({ name: 'ChangePasswordProfile' })"
            >
              <q-item-section>Cambiar contraseña</q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>Ayuda</q-item-section>
            </q-item>

            <q-separator />

            <q-item
              class="exit-button text-orange"
              clickable
              v-close-popup
              aria-label="Cerrar sesión"
              @click="logout"
            >
              <q-item-section avatar>
                <Icon :name="defaultIconsLucide.arrowRight" :size="24" />
              </q-item-section>

              <q-item-section>Salir</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { useLogin as useLoginStore, useNotificationsStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'

// Emits
const emits = defineEmits(['click:notification'])

// Components
import Icon from '@/components/common/Icon/Icon.vue'

const router = useRouter()
const { openMainLoader } = useMainLoader()
const { _logoutAction } = useLoginStore()
const { loggedUser } = storeToRefs(useLoginStore())
const { _getCountPendingNotifications } = useNotificationsStore('v1')
const { count_notification_pending } = storeToRefs(useNotificationsStore('v1'))

const showMenuProfile = ref(false)

const fullName = computed(() => {
  return `${loggedUser?.value?.user?.name} ${loggedUser?.value?.user?.last_name}`
})

const initials = computed(() => {
  return (
    (loggedUser?.value?.user?.name || '')[0] +
    (loggedUser?.value?.user?.last_name || '')[0]
  )
})

const logout = async () => {
  openMainLoader(true)
  if (await _logoutAction()) {
    await router.push({ name: 'LoginView' })
  }
  openMainLoader(false)
}

onMounted(async () => {
  await _getCountPendingNotifications()
})
</script>

<style lang="scss">
.header-actions {
  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    height: 100%;
    gap: 32px;
    z-index: 9999;

    .q-separator--vertical {
      margin: 6px 0;
    }
  }
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  .user-info {
    letter-spacing: 0px;
    margin: 0;

    * {
      margin: inherit;
    }

    .user-info-name {
      color: $black-90;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: normal;
    }

    .user-info-role {
      color: $black-60;
      font-size: 0.8125rem;
      line-height: 1.125rem;
      font-weight: 400;
    }
  }
}

.profile-menu {
  color: $black-90;
  min-width: 240px !important;
  max-width: 240px !important;
  border: 1px solid $black-25;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(227, 228, 229, 0.3),
    0 2px 2px rgba(227, 228, 229, 0.25), 0 3px 1px -2px rgba(227, 228, 229, 0.2);

  .q-list {
    .q-item {
      min-height: 38px;
      padding: 8px 12px;

      .q-item__section--avatar {
        min-width: auto;
        padding-right: 12px;
      }

      &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }

    .q-item.exit-button {
      font-size: 0.9375rem;
    }
  }
}

.bell-button {
  background-color: transparent;
  border: none;
  cursor: pointer !important;
}
</style>
