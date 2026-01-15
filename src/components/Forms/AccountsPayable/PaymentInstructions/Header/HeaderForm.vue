<template>
  <q-form ref="headerFormRef" class="q-pa-md">
    <section>
      <div class="row row q-col-gutter-md">
        <div
          class="col-12"
          :class="['view'].includes(action) ? 'col-md-4' : ''"
        >
          <div class="mb-2" v-if="['create'].includes(action)">
            <GenericSelectorComponent
              label="Número solicitud"
              :default_value="models.detail?.payment_request_id"
              :manual_option="payment_request_numbers"
              :auto_complete="true"
              :required="false"
              :disabled="['edit'].includes(action)"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.payment_request_id = $event"
            />
          </div>
          <GenericInputComponent
            v-else-if="['edit'].includes(action)"
            label="Número solicitud"
            type="text"
            :default_value="models.payment_request_label"
            :required="false"
            :disabled="true"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Número solicitud</p>
            <p class="text-weight-medium no-margin">
              {{ models?.payment_request_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Oficina"
            type="text"
            :default_value="models.office_label"
            :required="false"
            :disabled="true"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Oficina</p>
            <p class="text-weight-medium no-margin">
              {{ models?.office_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Negocio"
            type="text"
            :default_value="models.business_label"
            :required="false"
            :disabled="true"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models?.business_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Proveedor / Emisor"
            type="text"
            :default_value="models.supplier_label"
            :required="false"
            :disabled="true"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Proveedor / Emisor
            </p>
            <p class="text-weight-medium no-margin">
              {{ models?.supplier_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            label="Valor total"
            :model-value="String(models.total_value ?? '')"
            :required="false"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.total_value = rawValue ?? '')
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Valor total</p>
            <p class="text-weight-medium no-margin">
              {{
                models.total_value
                  ? formatCurrency(models?.total_value)
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Interfaces
import { IPaymentInstructionsHeaderForm } from '@/interfaces/customs/accounts-payable/PaymentInstructions'
import { ActionType } from '@/interfaces/global'

// Logic
import useHeaderForm from '@/components/Forms/AccountsPayable/PaymentInstructions/Header/HeaderForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentInstructionsHeaderForm | null
  }>(),
  {}
)

const {
  models,
  headerFormRef,

  // Selects
  payment_request_numbers,

  // Composables
  formatCurrency,
} = useHeaderForm(props, emit)

defineExpose({
  validateForm: () => headerFormRef.value?.validate(),
})
</script>
