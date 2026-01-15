<template>
  <q-form ref="formAssignSettlementParametersRef" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Asignar parámetros de liquidación
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tercero"
            :required="false"
            disabled
            :default_value="models.third_party"
            :rules="[]"
            @update:modelValue="models.third_party = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tercero</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Obligaciones Tributarias"
            :required="false"
            disabled
            :default_value="models.fiscal_responsibility"
            :rules="[]"
            @update:modelValue="models.fiscal_responsibility = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Obligaciones Tributarias</p>
            <p class="text-weight-medium no-margin">
              {{ models.fiscal_responsibility ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <RadioYesNo
            v-model="models.vat_responsibility"
            hasTitle
            title="¿Responsable de IVA?"
            :hasSubtitle="false"
            :isDisabled="true"
          />
        </div>
      </div>

      <TributaryList
        :action="action"
        :selected-settlement-formulas-list="
          selectedSettlementFormulasList ?? null
        "
        @update:selected-settlement-formulas-list="
          onUpdateAssignSettlementFormulasList($event)
        "
        @update:selected-row="onUpdateSelectedRow($event)"
      ></TributaryList>

      <q-separator class="q-my-lg" />

      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Relacion de conceptos:
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Concepto reteiva"
            disabled
            :required="true"
            :default_value="models.reteiva_concept"
            :rules="[
              (v: string) => useRules().is_required(v, 'El concepto reteiva es requerido'),
            ]"
            @update:modelValue="models.reteiva_concept = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Concepto reteiva</p>
            <p class="text-weight-medium no-margin">
              {{ models.reteiva_concept ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tarifa"
            disabled
            :required="false"
            :default_value="models.reteiva_concept_tax_rate"
            :rules="[]"
            @update:modelValue="models.reteiva_concept_tax_rate = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tarifa</p>
            <p class="text-weight-medium no-margin">
              {{ models.reteiva_concept_tax_rate ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-8">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Concepto IVA"
            disabled
            :required="true"
            :default_value="models.iva_concept"
            :rules="[
              (v: string) => useRules().is_required(v, 'El concepto IVA es requerido'),
            ]"
            @update:modelValue="models.iva_concept = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Concepto IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.iva_concept ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tarifa"
            disabled
            :required="false"
            :default_value="models.iva_concept_tax_rate"
            :rules="[]"
            @update:modelValue="models.iva_concept_tax_rate = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tarifa</p>
            <p class="text-weight-medium no-margin">
              {{ models.iva_concept_tax_rate ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center q-mt-md q-gutter-md">
        <Button
          label="Cancelar"
          size="md"
          unelevated
          :outline="true"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="$emit('close:modal')"
        />
        <Button
          label="Continuar"
          size="md"
          unelevated
          :outline="false"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="onSubmit"
        />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import TributaryList from '@/components/Lists/Clients/LegalPerson/Tributary/TributaryList.vue'

// Logic form
import useAssignSettlementParametersForm from '@/components/Forms/Clients/v2/LegalPerson/Tributary/AssignSettlementParameters/AssignSettlementParametersForm'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IAssignSettlementParametersForm,
  ISettlementFormula,
} from '@/interfaces/customs/clients/Clients'

const props = defineProps<{
  action: ActionType
  assignDataForm: IAssignSettlementParametersForm | null
  selectedSettlementFormulasList: ISettlementFormula[] | null
}>()

const emit = defineEmits<{
  (e: 'close:modal'): void
  (e: 'assign-data-form', value: IAssignSettlementParametersForm): void
  (
    e: 'update:selected-settlement-formulas-list',
    value: ISettlementFormula[]
  ): void
}>()

const {
  models,
  formAssignSettlementParametersRef,
  useRules,

  onSubmit,
  onUpdateAssignSettlementFormulasList,
  onUpdateSelectedRow,
} = useAssignSettlementParametersForm(props, emit)
</script>
