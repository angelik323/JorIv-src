<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div class="col-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código negocio fiduciario"
            :default_value="models.business_code"
            required
            type="number"
            :rules="[
              (val: string) =>
                is_required(val),
              () => isValidBusiness || 'El código negocio no es válido'

            ]"
            @update:modelValue="handleBusinessCode($event)"
            :disabled="['create', 'edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código negocio fiduciario</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre negocio"
            :default_value="models.business_name"
            :rules="[]"
            @update:model-value="models.business_name = $event"
            disabled
            :placeholder="isLoadingBusiness ? 'Cargando...' : ''"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="¿Quién paga la comisión fiduciaria?"
            :manual_option="who_pays_commission"
            :map_options="false"
            :required="true"
            :default_value="models?.who_pays"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.who_pays = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              ¿Quién paga la comisión fiduciaria?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.who_pays ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="¿Contabilidad en el fideicomiso?"
            :manual_option="options_boolean_value"
            :map_options="false"
            :required="true"
            :default_value="models?.accounts"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: boolean) => is_required_boolean(val)]"
            @update:modelValue="models.accounts = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              ¿Contabilidad en el fideicomiso?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.accounts ? 'SI' : 'NO' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="¿La comisión fiduciaria genera IVA?"
            :manual_option="options_boolean_value"
            :map_options="false"
            :required="true"
            :default_value="models?.generates_iva"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: boolean) => is_required_boolean(val)]"
            @update:modelValue="models.generates_iva = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              ¿La comisión fiduciaria genera IVA?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.generates_iva ? 'SI' : 'NO' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tarifa de IVA"
            :default_value="Math.round(models.iva ?? 0)"
            :rules="[]"
            @update:model-value="models.iva = $event"
            disabled
            placeholder=""
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tarifa de IVA</p>
            <p class="text-weight-medium no-margin">
              {{ Math.round(models.iva ?? 0) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { IAccountingParametersForm } from '@/interfaces/customs'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useBasicDataForm from '@/components/Forms/SettlementCommissions/BillingTrust/BasicDataAccountingParameters'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IAccountingParametersForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IAccountingParametersForm | null): void
}>()

const {
  formElementRef,
  models,
  who_pays_commission,
  options_boolean_value,
  handleBusinessCode,
  isValidBusiness,
  isLoadingBusiness,
  is_required,
  is_required_boolean,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
