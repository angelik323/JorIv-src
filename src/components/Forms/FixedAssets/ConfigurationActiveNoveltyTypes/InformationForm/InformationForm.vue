<template>
  <q-form ref="configActiveNoveltyTypesRef">
    <div class="row items-center justify-between q-mb-lg mt-md">
      <p
        v-if="action === 'edit' || action === 'create'"
        class="text-black-10 text-weight-bold text-h6 q-mb-none"
      >
        Listado
      </p>
      <Button
        v-if="['create'].includes(action)"
        :label="'Agregar'"
        :size="'md'"
        :unelevated="true"
        :outline="false"
        :left-icon="useUtils().defaultIconsLucide.plusCircle"
        :color-icon="'white'"
        :class="'text-capitalize btn-filter custom'"
        @click="addRegister"
      />
    </div>

    <div class="row q-mt-sm q-mb-md q-col-gutter-md">
      <!-- Fecha de creación -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="column">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de creación"
            :required="false"
            :rules="[]"
            disabled
            mask="YYYY-MM-DD HH:mm"
            :default_value="defaultDateValue"
          />
          <div v-else>
            <label class="text-weight-bold no-margin">Fecha de creación</label>
            <p class="text-weight-medium no-margin">
              {{ models.created_at ?? 'Sin fecha' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Creado por -->
      <div
        class="col-12 col-sm-6 col-md-3"
        v-if="['edit', 'view'].includes(action)"
      >
        <GenericInput
          v-if="['edit'].includes(action)"
          label="Creado por"
          :default_value="models.created_by_name ?? ''"
          :placeholder="''"
          type="text"
          :required="false"
          disabled
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Creado por</label>
          <p class="text-weight-medium no-margin">
            {{ models.created_by_name ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <!-- Fecha de actualización -->
      <div
        class="col-12 col-sm-6 col-md-3"
        v-if="['edit', 'view'].includes(action)"
      >
        <GenericDateInputComponent
          v-if="['edit'].includes(action)"
          label="Fecha de actualización"
          :required="false"
          :default_value="models.updated_at ?? ''"
          :rules="[]"
          mask="YYYY-MM-DD"
          disabled
        />

        <div v-else>
          <label class="text-weight-bold no-margin"
            >Fecha de actualización</label
          >
          <p class="text-weight-medium no-margin">
            {{ models.updated_at ?? 'Sin fecha' }}
          </p>
        </div>
      </div>

      <!-- Actualizado por -->
      <div
        class="col-12 col-sm-6 col-md-3"
        v-if="['edit', 'view'].includes(action)"
      >
        <GenericInput
          v-if="action === 'edit'"
          label="Actualizado por"
          :default_value="''"
          :placeholder="models.updated_by_name ?? ''"
          type="text"
          :required="false"
          disabled
        />

        <template v-else>
          <label class="text-weight-bold no-margin">Actualizado por</label>
          <p class="text-weight-medium no-margin">
            {{ models.updated_by_name ?? 'Sin información' }}
          </p>
        </template>
      </div>
    </div>
    <div
      class="q-mt-sm justify-center q-gutter-md ml-2 mr-4 mt-0 editable-table"
    >
      <TableList
        v-if="['create', 'edit', 'view'].includes(action)"
        class="q-mt-xl q-pt-md"
        :title="tableProps.title"
        :loading="tableProps.loading"
        :rows="paginatedRows"
        :columns="tableProps.columns"
        :custom-columns="[
          'code',
          'description',
          'accounting',
          'affectation',
          'actions',
        ]"
        :pages="tableProps.pages"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #code="{ row }">
          <div class="flex items-center justify-center">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="row.code"
              :placeholder="''"
              type="text"
              :class_name="'full-width'"
              disabled
              :required="true"
              :rules="[
          (v: string) => useRules().is_required(v, 'El código es requerido')
        ]"
            />
            <p v-else class="text-black-10 mb-0">
              {{ row.code ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #description="{ row }">
          <div class="flex items-center justify-center">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="row.description"
              :placeholder="''"
              type="text"
              :class_name="'full-width'"
              @update:modelValue="row.description = $event"
              :required="true"
              :rules="[
          (v: string) => useRules().is_required(v, 'La descripción es requerida')
        ]"
            />
            <p v-else class="text-black-10 mb-0">
              {{ row.description ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #accounting="{ row }">
          <div class="flex items-center justify-center">
            <SwitchComponent
              v-if="['create', 'edit'].includes(action)"
              :model-value="row.accounting"
              @update:model-value="row.accounting = $event"
              color="orange"
            />
            <p v-else class="text-black-10 mb-0">
              {{ row.accounting ? 'Sí' : 'No' }}
            </p>
          </div>
        </template>

        <template #affectation="{ row }">
          <div class="flex items-center justify-center">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :placeholder="`Seleccione una opción`"
              :required="true"
              :map_options="true"
              :manual_option="affectation_type"
              auto_complete
              :default_value="row.affectation_type"
              @update:model-value="row.affectation_type = $event"
              :rules="[
          (v: string) => useRules().is_required(v, 'El campo es requerido'),
        ]"
            />
            <p v-else class="text-black-7 mb-0">
              {{ row.affectation_type ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #actions="{ index }">
          <Button
            v-if="['create', 'edit'].includes(action)"
            :left-icon="useUtils().defaultIconsLucide.trash"
            color="orange"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openDeleteModal(index)"
          />
        </template>
      </TableList>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleDelete"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import SwitchComponent from '@/components/common/Switch/SwitchComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global'

// utils
import { useUtils } from '@/composables'

// logic
import useInformationform from '@/components/Forms/FixedAssets/ConfigurationActiveNoveltyTypes/InformationForm/Informationform'
import { IConfigurationActiveForm } from '@/interfaces/customs/fixed-assets/ConfigurationActiveNoveltyTypes'

// composables
import { useRules } from '@/composables'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

const props = defineProps<{
  action: ActionType
  data?: IConfigurationActiveForm | null
}>()

const emits =
  defineEmits<(e: 'update:data', value: IConfigurationActiveForm) => void>()

const {
  tableProps,
  models,
  paginatedRows,
  configActiveNoveltyTypesRef,
  affectation_type,
  alertModalConfig,
  alertModalRef,
  defaultDateValue,
  handleDelete,
  updatePage,
  updatePerPage,
  addRegister,
  openDeleteModal,
} = useInformationform(props, emits)

defineExpose({
  validateForm: () => configActiveNoveltyTypesRef.value?.validate(),
})
</script>
