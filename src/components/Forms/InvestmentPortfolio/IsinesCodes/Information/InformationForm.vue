<template>
  <q-form ref="formElementRef" :class="`q-pa-xl`">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código ISIN"
            :default_value="models.isin_code"
            required
            :disabled="['edit'].includes(action)"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Código isin es requerida'),
              (val: string) => useRules().max_length(val, 12),
            ]"
            @update:model-value="models.isin_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código ISIN</p>
            <p class="text-weight-medium no-margin">
              {{ models.isin_code ? models.isin_code : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            :default_value="models.description"
            required
            :disabled="['edit'].includes(action)"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Descripción es requerida'),
              (val: string) => useRules().max_length(val, 50),
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ? models.description : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nemotécnico"
            :default_value="models.mnemonic"
            required
            :disabled="['edit'].includes(action)"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Nemotécnico es requerida'),
              (val: string) => useRules().max_length(val, 12),
            ]"
            @update:model-value="models.mnemonic = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nemotécnico</p>
            <p class="text-weight-medium no-margin">
              {{ models.mnemonic ? models.mnemonic : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código emisor"
            required
            placeholder="Inserte"
            :default_value="models.issuer_code"
            :disabled="['edit'].includes(action)"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Código emisor es requerida'),
              (val: string) => useRules().max_length(val, 12),
            ]"
            @update:model-value="models.issuer_code = $event"
            :manual_option="emitter_anna_codes"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código emisor</p>
            <p class="text-weight-medium no-margin">
              {{ models.issuer_code ? models.issuer_code : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código administrador"
            :default_value="models.administrator_code"
            map_options
            required
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'Código administrador es requerida',
                ),
            ]"
            @update:model-value="models.administrator_code = $event"
            :manual_option="isines_administrators_codes"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código administrador</p>
            <p class="text-weight-medium no-margin">
              {{
                models.administrator_code
                  ? models.administrator_code
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Serie emisión"
            :default_value="models.issuance_series"
            required
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Serie emisión es requerida'),
              (val: string) => useRules().max_length(val, 50),
            ]"
            @update:model-value="models.issuance_series = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Serie emisión</p>
            <p class="text-weight-medium no-margin">
              {{
                models.issuance_series
                  ? models.issuance_series
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Año emisión"
            :default_value="
              models.issuance_year ? String(models.issuance_year) : ''
            "
            required
            :mask="'YYYY'"
            placeholder="YYYY"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Año emisión es requerido'),
              (val: string) =>
                moment(val, 'YYYY', true).isValid() ||
                'Ingresa una fecha válida en el formato AAAA',
              (val: string) =>
                useRules().max_value(val, moment().year()) ||
                `El campo Año emisión no debe ser mayor a ${moment().year()}.`,
            ]"
            @update:model-value="models.issuance_year = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Año emisión</p>
            <p class="text-weight-medium no-margin">
              {{
                models.issuance_year ? models.issuance_year : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Clase de título"
            :default_value="models.title_class"
            required
            :disabled="['edit'].includes(action)"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Clase de título es requerida'),
            ]"
            @update:model-value="models.title_class = $event"
            :manual_option="isines_titles_classes"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de título</p>
            <p class="text-weight-medium no-margin">
              {{ models.title_class ? models.title_class : 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de emisión"
            :default_value="models.issue_date"
            required
            :navigation_max_year_month="getFutureDateByYears(20)"
            :disabled="['edit'].includes(action)"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Fecha de emisión es requerida'),
            ]"
            @update:model-value="models.issue_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de emisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.issue_date ? models.issue_date : 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de vencimiento"
            :default_value="models.maturity_date"
            :disabled="['edit'].includes(action) || isShareOrHoldingsTitleClass"
            :required="!isShareOrHoldingsTitleClass"
            :navigation_max_year_month="getFutureDateByYears(20)"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'Fecha de vencimiento es requerida',
                ),
              (val: string) =>
                useRules().end_date_after_start_date(
                  val,
                  models.issue_date,
                  'YYYY-MM-DD',
                ),
            ]"
            @update:model-value="models.maturity_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de vencimiento</p>
            <p class="text-weight-medium no-margin">
              {{
                models.maturity_date ? models.maturity_date : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodicidad"
            :default_value="models.perioricity"
            :required="!isShareOrHoldingsTitleClass"
            :disabled="isShareOrHoldingsTitleClass"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Periodicidad es requerida'),
            ]"
            @update:model-value="models.perioricity = $event"
            :manual_option="isines_perioricities"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.perioricity ? models.perioricity : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="['create', 'edit'].includes(action)">
            <p class="text-grey-7 no-margin">
              {{ `Tipo de tasa${!isShareOrHoldingsTitleClass ? '*' : ''}` }}
            </p>
            <RadioYesNo
              label="Tipo de tasa*"
              v-model="isFixedRate"
              titleRadioTrue="Fija"
              titleRadioFalse="Variable"
              :is-disabled="isShareOrHoldingsTitleClass"
            />
          </template>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_type ? models.rate_type : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            currencyLabel="Valor tasa fija"
            v-model="models.fixed_rate_value as number"
            :precision="4"
            :currency="'COP'"
            hideIcon
            placeholder="Inserte"
            :disabled="!isFixedRate || isShareOrHoldingsTitleClass"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Valor tasa fija es requerida'),
              (val: string) => useRules().length_between(val, 0, 99.9999),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor tasa fija</p>
            <p class="text-weight-medium no-margin">
              {{
                models.fixed_rate_value
                  ? models.fixed_rate_value
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código tasa"
            :default_value="models.rate_code"
            :required="!isFixedRate && !isShareOrHoldingsTitleClass"
            :disabled="Boolean(isFixedRate) || isShareOrHoldingsTitleClass"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Código tasa es requerido'),
            ]"
            @update:model-value="models.rate_code = $event"
            :manual_option="isines_interest_rates"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_code ? models.rate_code : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Comportamiento tasa"
            :default_value="models.rate_behavior"
            :required="!isShareOrHoldingsTitleClass"
            :disabled="isShareOrHoldingsTitleClass"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Comportamiento tasa es requerida'),
            ]"
            @update:model-value="models.rate_behavior = $event"
            :manual_option="computedIsinesRateBehavior"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Comportamiento tasa</p>
            <p class="text-weight-medium no-margin">
              {{
                models.rate_behavior ? models.rate_behavior : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <template v-if="['create', 'edit'].includes(action)">
            <p class="text-grey-7 no-margin">
              {{ `Modalidad${!isShareOrHoldingsTitleClass ? '*' : ''}` }}
            </p>
            <RadioYesNo
              label="Modalidad*"
              v-model="isInAdvanceModality"
              :titleRadioTrue="investment_portfolio_isines_modality.in_advance"
              :titleRadioFalse="investment_portfolio_isines_modality.expired"
              :required="!isShareOrHoldingsTitleClass"
              :is-disabled="isShareOrHoldingsTitleClass"
            />
          </template>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.modality ? models.modality : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Spread"
            placeholder="Inserte"
            :default_value="models.spread"
            :disabled="isShareOrHoldingsTitleClass"
            :rules="
              models.spread
                ? [
                    (val: string) =>
                      useRules().only_max_1_integer_2_decimals(val),
                  ]
                : []
            "
            @update:model-value="models.spread = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Spread</p>
            <p class="text-weight-medium no-margin">
              {{ models.spread ? models.spread : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-12">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Observaciones"
            :default_value="models.observation"
            required
            type="textarea"
            placeholder="Inserte"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Observaciones es requerido'),
              (val: string) => useRules().max_length(val, 50),
            ]"
            @update:model-value="models.observation = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Observaciones</p>
            <p class="text-weight-medium no-margin">
              {{ models.observation ? models.observation : 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section v-if="['view'].includes(action)">
      <q-separator class="my-20" />
      <p class="text-weight-bold text-black-90 size-18">
        Historial del código ISIN
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Fecha de creación</p>
          <p class="text-black-90 mb-3">
            {{
              models.isin_code_history?.created_at
                ? models.isin_code_history?.created_at
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Creado por</p>
          <p class="text-black-90 mb-3">
            {{
              models.isin_code_history?.created_by_user
                ? models.isin_code_history?.created_by_user
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Modificación</p>
          <p class="text-black-90 mb-3">
            {{
              models.isin_code_history?.updated_at
                ? models.isin_code_history?.updated_at
                : 'No registrado'
            }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Modificado por</p>
          <p class="text-black-90 mb-3">
            {{
              models.isin_code_history?.updated_by_user
                ? models.isin_code_history?.updated_by_user
                : 'No registrado'
            }}
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Logic view
import useInformationForm from '@/components/Forms/InvestmentPortfolio/IsinesCodes/Information/InformationForm'

// Utils
import { IIsinesCodesForm } from '@/interfaces/customs/investment-portfolio/IsinesCodes'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'
import moment from 'moment'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IIsinesCodesForm | null
  }>(),
  {},
)

const emits = defineEmits(['validate:form'])

const {
  isines_administrators_codes,
  computedIsinesRateBehavior,
  isShareOrHoldingsTitleClass,
  isines_titles_classes,
  emitter_anna_codes,
  isines_perioricities,
  formElementRef,
  isines_interest_rates,
  isFixedRate,
  isInAdvanceModality,
  models,
  investment_portfolio_isines_modality,
  getFutureDateByYears,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
  getFormValues: () => models.value,
})
</script>

<style lang="scss" scoped>
.size-18 {
  font-size: 1.13rem;
}
.my-20 {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
