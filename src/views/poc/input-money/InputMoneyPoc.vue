<template>
  <div class="q-mx-xl">
    <ContentComponent indentation content-indentation :breadcrumbs="[]">
      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <q-form ref="formElementRef" aria-label="POC">
              <section>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-4">
                    <InputMoneyComponent
                      :model-value="models.unit_value"
                      label="Valor de la unidad"
                      required
                      :rules="[
                        (val: string) => useRules().is_required(val, 'El valor de la unidad es requerido'),
                      ]"
                      @update:model-value="
                        ({ rawValue }) => (models.unit_value = rawValue)
                      "
                    />
                    <div class="text-black-90">
                      <p class="text-weight-bold no-margin">
                        Valor de la unidad
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{ models.unit_value }}
                      </p>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <InputMoneyComponent
                      :model-value="models.value_finish"
                      label="Valor de los acabados"
                      :rules="[]"
                      @update:model-value="
                        ({ rawValue }) => (models.value_finish = rawValue)
                      "
                    />
                    <div class="text-black-90">
                      <p class="text-weight-bold no-margin">
                        Valor de los acabados (formatCurrency)
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{ formatCurrency(models.value_finish ?? 0) ?? '' }}
                      </p>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <InputMoneyComponent
                      :model-value="models.initial_fee_value"
                      label="Valor cuota inicial"
                      required
                      :rules="[
                        (val: string) => useRules().is_required(val, 'El valor cuota inicial es requerido'),
                      ]"
                      @update:model-value="
                        ({ rawValue }) => (models.initial_fee_value = rawValue)
                      "
                    />
                    <div class="text-black-90">
                      <p class="text-weight-bold no-margin">
                        Valor cuota inicial (formatCurrency)
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{
                          formatCurrency(models.initial_fee_value ?? 0) ?? ''
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <CurrencyInput
                      v-model="models.subsidy_fee_value"
                      label="Antiguo currency input"
                      placeholder="Inserte"
                      currency="COP"
                      :rules="[]"
                    />
                    <div class="text-black-90">
                      <p class="text-weight-bold no-margin">
                        Valor del subsidio
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{ models.subsidy_fee_value }}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </q-form>
          </div>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import { useRules } from '@/composables'
import useInputMoneyPoc from './InputMoneyPoc'

const { formElementRef, models, formatCurrency } = useInputMoneyPoc()

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
