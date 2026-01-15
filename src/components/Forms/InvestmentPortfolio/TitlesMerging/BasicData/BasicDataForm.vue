<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para englobe de títulos"
  >
    <section>
      <div v-if="action === 'create'" class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Información título
        </p>
      </div>

      <div
        class="row"
        :class="
          action === 'create'
            ? 'q-col-gutter-x-lg q-col-gutter-y-sm'
            : 'q-col-gutter-lg'
        "
      >
        <div v-if="action === 'view'" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Usuario</p>
            <p class="text-weight-medium no-margin">
              {{ models.created_by ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.investment_portfolio"
            label="Código de portafolio"
            auto_complete
            map_options
            required
            :manual_option="investment_portfolio"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de portafolio es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.investment_portfolio = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_portfolio ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.operation_type"
            label="Tipo de operación"
            auto_complete
            map_options
            required
            :manual_option="operation_type"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de operación es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.operation_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_type ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.emitter"
            label="ID emisor"
            auto_complete
            map_options
            required
            :manual_option="emitter"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID emisor es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.emitter = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ID emisor</p>
            <p class="text-weight-medium no-margin">
              {{ models.emitter ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.inversion_class"
            label="Clase de inversión"
            auto_complete
            map_options
            required
            :manual_option="encompass_inversion_classes"
            :rules="[
              (val: string) => useRules().is_required(val, 'La clase de inversión es requerida'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.inversion_class = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.inversion_class ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.paper"
            label="Papel"
            auto_complete
            map_options
            required
            :manual_option="paper_type_encompass_and_division"
            :rules="[
              (val: string) => useRules().is_required(val, 'El papel es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.paper = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Papel</p>
            <p class="text-weight-medium no-margin">
              {{ models.paper ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.isin"
            label="ISIN"
            auto_complete
            map_options
            :required="false"
            :manual_option="isin_codes_mnemonics_portfolio"
            :rules="[
              //(val: string) => useRules().is_required(val, 'El ISIN es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.isin = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ISIN</p>
            <p class="text-weight-medium no-margin">
              {{ models.isin ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.issue_date"
            label="Fecha emisión"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            disabled
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha emisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.issue_date ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.periodicity"
            label="Periodicidad"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.periodicity ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.modality"
            label="Modalidad"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.modality ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_type"
            label="Tipo tasa"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_type ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_code"
            label="Código tasa"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_code ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_value"
            label="Valor tasa"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_value ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.spread"
            label="Spread"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Spread</p>
            <p class="text-weight-medium no-margin">
              {{ models.spread ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.currency"
            label="Moneda"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency ?? '' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Registro títulos
        </p>
      </div>

      <!-- Tabla de títulos -->
      <VCard class="no-margin q-px-lg q-pt-xs q-pb-lg">
        <template #content-card>
          <TableList
            ref="titlesTableListRef"
            :loading="titlesTableProperties.loading"
            :columns="titlesTableProperties.columns"
            :rows="titlesTableProperties.rows"
            :selection="action === 'create' ? 'multiple' : 'none'"
            @selected="handleRowSelection"
            :custom-columns="['status', 'actions']"
            :hide-header="!titlesTableProperties.rows.length"
            hide-pagination
          >
            <template #status="{ row }">
              <ShowStatus
                :type="Number(row?.status?.id)"
                statusType="investmentPortfolio"
              />
            </template>

            <template #custom-no-data>
              <div class="column justify-center items-center">
                <img
                  src="@/assets/images/icons/no_data.svg"
                  alt="Selecciona los campos superiores para ver los títulos disponibles a englobar"
                  width="180px"
                />
                <div class="q-mt-lg text-black text-center">
                  <p class="text-weight-bold text-h6 q-mb-xs">
                    Ingresa los campos para ver títulos
                  </p>
                  <p class="text-weight-medium">
                    Selecciona los campos superiores para ver los títulos
                    disponibles a englobar
                  </p>
                </div>
              </div>
            </template>
          </TableList>
        </template>
      </VCard>
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Registro englobes (Valores nuevos títulos)
        </p>
      </div>

      <template v-if="action === 'create'">
        <div class="row items-start items-center q-col-gutter-x-lg">
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm col-grow">
            <div class="col-12 col-md-3">
              <CurrencyInput
                v-model="mergedTitlesValues.nominal_value"
                label="Valor nominal"
                placeholder="-"
                currency="COP"
                required
                disabled
                :rules="[
                  (val: string) => useRules().is_required(val, 'El valor nominal es requerido'),
                ]"
              />
            </div>

            <div class="col-12 col-md-3">
              <CurrencyInput
                v-model="mergedTitlesValues.market_value"
                label="Valor mercado"
                placeholder="-"
                currency="COP"
                required
                disabled
                :rules="[
                  (val: string) => useRules().is_required(val, 'El Valor mercado es requerido'),
                ]"
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericInputComponent
                :default_value="mergedTitlesValues.market_unit_value"
                label="Valor mercado unidades"
                placeholder="-"
                type="text"
                disabled
              />
            </div>

            <div class="col-12 col-md-3">
              <GenericInputComponent
                :default_value="mergedTitlesValues.tir_value"
                label="Valor TIR de compra"
                placeholder="-"
                type="text"
                disabled
              />
            </div>
          </div>

          <div class="col-auto">
            <Button
              class-custom="q-pa-sm"
              flat
              size="md"
              color="orange"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              :outline="false"
              aria-label="Agregar englobe"
              tooltip="Agregar englobe"
              @click="addMergedTitle"
            />
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>

      <!-- Tabla de englobes -->
      <VCard class="q-mt-lg q-mb-none q-px-lg q-pt-xs q-pb-lg">
        <template #content-card>
          <TableList
            ref="tableListRef"
            :loading="mergedtitleTableProperties.loading"
            :columns="mergedtitleTableProperties.columns"
            :rows="mergedtitleTableProperties.rows"
            :custom-columns="['status', 'actions']"
            :hide-header="!mergedtitleTableProperties.rows.length"
            hide-pagination
            dense
          >
            <template #status="{ row }">
              <ShowStatus
                :type="Number(row?.title_result?.status?.id)"
                statusType="investmentPortfolio"
              />
            </template>

            <template #custom-no-data>
              <div class="column justify-center items-center">
                <img
                  src="@/assets/images/icons/no_data_accounting.svg"
                  alt="Actualmente no hay englobes"
                  width="180px"
                />
                <div class="q-mt-lg text-black text-center">
                  <p class="text-weight-bold text-h6 q-mb-xs">
                    Actualmente no hay englobes
                  </p>
                  <p class="text-weight-medium">
                    Por favor, agregue uno para continuar con el proceso
                  </p>
                </div>
              </div>
            </template>
          </TableList>
        </template>
      </VCard>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { NonEditActionType } from '@/interfaces/global'
import { ITitlesMergingBasicDataForm } from '@/interfaces/customs/investment-portfolio/TitlesMerging'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import { useRules, useUtils } from '@/composables'
import useBasicDataForm from './BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: NonEditActionType
    data: ITitlesMergingBasicDataForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ITitlesMergingBasicDataForm | null): void
}>()

const { defaultIconsLucide } = useUtils()

const {
  investment_portfolio,
  operation_type,
  emitter,
  encompass_inversion_classes,
  paper_type_encompass_and_division,
  isin_codes_mnemonics_portfolio,
  formElementRef,
  titlesTableListRef,
  models,
  mergedTitlesValues,
  titlesTableProperties,
  mergedtitleTableProperties,
  handleRowSelection,
  addMergedTitle,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
