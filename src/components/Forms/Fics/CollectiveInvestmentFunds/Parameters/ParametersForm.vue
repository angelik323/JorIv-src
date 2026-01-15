<template>
  <q-form
    ref="parametersFormRef"
    class="q-pa-lg"
    aria-label="Formulario de parámetros del fondo"
  >
    <section>
      <div
        class="row q-col-gutter-x-lg"
        :class="isView ? 'q-col-gutter-y-lg' : 'q-col-gutter-y-sm'"
      >
        <p class="col-12 text-black-10 text-weight-bold text-h6" v-if="isView">
          Parámetros
        </p>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Fechas de operación
        </p>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p
              id="lbl-operation-start-date"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Fecha de inicio de operación
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-operation-start-date"
            >
              {{ formData.operation_start_date || '-' }}
            </p>
          </template>
          <GenericDateInputComponent
            v-else
            :default_value="formData.operation_start_date"
            label="Fecha de inicio de operación"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de inicio de operación es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            :disabled="isDisabled"
            @update:model-value="formData.operation_start_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p
              id="lbl-operation-end-date"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Fecha fin de operación
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-operation-end-date"
            >
              {{ formData.operation_end_date || '-' }}
            </p>
          </template>
          <GenericDateInputComponent
            v-else
            :default_value="formData.operation_end_date"
            label="Fecha fin de operación"
            mask="YYYY-MM-DD"
            :placeholder="isDisabled || !isFC ? '-' : 'YYYY-MM-DD'"
            :required="isFC"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha fin de operación es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            :disabled="isDisabled || !isFC"
            @update:model-value="formData.operation_end_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p
              id="lbl-operation-control-date"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Fecha de control de operación
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-operation-control-date"
            >
              {{ formData.operation_control_date || '-' }}
            </p>
          </template>
          <GenericDateInputComponent
            v-else
            :default_value="formData.operation_control_date"
            label="Fecha de control de operación"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de control de operación es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="formData.operation_control_date = $event"
          />
        </div>

        <div v-if="isView" class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Unidad de cálculo
        </p>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-calculation-unit"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Unidad de cálculo
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-calculation-unit">
              {{
                calculation_unit?.find(
                  (opt) => opt.label === formData.calculation_unit
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="formData.calculation_unit"
            label="Unidad de cálculo"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="calculation_unit"
            :rules="[
              (val: string) => useRules().is_required(val, 'La unidad de cálculo es requerida'),
            ]"
            @update:modelValue="formData.calculation_unit = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-minimun-value"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Valor mínimo
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-minimun-value">
              {{
                formData.minimun_value
                  ? formatCurrencyString(formData.minimun_value, {
                      showCurrencySymbol: false,
                    })
                  : '-'
              }}
            </p>
          </template>
          <CurrencyInput
            v-else
            v-model="formData.minimun_value"
            label="Valor mínimo"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor mínimo es requerido'),
            ]"
            :hide-icon="true"
          />
        </div>

        <div v-if="isView" class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Inversionistas
        </p>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-minimun-number-investors"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Número mínimo de inversionistas
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-minimun-number-investors"
            >
              {{ formData.minimun_number_investors || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.minimun_number_investors"
            label="Número mínimo de inversionistas"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El número mínimo de inversionistas es requerido'),
              (val: string) => useRules().min_value(val, isFA ? 10 : isFC ? 1 : 0),
              (val: string) => useRules().max_length(val, 4),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            @update:model-value="formData.minimun_number_investors = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-maximun-number-investors"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Porcentaje máximo por inversionista
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-maximun-number-investors"
            >
              {{ formatPercentage(formData.maximun_porcentage_per_investors) }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.maximun_porcentage_per_investors"
            label="Porcentaje máximo por inversionista"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El porcentaje máximo por inversionista es requerido'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 3, 2),
              (val: string) => useRules().max_value(val, isFA ? 10 : 100),
            ]"
            @update:model-value="
              formData.maximun_porcentage_per_investors = $event
            "
          />
        </div>

        <div v-if="isView" class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Plan
        </p>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-minimun-plan-balance"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Saldo mínimo del plan
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-minimun-plan-balance"
            >
              {{
                formData.minimun_plan_balance
                  ? formatCurrencyString(formData.minimun_plan_balance, {
                      showCurrencySymbol: false,
                    })
                  : '-'
              }}
            </p>
          </template>
          <CurrencyInput
            v-else
            v-model="formData.minimun_plan_balance"
            label="Saldo mínimo del plan"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El saldo minimo del plan es requerido'),
            ]"
            :hide-icon="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-minimun-investment-plan-percentage"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Porcentaje mínimo del plan de inversión
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-minimun-investment-plan-percentage"
            >
              {{
                formatPercentage(formData.minimun_investment_plan_percentage)
              }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.minimun_investment_plan_percentage"
            label="Porcentaje mínimo del plan de inversión"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El porcentaje minimo del plan de inversión es requerido'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 3, 2),
            ]"
            @update:model-value="
              formData.minimun_investment_plan_percentage = $event
            "
          />
        </div>

        <div v-if="isView" class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Fondo de control de aportes
        </p>

        <div class="col-12 col-md-4" v-if="isView">
          <p
            id="lbl-fund-permanency-agreement"
            class="q-mb-none text-black-10 text-weight-bold"
          >
            Fondo pacto de permanencia
          </p>

          <p
            class="mb-0 text-grey-9"
            aria-labelledby="lbl-fund-permanency-agreement"
          >
            {{ formatBoolean(formData.fund_permanency_agreement) }}
          </p>
        </div>

        <div
          class="row col-12 items-center justify-between q-pl-xl q-pr-md"
          v-else
        >
          <p class="q-mb-none mt-1 text-weight-medium">
            Fondo pacto de permanencia
          </p>

          <RadioYesNo
            v-model="formData.fund_permanency_agreement"
            class="q-mt-none"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
            :is-disabled="isDisabled || hasControlFund"
            @update:modelValue="formData.fund_permanency_agreement = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p
            id="lbl-fund-contribution-control"
            class="q-mb-none text-black-10 text-weight-bold"
          >
            Fondo control de aportes
          </p>

          <p
            class="mb-0 text-grey-9"
            aria-labelledby="lbl-fund-contribution-control"
          >
            {{ formatBoolean(formData.fund_contribution_control) }}
          </p>
        </div>

        <div class="col-12" v-else>
          <q-separator class="q-my-lg" />
        </div>

        <div
          class="row col-12 items-center justify-between q-pl-xl q-pr-md"
          v-if="!isView"
        >
          <p class="q-mb-none mt-1 text-weight-medium">
            Fondo control de aportes
          </p>

          <RadioYesNo
            v-model="formData.fund_contribution_control"
            class="q-mt-none"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
            :is-disabled="isDisabled || hasPermanence"
            @update:modelValue="formData.fund_contribution_control = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p
            id="lbl-extension-deadline"
            class="q-mb-none text-black-10 text-weight-bold"
          >
            Prorroga vencimiento
          </p>

          <p class="mb-0 text-grey-9" aria-labelledby="lbl-extension-deadline">
            {{ formatBoolean(formData.extension_deadline) }}
          </p>
        </div>

        <div class="col-12" v-else>
          <q-separator class="q-my-lg" />
        </div>

        <div
          class="row col-12 items-center justify-between q-pl-xl q-pr-md"
          v-if="!isView"
        >
          <p class="q-mb-none mt-1 text-weight-medium">Prorroga vencimiento</p>

          <RadioYesNo
            v-model="formData.extension_deadline"
            class="q-mt-none"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
            :is-disabled="isDisabled || !isPermanenceRequired"
            @update:modelValue="formData.extension_deadline = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p
            id="lbl-permanency-days"
            class="q-mb-none text-black-10 text-weight-bold"
          >
            Días de permanencia
          </p>

          <p class="mb-0 text-grey-9" aria-labelledby="lbl-permanency-days">
            {{ formData.permanency_days || '-' }}
          </p>
        </div>

        <div class="col-12" v-else>
          <q-separator class="q-my-lg" />
        </div>

        <div class="col-12 col-md-6" v-if="!isView">
          <GenericInputComponent
            v-if="isEditable"
            :default_value="formData.permanency_days"
            label="Días de permanencia"
            :placeholder="!isPermanenceRequired ? '-' : 'Inserte'"
            type="text"
            :required="isPermanenceRequired"
            :rules="[
              (val: string) => useRules().is_required(val, 'Los días de permanencia es requerido'),
              (val: string) => useRules().max_length(val, 99999),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="!isPermanenceRequired"
            @update:model-value="formData.permanency_days = $event"
          />
        </div>

        <div class="col-12 col-md-6" :class="isView ? 'col-md-4' : 'col-md-6'">
          <template v-if="isView">
            <p
              id="lbl-term-basis"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Base de plazo
            </p>

            <p class="mb-0 text-grey-9" aria-labelledby="lbl-term-basis">
              {{
                term_basis?.find(
                  (opt) => opt.value === String(formData.term_basis)
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="formData.term_basis"
            label="Base de plazo"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="term_basis"
            :rules="[
              (val: string) => useRules().is_required(val, 'La base de plazo es requerida'),
            ]"
            :disabled="isDisabled || !isPermanenceRequired"
            @update:modelValue="formData.term_basis = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p id="lbl-penalty" class="q-mb-none text-black-10 text-weight-bold">
            Penalización
          </p>
          <p class="mb-0 text-grey-9" aria-labelledby="lbl-penalty">
            {{ formatBoolean(formData.penalty) }}
          </p>
        </div>

        <div
          class="row col-12 items-center justify-between q-pl-xl q-pr-md"
          v-if="!isView"
        >
          <p class="q-mb-none mt-1 text-weight-medium">Penalización</p>
          <RadioYesNo
            v-model="formData.penalty"
            class="q-mt-none"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
            :is-disabled="isDisabled || !isPermanenceRequired"
            @update:model-value="formData.penalty = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p
            id="lbl-penalty-gmf"
            class="q-mb-none text-black-10 text-weight-bold"
          >
            GMF Penalización
          </p>

          <p class="mb-0 text-grey-9" aria-labelledby="lbl-penalty-gmf">
            {{ formatBoolean(formData.penalty_gmf) }}
          </p>
        </div>

        <div class="col-12" v-else>
          <q-separator class="q-my-lg" />
        </div>

        <div
          class="row col-12 items-center justify-between q-pl-xl q-pr-md"
          v-if="!isView"
        >
          <p class="q-mb-none mt-1 text-weight-medium">GMF Penalización</p>

          <RadioYesNo
            v-model="formData.penalty_gmf"
            class="q-mt-none"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
            :is-disabled="isDisabled || hasPenalty"
            @update:modelValue="formData.penalty_gmf = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p
            id="lbl-grace-days"
            class="q-mb-none text-black-10 text-weight-bold"
          >
            Días de gracia
          </p>

          <p class="mb-0 text-grey-9" aria-labelledby="lbl-grace-days">
            {{ formData.grace_days || '-' }}
          </p>
        </div>

        <div class="col-12" v-else>
          <q-separator class="q-my-lg" />
        </div>

        <div class="col-12 col-md-6" v-if="!isView">
          <GenericInputComponent
            v-if="isEditable"
            :default_value="formData.grace_days"
            label="Días de gracia"
            :placeholder="
              isDisabled || !isPermanenceRequired || hasPenalty
                ? '-'
                : 'Inserte'
            "
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Los días de gracia es requerido'),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="isDisabled || !isPermanenceRequired || hasPenalty"
            @update:model-value="formData.grace_days = $event"
          />
        </div>

        <div class="col-12 col-md-6" :class="isView ? 'col-md-4' : 'col-md-6'">
          <template v-if="isView">
            <p
              id="lbl-penalty-percentage"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Porcentaje penalización
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-penalty-percentage"
            >
              {{ formatPercentage(formData.pernalty_percentage) }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.pernalty_percentage"
            label="Porcentaje penalización"
            :placeholder="hasPenalty ? '-' : 'Inserte'"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El porcentaje penalización es requerido'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 3, 2),
            ]"
            :disabled="hasPenalty"
            @update:model-value="formData.pernalty_percentage = $event"
          />
        </div>

        <div class="col-12" v-if="isView">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Saldo
        </p>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p
              id="lbl-investment-plan-status-modification"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Modificación estado plan de inversión
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-investment-plan-status-modification"
            >
              {{
                status_investment_plan_status_modification?.find(
                  (opt) =>
                    opt.value ===
                    formData.investment_plan_status_modification_id
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="formData.investment_plan_status_modification_id"
            label="Modificación estado plan de inversión"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="status_investment_plan_status_modification"
            :rules="[
              (val: string) => useRules().is_required(val, 'La modificación estado plan de inversión es requerida'),
            ]"
            @update:modelValue="
              formData.investment_plan_status_modification_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p
              id="lbl-minimun-balance"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Saldo inferior
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-minimun-balance">
              {{
                formData.minimun_balance
                  ? formatCurrencyString(formData.minimun_balance, {
                      showCurrencySymbol: false,
                    })
                  : '-'
              }}
            </p>
          </template>
          <CurrencyInput
            v-else
            v-model="formData.minimun_balance"
            label="Saldo inferior"
            placeholder="Inserte"
            type="text"
            :required="false"
            :rules="[
              (val: string) => useRules().is_required(val, 'El saldo inferior es requerido'),
            ]"
            :disabled="isInvestmentPlanStatusChange"
            :hide-icon="true"
          />
        </div>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p
              id="lbl-days-without-movement"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Días sin movimiento
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-days-without-movement"
            >
              {{ formData.days_without_movement || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.days_without_movement"
            label="Días sin movimiento"
            :placeholder="isInvestmentPlanStatusChange ? '-' : 'Inserte'"
            type="text"
            :required="false"
            :rules="[
              (val: string) => useRules().is_required(val, 'Los días sin movimiento es requerido'),
              (val: string) => useRules().max_length(val, 3),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="isInvestmentPlanStatusChange"
            @update:model-value="formData.days_without_movement = $event"
          />
        </div>

        <div class="col-12" v-if="isView">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Comisión
        </p>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-fiduciary-commission"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Código comisión
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-fiduciary-commission"
            >
              {{
                fiduciary_commissions?.find(
                  (opt) => opt.value === formData.commission_id
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="formData.commission_id"
            label="Código comisión"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="fiduciary_commissions"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código comisión es requerido'),
            ]"
            :disabled="isDisabled || hasParticipationTypes"
            @update:modelValue="formData.commission_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-commission-assumed"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Asume comisión
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-commission-assumed"
            >
              {{
                commission_assumed?.find(
                  (opt) => opt.value === commissionAssumedValue
                )?.label ||
                formData.commission_assumed ||
                '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="commissionAssumedValue"
            label="Asume comisión"
            placeholder="Seleccione"
            required
            :manual_option="commission_assumed"
            map_options
            :rules="[
              (val: string) => useRules().is_required(val, 'Asume comisión es requerido'),
            ]"
            :disabled="hasParticipationTypes"
            @update:modelValue="commissionAssumedValue = $event"
          />
        </div>

        <div class="col-12" v-if="tableProps.rows.length">
          <VCard>
            <template #content-card>
              <div class="q-pa-lg">
                <TableList
                  hidePagination
                  :loading="tableProps.loading"
                  :columns="tableProps.columns"
                  :rows="tableProps.rows"
                  aria-label="Lsita de comisiones"
                />
              </div>
            </template>
          </VCard>
        </div>

        <div class="col-12 col-md-6" v-else>
          <template v-if="isView">
            <p
              id="lbl-fixed-rate-percentage"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Porcentaje de la comisión
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-fixed-rate-percentage"
            >
              {{ formatPercentage(formData.fixed_rate_percentage) }}
            </p>
          </template>
          <GenericInputComponent
            v-if="isEditable"
            :default_value="formData.fixed_rate_percentage"
            label="Porcentaje de la comisión"
            :required="false"
            :rules="[]"
            disabled
          />
        </div>

        <div class="col-12" v-if="isView">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Porcentajes
        </p>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-gmf-percentage"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Porcentaje GMF
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-gmf-percentage">
              {{ formatPercentage(formData.gmf_percentage) }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.gmf_percentage"
            label="Porcentaje GMF"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 3, 2),
              (val: string) => useRules().is_required(val, 'El porcentaje GMF es requerido'),
            ]"
            @update:model-value="formData.gmf_percentage = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-withholding-percentage"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Porcentaje retención
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-withholding-percentage"
            >
              {{ formatPercentage(formData.withholding_percentage) }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.withholding_percentage"
            label="Porcentaje retención"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 3, 2),
              (val: string) => useRules().is_required(val, 'El porcentaje retención es requerido'),
            ]"
            @update:model-value="formData.withholding_percentage = $event"
          />
        </div>

        <div class="col-12" v-if="isView">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Estructura del plan de inversión
        </p>

        <div class="col-12 col-md-3">
          <template v-if="isView">
            <p
              id="lbl-structure"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Estructura
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-structure">
              {{
                structure?.find((opt) => opt.value === formData.structure)
                  ?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="formData.structure"
            label="Estructura"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="structure"
            :rules="[
              (val: string) => useRules().is_required(val, 'La estructura es requerida'),
            ]"
            :disabled="isDisabled"
            @update:modelValue="formData.structure = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <template v-if="isView">
            <p
              id="lbl-office-length"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Longitud oficina
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-office-length">
              {{ formData.office_length || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.office_length"
            label="Longitud oficina"
            :placeholder="!hasCityInStructure ? '-' : 'Inserte'"
            type="text"
            :required="hasCityInStructure"
            :rules="[
              (val: string) => hasCityInStructure ? useRules().is_required(val, 'La longitud oficina es requerida') : true,
              (val: string) => useRules().max_value(val, 4),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="!hasCityInStructure"
            @update:model-value="formData.office_length = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <template v-if="isView">
            <p
              id="lbl-fund-length"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Longitud fondo
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-fund-length">
              {{ formData.fund_length || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.fund_length"
            label="Longitud fondo"
            :placeholder="!hasFundInStructure ? '-' : 'Inserte'"
            type="text"
            :required="hasFundInStructure"
            :rules="[
              (val: string) => useRules().is_required(val, 'La longitud fondo es requerida'),
              (val: string) => useRules().max_value(val, 4),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="!hasFundInStructure"
            @update:model-value="formData.fund_length = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <template v-if="isView">
            <p
              id="lbl-consecutive-length"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Longitud consecutivo
            </p>
            <p
              class="mb-0 text-grey-9"
              aria-labelledby="lbl-consecutive-length"
            >
              {{ formData.consecutive_length || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.consecutive_length"
            label="Longitud consecutivo"
            :placeholder="!hasConsecutiveInStructure ? '-' : 'Inserte'"
            type="text"
            :required="hasConsecutiveInStructure"
            :rules="[
              (val: string) => useRules().is_required(val, 'La longitud consecutivo es requerida'),
              (val: string) => useRules().max_value(val, 8),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="!hasConsecutiveInStructure"
            @update:model-value="formData.consecutive_length = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-structure-length"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Total longitud estructura
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-structure-length">
              {{ formData.structure_length || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="totalStructureLength"
            label="Total longitud estructura"
            placeholder="-"
            type="text"
            disabled
            @update:model-value="formData.structure_length = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-example-code-plan"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Ejemplo de código del plan
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-example-code-plan">
              {{ formData.example_code_plan || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="examplePlanCode"
            label="Ejemplo de código del plan"
            placeholder="-"
            type="text"
            disabled
            @update:model-value="formData.example_code_plan = $event"
          />
        </div>

        <div class="col-12" v-if="isView">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6"
          :class="isView ? 'q-mb-none' : ''"
        >
          Negocios
        </p>

        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-business-type"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Tipo de negocio
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-business-type">
              {{
                business_trust_types?.find(
                  (opt) => opt.value === formData.business_type_id
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="formData.business_type_id"
            label="Tipo de negocio"
            placeholder="Seleccione"
            map_options
            :required="false"
            :manual_option="business_trust_types"
            :rules="[]"
            @update:modelValue="handleBusinessTypeChange"
          />
        </div>
        <div class="col-12 col-md-6">
          <template v-if="isView">
            <p
              id="lbl-business-subtype"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Subtipo de negocio
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-business-subtype">
              {{
                business_trust_subtypes?.find(
                  (opt) => opt.value === formData.business_subtype_id
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="formData.business_subtype_id"
            label="Subtipo de negocio"
            placeholder="Seleccione"
            :required="false"
            :manual_option="business_trust_subtypes"
            map_options
            :rules="[]"
            @update:modelValue="formData.business_subtype_id = $event"
          />
        </div>

        <div class="col-12" v-if="isView">
          <q-separator class="q-my-lg" />
        </div>

        <p
          class="col-12 text-black-10 text-weight-bold text-h6 q-pt-lg"
          :class="isView ? 'q-mb-none' : ''"
        >
          {{
            isView ? 'Observaciones normativas para extractos' : 'Observaciones'
          }}
        </p>

        <div class="col-12">
          <template v-if="isView">
            <p
              id="lbl-description"
              class="q-mb-none text-black-10 text-weight-bold"
            >
              Descripción
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-description">
              {{ formData.description || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-else
            :default_value="formData.description"
            label="Descripción"
            placeholder="Inserte"
            type="textarea"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La descripción es requerida'),
              (val: string) => useRules().max_length(val, 2000),
              (val: string) => useRules().min_length(val, 1),
            ]"
            @update:model-value="formData.description = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useParametersForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/Parameters/ParametersForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: {}
  }>(),
  {}
)

const {
  isFA,
  isFC,
  isView,
  fundCode,
  fundType,
  formData,
  structure,
  term_basis,
  isEditable,
  isDisabled,
  tableProps,
  hasPenalty,
  formatBoolean,
  hasPermanence,
  hasControlFund,
  examplePlanCode,
  formatPercentage,
  calculation_unit,
  parametersFormRef,
  participationType,
  hasFundInStructure,
  hasCityInStructure,
  commission_assumed,
  business_trust_types,
  isPermanenceRequired,
  totalStructureLength,
  formatCurrencyString,
  fiduciary_commissions,
  hasParticipationTypes,
  commissionAssumedValue,
  business_trust_subtypes,
  hasConsecutiveInStructure,
  handleBusinessTypeChange,
  isInvestmentPlanStatusChange,
  status_investment_plan_status_modification,
} = useParametersForm(props)

defineExpose({
  getValues: () => formData.value,
  setCode: (val: string) => (fundCode.value = val),
  setFundType: (val: string) => (fundType.value = val),
  validateForm: () => parametersFormRef.value?.validate(),
  setParticipationType: (val: string) => (participationType.value = val),
})
</script>
