<template>
  <q-form ref="formInformation">
    <div class="row q-col-gutter-md" v-if="props.action !== 'create'">
      <div class="col-12 col-xs-6 col-md-6">
        <GenericInputComponent
          v-if="props.action !== 'view'"
          :default_value="models.creation_date"
          label="Fecha de vinculación"
          :rules="[]"
          readonly
          @update:modelValue="models.creation_date = $event"
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Fecha de vinculación</p>
          <p class="text-weight-medium no-margin">
            {{ models.creation_date }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-6 col-md-6">
        <div class="text-black-90">
          <p class="text-weight-bold no-margin">Estado</p>
          <ShowStatus :type="Number(models.status_id)" />
        </div>
      </div>
    </div>

    <section class="q-mt-xl">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['buyer_id', 'actions']"
        :hideBottom="true"
        :class="'q-pt-lg amounts-table'"
      >
        <template #custom-header>
          <div class="row q-col-gutter-sm" style="width: 100%">
            <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
              <p class="q-my-none text-weight-medium text-h5">
                {{ tableProps.title }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2" v-if="isCreate">
              <div class="row justify-end">
                <Button
                  class-custom="custom"
                  :outline="true"
                  label="Agregar"
                  color="orange"
                  :styleContent="{
                    'place-items': 'center',
                    color: 'black',
                  }"
                  :left-icon="defaultIconsLucide.plusCircleOutline"
                  @click="addRow"
                />
              </div>
            </div>
          </div>
        </template>

        <template #buyer_id="{ row }">
          <GenericSelectorComponent
            v-if="isCreate"
            auto_complete
            class_custom_popup="custom"
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="business_trust_third_parties"
            :map_options="true"
            :required="true"
            :disabled="false"
            :default_value="row.buyer_id"
            @update:modelValue="
              ;(row.buyer_id = $event), changeDataTable(row.buyer_id)
            "
            :rules="[(v: string) => useRules().is_required(v),
              (v: number) => useRules().not_exist_in_array(
                  v,
                  idsAssigns as number[],
                  'El comprador ya ha sido agregado'
                )
            ]"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">
              {{ row.buyer_id }}
            </p>
          </div>
        </template>

        <template #actions="{ row }">
          <!-- Eliminar -->
          <Button
            v-if="isCreate"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            :disabled="row.status_id === 10"
            @click="openAlertModalPrincipal(row)"
          />
        </template>
      </TableList>
    </section>

    <div v-show="tableProps.rows.length">
      <div class="q-mb-lg mt-2">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información del proyecto
        </p>
      </div>

      <div class="row q-col-gutter-md mt-2">
        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.real_estate_project_id"
            :label="'Proyecto inmobiliario'"
            map_options
            :manual_option="business_trust_real_estate_project"
            :readonly="!isCreate"
            :required="true"
            :rules="[
              (v:string) => useRules().is_required(v, 'El proyecto inmobiliario es requerido')
            ]"
            @update:modelValue="models.real_estate_project_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Proyecto inmobiliario</p>
            <p class="text-weight-medium no-margin">
              {{ models.real_estate_project_name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.real_estate_project_stage_id"
            :label="'N° de Etapa'"
            map_options
            :manual_option="project_stage"
            :readonly="!models.real_estate_project_id || !isCreate"
            :rules="[(v:string) =>useRules().is_required(v, 'El número de etapa es requerido')]"
            required
            @update:modelValue="models.real_estate_project_stage_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">N° de Etapa</p>
            <p class="text-weight-medium no-margin">
              {{ models.real_estate_project_stage_name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.real_estate_project_nomenclature_id"
            :label="'Apartamento / Casa'"
            map_options
            :manual_option="business_trust_properties"
            :readonly="!models.real_estate_project_stage_id || !isCreate"
            :rules="[(v:string) =>useRules().is_required(v, 'El apartamento / casa es requerida')]"
            required
            @update:modelValue="
              models.real_estate_project_nomenclature_id = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Apartamento / Casa</p>
            <p class="text-weight-medium no-margin">
              {{ models.real_estate_project_nomenclature_name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.type"
            label="Tipo de unidad"
            :type="'text'"
            placeholder=""
            disabled
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de unidad</p>
            <p class="text-weight-medium no-margin">{{ models.type }}</p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.area"
            label="Área del inmueble (m2)"
            :type="'text'"
            placeholder=""
            disabled
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Área del inmueble (m2)</p>
            <p class="text-weight-medium no-margin">{{ models.area }}</p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="formatCurrency(`${models.value}`)"
            label="Valor del inmueble"
            :type="'text'"
            placeholder=""
            disabled
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor del inmueble</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(`${models.value}`) }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericDateInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.date"
            label="Fecha estimada de entrega"
            disabled
            placeholder=""
            :rules="[]"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha estimada de entrega</p>
            <p class="text-weight-medium no-margin">
              {{ models.date }}
            </p>
          </div>
        </div>
      </div>

      <div class="q-mb-lg mt-2">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Plan de pagos
        </p>
      </div>

      <div class="row q-col-gutter-md mt-2">
        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.fiduciary_mandate_name"
            :label="'Número de encargo'"
            map_options
            :disabled="props.action == 'edit'"
            :manual_option="fiduciary_mandates_sale"
            :rules="[(v:string) =>useRules().is_required(v, 'El número de encargo es requerido')]"
            required
            :readonly="!models.real_estate_project_nomenclature_id"
            @update:modelValue="models.fiduciary_mandate_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de encargo</p>
            <p class="text-weight-medium no-margin">
              {{ models.fiduciary_mandate_name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3" v-if="!isCreate">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.financial_obligation?.obligation_number"
            label="Obligación financiera"
            :type="'text'"
            disabled
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Obligación financiera</p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_obligation?.obligation_number }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3" v-if="!isCreate">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="
              formatCurrency(`${models.financial_obligation?.amount}`)
            "
            label="Valor financiado"
            :type="'text'"
            disabled
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor financiado</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(`${models.financial_obligation?.amount}`) }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3" v-if="!isCreate">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.financial_obligation?.quotas"
            label="Plazo"
            :type="'text'"
            disabled
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Plazo</p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_obligation?.quotas }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <section class="q-mt-xl">
          <TableList
            :title="tablePropsPayments.title"
            :loading="tablePropsPayments.loading"
            :columns="tablePropsPayments.columns"
            :rows="tablePropsPayments.rows"
            :pages="tablePropsPayments.pages"
            :hideBottom="true"
            :class="'q-pt-lg amounts-table'"
          >
          </TableList>
        </section>
      </div>

      <div class="flex justify-between items-center q-mt-md color-black-90">
        <div class="text-black-90 text-h7 q-mb-lg">
          Abonos extraordinarios
        </div>
        <div class="flex justify-between items-center q-mt-lg">
          <RadioYesNo
            v-model="models.has_extraordinary_paymentes"
            :is-radio-button="false"
            :is-switch="true"
            :is-disabled="['view', 'edit'].includes(action)"
          />
        </div>
      </div>

      <section class="q-mt-xl" v-if="models.has_extraordinary_paymentes">
        <TableList
          :loading="tablePropsContributions.loading"
          :columns="tablePropsContributions.columns"
          :rows="tablePropsContributions.rows"
          :pages="tablePropsContributions.pages"
          :custom-columns="[
            'extraordinary_payment_value',
            'concept',
            'actions',
          ]"
          :hideBottom="true"
          :class="'q-pt-lg amounts-table'"
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tablePropsContributions.title }}
                </p>
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-3 col-lg-2"
                v-if="isCreate"
              >
                <div class="row justify-end">
                  <Button
                    class-custom="custom"
                    :outline="true"
                    label="Agregar"
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      color: 'black',
                    }"
                    :left-icon="defaultIconsLucide.plusCircleOutline"
                    @click="addRowContributions"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #extraordinary_payment_value="{ row }">
            <CurrencyInput
              v-if="props.action !== 'view'"
              v-model="row.extraordinary_payment_value"
              :currency="'COP'"
              :placeholder="''"
              :rules="[
                (val: string) => useRules().is_required(val, 'El valor estimado es requerido'),
                (val: string) => useRules().max_length(val, 40),
                (val: string) => useRules().min_length(val, 1),
              ]"
              @update:modelValue="row.extraordinary_payment_value = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">
                {{ formatCurrency(`${row.extraordinary_payment_value}`) }}
              </p>
            </div>
          </template>

          <template #concept="{ row }">
            <GenericInputComponent
              v-if="props.action !== 'view'"
              :default_value="row.concept"
              :type="'text'"
              :rules="[
                (v: string) => useRules().is_required(v, 'Las observaciones generales son requeridas'),
                (v: string) => useRules().only_alphanumeric(v, true),
                (v: string) => useRules().max_length(v, 500),
              ]"
              @update:modelValue="row.concept = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">
                {{ row.concept }}
              </p>
            </div>
          </template>

          <template #actions="{ row }">
            <!-- Eliminar -->
            <Button
              v-if="!'view'.includes(props.action)"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="row.status_id === 10"
              @click="openAlertModal(row)"
            />
          </template>
        </TableList>
      </section>

      <div class="q-mb-lg mt-2">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Documentos
        </p>
      </div>

      <section class="q-pl-md q-mt-lg">
        <UploadDocument
          v-for="element in dataUpload"
          :key="element.position"
          :file="element.file"
          @update:file="element.file = $event"
          @changeFile="(file: File | null) => handleFileChange(file, element.title)"
          :class="element.class"
          :title="element.title"
          :subtitle="element.subtitle"
          :required="element.required"
          displayMode="file"
          :view-close-file="['create', 'edit'].includes(action)"
        />
      </section>
    </div>
  </q-form>
  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar el abono?"
    @confirm="deleteContributions"
  >
  </AlertModalComponent>

  <AlertModalComponent
    ref="alertModalRefPrincipal"
    styleModal="min-width: 480px"
    title="¿Desea eliminar el comprador?"
    @confirm="deleteSaleRealStateProject"
  >
  </AlertModalComponent>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ISaleRealEstate
  }>(),
  {}
)

