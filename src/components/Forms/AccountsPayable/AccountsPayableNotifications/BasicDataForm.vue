<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Número de notificación"
            :default_value="models.notification_number"
            disabled
          />
        </div>
        <div class="col-12 col-md-3" v-if="action === 'view'">
          <div class="text-black-90">
            <p class="text-weight-bold">Número de notificación</p>
            <p class="text-weight-medium">
              {{ models.notification_number ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
          v-if="['create', 'edit'].includes(action)"
        >
          <GenericSelectorComponent
            label="Módulo"
            :manual_option="notification_modules"
            :map_options="true"
            :default_value="models.module"
            required
            @update:model-value="models.module = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El módulo es requerido'),
            ]"
          />
        </div>
        <div class="col-12 col-md-3" v-else>
          <div class="text-black-90">
            <p class="text-weight-bold">Módulo</p>
            <p class="text-weight-medium">
              {{ models.module ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
          v-if="['create', 'edit'].includes(action)"
        >
          <GenericSelectorComponent
            label="Proceso"
            :manual_option="notification_processes"
            :map_options="true"
            :default_value="models.process"
            required
            :disabled="models.module === 'treasury'"
            @update:model-value="models.process = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El proceso es requerido'),
            ]"
          />
        </div>
        <div class="col-12 col-md-3" v-else>
          <div class="text-black-90">
            <p class="text-weight-bold">Proceso</p>
            <p class="text-weight-medium">
              {{ models.process ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
          v-if="['create', 'edit'].includes(action)"
        >
          <GenericSelectorComponent
            label="Sub-proceso"
            :manual_option="notification_subprocesses"
            :map_options="true"
            :default_value="models.sub_process"
            :required="notification_subprocesses.length > 0"
            :disabled="
              models.process === 'module_closure' ||
              models.module === 'treasury'
            "
            @update:model-value="models.sub_process = $event"
            :rules="notification_subprocesses.length > 0?[(val: string) => useRules().is_required(val, 'El sub-proceso es requerido')]:[]"
          />
        </div>
        <div class="col-12 col-md-3" v-else>
          <div class="text-black-90">
            <p class="text-weight-bold">Sub-proceso</p>
            <p class="text-weight-medium">
              {{ models.sub_process ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md"></q-separator>
      <p class="text-black-90 text-subtitle1 text-weight-bold">
        Perfil de notificación
      </p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm">
        <div class="col-12 col-md-6" v-if="['create', 'edit'].includes(action)">
          <GenericSelectorComponent
            label="Destinatario/Rol"
            multiple
            show_as_checkbox
            :manual_option="user_roles"
            :map_options="true"
            :default_value="models.recipients"
            required
            @update:model-value="models.recipients = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El destinatario/rol es requerido'),
              (val: string) => useRules().is_required_array(val, 'El destinatario/rol es requerido'),
            ]"
          />
        </div>
        <div class="col-12 col-md-4" v-else>
          <div class="text-black-90">
            <p class="text-weight-bold">Destinatario/Rol</p>
            <p class="text-weight-medium">
              {{ models.recipients ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6" v-if="['create', 'edit'].includes(action)">
          <label class="text-weight-medium break-word q-ml-sm text-grey-7"
            >Medio de notificación*</label
          >
          <RadioYesNo
            :options="notification_channels"
            :is-radio-button="false"
            :multiple-check-box="true"
            v-model="models.channels"
          />
        </div>
        <div class="col-12 col-md-3" v-else>
          <div class="text-black-90">
            <p class="text-weight-bold">Medio de notificación</p>
            <p class="text-weight-medium">
              {{ models.channels ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12" v-if="['create', 'edit'].includes(action)">
          <GenericInputComponent
            label="Mensaje de notificación"
            type="textarea"
            :default_value="models.message"
            @update:model-value="models.message = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El mensaje de notificación es requerido'),
              (val: string) => useRules().is_required(val, 'El mensaje de notificación es requerido'),
              (val: string) => useRules().min_length(val, 5),
              (val: string) => useRules().max_length(val, 50),
            ]"
            required
          />
        </div>
        <div class="col-12" v-else>
          <div class="text-black-90">
            <p class="text-weight-bold">Mensaje de notificación</p>
            <p class="text-weight-medium">
              {{ models.message ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md"></q-separator>
      <p class="text-black-90 text-subtitle1 text-weight-bold">
        Parámetros de negocio
      </p>
      <div v-if="action !== 'view'">
        <div class="row items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium">¿Maneja negocio?</p>
          <RadioYesNo v-model="models.has_businesses" />
        </div>
        <q-separator class="q-my-md"></q-separator>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-5">
            <GenericSelectorComponent
              label="Tipo de negocio"
              multiple
              show_as_checkbox
              :manual_option="business_trust_types"
              :map_options="true"
              :default_value="models.business_type_ids"
              required
              :disabled="!models.has_businesses"
              @update:model-value="models.business_type_ids = $event"
              :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de negocio es obligatorio'),
              (val: string) => useRules().is_required_array(val, 'El tipo de negocio es obligatorio'),
            ]"
            />
          </div>
          <div class="col-12 col-md-5">
            <GenericSelectorComponent
              label="Subtipo de negocio"
              multiple
              show_as_checkbox
              :manual_option="business_trust_only_subtypes"
              :map_options="true"
              :default_value="models.business_sub_type_ids"
              :required="false"
              :disabled="!models.has_businesses"
              @update:model-value="models.business_sub_type_ids = $event"
              :rules="[]"
            />
          </div>
          <div class="col-12 col-md-2 row items-center">
            <Button
              label="Buscar"
              @click="handleSearch"
              :disabled="searchIsDisabled"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom mt-2"
            />
          </div>
        </div>

        <q-separator class="q-my-md"></q-separator>
      </div>
      <NoDataState
        v-if="isBusinessListEmpty"
        :type="!showState ? 'empty' : 'no-results'"
      />
      <div v-else>
        <div class="col-12" v-if="action !== 'view'">
          <GenericInputComponent
            label="Buscador"
            placeholder="Buscar negocio"
            :default_value="searchBusiness"
            @update:model-value="searchBusiness = $event"
            :disabled="isBusinessListEmpty"
            :rules="[]"
          />
        </div>
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status']"
          :rows-per-page-options="action === 'view' ? [0] : [20, 50, 100]"
          :selection="action !== 'view' ? 'multiple' : 'none'"
          v-model:selected="models.selected_business_trust"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <!-- Estado -->
            <ShowStatus :type="row.status.id" />
          </template>
        </TableList>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import Button from '@/components/common/Button/Button.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

//Interfaces
import { IAccountsPayableNotificationForm } from '@/interfaces/customs/accounts-payable/AccountsPayableNotifications'
import { ITrustBusinessItemList } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global/Action'

// Composables
import { useRules } from '@/composables'

// Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/AccountsPayableNotifications/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: IAccountsPayableNotificationForm | null
    preloadBusinnessTrust?: ITrustBusinessItemList[]
    action: ActionType
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: IAccountsPayableNotificationForm | null) => void
  >()

const {
  basicDataFormRef,
  models,
  notification_modules,
  notification_processes,
  notification_subprocesses,
  notification_channels,
  user_roles,
  business_trust_types,
  business_trust_only_subtypes,
  isBusinessListEmpty,
  searchIsDisabled,
  searchBusiness,
  showState,
  tableProps,
  handleSearch,
  updatePage,
  updateRowsPerPage,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
