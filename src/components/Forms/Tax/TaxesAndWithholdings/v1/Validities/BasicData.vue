<template>
  <section class="q-mt-md">
    <TableList
      :title="tableProps.title"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :loading="tableProps.loading"
      :custom-columns="tableProps.customColumns"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template #custom-header-action>
        <div class="q-mx-sm">
          <Button
            v-if="['view'].includes(action)"
            :outline="true"
            label="Descargar excel"
            :leftImg="excelIcon"
            :disabled="tableProps.rows.length === 0"
            tooltip="Descargar excel"
            @click="downloadExcel"
          />
        </div>

        <Button
          v-if="['edit'].includes(action)"
          :outline="false"
          label="Agregar"
          left-icon="PlusCircle"
          color-icon="white"
          @click="openModal()"
          :disabled="tableProps.rows.some((e) => !e.tax_id)"
        />
      </template>

      <template #status="{ row }">
        <CustomToggle
          :value="row.is_active"
          :width="100"
          :height="30"
          checked-text="Activo"
          unchecked-text="Inactivo"
          readonly
          @click=""
        />
      </template>

      <template #actions="{ row }" v-if="['edit'].includes(action)">
        <Button
          v-if="!row.tax_id"
          :label="''"
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Editar'"
          @click="openModal(row)"
        />
        <Button
          v-if="!row.tax_id"
          :label="''"
          :left-icon="defaultIconsLucide.delete"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Eliminar'"
          @click="deleteValidity(row)"
        />
      </template>
    </TableList>
  </section>

  <AlertModalComponent
    ref="validityModalRef"
    styleModal="min-width: 500px"
    :title-header="modalProps.title"
    :show-img-default="false"
    @confirm="saveValidity"
    :text-btn-confirm="'Guardar'"
    margin-top-body="mt-1"
  >
    <template #default-body>
      <q-form ref="formInformationRef">
        <section class="q-mt-md q-px-lg">
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12">
              <Date
                v-if="['create', 'edit'].includes(modalProps.action)"
                :default_value="formValuesModal.valid_from"
                label="Válido desde"
                required
                :rules="[(val) => rules.is_required(val)]"
                @update:model-value="
                  (val) => (formValuesModal.valid_from = val)
                "
              />

              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Válido desde</p>
                <p class="text-weight-medium no-margin">
                  {{ formValuesModal.valid_from ?? 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-12">
              <Date
                v-if="['create', 'edit'].includes(modalProps.action)"
                :default_value="formValuesModal.valid_to"
                label="Válido hasta"
                required
                :rules="[(val) => rules.is_required(val)]"
                @update:model-value="(val) => (formValuesModal.valid_to = val)"
              />

              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Válido hasta</p>
                <p class="text-weight-medium no-margin">
                  {{ formValuesModal.valid_to ?? 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-12">
              <Input
                v-if="['create', 'edit'].includes(action)"
                label="Calculo de impuesto"
                :rules="[]"
                :default_value="formValuesModal.calculation"
                disabled
                placeholder="-"
              />

              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Calculo de impuesto</p>
                <p class="text-weight-medium no-margin">
                  {{ formValuesModal.calculation ?? 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-12">
              <Input
                v-if="['create', 'edit'].includes(action)"
                label="Importe"
                required
                :rules="[
              (val: string) => rules.is_required(val),
              (val: string) => rules.only_number_with_decimals(val, 2),
              (val: string) => rules.max_length(val, 15),
            ]"
                :default_value="formValuesModal.rate_percentage"
                @update:model-value="formValuesModal.rate_percentage = $event"
              />

              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Importe</p>
                <p class="text-weight-medium no-margin">
                  {{ formValuesModal.rate_percentage ?? 'No registrado' }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </q-form>
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// Components
import TableList from '@/components/table-list/TableList.vue'
import Date from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import Input from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITaxesAndWithholdingsValidities } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Logic
import useInformationForm from '@/components/Forms/Tax/TaxesAndWithholdings/v1/Validities/BasicData'

//Assets
import excelIcon from '@/assets/images/excel.svg'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ITaxesAndWithholdingsValidities | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ITaxesAndWithholdingsValidities | null): void
}>()

const {
  formInformationRef,
  tableProps,
  formValuesModal,
  rules,
  validityModalRef,
  defaultIconsLucide,
  modalProps,
  saveValidity,
  openModal,
  deleteValidity,
  downloadExcel,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formInformationRef.value?.validate(),
})
</script>
