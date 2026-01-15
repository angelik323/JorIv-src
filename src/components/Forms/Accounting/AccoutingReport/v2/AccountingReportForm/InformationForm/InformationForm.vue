<template>
  <div>
    <q-form ref="informationFormRef">
      <AccordeonComponent
        v-if="isVisible(0)"
        label="Parámetros de generación del reporte"
      >
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-lg">
          <div class="col-12 col-md-4">
            <GenericInputComponent
              :default_value="formData.name_report"
              label="Nombre del reporte"
              placeholder="-"
              type="text"
              required
              disabled
              :rules="[]"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericInputComponent
              :default_value="formData.type_report"
              label="Tipo de reporte"
              placeholder="-"
              type="text"
              required
              disabled
              :rules="[]"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="formData.report_template_id"
              label="Plantilla"
              placeholder="Seleccione"
              :manual_option="selectOptions.template"
              auto_complete
              map_options
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'La plantilla es requerida'),
              ]"
              @update:model-value="formData.report_template_id = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="formData.business_class"
              label="Clase de negocio"
              placeholder="Seleccione"
              :manual_option="selectOptions.business_classes"
              auto_complete
              map_options
              required
              :disabled="!!defaultBusinessClass"
              :rules="[
                (val: string) => useRules().is_required(val, 'La clase de negocio es requerida'),
              ]"
              @update:model-value="formData.business_class = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="formData.accounting_structure_id"
              label="Estructura contable"
              placeholder="Seleccione"
              :manual_option="selectOptions.account_structures"
              auto_complete
              map_options
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'La estructura contable es requerida'),
              ]"
              @update:model-value="formData.accounting_structure_id = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="formData.structure_level"
              label="Niveles"
              placeholder="Seleccione"
              :manual_option="selectOptions.levels_structure"
              auto_complete
              map_options
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'El nivel es requerido'),
              ]"
              @update:model-value="formData.structure_level = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="formData.amount_type"
              label="Cifras expresadas en"
              placeholder="Seleccione"
              :manual_option="selectOptions.amount_types"
              auto_complete
              map_options
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'La cifra expresada es requerida'),
              ]"
              @update:model-value="formData.amount_type = $event"
            />
          </div>
        </div>
      </AccordeonComponent>

      <AccordeonComponent v-if="isVisible(1)" label="Negocios">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-lg q-mb-lg">
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="formData.business_unit"
              label="Unidad de negocios"
              placeholder="Seleccione"
              :manual_option="selectOptions.unit_businesses"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="formData.business_unit = $event"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="formData.business_type_id"
              label="Tipo de negocios"
              placeholder="Seleccione"
              :manual_option="selectOptions.type_business"
              auto_complete
              map_options
              :required="false"
              :disabled="!unitBusinessValue"
              :rules="[]"
              @update:model-value="formData.business_type_id = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <RadioYesNo
              hasTitle
              v-model="formData.use_business_range"
              title="Rango de negocios"
              @update:model-value="formData.use_business_range = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="formData.from_business_trust_code"
              label="Desde negocio"
              placeholder="Seleccione"
              :manual_option="from_business"
              auto_complete
              map_options
              required
              :disabled="!formData.use_business_range"
              :rules="[
                  (val: string) => useRules().is_required(val, 'El desde negocio es requerido'),
                ]"
              @update:model-value="formData.from_business_trust_code = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="formData.to_business_trust_code"
              label="Hasta de negocio"
              placeholder="Seleccione"
              :manual_option="to_business"
              auto_complete
              map_options
              required
              :disabled="!formData.use_business_range"
              :rules="[
                  (val: string) => useRules().is_required(val, 'El hasta negocio es requerido'),
                ]"
              @update:model-value="formData.to_business_trust_code = $event"
            />
          </div>
        </div>
      </AccordeonComponent>

      <AccordeonComponent v-if="isVisible(2)" :label="dateRangeConfig.title">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-lg">
          <div v-if="isVisibleSelect" class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="selectedDateType"
              label="Seleccione"
              placeholder="Seleccione"
              :manual_option="selectDates"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="selectedDateType = $event"
            />
          </div>

          <div
            class="col-12"
            :class="isVisibleSelect ? 'col-md-4' : 'col-md-6'"
          >
            <GenericDateInputComponent
              :default_value="formData.from_period_date"
              :label="dateRangeConfig.from.label"
              :placeholder="dateRangeConfig.from.placeholder"
              :mask="dateRangeConfig.from.mask"
              required
              :rules="dateRangeConfig.from.rules"
              @update:model-value="formData.from_period_date = $event"
            />
          </div>

          <div
            class="col-12"
            :class="isVisibleSelect ? 'col-md-4' : 'col-md-6'"
          >
            <GenericDateInputComponent
              :default_value="formData.to_period_date"
              :label="dateRangeConfig.to.label"
              :placeholder="dateRangeConfig.to.placeholder"
              :mask="dateRangeConfig.to.mask"
              required
              :rules="dateRangeConfig.to.rules"
              @update:model-value="formData.to_period_date = $event"
            />
          </div>

          <div class="col-12">
            <RadioYesNo
              :modelValue="formData.include_close_voucher"
              label="Incluye comprobantes de cierre"
              :isRadioButton="false"
              :hasSubtitle="false"
              :hasTitle="false"
              classCheck="no-margin"
              @update:modelValue="(val: boolean) => (formData.include_close_voucher = val)"
            />
          </div>
        </div>
      </AccordeonComponent>

      <AccordeonComponent v-if="isVisible(3)" label="Cuentas contables">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-lg q-mb-lg">
          <div class="col-12 col-md-4">
            <RadioYesNo
              hasTitle
              v-model="formData.use_account_range"
              title="Rango de cuentas"
              @update:model-value="formData.use_account_range = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <div class="input-with-button">
              <div class="input-wrapper">
                <GenericSelectorComponent
                  :default_value="formData.from_account_code"
                  label="Desde cuenta contable"
                  placeholder="Seleccione"
                  :manual_option="selectOptions.accounts_charts"
                  auto_complete
                  map_options
                  :required="false"
                  :disabled="!formData.use_account_range"
                  :rules="[]"
                  display_value="code"
                  @update:model-value="formData.from_account_code = $event"
                />
              </div>

              <Button
                :icon="defaultIconsLucide.filter"
                :outline="false"
                color="white"
                :color-icon="'#762344'"
                class="custom"
                :disabled="!formData.use_account_range"
                @click="
                  () => {
                    isFromAccount = true
                    accountingAccountFilterRef?.openFilter()
                  }
                "
              />
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="input-with-button">
              <div class="input-wrapper">
                <GenericSelectorComponent
                  :default_value="formData.to_account_code"
                  label="Hasta cuenta contable"
                  placeholder="Seleccione"
                  :manual_option="selectOptions.accounts_charts"
                  auto_complete
                  map_options
                  :required="false"
                  :disabled="!formData.use_account_range"
                  :rules="[]"
                  display_value="code"
                  @update:model-value="formData.to_account_code = $event"
                />
              </div>

              <Button
                :icon="defaultIconsLucide.filter"
                :outline="false"
                color="white"
                :color-icon="'#762344'"
                class="custom"
                :disabled="!formData.use_account_range"
                @click="
                  () => {
                    isFromAccount = false
                    accountingAccountFilterRef?.openFilter()
                  }
                "
              />
            </div>
          </div>
        </div>
      </AccordeonComponent>
    </q-form>

    <AccountingAccountFilter
      ref="accountingAccountFilterRef"
      :key="Number(formData.accounting_structure_id)"
      :accounting_structure_id="formData.accounting_structure_id"
      @response:selector-accounts="
        ($event) => handleAccountSelection($event, isFromAccount)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Components
import AccountingAccountFilter from '@/components/AdvancedFilters/Accounting/AccountingAccount/AccountingAccountFilter.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import AccordeonComponent from '@/components/Accordeon/Accordeon.vue'
import Button from '@/components/common/Button/Button.vue'

// Constants
import { selectDates } from '@/constants/resources/accounting'

// Composables
import { useRules } from '@/composables/useRules'

// Logic view
import useInformationForm from '@/components/Forms/Accounting/AccoutingReport/v2/AccountingReportForm/InformationForm/InformationForm'

const isFromAccount = ref(false)

const props = defineProps<{
  nameReport: string
  typeReport: string
  noVisible?: number[]
  defaultBusinessClass?: string
}>()

const {
  formData,
  isVisible,
  to_business,
  from_business,
  selectOptions,
  dateRangeConfig,
  isVisibleSelect,
  selectedDateType,
  unitBusinessValue,
  defaultIconsLucide,
  informationFormRef,
  getNormalizedValues,
  handleAccountSelection,
  accountingAccountFilterRef,
} = useInformationForm(props)

defineExpose({
  getValues: () => getNormalizedValues(),
  validateForm: () => informationFormRef.value?.validate(),
})
</script>

<style scoped src="./InformationForm.scss" lang="scss" />
