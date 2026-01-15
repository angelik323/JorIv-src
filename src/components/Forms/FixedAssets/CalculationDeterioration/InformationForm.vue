<template>
  <q-form ref="calculationRef">
    <p class="font-size-1 text-weight-bold" v-if="['view'].includes(action)">
      Consulta de cálculo y comprobante contable
    </p>
    <!-- Sección: Datos básicos -->
    <div class="q-pa-md rounded-borders q-mb-lg">
      <p class="font-size-1 text-weight-bold q-mb-md">Datos básicos</p>

      <!-- Vista: View Mode -->
      <div v-if="['view'].includes(action)">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <label class="text-weight-bold">Realizado por</label>
            <p class="text-weight-medium q-mb-none q-mt-xs">
              {{ models.created_by_name || 'Sin datos' }}
            </p>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <label class="text-weight-bold">Fecha de creación</label>
            <p class="text-weight-medium q-mb-none q-mt-xs">
              {{ models.created_at }}
            </p>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <label class="text-weight-bold">Actualizado por</label>
            <p class="text-weight-medium q-mb-none q-mt-xs">
              {{ models.updated_by_name || 'Sin datos' }}
            </p>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <label class="text-weight-bold">Fecha de actualización</label>
            <p class="text-weight-medium q-mb-none q-mt-xs">
              {{ models.updated_at || 'Sin datos' }}
            </p>
          </div>

          <div class="col-12">
            <label class="text-weight-bold">Motivo / Justificación</label>
            <p class="text-weight-medium q-mb-none q-mt-xs">
              {{ models.reason_justification || 'Sin datos' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Vista: Create Mode -->
      <div v-if="['create'].includes(action)">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <GenericDateInputComponent
              label="Fecha de creación"
              :required="false"
              mask="YYYY-MM-DD HH:mm"
              :default_value="defaultDateValue"
              :rules="[
                (v: string) => useRules().is_required(v, 'La fecha es requerida')
              ]"
            />
          </div>

          <div class="col-12">
            <GenericInputComponent
              label="Motivo / Justificación"
              type="textarea"
              :default_value="models.reason_justification"
              @update:model-value="models.reason_justification = $event"
              :rules="[
            (v: string) => useRules().is_required(v, 'Motivo / Justificación es requerido')
          ]"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Seccion de creación -->
    <section v-if="['create'].includes(action)">
      <p class="font-size-1 text-weight-bold">Información del activo o bien</p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            label="Negocio"
            :placeholder="`Seleccione una opción`"
            :required="true"
            :map_options="true"
            :manual_option="business_trusts_uge_impairment"
            auto_complete
            :default_value="models.business_trust_id"
            @update:model-value="models.business_trust_id = $event"
            :rules="[
          (v: string) => useRules().is_required(v, 'El campo es requerido'),
        ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            label="Tipo de activo fijo o bien"
            :placeholder="`Seleccione una opción`"
            :required="true"
            :map_options="true"
            :manual_option="business_trusts_type"
            auto_complete
            :default_value="models.configuration_types_id"
            @update:model-value="models.configuration_types_id = $event"
            :rules="[
          (v: string) => useRules().is_required(v, 'El campo es requerido'),
        ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            label="Subtipo de activo fijo o bien"
            :placeholder="`Seleccione una opción`"
            :required="true"
            :map_options="true"
            :manual_option="business_trusts_subtypes"
            auto_complete
            :default_value="models.configuration_subtypes_id"
            @update:model-value="models.configuration_subtypes_id = $event"
            :rules="[
          (v: string) => useRules().is_required(v, 'El campo es requerido'),
        ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericSelectorComponent
            label="Codigo de activo fijo o bien"
            :placeholder="`Seleccione una opción`"
            :required="true"
            :map_options="true"
            :manual_option="fixed_asset_values"
            auto_complete
            :default_value="models.asset_id"
            @update:model-value="models.asset_id = $event"
            :rules="[
          (v: string) => useRules().is_required(v, 'El campo es requerido'),
        ]"
          />
        </div>
      </div>
      <div class="row justify-end q-gutter-md">
        <Button
          label="Ver hoja de vida"
          size="md"
          unelevated
          :outline="false"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="handleViewResume(models.asset_id)"
        />
      </div>

      <p class="font-size-1 text-weight-bold">Valor base</p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <GenericInputComponent
            label="Valor contabilidad"
            :default_value="models.book_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.book_value = $event"
            :required="true"
            disabled
          />
        </div>
        <div class="col-12 col-sm-6">
          <GenericInputComponent
            label="Valor razonable"
            :default_value="models.fair_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.fair_value = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 16),
              (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
      </div>

      <p class="font-size-1 text-weight-bold">
        Valor residual y costos asociados
      </p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <GenericInputComponent
            label="Costo adquisición del bien"
            :default_value="models.acquisition_cost"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.acquisition_cost = $event"
            :required="true"
            disabled
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <GenericInputComponent
            label="Valor estimado en venta"
            :default_value="models.estimated_sale_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.estimated_sale_value = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 15),
                   (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <GenericInputComponent
            label="Costo estimado en venta"
            :default_value="models.estimated_sale_cost"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.estimated_sale_cost = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 15),
              (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
        <div class="col-12">
          <GenericInputComponent
            label="Total valor residual"
            :default_value="models.total_residual_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.total_residual_value = $event"
            :required="true"
            disabled
          />
        </div>
      </div>

      <p class="font-size-1 text-weight-bold">Valor uso</p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            label="valor total de los flujos UGE por año"
            :default_value="models.total_cash_flows"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.total_cash_flows = $event"
            :required="true"
            disabled
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            label="Numero periodos"
            :default_value="models.number_of_periods"
            :placeholder="''"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.number_of_periods = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 4),
              (val: string) => useRules().only_number(val),
            ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            label="Tasa descuento porcentaje estimado"
            :default_value="models.discount_rate"
            :placeholder="'0.00%'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.discount_rate = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 5),
              (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            label="Valor Residual"
            :default_value="models.total_residual_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.total_residual_value = $event"
            :required="true"
            :rules="[]"
            disabled
          />
        </div>
        <div class="col-12">
          <GenericInputComponent
            label="Valor uso calculado"
            :default_value="models.value_in_use"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.value_in_use = $event"
            :required="true"
            :rules="[]"
            disabled
          />
        </div>
      </div>
      <p class="font-size-1 text-weight-bold">Valor base</p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Valor contabilidad"
            :default_value="models.value_in_use"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.value_in_use = $event"
            :required="true"
            disabled
          />
        </div>
        <div class="col-12 col-sm-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Valor razonable"
            :default_value="models.fair_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.fair_value = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 16),
              (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
      </div>

      <p class="font-size-1 text-weight-bold">
        Valor residual y costos asociados
      </p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Costo adquisición del bien"
            :default_value="models.acquisition_cost"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.acquisition_cost = $event"
            :required="true"
            disabled
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Valor estimado en venta"
            :default_value="models.estimated_sale_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.estimated_sale_value = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 15),
                   (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Costo estimado en venta"
            :default_value="models.estimated_sale_cost"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.estimated_sale_cost = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 15),
              (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
        <div class="col-12">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Total valor residual"
            :default_value="models.total_residual_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.total_residual_value = $event"
            :required="true"
            disabled
          />
        </div>
      </div>

      <p class="font-size-1 text-weight-bold">Valor uso</p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="valor total de los flujos UGE por año"
            :default_value="models.total_cash_flows"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.total_cash_flows = $event"
            :required="true"
            disabled
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Numero periodos"
            :default_value="models.number_of_periods"
            :placeholder="''"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.number_of_periods = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 4),
              (val: string) => useRules().only_number(val),
            ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tasa descuento porcentaje estimado"
            :default_value="models.discount_rate"
            :placeholder="'0.00%'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.discount_rate = $event"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo es requerido'),
              (val: string) =>useRules().min_length(val, 1),
              (val: string) =>useRules(). max_length(val, 5),
              (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Valor Residual"
            :default_value="models.total_residual_value"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.total_residual_value = $event"
            :required="true"
            :rules="[]"
            disabled
          />
        </div>
        <div class="col-12">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Valor uso calculado"
            :default_value="models.value_in_use"
            :placeholder="'$0.00'"
            type="text"
            :class_name="'full-width'"
            @update:modelValue="models.value_in_use = $event"
            :required="true"
            :rules="[]"
            disabled
          />
        </div>
      </div>

      <div class="row items-center justify-between q-mb-lg mt-md">
        <p class="font-size-1 text-weight-bold">Resultado del calculo</p>
        <Button
          label="Calcular"
          size="md"
          unelevated
          :outline="false"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="calculateImpairment()"
        />
      </div>
      <div class="row" v-if="['create'].includes(action)">
        <div class="col-12 col-md-6 q-px-sm">
          <InfoCard
            :title="'Valor recuperable '"
            :value="models.impairment_loss"
            :placeholder="'$0.00'"
            :description="'Max(valor,valor razonable-costos)'"
          ></InfoCard>
        </div>
        <div class="col-12 col-md-6 q-px-sm">
          <InfoCard
            :title="'Valor del deterioro'"
            :value="models.impairment_percentage"
            :placeholder="'$0.00'"
            :description="'0.00% del valor contable'"
          ></InfoCard>
        </div>
      </div>
    </section>

    <!-- Seccion ver -->
    <section v-if="['view'].includes(action)" class="q-gutter-y-lg">
      <!-- Sección: Datos del activo -->
      <div class="q-pa-md rounded-borders">
        <p class="font-size-1 text-weight-bold q-mb-md">Datos del activo</p>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5"
                >Código/Numero de activo</label
              >
              <span class="text-weight-medium col-7">{{
                models.asset?.id || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Descripción</label>
              <span class="text-weight-medium col-7">{{
                models.asset?.description || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Ubicacion</label>
              <span class="text-weight-medium col-7">{{
                models.asset?.location || 'Sin datos'
              }}</span>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Responsable</label>
              <span class="text-weight-medium col-7">{{
                models.asset?.responsible_id || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Estado</label>
              <span class="text-primary text-weight-bold col-7">{{
                models.asset?.status_name?.status || 'Sin datos'
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Datos Contables y de cálculo -->
      <div class="q-pa-md rounded-borders">
        <p class="font-size-1 text-weight-bold q-mb-md">
          Datos Contables y de cálculo
        </p>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor contabilidad</label>
              <span class="text-weight-medium col-6">{{
                models.book_value || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor recuperable</label>
              <span class="text-weight-medium col-6">{{
                models.recoverable_amount || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor deterioro</label>
              <span class="text-weight-medium col-6">{{
                models.impairment_loss || 'Sin datos'
              }}</span>
            </div>
            <div class="row">
              <label class="text-weight-bold col-6"
                >Porcentaje de deterioro</label
              >
              <span class="text-weight-medium col-6">{{
                models.impairment_percentage || 'Sin datos'
              }}</span>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Tasa de descuento</label>
              <span class="text-weight-medium col-6">{{
                models.discount_rate || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor de uso</label>
              <span class="text-weight-medium col-6">{{
                models.value_in_use || 'Sin datos'
              }}</span>
            </div>
            <div class="row">
              <label class="text-weight-bold col-6">Valor residual</label>
              <span class="text-weight-medium col-6">{{
                models.residual_value || 'Sin datos'
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Comprobante contable asociado -->
      <div class="q-pa-md rounded-borders">
        <p class="font-size-1 text-weight-bold q-mb-md">
          Comprobante contable asociado
        </p>

        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6"
                >Número de comprobante</label
              >
              <span class="text-weight-medium col-6 text-right">{{
                models.voucher_id || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6"
                >Fecha de registro contable</label
              >
              <span class="text-weight-medium col-6 text-right">{{
                models.voucher?.registration_date || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6"
                >Estado del comprobante</label
              >
              <span class="text-weight-medium col-6 text-right text-positive">{{
                models.voucher?.status?.status || 'Sin datos'
              }}</span>
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <Button
            label="Ver Comprobante"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="handleViewComprobante(models.voucher_id)"
          />
        </div>
      </div>
    </section>

    <!-- Seccion ver -->
    <section v-if="['view'].includes(action)" class="q-gutter-y-lg">
      <!-- Sección: Datos del activo -->
      <div class="q-pa-md rounded-borders">
        <p class="font-size-1 text-weight-bold q-mb-md">Datos del activo</p>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="row items-center q-mb-sm">
              <label class="text-weight-bold q-mr-sm"
                >Código / número de activo:</label
              >
              <span class="text-weight-medium col-7">{{
                models.asset?.id || 'Identificación del activo o bien'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Descripción</label>
              <span class="text-weight-medium col-7">{{
                models.asset?.description || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Ubicacion</label>
              <span class="text-weight-medium col-7">{{
                models.asset?.location || 'Sin datos'
              }}</span>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Responsable</label>
              <span class="text-weight-medium col-7">{{
                models.asset?.responsible_id || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-5">Estado</label>
              <span class="text-primary text-weight-bold col-7">{{
                models.asset?.status_name?.status || 'Sin datos'
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Datos Contables y de cálculo -->
      <div class="q-pa-md rounded-borders">
        <p class="font-size-1 text-weight-bold q-mb-md">
          Datos Contables y de cálculo
        </p>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor contabilidad</label>
              <span class="text-weight-medium col-6">{{
                models.book_value || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor recuperable</label>
              <span class="text-weight-medium col-6">{{
                models.recoverable_amount || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor deterioro</label>
              <span class="text-weight-medium col-6">{{
                models.impairment_loss || 'Sin datos'
              }}</span>
            </div>
            <div class="row">
              <label class="text-weight-bold col-6"
                >Porcentaje de deterioro</label
              >
              <span class="text-weight-medium col-6">{{
                models.impairment_percentage || 'Sin datos'
              }}</span>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Tasa de descuento</label>
              <span class="text-weight-medium col-6">{{
                models.discount_rate || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6">Valor de uso</label>
              <span class="text-weight-medium col-6">{{
                models.value_in_use || 'Sin datos'
              }}</span>
            </div>
            <div class="row">
              <label class="text-weight-bold col-6">Valor residual</label>
              <span class="text-weight-medium col-6">{{
                models.residual_value || 'Sin datos'
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Comprobante contable asociado -->
      <div class="q-pa-md rounded-borders">
        <p class="font-size-1 text-weight-bold q-mb-md">
          Comprobante contable asociado
        </p>

        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6"
                >Número de comprobante</label
              >
              <span class="text-weight-medium col-6 text-right">{{
                models.voucher_id || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6"
                >Fecha de registro contable</label
              >
              <span class="text-weight-medium col-6 text-right">{{
                models.voucher?.registration_date || 'Sin datos'
              }}</span>
            </div>
            <div class="row q-mb-sm">
              <label class="text-weight-bold col-6"
                >Estado del comprobante</label
              >
              <span class="text-weight-medium col-6 text-right text-positive">{{
                models.voucher?.status?.status || 'Sin datos'
              }}</span>
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <Button
            label="Ver Comprobante"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="handleViewComprobante(models.voucher_id)"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import useInformationform from '@/components/Forms/FixedAssets/CalculationDeterioration/Informationform'
import InfoCard from './InfoCard/InfoCard.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ICalculationForm } from '@/interfaces/customs/fixed-assets/CalculationDeterioration'

// utils
import { useRules } from '@/composables'
// logic

const props = defineProps<{
  action: ActionType
  data?: ICalculationForm | null
}>()

const emits = defineEmits<(e: 'update:data', value: ICalculationForm) => void>()

const {
  models,
  calculationRef,
  defaultDateValue,
  business_trusts_type,
  business_trusts_subtypes,
  business_trusts_uge_impairment,
  fixed_asset_values,
  handleViewResume,
  calculateImpairment,
  handleViewComprobante,
} = useInformationform(props, emits)

defineExpose({
  validateForm: () => calculationRef.value?.validate(),
})
</script>
