<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6">
        {{ { create: 'Crear', edit: 'Editar', view: 'Ver' }[action] }}
        información general del contrato
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Negocio"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.business_trusts_id"
            :manual_option="business_trusts"
            :required="true"
            :disabled="action === 'edit'"
            :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
            @update:model-value="models.business_trusts_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_trusts_id || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de contrato"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.contract_document_structure_id"
            :manual_option="contract_document_structure"
            required
            :disabled="action === 'edit'"
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="models.contract_document_structure_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Tipo de documento contractual
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.contract_document_structure_id || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Estado"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.status_id"
            :manual_option="
              substatuses_contract_type_status_statuses_substatuses
            "
            required
            disabled
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="models.status_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{ models.status_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Etapa"
            :default_value="models.stage"
            placeholder="-"
            :disabled="true"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="models.stage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Etapa</p>
            <p class="text-weight-medium no-margin">
              {{ models.stage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha del registro"
            :default_value="models.registration_date"
            :disabled="action === 'edit'"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="models.registration_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha del registro</p>
            <p class="text-weight-medium no-margin">
              {{ models.registration_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número interno del contrato"
            :default_value="models.internal_number"
            max_length="16"
            :required="false"
            :rules="[]"
            @update:model-value="models.internal_number = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Número interno del contrato
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.internal_number ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de contrato"
            :default_value="models.contract_number"
            max_length="16"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de contrato es requerido'),
              (val: string) => useRules().max_length(val, 20)
            ]"
            @update:model-value="models.contract_number = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.contract_number ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del contrato"
            :default_value="models.name"
            max_length="80"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del contrato es requerido'),
              (val: string) => useRules().min_length(val, 5),
              (val: string) => useRules().max_length(val, 80)
            ]"
            @update:model-value="models.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Objeto del contrato"
            type="textarea"
            :default_value="models.object"
            :rules="[
              (val: string) => useRules().is_required(val, 'El objeto del contrato es requerido'),
              (val: string) => useRules().max_length(val, 2000)
            ]"
            max_length="2000"
            :required="true"
            @update:model-value="models.object = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Objeto del contrato</p>
            <p class="text-weight-medium no-margin pre-wrap">
              {{ models.object ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de suscripción"
            :default_value="models.subscription_date"
            required
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="models.subscription_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de suscripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.subscription_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Duración"
            type="number"
            :default_value="models.duration"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La duración es requerida'),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().max_value(val, 99)
            ]"
            @update:model-value="models.duration = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Duración</p>
            <p class="text-weight-medium no-margin">
              {{ models.duration ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Periodicidad"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.periodicity"
            :manual_option="contract_periodicity_options"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La periodicidad es requerida')]"
            @update:model-value="models.periodicity = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.periodicity || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha inicio de ejecución"
            :default_value="models.execution_start_date"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de inicio de ejecución es requerida')]"
            @update:model-value="models.execution_start_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicio de ejecución</p>
            <p class="text-weight-medium no-margin">
              {{ models.execution_start_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de finalización de contrato"
            :default_value="models.execution_end_date"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de finalización es requerida')]"
            @update:model-value="models.execution_end_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Fecha de finalización de contrato
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.execution_end_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Moneda del contrato"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.currency_id"
            return_object
            :manual_option="coins_exchange_traded_fund"
            required
            display_value="code"
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="
              (val) => {
                models.amount = null
                models.currency_id = val.code
                models.trm_value = val.rate
                models.trm_value_raw = Number(val.rate) || null
              }
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_id || 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          v-if="models.currency_id && models.currency_id != 'COP'"
          class="col-xs-12 col-sm-12 col-md-3"
        >
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.amount || null"
            hide_symbol
            label="Monto"
            :max_integer_digits="12"
            :max_decimal_digits="2"
            :rules="[
              (val: string) => useRules().is_required(val, 'El monto es requerido')
            ]"
            @update:model-value="({ rawValue }) => (models.amount = rawValue)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Monto</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.amount) }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.trm_value || null"
            disabled
            hide_symbol
            label="TRM"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.trm_value = rawValue)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">TRM</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.trm_value) }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.contract_value || null"
            :disabled="
              (models.currency_id && models.currency_id != 'COP') ||
              (models.milestones?.length ?? 0) > 0
            "
            hide_symbol
            :max_integer_digits="15"
            :max_decimal_digits="2"
            label="Valor del contrato"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.contract_value = rawValue)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor del contrato</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(models.contract_value) || 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <div>
            <RadioYesNo
              v-if="action !== 'view'"
              v-model="models.has_stamp_tax"
              label="¿Aplica impuesto de timbre?"
              :isRadioButton="false"
              :hasTitle="false"
              :hasSubtitle="false"
              :isDisabled="['view', 'edit'].includes(action)"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                ¿Aplica impuesto de timbre?
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.has_stamp_tax ? 'Sí' : 'No' }}
              </p>
            </div>
          </div>

          <div>
            <RadioYesNo
              v-if="action !== 'view'"
              v-model="models.requires_publication"
              label="¿Requiere publicación?"
              :isRadioButton="false"
              :hasTitle="false"
              :hasSubtitle="false"
              :isDisabled="['view', 'edit'].includes(action)"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">¿Requiere publicación?</p>
              <p class="text-weight-medium no-margin">
                {{ models.requires_publication ? 'Sí' : 'No' }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Proyecto asociado"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.project_id"
            :manual_option="project"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El proyecto asociado es requerido')]"
            @update:model-value="models.project_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Proyecto asociado</p>
            <p class="text-weight-medium no-margin">
              {{ models.project_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Plan de obras"
            map_options
            first_filter_option="name"
            second_filter_option="label"
            :default_value="models.work_plan_id"
            :manual_option="work_plan"
            return_object
            display_label="name"
            :required="has_work_plan"
            :rules="[ has_work_plan ? (val: string) => useRules().is_required(val, 'El plan de obras es requerido') : () => true ]"
            @update:model-value="
              (val) => {
                models.work_plan_id = val.id
                models.work_plan_structure_id = val.structure_plan_code_id
                models.work_plan_structure = val.structure?.[0]?.structure || ''
                models.work_plan_code = val.code
              }
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Plan de obras</p>
            <p class="text-weight-medium no-margin">
              {{ models.work_plan_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Estructura plan de obras"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.work_plan_structure"
            :manual_option="[]"
            :required="false"
            disabled
            :rules="[(val: string) => useRules().is_required(val, 'La estructura del plan de obras es requerida')]"
            @update:model-value="models.work_plan_structure = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estructura plan de obras</p>
            <p class="text-weight-medium no-margin">
              {{ models.work_plan_structure ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Código plan de obras"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.work_plan_code"
            :manual_option="[]"
            :required="false"
            disabled
            :rules="[(val: string) => useRules().is_required(val, 'El código del plan de obras es requerido')]"
            @update:model-value="models.work_plan_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código plan de obras</p>
            <p class="text-weight-medium no-margin">
              {{ models.work_plan_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.internal_notes"
            label="Observaciones o notas internas"
            type="textarea"
            max_length="500"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Observaciones o notas internas
            </p>
            <p class="text-weight-medium no-margin">
              {{ models?.internal_notes ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <p class="text-black-10 text-weight-bold text-h6 q-mt-sm">
        Partes involucradas
      </p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Contratista"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.contractor_id"
            :manual_option="
              third_parties.filter(
                (it) => it.third_party_category === 'indirecto'
              )
            "
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El contratista es requerido')]"
            @update:model-value="models.contractor_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Contratista</p>
            <p class="text-weight-medium no-margin">
              {{ models.contractor_id || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Rol de supervisión del contrato"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.supervision_role"
            :manual_option="constract_roles"
            :required="has_supervisor"
            :disabled="!has_supervisor"
            auto_complete
            :rules="[ (val: string) => useRules().is_required(val, 'El rol de supervisión del contrato es requerido') ]"
            @update:model-value="models.supervision_role = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Rol de supervisión del contrato
            </p>
            <p class="text-weight-medium no-margin">
              {{ models?.supervision_role ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Supervisor del contrato"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.supervisor_id"
            :manual_option="third_parties"
            :required="has_supervisor"
            :disabled="!has_supervisor"
            auto_complete
            :rules="[ (val: string) => useRules().is_required(val, 'El supervisor del contrato es requerido') ]"
            @update:model-value="models.supervisor_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Supervisor del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.supervisor_id || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Otro rol del supervisor del contrato"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.other_supervision_role"
            :manual_option="constract_roles"
            :required="has_supervisor"
            :disabled="!has_supervisor"
            auto_complete
            :rules="[ (val: string) => useRules().is_required(val, 'El otro rol del supervisor del contrato es requerido')]"
            @update:model-value="models.other_supervision_role = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Otro rol del supervisor del contrato
            </p>
            <p class="text-weight-medium no-margin">
              {{ models?.other_supervision_role ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Supervisor del contrato 2"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.supervisor2_id"
            :manual_option="third_parties"
            :required="false"
            :disabled="!has_supervisor"
            auto_complete
            :rules="[]"
            @update:model-value="models.supervisor2_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Supervisor del contrato 2</p>
            <p class="text-weight-medium no-margin">
              {{ models.supervisor2_id || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <p class="text-black-10 text-weight-bold text-h6 q-mt-sm">
        Condiciones contractuales
      </p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            label="Lugar de ejecución"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.execution_city_id"
            :manual_option="cities"
            :required="false"
            :rules="[]"
            @update:model-value="models.execution_city_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Lugar de ejecución</p>
            <p class="text-weight-medium no-margin">
              {{ models.execution_city_id || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Composables
import { useRules } from '@/composables'

// Constants
import { constract_roles, contract_periodicity_options } from '@/constants'

// Interfaces
import { IContractRegistrationGeneralDataForm } from '@/interfaces/customs/derivative-contracting/ContractRegistration'
import { ActionType } from '@/interfaces/global'

//Logic form
import useGeneralDataForm from '@/components/Forms/DerivativeContracting/ContractRegistration/GeneralData/GeneralDataForm'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IContractRegistrationGeneralDataForm | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  }>(),
  {}
)

const {
  models,
  formElementRef,
  business_trusts,
  contract_document_structure,
  substatuses_contract_type_status_statuses_substatuses,
  work_plan,
  third_parties,
  coins_exchange_traded_fund,
  has_supervisor,
  has_work_plan,
  cities,
  project,

  formatCurrencyString,
} = useGeneralDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
