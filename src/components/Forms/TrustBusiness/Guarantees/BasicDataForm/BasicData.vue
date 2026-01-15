<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          class="col-12 col-md-4 q-my-sm"
          v-if="!'create'.includes(props.action)"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="ID de Garantía"
            :default_value="models.id"
            type="text"
            :required="false"
            :readonly="isEditableRegistrationStatus"
            :rules="[]"
            @update:modelValue="models.id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ID de Garantía</p>
            <p class="text-weight-medium no-margin">
              {{ models.id }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 q-my-sm">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del negocio"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="business_trusts"
            :map_options="true"
            :required="true"
            :readonly="isEditableRegistrationStatus"
            :default_value="models?.business_trust_id"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.business_trust_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_trust_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de registro"
            :default_value="models.registration_date"
            :disabled="true"
            :rules="[]"
            @update:modelValue="models.registration_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de registro</p>
            <p class="text-weight-medium no-margin">
              {{ models.registration_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de garantía"
            :manual_option="guarantees_types"
            :map_options="false"
            :required="true"
            :default_value="models?.guarantee_type"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :readonly="isRegistrationStatusEditable"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.guarantee_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de garantía</p>
            <p class="text-weight-medium no-margin">
              {{ models.guarantee_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Especificación"
            :default_value="models.specification"
            required
            :readonly="isRegistrationStatusEditable"
            :rules="[(val: string) => is_required(val)]"
            @update:model-value="models.specification = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Especificación</p>
            <p class="text-weight-medium no-margin">
              {{ models.specification ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Descripción detallada"
            :default_value="models.description"
            required
            :rules="[
              (val: string) => is_required(val),
              (val: string) => max_length(val, 100),
            ]"
            :readonly="isRegistrationStatusEditable"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción detallada</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Moneda"
            :manual_option="coins"
            :map_options="true"
            :required="true"
            :default_value="models?.currency_id"
            :auto_complete="true"
            :clearable="true"
            :readonly="isRegistrationStatusEditable"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.currency_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.guaranteed_value"
            label="Valor garantizado"
            :currency="'COP'"
            :placeholder="''"
            required
            :disabled="isRegistrationStatusEditable"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El valor es requerido'),
                (val: string) => useRules().max_length(val, 40),
                (val: string) => useRules().min_length(val, 1),
              ]"
            @update:model-value="models.guaranteed_value = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor garantizado</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(`${models.guaranteed_value}`) }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de vinculación"
            :manual_option="guarantees_linkage_types"
            :map_options="false"
            :required="true"
            :default_value="models?.linkage_type"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :readonly="isRegistrationStatusEditable"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.linkage_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de vinculación</p>
            <p class="text-weight-medium no-margin">
              {{ models.linkage_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de vencimiento"
            :default_value="models.expiration_date"
            :rules="
              models.expiration_date
                ? [
                    (val: string) =>
                      useRules().date_after_or_equal_to_specific_date(
                        val,
                        models.registration_date ?? '',
                        'Fecha de registro'
                      ),
                  ]
                : []
            "
            :disabled="isRegistrationStatusEditable"
            @update:modelValue="models.expiration_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de vencimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.expiration_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Acreedor garantizado"
            :manual_option="business_trust_third_parties"
            :map_options="true"
            :required="true"
            :default_value="models?.secured_creditor_id"
            :auto_complete="true"
            :clearable="true"
            :readonly="isRegistrationStatusEditable"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.secured_creditor_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Acreedor garantizado</p>
            <p class="text-weight-medium no-margin">
              {{ models.secured_creditor_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estado del registro"
            :manual_option="guarantees_record_status"
            :map_options="false"
            :required="true"
            :default_value="models.registration_status"
            :auto_complete="false"
            :clearable="false"
            :readonly="true"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.registration_status = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado del registro</p>
            <p class="text-weight-medium no-margin">
              <ShowStatus :type="Number(models.registration_status ?? 0)" />
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 q-my-sm">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label=" Estado de la garantía"
            :manual_option="guarantees_status"
            :map_options="false"
            :required="true"
            :default_value="models?.guarantee_status_id"
            :auto_complete="false"
            :clearable="false"
            :readonly="
              models.registration_status !== TrustBusinessStatusID.AUTHORIZED
            "
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.guarantee_status_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado de la garantía</p>
            <p class="text-weight-medium no-margin">
              <ShowStatus :type="Number(models.guarantee_status_id ?? 0)" />
            </p>
          </div>
        </div>

        <div class="col-12 q-my-sm">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Observaciones"
            :default_value="models.observations"
            required
            :readonly="isRegistrationStatusEditable"
            type="textarea"
            :rules="[
              (val: string) => is_required(val),
              (val: string) => min_length(val, 20),
              (val: string) => max_length(val, 500)
            ]
            "
            @update:model-value="models.observations = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Observaciones</p>
            <p class="text-weight-medium no-margin">
              {{ models.observations ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Soporte documental*
        </p>
      </div>

      <UploadFile
        v-if="
          !['view', 'authorize'].includes(props.action) &&
          models.documents?.length === 0
        "
        ref="attachDocumentRef"
        :title="uploadProps.title"
        :styles-customs="uploadProps.styleCustom"
        :multiple-files="uploadProps.multiple"
        :label-upload-btn="uploadProps.labelBtn"
        :bordered="uploadProps.bordered"
        :accept="uploadProps.accept"
        color-icon="orange"
        @added="addedFiles"
        @rejected="rejectedFiles"
        @removed="deleteFiles"
      />

      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions', 'status_id', 'name']"
        :hide-bottom="true"
      >
        <template #name="{ row }">
          <div class="q-pa-md row items-center justify-center">
            <img
              class="image-excel q-mr-sm"
              src="@/assets/images/pdf.svg"
              alt="Pdf Icon"
            />
            {{ row.name }}
          </div>
        </template>

        <template #status_id="{ row }">
          <div class="q-pa-md row items-center justify-center">
            <ShowStatus :type="Number(row?.status_id ?? 20)" />
          </div>
        </template>

        <template #actions="{ row }">
          <!-- Eliminar archivo -->
          <Button
            v-if="['create', 'edit'].includes(props.action)"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            :disabled="
              models.registration_status === TrustBusinessStatusID.AUTHORIZED &&
              Number(models.registration_status) !==
                TrustBusinessStatusID.REJECTED
            "
            @click="deleteFileManual(row)"
          />

          <!-- Descargar archivo -->
          <Button
            v-if="!['create', 'edit'].includes(props.action)"
            :left-icon="defaultIconsLucide.download"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Descargar'"
            @click="downloadFileS3(row)"
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { IGuaranteesForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useBasicDataForm from '@/components/Forms/TrustBusiness/Guarantees/BasicDataForm/BasicData'
import TableList from '@/components/table-list/TableList.vue'
import { defaultIconsLucide } from '@/utils'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

// composables
import { useRules, useUtils } from '@/composables'
const formatCurrency = useUtils().formatCurrency

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IGuaranteesForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IGuaranteesForm | null): void
}>()

const {
  formElementRef,
  models,
  uploadProps,
  attachDocumentRef,
  tableProps,
  business_trusts,
  guarantees_types,
  guarantees_linkage_types,
  coins,
  business_trust_third_parties,
  guarantees_record_status,
  guarantees_status,
  isEditableRegistrationStatus,
  isRegistrationStatusEditable,
  TrustBusinessStatusID,
  deleteFileManual,
  rejectedFiles,
  deleteFiles,
  addedFiles,
  is_required,
  max_length,
  downloadFileS3,
  min_length,
  validateForm,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm,
})
</script>
