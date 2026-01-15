<template>
  <q-form ref="formElementRef">
    <section class="q-pa-lg">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :custom-columns="['select', 'actions']"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template #select="{ row }" v-if="['view'].includes(action)">
          <div class="px-1 flex justify-center">
            <q-checkbox
              v-model="row.select"
              @update:model-value="(val) => (row.select = val)"
              color="orange"
            />
          </div>
        </template>

        <template #custom-header>
          <div>
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              {{ tableProps.title }}
            </p>
          </div>
          <q-space />

          <div class="row q-gutter-sm">
            <Button
              v-if="['view'].includes(props.action)"
              outline
              label="Generar PDF cláusulas"
              :leftImg="pdfIcon"
              tooltip="Generar PDF cláusulas"
              @click="generatePDF"
              :disabled="!tableProps.rows.some((e) => e.select)"
            />

            <Button
              v-if="['create', 'edit'].includes(props.action)"
              no-caps
              unelevated
              :label="'Agregar'"
              :leftIcon="defaultIconsLucide.plusCircle"
              :color-icon="'white'"
              :text-color="'white'"
              :outline="false"
              :color="'primary'"
              :tooltip="'Agregar'"
              @click="openModal('create')"
            />
          </div>
        </template>

        <template
          #actions="{ row }"
          v-if="['create', 'edit'].includes(props.action)"
        >
          <Button
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Ver"
            @click="openModal('view', row)"
          />

          <Button
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Editar"
            @click="openModal('edit', row)"
          />

          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openDeleteModal(row.id)"
          />
        </template>
      </TableList>
    </section>
  </q-form>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar la cláusula seleccionada?"
    :show-img-default="false"
    @confirm="confirmDeleteAction"
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

  <AlertModalComponent
    ref="addAdditionModalRef"
    styleModal="min-width: 1000px"
    :title-header="modalProperties.title"
    :show-img-default="false"
    @confirm="saveAddition"
    :text-btn-confirm="modalProperties.buttonLabel"
    margin-top-body="mt-1"
  >
    <template #default-body>
      <q-form ref="formAdditionModal">
        <section class="q-px-lg">
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-4">
              <GenericInput
                v-if="['create', 'edit'].includes(modalProperties.type)"
                label="Orden de cláusula"
                type="number"
                :default_value="modelsModal?.order"
                :required="true"
                :rules="[
                  (val: string) => useRules().is_required(val),
                  (val: string) => useRules().max_length(val, 2),
                ]"
                @update:modelValue="modelsModal.order = $event"
              />
              <div v-else class="text-black-90 q-mt-md">
                <p class="text-weight-bold no-margin">Orden de cláusula</p>
                <p class="text-weight-medium no-margin">
                  {{ modelsModal.order ?? 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                v-if="['create', 'edit'].includes(modalProperties.type)"
                label="Tipo de cláusula"
                :manual_option="clause_types"
                :map_options="true"
                :required="true"
                :default_value="modelsModal?.type_clause_id"
                :auto_complete="true"
                :clearable="true"
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val)]"
                @update:modelValue="modelsModal.type_clause_id = $event"
              />
              <div v-else class="text-black-90 q-mt-md">
                <p class="text-weight-bold no-margin">Tipo de cláusula</p>
                <p class="text-weight-medium no-margin">
                  {{
                    clause_types.find(
                      (e) => e.value === modelsModal.type_clause_id
                    )?.label ?? 'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                v-if="['create', 'edit'].includes(modalProperties.type)"
                label="Nombre de cláusula"
                :manual_option="contract_clauses_names"
                :map_options="true"
                :required="true"
                :default_value="modelsModal?.clause_id"
                :auto_complete="true"
                :clearable="true"
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val)]"
                @update:modelValue="modelsModal.clause_id = $event"
              />
              <div v-else class="text-black-90 q-mt-md">
                <p class="text-weight-bold no-margin">Nombre de cláusula</p>
                <p class="text-weight-medium no-margin">
                  {{
                    contract_clauses_names.find(
                      (e) => e.value === modelsModal.clause_id
                    )?.label ?? 'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12">
              <GenericInput
                v-if="['create', 'edit'].includes(modalProperties.type)"
                label="Cláusula"
                type="textarea"
                :default_value="modelsModal?.clause_description"
                :required="true"
                :rules="[
                  (val: string) => useRules().is_required(val),
                ]"
                @update:modelValue="modelsModal.clause_description = $event"
              />
              <div v-else class="text-black-90 q-mt-md">
                <p class="text-weight-bold no-margin">Cláusula</p>
                <p class="text-weight-medium no-margin">
                  {{ modelsModal.clause_description ?? 'No registrado' }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </q-form>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
import { IClausesFormAdditions } from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useRules } from '@/composables'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import useClausulesForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Clauses/Clauses'

import pdfIcon from '@/assets/images/pdf.svg'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IClausesFormAdditions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IClausesFormAdditions | null): void
}>()

const {
  formElementRef,
  defaultIconsLucide,
  tableProps,
  deleteModalRef,
  addAdditionModalRef,
  formAdditionModal,
  modelsModal,
  clause_types,
  modalProperties,
  contract_clauses_names,
  generatePDF,
  saveAddition,
  openModal,
  confirmDeleteAction,
  openDeleteModal,
} = useClausulesForm(props, emits)

defineExpose({
  validateForm: () => tableProps.value.rows.length > 0,
})
</script>
