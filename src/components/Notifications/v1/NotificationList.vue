<template>
  <q-drawer
    id="sidebar-drawer-notification"
    side="right"
    v-model="openPanelNotification"
    show-if-above
    :mini="false"
    :width="400"
    :breakpoint="600"
    bordered
    class="full-height"
    aria-label="Menú notificaciones"
    behavior="mobile"
    persistent
  >
    <header class="mb-1 q-py-md row justify-end">
      <q-space></q-space>
      <Button
        label=""
        :right-icon="defaultIconsLucide?.closeCircle"
        color="white"
        color-icon="gray"
        class-custom="custom"
        outline
        @click="openPanelNotification = false"
        aria-label="Cerrar menú notificaciones"
      />
    </header>
    <q-infinite-scroll
      @load="onLoadNotifications"
      :offset="500"
      :disable="!openPanelNotification"
    >
      <div v-if="loading" class="row justify-center q-my-md">
        <div class="q-pa-md">
          <Card v-for="i in 5" :key="i">
            <template #content-card>
              <div
                class="q-px-md q-py-sm row no-wrap relative-position"
                style="width: 350px; height: 150px"
              >
                <div class="column justify-center q-pr-sm">
                  <q-skeleton type="QAvatar" />
                </div>
                <div class="column justify-center full-width">
                  <div class="q-item__label">
                    <q-skeleton type="text" />
                  </div>
                  <div
                    class="q-item__label q-item__label--caption text-caption"
                  >
                    <q-skeleton type="text" width="80%" />
                  </div>
                  <div class="row justify-between q-col-gutter-sm mt-2 mx-2">
                    <q-skeleton type="text" width="50px" />
                    <q-skeleton type="text" width="50px" />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div v-else class="q-pa-sm">
        <q-list>
          <q-item v-for="(n, i) in notifications" :key="i" class="q-pa-none">
            <Card class="full-width">
              <template #content-card>
                <header class="mb-1 row justify-end">
                  <q-space></q-space>
                  <Button
                    label=""
                    :right-icon="defaultIconsLucide.close"
                    color="white"
                    :color-icon="n.status_id === 115 ? 'black' : 'grey'"
                    class-custom="custom"
                    outline
                    :disabled="n.is_confirm_required && n.status_id === 116"
                    @click="onDeleteNotification(n.id)"
                    aria-label="Eliminar notificación"
                  />
                </header>
                <div class="q-item q-item-type row no-wrap q-px-md q-pb-md">
                  <q-item-section avatar class="bell-notification mt-0">
                    <Icon
                      label=""
                      :name="defaultIconsLucide.bell"
                      color="#F45100"
                      default-class="custom"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium mt-0">
                      {{ n.title }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      {{ n.description }}
                    </q-item-label>
                    <div class="row justify-between q-col-gutter-sm mt-2">
                      <p class="mb-0 text-caption text-grey-7 content-center">
                        {{ n.start_date }}
                      </p>
                      <div
                        v-if="n.is_confirm_required"
                        class="text-grey-6 content-center"
                      >
                        <Button
                          v-if="n.status_id === 116"
                          size="md"
                          :outline="false"
                          label="Confirmar"
                          color="orange"
                          class-custom="custom"
                          @click="onConfirmNotification(n.id)"
                        />
                        <Button
                          v-else
                          size="15px"
                          :outline="false"
                          label="Confirmado"
                          :styleText="{
                            'font-weight': 'bold',
                            color: 'black',
                            fontSize: '12px',
                          }"
                          :style-content="{
                            cursor: 'default',
                            width: '7rem',
                          }"
                          color-icon="#E25D0F"
                          :right-icon="defaultIconsLucide.checkCircle"
                          color="mistyrose"
                          class-custom="custom"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </div>
              </template>
            </Card>
          </q-item>
        </q-list>
      </div>
      <template v-if="notifications.length == 0 && !loading">
        <div class="q-my-md flex column items-center">
          <div class="bell-notification mt-0 mb-6">
            <Icon
              label=""
              :name="defaultIconsLucide.bell"
              color="#F45100"
              :size="45"
              default-class="custom"
            />
          </div>
          <p class="mb-0 text-h5 text-center">No hay notificaciones</p>
        </div>
      </template>
      <template #loading v-if="notifications.length > 0 && !loading">
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-drawer>
</template>

<script setup lang="ts">
// Props
const props = withDefaults(defineProps<Readonly<NotificationListProps>>(), {
  open: false,
})

// Emits
const emits = defineEmits(['update:open'])

// Components
import Button from '@/components/common/Button/Button.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Icon from '@/components/common/Icon/Icon.vue'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { NotificationListProps } from '@/interfaces/global'

// Logic
import useNotificationList from './NotificationList'

const {
  openPanelNotification,
  notifications,
  loading,
  onLoadNotifications,
  onDeleteNotification,
  onConfirmNotification,
} = useNotificationList(props, emits)
</script>