// Emits
const emits = defineEmits(['update:models'])

import { ISaleRealEstate } from '@/interfaces/customs'

// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import UploadDocument from '@/components/common/UploadDocument/UploadDocument.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

// Composables
import { useRules, useUtils } from '@/composables'
const formatCurrency = useUtils().formatCurrency

// Types
import { ActionType } from '@/interfaces/global'

// utils
import { defaultIconsLucide } from '@/utils'

// Logic
import useSaleRealEstate from './InformationForm'

const {
  models,
  formInformation,
  tableProps,
  business_trust_third_parties,
  alertModalRef,
  business_trust_real_estate_project,
  dataUpload,
  project_stage,
  business_trust_properties,
  tablePropsPayments,
  tablePropsContributions,
  alertModalRefPrincipal,
  isCreate,
  fiduciary_mandates_sale,
  idsAssigns,

  openAlertModalPrincipal,
  deleteSaleRealStateProject,
  addRow,
  changeDataTable,
  deleteContributions,
  openAlertModal,
  handleFileChange,
  addRowContributions,
} = useSaleRealEstate(props, emits)

defineExpose({
  validateForm: async () => {
    const isValid = await formInformation.value?.validate()
    return isValid && tableProps.value.rows.length > 0
  },
})
</script>

<style lang="scss" scoped>
:deep(.amounts-table) {
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
