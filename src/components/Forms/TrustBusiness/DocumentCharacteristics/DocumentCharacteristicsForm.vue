<template>
  <q-form ref="formDocumentCharacteristics" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            label="Nombre del negocio"
            :manual_option="business_trusts"
            :map_options="true"
            :default_value="businessTrustSelected"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: string) => useRules().is_required(val, 'El campo nombre del negocio es requerido')]"
            :disabled="['edit'].includes(action)"
            @update:model-value="businessTrustSelected = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Código de característica</p>
            <p class="text-weight-medium">
              {{
                `${models.business_trust?.business_code} - ${models.business_trust?.name}` ||
                ''
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código y descripción del documento"
            required
            :manual_option="document_types"
            :map_options="true"
            :default_value="models.document_type_id"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: string) => useRules().is_required(val, 'El campo código y descripción del documento es requerido')]"
            :disabled="['edit'].includes(action)"
            @update:model-value="models.document_type_id = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">
              Código y descripción del documento
            </p>
            <p class="text-weight-medium">
              {{ renderDocumentTypeCodeAndDescription }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de creación"
            disabled
            :required="false"
            :default_value="models.created_at"
            :rules="[]"
            mask="YYYY-MM-DD"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Fecha de creación</p>
            <p class="text-weight-medium">
              {{ models.created_at || '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <q-separator class="q-my-xl" />
    <section
      class="q-mt-sm justify-center q-gutter-md ml-2 mr-4 mt-0 editable-table"
    >
      <TableList
        :loading="tableProperties.loading"
        :columns="tableProperties.columns"
        :rows="tableProperties.rows"
        :pages="tableProperties.pages"
        :custom-columns="[
          'id',
          'caracteristic_code_and_description',
          'order',
          'actions',
        ]"
        hide-bottom
      >
        <template #custom-header>
          <div>
            <p class="q-my-none text-weight-medium text-h5">
              {{ tableProperties.title }}
            </p>
          </div>
          <q-space />

          <Button
            v-if="!['view'].includes(action)"
            no-caps
            unelevated
            :label="'Agregar'"
            :leftIcon="defaultIconsLucide.plusCircle"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="'Agregar'"
            @click="addRowTable"
          />
        </template>
        <template #id="{ row, index }">
          <p class="mb-0">
            {{ row.id || index + 1 }}
          </p>
        </template>
        <template #caracteristic_code_and_description="{ row, index }">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :manual_option="document_structures"
            :map_options="true"
            :default_value="row.id !== 0 ? row.id : null"
            :clearable="false"
            :auto_complete="true"
            :rules="[(val: string) => useRules().is_required(val, 'El campo aplica para es requerido')]"
            @update:modelValue="changeSelectorCharacteristic($event, index)"
          />
          <p v-else class="mb-0">
            {{ row.characteristic_code }} - {{ row.description }}
          </p>
        </template>
        <template #order="{ row, index }">
          <div
            class="order-selector-wrapper"
            v-if="['create', 'edit'].includes(action)"
          >
            <GenericSelectorComponent
              required
              :manual_option="getAvailableOrderOptions(index)"
              :map_options="true"
              :default_value="row.order"
              :clearable="false"
              :auto_complete="false"
              :class_custom_popup="'document-characteristics-order-popup custom'"
              :rules="[(val: string) => useRules().is_required(val, 'El campo orden es requerido')]"
              @update:model-value="updateOrder($event, index)"
            />
          </div>
          <p v-else class="mb-0">
            {{ row.order }}
          </p>
        </template>
        <template
          #actions="{ index }"
          v-if="['create', 'edit'].includes(action)"
        >
          <!-- Editar -->
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openModalDelete(index)"
          />
        </template>
        <template #custom-no-data>
          <div
            class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
          >
            <img
              src="@/assets/images/icons/no_data_accounting.svg"
              alt="No hay datos para mostrar"
              width="180px"
            />
            <p class="text-weight-bold text-h5 text-center mb-1">
              Actualmente no hay carácteristicas de documentos
            </p>
            <p class="text-weight-medium text-subtitle1 text-center q-pt-none">
              Por favor, agregue uno para continuar con el proceso
            </p>
          </div>
        </template>
      </TableList>
    </section>
  </q-form>
  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="alertModalConfig.description"
    :description_message="''"
    @confirm="handleDeleteRow()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: ActionType
  }>(),
  {}
)

import { useRules } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ActionType } from '@/interfaces/global'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useDocumentCharacteristicsForm from './DocumentCharacteristicsForm'

const {
  models,
  tableProperties,
  alertModalRef,
  alertModalConfig,
  businessTrustSelected,
  business_trusts,
  document_types,
  document_structures,
  formDocumentCharacteristics,
  renderDocumentTypeCodeAndDescription,
  getAvailableOrderOptions,
  openModalDelete,
  addRowTable,
  handleDeleteRow,
  changeSelectorCharacteristic,
  updateOrder,
  handleSubmitForm,
} = useDocumentCharacteristicsForm(props.action)

defineExpose({
  validateForm: () => formDocumentCharacteristics.value?.validate(),
  submitForm: () => handleSubmitForm(),
  models,
})
</script>
