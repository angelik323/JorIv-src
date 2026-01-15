<template>
  <q-form ref="formRefName">
    <section>
      <div class="row q-col-gutter-lg q-mt-md items-start">
        <div class="col-12 col-md-6">
          <div class="q-gutter-md">
            <div class="col-12">
              <GenericCheckboxSelector
                label="Usuarios"
                :modelValue="notificationData.users"
                :options="notificationDataSelect.users"
                :placeholder="'Buscar usuarios'"
                :show_selected_chips="false"
                :loading="isLoadingUsers"
                @search="onUserSearch"
                required
                @change="(val) => handlerExcludeIdsUser(val)"
              />
            </div>

            <div class="col-12">
              <GenericCheckboxSelector
                label="Roles"
                :modelValue="notificationData.roles"
                :options="notificationDataSelect.roles"
                :show_selected_chips="false"
                auto_complete
                required
                @change="(val) => (notificationData.roles = val)"
              />
            </div>

            <div class="col-12">
              <GenericCheckboxSelector
                label="Negocios"
                :modelValue="notificationData.business"
                :options="notificationDataSelect.business"
                :show_selected_chips="false"
                auto_complete
                required
                @change="(val) => (notificationData.business = val)"
              />
            </div>

            <div class="col-12">
              <GenericInputComponent
                label="Correo"
                :default_value="emailInputValue"
                class_name="q-mt-none"
                placeholder="Inserte"
                type="email"
                required
                :rules="[
                (val: string) => useRules().email_no_consecutive_specials(val),
                (val: string) => useRules().email_no_invalid_characters(val),
                (val: string) => useRules().email_max_length(val, 254),
                (val: string) => useRules().email_min_length(val, 5),
                (val: string) => useRules().email_no_accents(val),
                (val: string) => useRules().email_validation(val),
              ]"
                :append_icon="defaultIconsLucide.plusCircle"
                append_clickable
                @click:appendIcon="handleUpdateEmails"
                @update:modelValue="emailInputValue = $event"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <VCard>
            <template #content-card>
              <div class="full-width q-gutter-md q-py-lg">
                <div v-if="hasNotificationData" class="text-center">
                  <div class="row justify-center my-4">
                    <img
                      src="@/assets/images/icons/no_data_3.svg"
                      alt="Helion"
                    />
                  </div>
                  <p class="text-weight-bold text-h6">
                    Realice una búsqueda para ver los datos
                  </p>
                  <p class="text-weight-light text-h6">
                    Aquí visualizará los resultados de su búsqueda
                  </p>
                </div>

                <div v-else>
                  <ChipRow
                    label="Usuarios"
                    :default-value="notificationData.users"
                    :removable="true"
                    :hiddenCount="0"
                    @change="(val) => (notificationData.users = val)"
                  />

                  <q-separator class="q-my-md" />

                  <ChipRow
                    label="Roles"
                    :default-value="notificationData.roles"
                    :removable="true"
                    :hiddenCount="0"
                    @change="(val) => (notificationData.roles = val)"
                  />

                  <q-separator class="q-my-md" />

                  <ChipRow
                    label="Negocios"
                    :default-value="notificationData.business"
                    :removable="true"
                    :hiddenCount="0"
                    @change="(val) => (notificationData.business = val)"
                  />

                  <q-separator class="q-my-md" />

                  <ChipRow
                    label="Correos"
                    :default-value="emailsDefaultValue"
                    :removable="true"
                    :hiddenCount="0"
                    @change="onEmailsChange"
                  />
                </div>
              </div>
            </template>
          </VCard>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericCheckboxSelector from '@/components/common/GenericCheckboxSelector/GenericCheckboxSelector.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ChipRow from '@/components/common/ChipRow/ChipRow.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import {
  ICalendarEventView,
  IFormNotification,
} from '@/interfaces/customs/agenda/CalendarEvents'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useNotificationsForm from '@/components/Forms/CalendarEvents/notification/NotificationForm'

const props = withDefaults(
  defineProps<{
    formType: 'notification' | 'confirmation'
    action: ActionType
    data?: IFormNotification | ICalendarEventView
    tabActive?: string
    excludeIdsUsers: number[]
  }>(),
  {}
)

const {
  formRefName,
  onUserSearch,
  validateForm,
  onEmailsChange,
  isLoadingUsers,
  emailInputValue,
  notificationData,
  emailsDefaultValue,
  defaultIconsLucide,
  handleUpdateEmails,
  hasNotificationData,
  handlerExcludeIdsUser,
  notificationDataSelect,
} = useNotificationsForm(props)

defineExpose({
  getValues: () => ({
    ...notificationData.value,
    emails: notificationDataSelect.value.emails,
  }),
  validateForm,
})
</script>
