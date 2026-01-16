<template>
  <q-form ref="formInformation">
    <section v-if="['view'].includes(action)">
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">Estado</p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">Estado</p>

            <ShowStatus
              :type="models.status?.id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </div>

          <div
            v-if="models.status?.id == 39"
            class="col-xs-12 col-sm-12 col-md-6"
          >
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">
              Fecha de cancelación
            </p>

            <p class="text-grey-9 mb-0">
              {{ models.cancellation_date ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="models.status?.id == 39"
            class="col-xs-12 col-sm-12 col-md-6"
          >
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">
              Motivo de cancelación
            </p>

            <p class="text-grey-9 mb-0">
              {{ models.cancellation_reasons ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="models.status?.id == 51"
            class="col-xs-12 col-sm-12 col-md-6"
          >
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">
              Motivo de bloqueo
            </p>

            <p class="text-grey-9 mb-0">
              {{ models.blocking_reasons ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator v-if="['view'].includes(action)" class="mt-1" />

    <section v-if="['edit'].includes(action)">
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">Estado</p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p class="text-weight-medium text-grey-6 mb-0">Estado</p>

            <GenericSelectorComponent
              :default_value="models.status?.id"
              :manual_option="bank_account_status"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El estado es requerido'),
              ]"
              @update:model-value="clearStatus($event)"
              @update:modelValue="models.status!.id = $event"
            />
          </div>

          <div
            v-if="models.status?.id == 39"
            class="col-xs-12 col-sm-12 col-md-6"
          >
            <p class="text-weight-medium text-grey-6 mb-0">
              Fecha de cancelación
            </p>

            <GenericDateInputComponent
              :default_value="models.cancellation_date"
              :required="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La fecha de cancelacion es requerida'
                  ),
              ]"
              @update:modelValue="models.cancellation_date = $event"
            />
          </div>

          <div
            v-if="models.status?.id == 39"
            class="col-xs-12 col-sm-12 col-md-12"
          >
            <p class="text-weight-medium text-grey-6 mb-0">
              Motivo de cancelación*
            </p>

            <GenericInput
              placeholder="Inserte"
              type="textarea"
              :required="true"
              :default_value="models.cancellation_reasons ?? ''"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La razon de cancelación es requerida'
                  ),
                (val: string) => useRules().max_length(val, 200),
                (val: string) => useRules().min_length(val, 6),
              ]"
              @update:modelValue="models.cancellation_reasons = $event"
            />
          </div>

          <div
            v-if="models.status?.id == 51"
            class="col-xs-12 col-sm-12 col-md-12"
          >
            <p class="text-weight-medium text-grey-6 mb-0">
              Motivo de bloqueo*
            </p>

            <GenericInput
              placeholder="Inserte"
              type="textarea"
              :required="true"
              :default_value="models.blocking_reasons ?? ''"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La razon de bloqueo es requerida'
                  ),
                (val: string) => useRules().max_length(val, 200),
                (val: string) => useRules().min_length(val, 6),
              ]"
              @update:modelValue="models.blocking_reasons = $event"
            />
          </div>
        </div>
      </div>
    </section>

    <q-separator v-if="['edit'].includes(action)" class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div v-if="['edit', 'view'].includes(action)" class="col-12">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">
              Información basica
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-12'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{ ['view'].includes(action) ? 'Nombre' : 'Negocio*' }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.business_id"
              :manual_option="bank_account_business"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :disabled="['edit'].includes(action)"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El negocio es requerido'),
              ]"
              @update:model-value="
                (val) => {
                  models.business_id = val
                  models.gmf_fund_accounting_account_id = null
                }
              "
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.account_name ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{ ['view'].includes(action) ? 'Cuenta bancaria' : 'Banco*' }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.bank_id"
              :manual_option="treasury_banks"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :disabled="['edit'].includes(action)"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El banco es requerido'),
              ]"
              @update:model-value="models.bank_id = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.account_bank ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{
                ['view'].includes(action)
                  ? 'Tipo de cuenta'
                  : 'Nombre de cuenta*'
              }}
            </p>

            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.account_name"
              placeholder="Inserte"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El nombre de cuenta es requerido'),
                (val: string) => useRules().no_special_characters(val),
                (val: string) => useRules().max_length(val, 60),
                (val: string) => useRules().min_length(val, 3),
                (val: string) => useRules().no_consecutive_spaces(val),
              ]"
              @update:model-value="updateUpperCase('account_name', $event)"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.account_type ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{
                ['view'].includes(action)
                  ? 'Titular o responsable'
                  : 'Cuenta bancaria*'
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.account_bank"
              placeholder="Inserte"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La cuenta bancaria es requerida'
                  ),
                (val: string) => useRules().only_number(val),
                (val: string) => useRules().max_length(val, 16),
              ]"
              @update:model-value="updateUpperCase('account_bank', $event)"
            />
            <p v-else class="mb-0 text-grey-9">
              {{
                `${models.responsible_owner_document ?? ''} - ${
                  models.responsible_owner_name ?? ''
                }`
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Número de cuenta{{ ['view'].includes(action) ? '' : '*' }}
            </p>

            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.account_number"
              placeholder="Inserte"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El número de cuenta es requerido'
                  ),
                (val: string) => useRules().only_number(val),
                (val: string) => useRules().max_length(val, 30),
              ]"
              @update:model-value="updateUpperCase('account_number', $event)"
            />
            <p v-else class="mb-0 text-grey-9 word-break-all">
              {{ models.account_number ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{
                ['view'].includes(action)
                  ? 'Tipo de operacion'
                  : 'Titular o responsable*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.responsible_owner_id"
              :manual_option="active_third_parties"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El titular o responsable es requerido'
                  ),
              ]"
              @update:model-value="models.responsible_owner_id = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.operation_type ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{
                ['view'].includes(action)
                  ? 'Tipo de producto'
                  : 'Tipo de operación*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.operation_type"
              :manual_option="operation_types"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El tipo de operación es requerido'
                  ),
              ]"
              @update:model-value="models.operation_type = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.product_type ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{
                ['view'].includes(action)
                  ? 'Sucursal bancaria'
                  : 'Tipo de cuenta*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.account_type"
              :manual_option="account_types"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El tipo de cuenta es requerido'),
              ]"
              @update:model-value="models.account_type = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.bank_account_id ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="['create', 'edit'].includes(action)"
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Tipo de producto*
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.product_type"
              :manual_option="product_types"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El tipo de producto es requerido'
                  ),
              ]"
              @update:model-value="models.product_type = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.product_type ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="['create', 'edit'].includes(action)"
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Sucursal bancaria*
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.bank_branch_id"
              :manual_option="bank_branches_third_party"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La sucursal bancaria es requerida'
                  ),
              ]"
              @update:model-value="models.bank_branch_id = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.bank_branch_id ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Fecha de apertura{{ ['view'].includes(action) ? '' : '*' }}
            </p>

            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.opening_date"
              :required="true"
              :disabled="openingDateDisabled"
              :mask="'YYYY-MM-DD'"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La fecha de apertura es requerida'
                  ),
                (val: string) =>
                  useRules().date_before_or_equal_to_the_current_date(val),
              ]"
              :option_calendar="($event) => useUtils().isDateUpToToday($event)"
              @update:modelValue="models.opening_date = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{
                models.opening_date
                  ? useUtils().formatDate(models.opening_date, 'DD/MM/YYYY')
                  : 'No registrado'
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Fecha de cierre de conciliación bancaria
            </p>

            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.treasury_concillation_closing_date"
              :mask="'YYYY-MM-DD'"
              :required="false"
              :disabled="['edit'].includes(action) && models.treasury_concillation_closing_date !== null"
              :rules="[(val: string) =>
                  useRules().date_before_or_equal_to_the_current_date(val)]"
              :option_calendar="($event) => useUtils().isDateUpToToday($event)"
              @update:modelValue="
                models.treasury_concillation_closing_date = $event
              "
            />
            <p v-else class="mb-0 text-grey-9">
              {{
                models.treasury_concillation_closing_date
                  ? useUtils().formatDate(
                      models.treasury_concillation_closing_date,
                      'DD/MM/YYYY'
                    )
                  : 'No registrado'
              }}
            </p>
          </div>

          <div
            v-if="['view'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-3"
          >
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">
              Fecha de cierre tesorería
            </p>

            <p class="mb-0 text-grey-9">
              {{
                models.treasury_closing_date
                  ? useUtils().formatDate(
                      models.treasury_closing_date,
                      'DD/MM/YYYY'
                    )
                  : 'No registrado'
              }}
            </p>
          </div>

          <div
            v-if="['view'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-3"
          >
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">
              Dias de inactividad
            </p>

            <p class="text-grey-9 mb-0">
              {{ models.inactive_days ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Aplica control de saldo
            </p>

            <RadioYesNo
              v-if="['create', 'edit'].includes(action)"
              v-model="models.control_balance"
              :isRadioButton="false"
              :hasTitle="false"
              label="Aplica control de saldo"
              :hasSubtitle="false"
              :isDisabled="isControlBalanceDisabled"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.control_balance ? 'Si' : 'No' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">
              Información contable
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Cuenta contable{{ ['view'].includes(action) ? '' : '*' }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="
                ['edit'].includes(action) || (models.business_id === 0 || models.business_id === null)
              "
              :default_value="models.accounting_account_id"
              :manual_option="bank_account_accounting_accounts"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La cuenta contable es requerida'
                  ),
              ]"
              @update:model-value="models.accounting_account_id = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ `${models.accounting_account_code ?? ''} - ${models.accounting_account_name ?? ''}` }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Centro de costo{{
                ['view'].includes(action) || isCostCenterDisable ? '' : '*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="isCostCenterDisable"
              :default_value="models.cost_center_id"
              :manual_option="bank_account_cost_centers"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El centro de costo es requerido'
                  ),
              ]"
              @update:model-value="models.cost_center_id = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{
                `${models.cost_center_code ?? ''} - ${
                  models.cost_center_description ?? ''
                }`
              }}
              -
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">
              Información de gravámenes
            </p>
          </div>

          <div v-if="['create', 'edit'].includes(action)" class="col-12">
            <RadioYesNo
              v-model="models.taxed_withholding"
              :isRadioButton="false"
              :hasTitle="false"
              label="¿Gravada con retefuente?"
              :hasSubtitle="false"
              :isDisabled="false"
            />

            <RadioYesNo
              v-model="radioTaxedGmf"
              :isRadioButton="false"
              :hasTitle="false"
              label="¿Gravada con GMF?"
              :hasSubtitle="false"
              :isDisabled="false"
              @update:model-value="clearGmf($event)"
            />
          </div>

          <div
            v-if="['view'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-3"
          >
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">
              Cuenta bancaria gravada por retefuente
            </p>

            <p class="mb-0 text-grey-9">
              {{ models.taxed_withholding ? 'Si' : 'No' }}
            </p>
          </div>

          <div
            v-if="['view'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-3"
          >
            <p class="text-weight-medium text-black-6 mb-0 ellipsis">
              Cuenta bancaria gravada por GMF
            </p>

            <p class="mb-0 text-grey-9">
              {{ models.taxed_gmf ? 'Si' : 'No' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Tarifa GMF
            </p>

            <InputMoneyComponent
              v-if="['create', 'edit'].includes(action)"
              :model-value="models.gmf_rate"
              :disabled="!models.taxed_gmf"
              :max_integer_digits="1"
              :max_decimal_digits="5"
              required
              :hide_symbol="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'El rango superior es requerido'),
              ]"
              @update:model-value="({ rawValue }) => (models.gmf_rate = rawValue)"
            />

            <p v-else class="mb-0 text-grey-9">
              {{ models.gmf_rate ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Cuenta contable negocio
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="models.business_id === 0 || !models.taxed_gmf"
              :default_value="models.accounting_account_gmf"
              :manual_option="bank_account_accounting_accounts"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La cuenta contable negocio es requerida'
                  ),
              ]"
              @update:model-value="models.accounting_account_gmf = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{
                models.gmf_business_accounting_account_name ?? 'No registrado'
              }}
              - {{ models.gmf_business_accounting_account_code ?? '' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Centro de costo GMF
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="
                models.business_id === 0 ||
                !models.taxed_gmf ||
                isGmfCostCenterDisable
              "
              :default_value="models.cost_center_gmf_id"
              :manual_option="bank_account_cost_centers"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El centro de costo GMF es requerido'
                  ),
              ]"
              @update:model-value="models.cost_center_gmf_id = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.cost_center_gmf_code ?? 'No registrado' }}
              - {{ models.cost_center_gmf_description ?? '' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Cuenta contable fondo
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="isGmfFundAccountingDisabled"
              :default_value="models.gmf_fund_accounting_account_id"
              :manual_option="bank_account_accounting_accounts"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La cuenta contable fondo es requerida'
                  ),
              ]"
              @update:model-value="
                models.gmf_fund_accounting_account_id = $event
              "
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.gmf_fund_accounting_account_code ?? 'No registrado' }} -
              {{ models.gmf_fund_accounting_account_name ?? '' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Decimales GMF
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="!models.taxed_gmf"
              :default_value="models.gmf_decimals"
              :manual_option="gmf_decimals"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'Decimales GMF es requerido'
                  ),
              ]"
              @update:model-value="models.gmf_decimals = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.gmf_decimals ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-3' : 'col-md-6'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Movimiento GMF
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="!models.taxed_gmf"
              :default_value="models.gmf_movements"
              :manual_option="treasury_movement_codes"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'Movimiento GMF es requerido'
                  ),
              ]"
              @update:model-value="models.gmf_movements = $event"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.gmf_movements_code ?? 'No registrado' }} -
              {{ models.gmf_movements_description ?? '' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">
              Información de moneda
            </p>
          </div>

          <div
            class="col-12"
            :class="['view'].includes(action) ? 'col-md-6' : 'col-md-12'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Tipo de moneda
            </p>

            <RadioYesNo
              v-if="['create', 'edit'].includes(action)"
              v-model="radioCoin"
              titleRadioTrue="Local"
              titleRadioFalse="Extranjera"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              :is-disabled="['edit'].includes(action)"
              @update:model-value="
                models.coin_type = $event ? 'Local' : 'Extranjera'
              "
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.coin_type }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Moneda
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.coin"
              :manual_option="filteredCurrency"
              :auto_complete="true"
              :required="true"
              :disabled="['edit'].includes(action)"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'La moneda es requerido'),
              ]"
              @update:model-value="models.coin = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.coin ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">
              Información de cheque
            </p>
          </div>

          <div
            class="col-12"
            :class="['view'].includes(action) ? 'col-md-6' : 'col-md-12'"
          >
            <p
              v-if="['view'].includes(action)"
              class="text-weight-medium text-black-6 mb-0"
            >
              Manejo de chequera
            </p>

            <RadioYesNo
              v-if="['create', 'edit'].includes(action)"
              v-model="radioHandlesCheckbook"
              :isRadioButton="false"
              :hasTitle="false"
              label="Manejo de chequera"
              :hasSubtitle="false"
              :isDisabled="false"
              @update:model-value="clearFormat($event)"
            />
            <p v-else class="mb-0 text-grey-9">
              {{ models.handles_checkbook ? 'Si' : 'No' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Formato de chequera
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="!models.handles_checkbook"
              :default_value="models.format"
              :manual_option="format_check"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El formato de chequera es requerido'
                  ),
              ]"
              @update:model-value="updateUpperCase('format', $event)"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.format ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// Components
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Interfaces
import { IBankAccount } from '@/interfaces/customs'

// Composables
import { useRules, useUtils } from '@/composables'

// Logic form
import useInformationForm from '@/components/Forms/Treasury/BankingAccounts/Information/v2/InformationForm'

import { ActionType } from '@/interfaces/global/Action'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBankAccount
  }>(),
  {}
)

const {
  models,
  formInformation,
  bank_account_status,
  bank_account_business,
  treasury_banks,
  active_third_parties,
  operation_types,
  account_types,
  product_types,
  bank_branches_third_party,
  bank_account_accounting_accounts,
  // bank_account_accounting_account_gmf,
  isCostCenterDisable,
  bank_account_cost_centers,
  gmf_decimals,
  treasury_movement_codes,
  format_check,
  filteredCurrency,
  radioCoin,
  radioTaxedGmf,
  radioHandlesCheckbook,
  isGmfFundAccountingDisabled,
  isGmfCostCenterDisable,
  isControlBalanceDisabled,
  openingDateDisabled,
  clearGmf,
  clearFormat,
  clearStatus,
  updateUpperCase,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
