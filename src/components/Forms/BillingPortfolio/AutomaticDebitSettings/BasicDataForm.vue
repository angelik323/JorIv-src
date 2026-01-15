<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.business_trust_id"
            label="Nombre del negocio"
            :manual_option="business_trusts"
            map_options
            auto_complete
            required
            placeholder="Buscar por código del negocio o nombre del negocio"
            clearable
            :rules="[
              (val: string) => is_required(val,  'El nombre del negocio es requerido'),
              (val: string) => max_length(val, 12),
            ]"
            @update:modelValue="models.business_trust_id = $event"
          />
          <div v-else class="text-black-90 col-md-3">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                models.business_trust_id
                  ? (models.business_code_snapshot ?? '') +
                    ' - ' +
                    (models.business_name_snapshot ?? '')
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.automatic_debit"
            label="Marcar débito automático"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'El marcar débito automático es requerido')]"
            @update:modelValue="models.automatic_debit = $event"
          />
          <div v-else class="text-black-90 col-md-3">
            <p class="text-weight-bold no-margin">Marcar débito automático</p>
            <p class="text-weight-medium no-margin">
              {{ models.automatic_debit ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.source"
            label="Fuente"
            :manual_option="sources_debit"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'La fuente es requerida')]"
            @update:modelValue="models.source = $event"
          />
          <div v-else class="text-black-90 col-md-3">
            <p class="text-weight-bold no-margin">Fuente</p>
            <p class="text-weight-medium no-margin">
              {{
                models.source
                  ? models.source === 'investment_plan'
                    ? 'Plan de inversión'
                    : 'Cuenta'
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <template v-if="models.source === 'account'">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.account_bank_id"
              label="Banco"
              :manual_option="banks"
              map_options
              auto_complete
              required
              :rules="[(val: string) => is_required(val,  'El banco es requerido')]"
              @update:modelValue="models.account_bank_id = $event"
            />
            <div v-else class="text-black-90 col-md-3">
              <p class="text-weight-bold no-margin">Banco</p>
              <p class="text-weight-medium no-margin">
                {{ models.account_bank_name ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.account_id"
              label="Número de cuenta"
              :manual_option="treasury_bank_accounts_with_name"
              map_options
              auto_complete
              required
              :rules="[(val: string) => is_required(val,  'El número de cuenta es requerido')]"
              @update:modelValue="models.account_id = $event"
            />
            <div v-else class="text-black-90 col-md-3">
              <p class="text-weight-bold no-margin">Número de cuenta</p>
              <p class="text-weight-medium no-margin">
                {{ models.account_name ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <template v-else-if="models.source === 'investment_plan'">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.collective_investment_fund_id"
              label="Fondo"
              :manual_option="funds"
              map_options
              auto_complete
              required
              :rules="[(val: string) => is_required(val,  'Fondo es requerido')]"
              @update:modelValue="models.collective_investment_fund_id = $event"
            />
            <div v-else class="text-black-90 col-md-3">
              <p class="text-weight-bold no-margin">Fondo</p>
              <p class="text-weight-medium no-margin">
                {{ models.fund_name ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.investment_plan_id"
              label="Plan de inversión"
              :manual_option="fiduciary_investment_plans"
              map_options
              auto_complete
              required
              :rules="[(val: string) => is_required(val,  'Plan de inversión es requerido')]"
              @update:modelValue="models.investment_plan_id = $event"
            />
            <div v-else class="text-black-90 col-md-3">
              <p class="text-weight-bold no-margin">Plan de inversión</p>
              <p class="text-weight-medium no-margin">
                {{ models.plans_name ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <template v-if="['edit', 'view'].includes(action)">
          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              v-if="['edit'].includes(action)"
              label="Fecha de registro/actualización"
              :default_value="models.updated_at"
              :rules="[]"
              disabled
              @update:modelValue="models.updated_at = $event"
            />
            <div v-else class="text-black-90 col-md-3">
              <p class="text-weight-bold no-margin">
                Fecha de registro/actualización
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.updated_at ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <GenericInputComponent
              v-if="['edit'].includes(action)"
              label="Estado"
              disabled
              :default_value="models.is_active"
              :rules="[]"
              @update:modelValue="models.is_active = $event"
            />
            <div v-else class="text-black-90 col-md-3">
              <p class="text-weight-bold no-margin">Estado</p>
              <p class="text-weight-medium no-margin">
                {{ models.is_active }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <div
      class="q-mt-lg q-mb-lg"
      v-if="
        ['create', 'edit'].includes(action) &&
        models.list_documents?.length === 0
      "
    >
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Documentos</p>
      <UploadFile
        ref="attachDocumentRef"
        title="Cargar archivo *"
        styles-customs="width: 100%"
        label-upload-btn="Seleccione el archivo para subir"
        accept="application/pdf"
        class-name-title="text-weight-medium text-grey-6 q-mt-md q-mb-xs"
        :bordered="false"
        :show-preview="false"
        color-icon="orange"
        @added="addedFiles"
        @rejected="rejectedFiles"
      />
    </div>

    <template v-else>
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none q-mt-xl">
        Listado de documentos
      </p>
      <VCard>
        <template #content-card>
          <div class="q-mx-md">
            <TableList
              :loading="tableDocumentsProperties.loading"
              :rows="tableDocumentsProperties.rows"
              :columns="tableDocumentsProperties.columns"
              :custom-columns="['actions', 'status_id']"
              hide-pagination
              dense
            >
              <template #status_id>
                <div class="q-pa-md row items-center">
                  <div class="q-mr-md">
                    <ShowStatus :type="75" />
                  </div>
                </div>
              </template>

              <template #actions="{ row }">
                <Button
                  v-if="['edit', 'view'].includes(action) && !row.isNew"
                  :left-icon="defaultIconsLucide.download"
                  color="orange"
                  class-custom="custom"
                  :outline="false"
                  flat
                  colorIcon="#f45100"
                  tooltip="Descargar"
                  @click="viewFile(row.temporal_path, row.original_name)"
                />

                <Button
                  v-if="['create', 'edit'].includes(action)"
                  :left-icon="defaultIconsLucide.trash"
                  color="orange"
                  class-custom="custom"
                  :outline="false"
                  flat
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="removeFile(row)"
                />
              </template>
              <template #custom-no-data>
                <div
                  class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
                >
                  <img
                    src="@/assets/images/icons/no_data_2.svg"
                    alt="No hay datos para mostrar"
                    width="180px"
                  />
                  <p class="text-weight-bold text-h5 text-center">
                    No hay datos para mostrar
                  </p>
                </div>
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </template>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { ActionType } from '@/interfaces/global'
import { IAutomaticDebitSettingsForm } from '@/interfaces/customs'
import { business_trust_yes_no, sources_debit } from '@/constants'

import useBasicDataForm from '@/components/Forms/BillingPortfolio/AutomaticDebitSettings/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IAutomaticDebitSettingsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IAutomaticDebitSettingsForm | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  max_length,
  business_trusts,
  tableDocumentsProperties,
  attachDocumentRef,
  treasury_bank_accounts_with_name,
  banks,
  funds,
  fiduciary_investment_plans,
  defaultIconsLucide,

  addedFiles,
  rejectedFiles,
  removeFile,
  viewFile,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
