<template>
  <q-form ref="formValidateElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-3' : 'col-md-4',
          ]"
        >
          <GenericDateInputComponent
            v-if="['edit'].includes(action)"
            label="Periodo"
            :required="true"
            :mask="'YYYY-MM'"
            :placeholder="'YYYY-MM'"
            :default_value="editModel.period_date ?? ''"
            :rules="[(v: string) => useRules().is_required(v, 'El campo Periodo es requerido')]"
            @update:model-value="editModel.period_date = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodo</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.period_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-3' : 'col-md-4',
          ]"
        >
          <GenericSelectorComponent
            v-if="['edit'].includes(action)"
            label="Estructura contable"
            :auto_complete="true"
            :map_options="true"
            :required="true"
            :default_value="editModel.structure"
            :manual_option="account_structures_active_revert_vouchers"
            :rules="[(v: string) => useRules().is_required(v, 'El campo Estructura contable es requerido')]"
            @update:modelValue="selectStructure($event)"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estructura contable</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.structure ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-3' : 'col-md-4',
          ]"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Nombre de la estructura"
            :required="false"
            disabled
            placeholder="-"
            :default_value="editModel.structure_name"
            :rules="[]"
            @update:model-value="editModel.structure_name = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre de la estructura</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.structure_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['edit'].includes(action)"
            label="Desde negocio"
            :auto_complete="true"
            :map_options="true"
            :required="true"
            :default_value="editModel.from_business_trust_id"
            :manual_option="
              business_trusts_with_description_by_account_structure_code
            "
            :rules="[(v: string) => useRules().is_required(v, 'El campo Desde negocio es requerido')]"
            @update:modelValue="selectFromBusiness($event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Desde negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                viewModel.from_business_trust_id.business_code ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Nombre del negocio"
            :required="false"
            placeholder="-"
            :default_value="editModel.from_business_trust_name ?? ''"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                viewModel.from_business_trust_id?.business_name ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['edit'].includes(action)"
            label="Hasta negocio"
            :auto_complete="true"
            :map_options="true"
            :required="true"
            :default_value="editModel.to_business_trust_id"
            :manual_option="
              business_trusts_with_description_by_account_structure_code
            "
            :rules="[(v: string) => useRules().is_required(v, 'El campo Hasta negocio es requerido')]"
            @update:modelValue="selectToBusiness($event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Hasta negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                viewModel.to_business_trust_id.business_code ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Nombre del negocio"
            :required="false"
            placeholder="-"
            :default_value="editModel.to_business_trust_name ?? ''"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                viewModel.to_business_trust_id?.business_name ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-3' : 'col-md-12',
          ]"
        >
          <RadioYesNo
            v-if="['edit'].includes(action)"
            label="Genera cierre diario"
            v-model="editModel.daily_closing"
            :isRadioButton="true"
            :hasTitle="true"
            :title="
              'Genera cierre diario' + (['view'].includes(action) ? '' : '*')
            "
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
            @update:modelValue="handleDailyClosingChange($event)"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Genera cierre diario</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.daily_closing ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator v-if="['edit'].includes(action)" class="q-mb-lg q-mt-md" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm">
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-3' : 'col-md-6',
          ]"
        >
          <GenericSelectorComponent
            v-if="['edit'].includes(action)"
            label="Actualizar"
            :auto_complete="false"
            :map_options="true"
            :required="false"
            :manual_option="update_date_options"
            :default_value="editModel.update"
            :rules="[]"
            :disabled="!editModel.daily_closing"
            @update:model-value="editModel.update = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Actualizar</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.update ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-3' : 'col-md-6',
          ]"
        >
          <GenericDateInputComponent
            v-if="['edit'].includes(action)"
            label="Día a actualizar"
            :disabled="!editModel.daily_closing"
            :required="true"
            :mask="'YYYY-MM-DD'"
            :placeholder="'YYYY-MM-DD'"
            :default_value="editModel.day_to_update ?? ''"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo Día a actualizar es requerido'),
              (v: string) => useRules().date_between(v, firstDay ?? '', lastDay ?? ''),
            ]"
            @update:model-value="editModel.day_to_update = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dia a actualizar</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.day_to_update ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          v-if="['view'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-3"
        >
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Genera Comprobante</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.needs_voucher ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div
          v-if="['view'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-3"
        >
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.status?.status }}
            </p>
          </div>
        </div>
      </div>

      <q-separator v-if="['edit'].includes(action)" class="q-mb-sm q-mt-md" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm">
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-3' : 'col-md-12',
          ]"
        >
          <RadioYesNo
            v-if="['edit'].includes(action)"
            v-model="editModel.needs_voucher"
            :isRadioButton="true"
            :hasTitle="true"
            :title="
              'Genera Comprobante' + (['view'].includes(action) ? '' : '*')
            "
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
          />
        </div>
      </div>
    </section>

    <section v-if="['view'].includes(action)">
      <q-separator v-if="['view'].includes(action)" class="q-mb-lg" />

      <q-item-label class="text-weight-bold mb-0">
        Detalle del Comprobante de cierre
      </q-item-label>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm">
        <div
          v-if="['view'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-6 text-black-90"
        >
          <p class="text-weight-bold mb-0">Tipo de comprobante</p>
          <p class="text-weight-medium no-margin">
            {{
              viewModel.receipt_type_id
                ? `${viewModel.receipt_type_id?.code ?? ''} - ${
                    viewModel.receipt_type_id?.name ?? ''
                  }`
                : 'No registrado'
            }}
          </p>
        </div>

        <div
          v-if="['view'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-6 text-black-90"
        >
          <p class="text-weight-bold no-margin">Subtipo de comprobante</p>
          <p class="text-weight-medium no-margin">
            {{
              viewModel.sub_receipt_type_id
                ? `${viewModel.sub_receipt_type_id?.code ?? ''} - ${
                    viewModel.sub_receipt_type_id?.name ?? ''
                  }`
                : 'No registrado'
            }}
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useRules } from '@/composables'
import { update_date_options } from '@/constants/resources'
import { ActionType } from '@/interfaces/global'
import { IValidationVouchersView } from '@/interfaces/customs'
import ValidateVouchersForm from './ValidateVouchersForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IValidationVouchersView
  }>(),
  {}
)

const {
  editModel,
  viewModel,
  formValidateElementRef,
  business_trusts_with_description_by_account_structure_code,
  account_structures_active_revert_vouchers,
  handleDailyClosingChange,
  selectStructure,
  selectFromBusiness,
  selectToBusiness,
  firstDay,
  lastDay,
} = ValidateVouchersForm(props)

const validateForm = () => formValidateElementRef.value?.validate()

defineExpose({
  validateForm,
})
</script>
