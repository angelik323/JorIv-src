<template>
  <section>
    <q-form ref="accounting_trust_business_form_ref">
      <p class="font-size-1 text-weight-bold">Información general</p>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            :default_value="models?.address"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'La dirección es requerida'),
            ]"
            :placeholder="`Ingrese la dirección`"
            :required="true"
            @update:model-value="models.address = $event"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Dirección</p>
            <p class="text-grey-6 mb-0">
              {{ models.address ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País"
            :placeholder="`Seleccione un país`"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.country_id"
            :manual_option="countries"
            @update:model-value="models.country_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El país es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">País</p>
            <p class="text-grey-6 mb-0">
              {{ models.country ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-3 col-lg-3"
          v-if="is_colombia || ['view'].includes(action)"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Departamento"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :placeholder="`Seleccione un departamento`"
            :required="is_colombia"
            :default_value="models.department_id"
            :manual_option="is_colombia ? departments : []"
            @update:model-value="models.department_id = $event"
            :rules="
              is_colombia
                ? [
                    (v: string) =>
                      useRules().is_required(v, 'El departamento es requerido'),
                  ]
                : []
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Departamento</p>
            <p class="text-grey-6 mb-0">
              {{ models.department ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-3 col-lg-3"
          v-if="is_colombia || ['view'].includes(action)"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Ciudad"
            :placeholder="`Seleccione una ciudad`"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :default_value="models.city_id"
            :manual_option="models.department_id ? cities : []"
            @update:model-value="models.city_id = $event"
            :rules="
              is_colombia
                ? [
                    (v: string) =>
                      useRules().is_required(v, 'La ciudad es requerido'),
                  ]
                : []
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Ciudad</p>
            <p class="text-grey-6 mb-0">
              {{ models.city ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            class_custom_popup="custom"
            label="NIT auxiliar"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.auxiliary_nit"
            :manual_option="nit_agents"
            @update:model-value="models.auxiliary_nit = $event"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El NIT auxiliar es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">NIT auxiliar</p>
            <p class="text-grey-6 mb-0">
              {{ models.nit_auxiliary_view ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Identificación tributaria"
            class_custom_popup="custom"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.identification_tax"
            :manual_option="nit_agents"
            @update:model-value="models.identification_tax = $event"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La identificación tributaria es requerida'
                ),
              (v: string) => useRules().max_length(v, 15),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Identificación tributaria
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.tax_identification_view ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Agente retenedor"
            class_custom_popup="custom"
            :placeholder="`Seleccione un agente`"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models?.retaining_agent_id"
            :manual_option="business_trust_third_parties"
            @update:model-value="models.retaining_agent_id = $event"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El agente retenedor es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Agente retenedor
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.retaining_agent_view ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estado"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.status_id"
            :manual_option="status_accounting_trust_business"
            @update:model-value="models.status_id = $event"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El estado es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Estado</p>
            <p class="text-grey-6 mb-0">
              {{ models.status?.name ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura contable"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.accounting_structure_id"
            :manual_option="account_structures"
            @update:model-value="
              ;(models.accounting_structure_id = $event),
                (models.business_account_structures[0].account_structure_id =
                  $event)
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La estructura contable es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura contable
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.accounting_structure_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Centro de costos"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.has_cost_center"
            :manual_option="default_yes_no"
            @update:model-value="models.has_cost_center = $event"
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'El centro de costos es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Centro de costos
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.has_cost_center ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
        <div
          v-if="!!models.has_cost_center"
          class="col-xs-12 col-sm-12 col-md-3 col-lg-3"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura Centro de costos"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.cost_center_structure_id"
            :manual_option="cost_centers_structures"
            @update:model-value="models.cost_center_structure_id = $event"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La estructura de centro de costos es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura Centro de costos
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.cost_center_structure ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Moneda funcional del negocio"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.functional_business_currency"
            :manual_option="business_currency"
            @update:model-value="models.functional_business_currency = $event"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La moneda funcional del negocio es requerida'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Moneda funcional del negocio
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.functional_business_currency ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Consolidadora"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.has_consolidator"
            :manual_option="default_yes_no"
            @update:model-value="models.has_consolidator = $event"
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'La consolidadora es requerida'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Consolidadora</p>
            <p class="text-grey-6 mb-0">
              {{ models.has_consolidator ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Opera moneda extranjera"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.can_foreign_currency"
            :manual_option="default_yes_no"
            @update:model-value="models.can_foreign_currency = $event"
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'La operación de moneda extranjera es requerida'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Opera moneda extranjera
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.can_foreign_currency ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Última reexpresión moneda extranjera"
            :default_value="models?.last_restatement_foreign_currency"
            :rules="
              can_foreign_currency
                ? [
                    (v: string) =>
                      useRules().is_required(
                        v,
                        'La última reexpresión de moneda extranjera es requerida'
                      ),
                  ]
                : []
            "
            :required="can_foreign_currency"
            :disabled="!can_foreign_currency"
            @update:model-value="
              models.last_restatement_foreign_currency = $event
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Última reexpresión moneda extranjera
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.startup_period ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="¿Maneja estructura equivalente?"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.has_equivalent_structure"
            :manual_option="default_yes_no"
            @update:model-value="models.has_equivalent_structure = $event"
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'Este campo es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              ¿Maneja estructura equivalente?
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.has_equivalent_structure ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="¿Maneja estructura fiscal?"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.has_tax_structure"
            :manual_option="default_yes_no"
            @update:model-value="models.has_tax_structure = $event"
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'Este campo es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              ¿Maneja estructura fiscal?
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.has_tax_structure ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>

      <p class="font-size-1 text-weight-bold mt-4">Información tributaria</p>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Responsabilidad fiscal"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models?.has_fiscal_responsibility"
            :manual_option="fiscal_responsability"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La responsabilidad fiscal es requerida'
                ),
            ]"
            :required="true"
            @update:model-value="models.has_fiscal_responsibility = $event"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Responsabilidad fiscal
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.has_fiscal_responsibility }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Responsable de IVA"
            :required="!responsable_vat"
            :disabled="responsable_vat"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models?.has_responsibility_iva"
            :manual_option="default_yes_no"
            @update:model-value="models.has_responsibility_iva = $event"
            :rules="
              responsable_vat
                ? []
                : [
                    (v: boolean) =>
                      useRules().is_required_boolean(
                        v,
                        'El responsable de IVA es requerido'
                      ),
                  ]
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Responsable de IVA
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.has_responsibility_iva ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Retiene ICA"
            :required="!responsable_vat"
            :disabled="responsable_vat"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.can_retains_ica"
            :manual_option="default_yes_no"
            @update:model-value="models.can_retains_ica = $event"
            :rules="
              responsable_vat
                ? []
                : [
                    (v: boolean) =>
                      useRules().is_required_boolean(
                        v,
                        'El retiene ICA es requerido'
                      ),
                  ]
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Retiene ICA</p>
            <p class="text-grey-6 mb-0">
              {{ models.can_retains_ica ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Retiene ICA diferencial"
            :required="!responsable_vat"
            :disabled="responsable_vat"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.retains_differential_ica"
            :manual_option="default_yes_no"
            @update:model-value="models.retains_differential_ica = $event"
            :rules="
              !responsable_vat
                ? []
                : [
                    (v: boolean) =>
                      useRules().is_required_boolean(
                        v,
                        'El retiene ICA diferencial es requerido'
                      ),
                  ]
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Retiene ICA diferencial
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.retains_differential_ica ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>

      <p class="font-size-1 text-weight-bold mt-4">
        Información cierre contable principal
      </p>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo de arranque"
            :default_value="models?.startup_period"
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            :disabled="
              ['edit'].includes(action) &&
              data_information_form?.status_id !==
                TrustBusinessStatusID.PREOPERATIONAL
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El periodo de arranque es requerido'
                ),
            ]"
            :required="true"
            @update:model-value="
              ;(models.startup_period = $event),
                (models.business_account_structures[0].startup_period = $event)
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Periodo de arranque
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.startup_period ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo actual"
            :default_value="models?.current_period"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El periodo actual es requerido'),
            ]"
            :required="false"
            :disabled="true"
            @update:model-value="
              ;(models.current_period = $event),
                (models.business_account_structures[0].current_period = $event)
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Periodo actual</p>
            <p class="text-grey-6 mb-0">
              {{ models.current_period ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo último cierre"
            :required="false"
            :disabled="true"
            placeholder="AAAA-MM"
            :default_value="models.last_closing"
            @update:model-value="
              ;(models.last_closing = $event),
                (models.business_account_structures[0].last_closing = $event)
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El periodo último cierre es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Periodo último cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.last_closing ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Último día cierre"
            :required="false"
            :disabled="true"
            :default_value="models.last_closing_day"
            @update:model-value="
              ;(models.last_closing_day = $event),
                (models.business_account_structures[0].last_closing_day =
                  $event)
            "
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El último día cierre es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Último día cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.last_closing_day ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Genera cierre diario"
            :required="true"
            auto_complete
            map_options
            :disabled="
              ['edit'].includes(action) &&
              data_information_form?.status_id !==
                TrustBusinessStatusID.PREOPERATIONAL
            "
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.daily_closing"
            :manual_option="default_yes_no"
            @update:model-value="models.daily_closing = $event"
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'El cierre diario es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Genera cierre diario
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.daily_closing ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Último cierre diario"
            :required="models.daily_closing === true"
            :disabled="
              models.daily_closing !== true ||
              (['edit'].includes(action) &&
                data_information_form?.status_id !==
                  TrustBusinessStatusID.PREOPERATIONAL) ||
              ['view'].includes(action)
            "
            :default_value="models.last_closing_daily"
            @update:model-value="models.last_closing_daily = $event"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El último cierre diario es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Último cierre diario
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.last_closing_daily ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <p
        class="font-size-1 text-weight-bold mt-4"
        v-if="models.has_equivalent_structure"
      >
        Información cierre contable estructura equivalente
      </p>
      <div class="row q-col-gutter-md" v-if="models.has_equivalent_structure">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura contable"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="
              models.business_account_structures[1].account_structure_id
            "
            :manual_option="account_structures"
            @update:model-value="
              models.business_account_structures[1].account_structure_id =
                $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La estructura contable es requerido'
                ),
                (v: string) => useRules().validate_not_same(v, models.business_account_structures[0].account_structure_id, 'La estructura contable no se puede repetir')
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura contable
            </p>
            <p class="text-grey-6 mb-0">
              {{
                `${models.business_account_structures[1].account_structure?.code} - ${models.business_account_structures[1].account_structure?.purpose}`
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo de arranque"
            :default_value="
              models.business_account_structures[1].startup_period
            "
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            :disabled="
              ['edit'].includes(action) &&
              data_information_form?.status_id !==
                TrustBusinessStatusID.PREOPERATIONAL
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El periodo de arranque es requerido'
                ),
            ]"
            :required="models.has_equivalent_structure"
            @update:model-value="
              models.business_account_structures[1].startup_period = $event
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Periodo de arranque
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[1].startup_period ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo actual"
            :default_value="
              models.business_account_structures[1]?.current_period
            "
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El periodo actual es requerido'),
            ]"
            :required="false"
            :disabled="true"
            @update:model-value="
              models.business_account_structures[1].current_period = $event
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Periodo actual</p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[1].current_period ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo último cierre"
            :required="false"
            :disabled="true"
            placeholder="AAAA-MM"
            :default_value="models.business_account_structures[1].last_closing"
            @update:model-value="
              models.business_account_structures[1].last_closing = $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El periodo último cierre es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Periodo último cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[1].last_closing ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Último día cierre"
            :required="false"
            :disabled="true"
            :default_value="
              models.business_account_structures[1].last_closing_day
            "
            @update:model-value="
              models.business_account_structures[1].last_closing_day = $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El último día cierre es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Último día cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[1].last_closing_day ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Genera cierre diario"
            :required="true"
            auto_complete
            map_options
            :disabled="
              ['edit'].includes(action) &&
              data_information_form?.status_id !==
                TrustBusinessStatusID.PREOPERATIONAL
            "
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.business_account_structures[1].daily_closing"
            :manual_option="default_yes_no"
            @update:model-value="
              models.business_account_structures[1].daily_closing = $event
            "
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'El cierre diario es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Genera cierre diario
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[1].daily_closing
                  ? 'Sí'
                  : 'No'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Último cierre diario"
            :required="
              models.business_account_structures[1].daily_closing === true
            "
            :disabled="
              models.business_account_structures[1].daily_closing !== true ||
              (['edit'].includes(action) &&
                data_information_form?.status_id !==
                  TrustBusinessStatusID.PREOPERATIONAL) ||
              ['view'].includes(action)
            "
            :default_value="
              models.business_account_structures[1].last_closing_daily
            "
            @update:model-value="
              models.business_account_structures[1].last_closing_daily = $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El último cierre diario es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Último cierre diario
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[1].last_closing_daily ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>

      <p
        class="font-size-1 text-weight-bold mt-4"
        v-if="models.has_tax_structure"
      >
        Información cierre contable estructura fiscal
      </p>
      <div class="row q-col-gutter-md" v-if="models.has_tax_structure">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura contable"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="
              models.business_account_structures[2].account_structure_id
            "
            :manual_option="account_structures"
            @update:model-value="
              models.business_account_structures[2].account_structure_id =
                $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La estructura contable es requerido'
                ),
                (v: string) => useRules().validate_not_same(v, models.business_account_structures[0].account_structure_id, 'La estructura contable no se puede repetir'),
                (v: string) => useRules().validate_not_same(v, models.business_account_structures[1].account_structure_id, 'La estructura contable no se puede repetir'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura contable
            </p>
            <p class="text-grey-6 mb-0">
              {{
                `${models.business_account_structures[2].account_structure?.code} - ${models.business_account_structures[2].account_structure?.purpose}`
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo de arranque"
            :default_value="
              models.business_account_structures[2].startup_period
            "
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            :disabled="
              ['edit'].includes(action) &&
              data_information_form?.status_id !==
                TrustBusinessStatusID.PREOPERATIONAL
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El periodo de arranque es requerido'
                ),
            ]"
            :required="models.has_tax_structure"
            @update:model-value="
              models.business_account_structures[2].startup_period = $event
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Periodo de arranque
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[2].startup_period ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo actual"
            :default_value="
              models.business_account_structures[2]?.current_period
            "
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El periodo actual es requerido'),
            ]"
            :required="false"
            :disabled="true"
            @update:model-value="
              models.business_account_structures[2].current_period = $event
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Periodo actual</p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[2].current_period ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodo último cierre"
            :required="false"
            :disabled="true"
            placeholder="AAAA-MM"
            :default_value="models.business_account_structures[2].last_closing"
            @update:model-value="
              models.business_account_structures[2].last_closing = $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El periodo último cierre es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Periodo último cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[2].last_closing ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Último día cierre"
            :required="false"
            :disabled="true"
            :default_value="
              models.business_account_structures[2].last_closing_day
            "
            @update:model-value="
              models.business_account_structures[2].last_closing_day = $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El último día cierre es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Último día cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[2].last_closing_day ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Genera cierre diario"
            :required="true"
            auto_complete
            map_options
            :disabled="
              ['edit'].includes(action) &&
              data_information_form?.status_id !==
                TrustBusinessStatusID.PREOPERATIONAL
            "
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.business_account_structures[2].daily_closing"
            :manual_option="default_yes_no"
            @update:model-value="
              models.business_account_structures[2].daily_closing = $event
            "
            :rules="[
              (v: boolean) =>
                useRules().is_required_boolean(
                  v,
                  'El cierre diario es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Genera cierre diario
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[2].daily_closing
                  ? 'Sí'
                  : 'No'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Último cierre diario"
            :required="
              models.business_account_structures[2].daily_closing === true
            "
            :disabled="
              models.business_account_structures[2].daily_closing !== true ||
              (['edit'].includes(action) &&
                data_information_form?.status_id !==
                  TrustBusinessStatusID.PREOPERATIONAL) ||
              ['view'].includes(action)
            "
            :default_value="
              models.business_account_structures[2].last_closing_daily
            "
            @update:model-value="
              models.business_account_structures[2].last_closing_daily = $event
            "
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El último cierre diario es requerido'
                ),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Último cierre diario
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_account_structures[2].last_closing_daily ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </q-form>
  </section>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

// Emits
const emits = defineEmits<(e: 'update:models', value: any) => void>()

// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

import useAccountingTrustBusiness from './AccountingTrustBusiness'
import { useRules } from '@/composables'

const {
  models,
  countries,
  departments,
  cities,
  cost_centers_structures,
  fiscal_responsability,
  default_yes_no,
  business_currency,
  account_structures,
  status_accounting_trust_business,
  accounting_trust_business_form_ref,
  business_trust_third_parties,
  nit_agents,
  is_colombia,
  can_foreign_currency,
  responsable_vat,
  data_information_form,
  TrustBusinessStatusID,
} = useAccountingTrustBusiness(props, emits)

defineExpose({
  validateForm: () => accounting_trust_business_form_ref.value?.validate(),
})
</script>
