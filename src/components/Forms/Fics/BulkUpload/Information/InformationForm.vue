<template>
  <q-form
    ref="informationFormRef"
    aria-label="Formulario de datos básicos del fondo"
  >
    <!-- Campos -->
    <VCard class="q-pa-lg">
      <template #content-card>
        <section v-if="['create'].includes(action)">
          <div class="row col-12 items-center justify-between q-px-md">
            <p class="q-mb-none mt-1 text-weight-medium">Operación</p>
            <RadioYesNo
              v-model="models.operation"
              class="q-mt-none"
              @update:modelValue="models.operation = $event"
              :options="ficsBulkUploadOperationOptions"
            />
          </div>

          <!-- Campos para Aportes - Retiros -->
          <template v-if="showFields">
            <q-separator class="my-20" />

            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Código de plantilla"
                  :default_value="models.template_id"
                  required
                  :disabled="['edit'].includes(action)"
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Código de plantilla es requerida'),
                  ]"
                  @update:model-value="models.template_id = $event"
                  :manual_option="selectOptions.templates"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Código de plantilla</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Descripción de plantilla"
                  :default_value="models.template_description"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Descripción de plantilla es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="models.template_description = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Descripción de plantilla
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Código fondo de inversión"
                  :default_value="models.investment_fund_id"
                  required
                  :disabled="['edit'].includes(action)"
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Código fondo de inversión es requerido'),
                  ]"
                  @update:model-value="models.investment_fund_id = $event"
                  :manual_option="selectOptions.funds"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Código fondo de inversión
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Descripción de fondo"
                  :default_value="models.investment_fund_description"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Descripción de fondo es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="
                    models.investment_fund_description = $event
                  "
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Descripción de fondo</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Negocio del fondo"
                  :default_value="models.business_fund"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Negocio del fondo es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="models.business_fund = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Negocio del fondo</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericDateInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Fecha de operación"
                  :default_value="models.operation_date"
                  required
                  disabled
                  mask="YYYY-MM-DD"
                  placeholder="AAAA-MM-DD"
                  :rules="[
                    (val: string) =>
                      useRules().is_required(
                        val,
                        'Fecha de operación es requerida',
                      ),
                  ]"
                  @update:model-value="models.operation_date = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Fecha de operación</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.operation_date
                        ? models.operation_date
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Oficina"
                  :default_value="models.office_id"
                  required
                  :disabled="['edit'].includes(action)"
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Oficina es requerida'),
                  ]"
                  @update:model-value="models.office_id = $event"
                  :manual_option="selectOptions.offices"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Oficina</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Descripción de oficina"
                  :default_value="models.office_description"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Descripción de oficina es requerida'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="models.office_description = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Descripción de oficina
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Código banco"
                  :default_value="models.bank_id"
                  required
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Código banco es requerido'),
                  ]"
                  @update:model-value="models.bank_id = $event"
                  :manual_option="selectOptions.banks"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Código banco</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Descripción banco"
                  :default_value="models.bank_description"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Descripción banco es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="models.bank_description = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Descripción banco</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Cuenta pagadora/recaudadora"
                  :default_value="models.transaction_method_id"
                  required
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Cuenta pagadora/recaudadora es requerida'),
                  ]"
                  @update:model-value="models.transaction_method_id = $event"
                  :manual_option="transaction_method_options"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Cuenta pagadora/recaudadora
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Descripción cuenta"
                  :default_value="models.transaction_method_description"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Descripción cuenta es requerida'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="
                    models.transaction_method_description = $event
                  "
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Descripción cuenta</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Saldo cuenta"
                  :default_value="
                    formatCurrencyString(models.account_balance ?? '0')
                  "
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Saldo cuenta es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="models.account_balance = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Saldo cuenta</p>
                  <p class="text-weight-medium no-margin">
                    {{ formatCurrencyString(models.account_balance ?? '0') }}
                  </p>
                </div>
              </div>
            </div>
          </template>

          <!-- Campos para Cancelacion -->
          <template v-if="showFieldsCancelation">
            <q-separator class="my-20" />

            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Código fondo de inversión"
                  :default_value="models.investment_fund_id"
                  required
                  :disabled="['edit'].includes(action)"
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Código fondo de inversión es requerido'),
                  ]"
                  @update:model-value="models.investment_fund_id = $event"
                  :manual_option="selectOptions.funds"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Código fondo de inversión
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Descripción de fondo"
                  :default_value="models.investment_fund_description"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Descripción de fondo es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="
                    models.investment_fund_description = $event
                  "
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Descripción de fondo</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Negocio del fondo"
                  :default_value="models.business_fund"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Negocio del fondo es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="models.business_fund = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Negocio del fondo</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericDateInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Fecha de operación"
                  :default_value="models.operation_date"
                  required
                  disabled
                  mask="YYYY-MM-DD"
                  placeholder="AAAA-MM-DD"
                  :rules="[
                    (val: string) =>
                      useRules().is_required(
                        val,
                        'Fecha de operación es requerida',
                      ),
                  ]"
                  @update:model-value="models.operation_date = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Fecha de operación</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.operation_date
                        ? models.operation_date
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Oficina"
                  :default_value="models.office_id"
                  required
                  :disabled="['edit'].includes(action)"
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Oficina es requerido'),
                  ]"
                  @update:model-value="models.office_id = $event"
                  :manual_option="selectOptions.offices"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Oficina</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <GenericInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Descripción de oficina"
                  :default_value="models.office_description"
                  required
                  disabled
                  placeholder="-"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Descripción de oficina es requerido'),
                    (val: string) => useRules().max_length(val, 200),
                  ]"
                  @update:model-value="models.office_description = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Descripción de oficina
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <GenericDateInputComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Fecha de cancelación"
                  :default_value="models.cancelation_date"
                  required
                  disabled
                  mask="YYYY-MM-DD"
                  placeholder="AAAA-MM-DD"
                  :rules="[
                    (val: string) =>
                      useRules().is_required(
                        val,
                        'Fecha de cancelación es requerida',
                      ),
                  ]"
                  @update:model-value="models.cancelation_date = $event"
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Fecha de cancelación</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.cancelation_date
                        ? models.cancelation_date
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  v-if="['create', 'edit'].includes(action)"
                  label="Código de plantilla"
                  :default_value="models.template_id"
                  required
                  :disabled="['edit'].includes(action)"
                  placeholder="Seleccione"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Código de plantilla es requerido'),
                  ]"
                  @update:model-value="models.template_id = $event"
                  :manual_option="selectOptions.templates"
                  map_options
                />
                <div v-else class="text-black-90">
                  <p class="text-weight-bold no-margin">Código de plantilla</p>
                  <p class="text-weight-medium no-margin">
                    {{ 'No registrado' }}
                  </p>
                </div>
              </div>
            </div>
            <div class="row col-12 items-center justify-between q-px-md">
              <p class="q-mb-none mt-1 text-weight-medium">Manual/Plantilla*</p>
              <div>
                <RadioYesNo
                  v-model="models.manual"
                  class="q-mt-none"
                  @update:modelValue="models.manual = $event"
                  required
                  :options="[
                    {
                      label: 'Manual',
                      value: 'Manual',
                    },
                    {
                      label: 'Plantilla',
                      value: 'Plantilla',
                    },
                  ]"
                />
              </div>
            </div>
            <template v-if="models.manual === 'Manual'">
              <q-separator class="my-20" />
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                <div class="col-12 col-md-5">
                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes(action)"
                    label="Código de negocio"
                    :default_value="models.business_code"
                    required
                    :disabled="['edit'].includes(action)"
                    placeholder="Seleccione"
                    :rules="[
                    (val: string) => useRules().is_required(val, 'Código de negocio es requerido'),
                  ]"
                    @update:model-value="models.business_code = $event"
                    :manual_option="selectOptions.funds"
                    map_options
                    auto_complete
                  />
                  <div v-else class="text-black-90">
                    <p class="text-weight-bold no-margin">Código de negocio</p>
                    <p class="text-weight-medium no-margin">
                      {{
                        models.business_code
                          ? models.business_code
                          : 'No registrado'
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <q-separator class="my-20" />
          <div class="row items-center justify-end">
            <Button
              class="custom"
              label="Continuar"
              color="orange"
              size="md"
              :outline="false"
              @click="handleContinue()"
              :disabled="conditionalContinue()"
            />
          </div>
        </section>
        <section v-else>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Numero de cargue masivo
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.number_masive ? models.number_masive : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">Operación</p>
              <p class="text-black-90 mb-3">
                {{ models.operation ? models.operation : 'No registrado' }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Código de plantilla
              </p>
              <p class="text-black-90 mb-3">
                {{ models.template_id ? models.template_id : 'No registrado' }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Descripción de plantilla
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.template_description
                    ? models.template_description
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Código fondo de inversión
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.investment_fund_id
                    ? models.investment_fund_id
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Descripción de fondo
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.investment_fund_description
                    ? models.investment_fund_description
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Negocio del fondo
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.business_fund ? models.business_fund : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Fecha de operación
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.operation_date
                    ? models.operation_date
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">Oficina</p>
              <p class="text-black-90 mb-3">
                {{ models.office_id ? models.office_id : 'No registrado' }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Descripción de oficina
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.office_description
                    ? models.office_description
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">Código banco</p>
              <p class="text-black-90 mb-3">
                {{ models.bank_id ? models.bank_id : 'No registrado' }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Descripción banco
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.bank_description
                    ? models.bank_description
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Cuenta pagadora / recaudadora
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.transaction_method_id
                    ? models.transaction_method_id
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">
                Descripción cuenta
              </p>
              <p class="text-black-90 mb-3">
                {{
                  models.transaction_method_description
                    ? models.transaction_method_description
                    : 'No registrado'
                }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
              <p class="text-weight-bold text-black-90 mb-0">Saldo cuenta</p>
              <p class="text-black-90 mb-3">
                {{ formatCurrencyString(models.account_balance ?? '0') }}
              </p>
            </div>
          </div>
        </section>
      </template>
    </VCard>

    <VCard class="q-pa-lg" v-if="btnContinueClicked">
      <template #content-card>
        <div ref="scrollBox">
          <!-- Subida de excel para Aportes - Retiros - cancelaciones opcion plantilla -->
          <template
            v-if="
              showUploadExcel &&
              models.operation &&
              ['Aportes', 'Retiros', 'Cancelaciones']?.includes(
                models.operation
              )
            "
          >
            <template v-if="models.manual !== 'Manual'">
              <div class="row center">
                <p
                  v-if="['Aportes', 'Retiros']?.includes(models.operation)"
                  class="text-weight-bold text-black-90 size-18"
                >
                  Importar plantilla
                </p>
                <p v-else class="text-weight-bold text-black-90 size-18">
                  Detalle del cargue de la operación
                </p>
                <Button
                  :outline="true"
                  label="Descargar plantilla"
                  :leftImg="excelIcon"
                  tooltip="Descargar plantilla"
                  @click="exportExcelTableLoad"
                  :disabled="tableLoadPros.rows.length === 0"
                />
              </div>
              <p
                v-if="['Cancelaciones']?.includes(models.operation)"
                class="text-weight-normal text-black-60 size-18"
              >
                El valor de la operación puede variar según los procesos de
                cierres y los cobros adherentes a la operación
              </p>
              <div class="col-12" v-if="tableLoadPros.rows.length === 0">
                <UploadFile
                  ref="attachDocumentRef"
                  title="Cargar archivo"
                  labelUploadBtn="Seleccione los archivos para subir"
                  stylesCustoms="width: 100%"
                  :bordered="false"
                  accept=".xlsx"
                  @added="onFileAdded"
                />
              </div>

              <div
                class="col-12 border-rounded"
                v-if="tableLoadPros.rows.length > 0"
              >
                <TableList
                  hidePagination
                  :loading="tableLoadPros.loading"
                  :columns="tableLoadPros.columns"
                  :rows="tableLoadPros.rows"
                  :custom-columns="['file_name', 'status', 'actions']"
                >
                  <template #actions="{ row }">
                    <Button
                      :left-icon="defaultIconsLucide.delete"
                      color="orange"
                      :class-custom="'custom'"
                      :outline="false"
                      :flat="true"
                      colorIcon="#f45100"
                      tooltip="Ver"
                      @click="tableLoadDelete(row.id)"
                    />
                  </template>
                  <template #file_name="{ row }">
                    <div class="row items-center justify-start">
                      <img
                        class="image-excel q-mr-sm"
                        src="@/assets/images/excel.svg"
                        alt="Excel Icon"
                      />
                      {{ row.file_name || '' }}
                    </div>
                  </template>

                  <template #status="{ row }">
                    <div
                      class="flex items-center"
                      :class="row?.status?.id !== 20 ? 'justify-center' : ''"
                    >
                      <div class="q-mr-md">
                        <ShowStatus
                          :type="Number(row?.status?.id ?? 20)"
                          statusType="ficsBulkUpload"
                        />
                      </div>

                      <q-linear-progress
                        v-if="row?.status?.id === 20"
                        indeterminate
                        color="primary_fiduciaria"
                        size="7px"
                        class="progress-bar-rounded"
                      />
                    </div>
                  </template>
                </TableList>
              </div>
              <template
                v-if="
                  tableResulUploadPros.rows.length > 0 &&
                  tableLoadPros.rows.length > 0
                "
              >
                <div class="row center my-30">
                  <p class="text-weight-bold text-black-90 size-18">
                    Detalle del cargue de la operación
                  </p>
                  <Button
                    :outline="true"
                    label="Descargar detalle"
                    :leftImg="excelIcon"
                    tooltip="Descargar detalle"
                    @click="exportExcelTableResulUpload"
                  />
                </div>
                <TableList
                  :loading="tableResulUploadPros.loading"
                  :columns="tableResulUploadPros.columns"
                  :rows="tableResulUploadPros.rows"
                  :pages="tableResulUploadPros.pages"
                  :custom-columns="['status']"
                  @update-page="updatePage"
                  @update-rows-per-page="updateRows"
                  :dense="true"
                >
                  <template #status="{ row }">
                    <ShowStatus
                      :type="row.status.id ?? ''"
                      statusType="ficsBulkUpload"
                    />
                  </template>
                  <template #custom-header-action>
                    <Button
                      color="orange"
                      :class-custom="'custom'"
                      :outline="false"
                      label="Platillas"
                      @click="
                        $router.push({
                          name: 'BulkUploadTemplatesView',
                        })
                      "
                    />
                  </template>
                </TableList>
              </template>
            </template>
          </template>

          <!-- Subida de excel para Cancelaciones con opcion manual -->
          <template
            v-if="
              showUploadExcel &&
              models.operation &&
              ['Cancelaciones']?.includes(models.operation) &&
              models.manual === 'Manual'
            "
          >
            <div class="row center">
              <p class="text-weight-bold text-black-90 size-18">
                Detalle del cargue de la operación
              </p>
              <Button
                :outline="true"
                label="Descargar detalle"
                :leftImg="excelIcon"
                tooltip="Descargar detalle"
                @click=""
              />
            </div>
            <p class="text-weight-normal text-black-60 size-18">
              El valor de la operación puede variar según los procesos de
              cierres y los cobros adherentes a la operación
            </p>
            <TableList
              :loading="tableChangeManualPros.loading"
              :columns="tableChangeManualPros.columns"
              :rows="tableChangeManualPros.rows"
              :pages="tableChangeManualPros.pages"
              :custom-columns="['transaction_method']"
              :selection="'multiple'"
              @selected="handleIdSelection"
              @update-page="updatePage"
              @update-rows-per-page="updateRows"
            >
              <template #transaction_method="{ row }">
                <GenericSelectorComponent
                  :default_value="row.selected_transaction_method"
                  :disabled="!models.manual_ids?.includes(row.id)"
                  :required="row.transaction_method.length === 0"
                  placeholder="Seleccione"
                  :rules="[
                    (val) =>
                      useRules().is_required(
                        val,
                        'Código de negocio es requerido'
                      ),
                  ]"
                  @update:model-value="row.selected_transaction_method = $event"
                  :manual_option="
                    manualOptionTableManual(row.transaction_method)
                  "
                  map_options
                  auto_complete
                />
              </template>
            </TableList>
          </template>
          <div class="row items-center justify-end q-pt-md">
            <Button
              class="custom"
              label="Crear"
              color="orange"
              size="md"
              :outline="false"
              @click="handleCreate()"
              :disabled="!btnContinueClicked || tableLoadPros.rows.length === 0"
            />
          </div>
        </div>
      </template>
    </VCard>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useInformationForm from '@/components/Forms/Fics/BulkUpload/Information/InformationForm'

// utils
import excelIcon from '@/assets/images/excel.svg'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'
import { IBulkUploadList } from '@/interfaces/customs/fics/BulkUpload'
import { defaultIconsLucide } from '@/utils'
import { ficsBulkUploadOperationOptions } from '@/constants'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBulkUploadList
  }>(),
  {}
)

const {
  transaction_method_options,
  tableChangeManualPros,
  showFieldsCancelation,
  formatCurrencyString,
  tableResulUploadPros,
  informationFormRef,
  btnContinueClicked,
  attachDocumentRef,
  showUploadExcel,
  tableLoadPros,
  selectOptions,
  scrollBox,
  showFields,
  models,
  exportExcelTableResulUpload,
  manualOptionTableManual,
  exportExcelTableLoad,
  conditionalContinue,
  handleIdSelection,
  tableLoadDelete,
  handleContinue,
  handleCreate,
  onFileAdded,
  updatePage,
  updateRows,
} = useInformationForm(props)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
  models,
  showFields,
})
</script>
<style lang="scss" src="./InformationForm.scss"></style>
