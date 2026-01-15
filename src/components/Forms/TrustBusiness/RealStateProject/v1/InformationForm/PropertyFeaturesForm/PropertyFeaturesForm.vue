<template>
  <q-form ref="characteristicsForm">
    <div class="q-pa-md q-pt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">General</p>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.department_id"
            :label="'Departamento'"
            map_options
            :manual_option="departments"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El departamento es requerido'),
            ]"
            required
            :readonly="!isCreate"
            @update:modelValue="models.department_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Departamento</p>
            <p class="text-weight-medium no-margin">
              {{ models.department_name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.city_id"
            :label="'Ciudad'"
            map_options
            :manual_option="cities"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'La ciudad es requerida'),
            ]"
            :readonly="!models.department_id || !isCreate"
            required
            @update:modelValue="models.city_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Ciudad</p>
            <p class="text-weight-medium no-margin">{{ models.city_name }}</p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.address"
            :required="true"
            label="Dirección"
            :type="'text'"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'La dirección es requerida'),
            ]"
            :readonly="!isCreate"
            @update:modelValue="models.address = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">{{ models.address }}</p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.land_area"
            label="Área del Terreno (m2)"
            :required="true"
            :type="'text'"
            :rules="[
              (v: string) => useRules().is_required(v, 'El área es requerida'),
              (v: string | number | null) => useRules().only_numbers_and_dots(v),
              (v: string) => useRules().has_maximum_n_decimals(v, 20),
              (v: string) => useRules().max_length(v, 255),
            ]"
            @update:modelValue="models.land_area = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Área</p>
            <p class="text-weight-medium no-margin">
              {{ models.land_area }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.property_registration"
            :label="'Matrícula inmobiliaria'"
            map_options
            :manual_option="[]"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'La matrícula inmobiliaria es requerida'
                ),
            ]"
            :required="false"
            disabled
            @update:modelValue="models.property_registration = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Matrícula inmobiliaria</p>
            <p class="text-weight-medium no-margin">
              {{ models.property_registration }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.builder_id"
            :label="'Constructor o promotor'"
            map_options
            :manual_option="business_trust_third_parties"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  'El constructor o promotor es requerido'
                ),
            ]"
            :readonly="!isCreate"
            required
            @update:modelValue="models.builder_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Constructor o promotor</p>
            <p class="text-weight-medium no-margin">
              {{ models.builder_name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-5 col-md-5">
          <GenericSelectorComponent
            v-if="props.action !== 'view'"
            :default_value="models.technical_supervision_id"
            :label="'Nombre interventoría / Supervisión técnica'"
            map_options
            :manual_option="business_trust_third_parties"
            :rules="[
              (v: string) =>
                useRules().is_required(v, 'El nombre es requerido'),
              (v: string) =>
                useRules().validate_not_same(v, models.builder_id, 'El nombre no puede ser igual al constructor o promotor')
            ]"
            :readonly="!isCreate"
            required
            @update:modelValue="models.technical_supervision_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Nombre interventoría / Supervisión técnica
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.technical_supervision_name }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />

      <div class="q-mb-lg mt-2">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Características del inmueble
        </p>
      </div>

      <RadioYesNo
        v-model="models.development_type"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="Tipo de unidad*"
        :hasSubtitle="false"
        :required="true"
        :is-disabled="['view'].includes(action)"
        :options="development_type"
      />
      <q-separator class="q-mt-sm" />

      <div class="row q-col-gutter-md mt-2" v-if="models.development_type">
        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.number_of_groups"
            :label="`${houseDepartmentProps.number_of_groups}`"
            :required="true"
            :type="'text'"
            :rules="[
              (v: string) =>
                useRules().is_required(
                  v,
                  `El ${houseDepartmentProps.number_of_groups.toLowerCase()} es requerido`
                ),
              (v: string) => useRules().only_number(v),
            ]"
            @update:modelValue="models.number_of_groups = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              {{ houseDepartmentProps.number_of_groups }}
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.number_of_groups }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <div v-if="isTower">
            <GenericInputComponent
              v-if="props.action !== 'view'"
              :default_value="models.block_nomenclature"
              :label="`${houseDepartmentProps.block_nomenclature}`"
              :required="true"
              :type="'text'"
              :rules="
                isTower
                  ? [
                      (v: string) =>
                        useRules().is_required(v, `Este campo es requerido`),
                      (v: string) => useRules().only_number(v),
                    ]
                  : []
              "
              @update:modelValue="models.block_nomenclature = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                {{ houseDepartmentProps.block_nomenclature }}
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.block_nomenclature }}
              </p>
            </div>
          </div>

          <div v-else>
            <GenericSelectorComponent
              v-if="props.action !== 'view'"
              :default_value="models.block_nomenclature"
              :label="houseDepartmentProps.block_nomenclature"
              map_options
              :multiple="false"
              :manual_option="block_nomeclatures"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, `Este campo es requerido`),
              ]"
              :required="true"
              @update:modelValue="models.block_nomenclature = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                {{ houseDepartmentProps.block_nomenclature }}
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.block_nomenclature }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.number_of_unit_per_group"
            :label="`${houseDepartmentProps.number_of_unit_per_group}`"
            :required="true"
            :type="'text'"
            :rules="[
              (v: string) =>
                useRules().is_required(v, `Este campo es requerido`),
              (v: string) => useRules().only_number(v),
            ]"
            @update:modelValue="models.number_of_unit_per_group = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              {{ houseDepartmentProps.number_of_unit_per_group }}
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.number_of_unit_per_group }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.initial_group"
            :label="`${houseDepartmentProps.initial_group}`"
            :required="true"
            :type="'text'"
            :rules="
              isTower || isNumber
                ? [
                    (v: string) =>
                      useRules().is_required(
                        v,
                        `La ${houseDepartmentProps.initial_group.toLowerCase()} es requerida`
                      ),
                    (v: string) => useRules().only_positive_number(v),
                    (v: string) => useRules().only_number(v),
                  ]
                : [
                    (v: string) =>
                      useRules().is_required(
                        v,
                        `La ${houseDepartmentProps.initial_group.toLowerCase()} es requerida`
                      ),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().max_length(v, 1),
                  ]
            "
            @update:modelValue="models.initial_group = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              {{ houseDepartmentProps.initial_group }}
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.initial_group }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.final_group"
            :label="`${houseDepartmentProps.final_group}`"
            :required="true"
            :type="'text'"
            readonly
            :rules="
              isTower || isNumber
                ? [
                    (v: string) =>
                      useRules().is_required(
                        v,
                        `La ${houseDepartmentProps.final_group.toLowerCase()} es requerida`
                      ),
                    (v: string) => useRules().only_positive_number(v),
                    (v: string) =>
                      useRules().max_value(v, Number(models.number_of_groups)+ Number(models.initial_group) -1),
                    (v: string) => useRules().only_number(v),
                  ]
                : [
                    (v: string) =>
                      useRules().is_required(
                        v,
                        `La ${houseDepartmentProps.final_group.toLowerCase()} es requerida`
                      ),
                    (v: string) => useRules().max_length(v, 1),
                    (v: string) => useRules().max_letter(v, 'z', `La letra no puede ser mayor a Z, use una nomenclatura numérica`),
                  ]
            "
            @update:modelValue="models.final_group = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              {{ houseDepartmentProps.final_group }}
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.final_group }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.total_units_stage"
            :label="`${houseDepartmentProps.total_units_stage}`"
            :required="isTower"
            :type="'text'"
            :rules="
              isTower
                ? [
                    (v: string) =>
                      useRules().is_required(
                        v,
                        `El ${houseDepartmentProps.total_units_stage.toLowerCase()} es requerido`
                      ),
                    (v: string) => useRules().only_number(v),
                  ]
                : []
            "
            readonly
            @update:modelValue="models.total_units_stage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              {{ houseDepartmentProps.total_units_stage }}
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.total_units_stage }}
            </p>
          </div>
        </div>

        <div class="col-12 col-xs-3 col-md-3">
          <GenericInputComponent
            v-if="props.action !== 'view'"
            :default_value="models.property_area_m2"
            label="Área del inmueble (m2)"
            :type="'text'"
            :rules="[
              (v: string) => useRules().is_required(v, 'El área es requerida'),
              (v: string | number | null) => useRules().only_numbers_and_dots(v),
              (v: string) => useRules().has_maximum_n_decimals(v, 20),
              (v: string) => useRules().max_length(v, 255),
            ]"
            :required="true"
            @update:modelValue="models.property_area_m2 = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Área del inmueble (m2)</p>
            <p class="text-weight-medium no-margin">
              {{ models.property_area_m2 }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="models.development_type">
        <RadioYesNo
          v-model="models.property_value_calculation"
          class="q-pt-md q-pl-sm"
          hasTitle
          title="Base de cálculo del valor del inmueble*"
          :hasSubtitle="false"
          :required="true"
          :is-disabled="['view'].includes(action)"
          :options="base_calculation_property"
        />
        <q-separator class="q-mt-sm" />

        <div class="row q-col-gutter-md mt-2">
          <div class="col-12 col-xs-3 col-md-3" v-if="isSsmlv">
            <GenericInputComponent
              v-if="props.action !== 'view'"
              :default_value="models.amount_smmlv"
              label="Cantidad de SMMLV"
              :required="isSsmlv"
              :type="'text'"
              :rules="
                isSsmlv
                  ? [
                      (v: string) =>
                        useRules().is_required(
                          v,
                          `La cantidad de SMMLV es requerida`
                        ),
                      (v: string) => useRules().only_number_with_decimals(v),
                      (v: string) => useRules().max_length(v, 8),
                    ]
                  : []
              "
              @update:modelValue="models.amount_smmlv = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Cantidad de SMMLV</p>
              <p class="text-weight-medium no-margin">
                {{ models.amount_smmlv }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-3 col-md-3" v-if="isSsmlv">
            <GenericDateInputComponent
              v-if="props.action !== 'view'"
              :default_value="models.year_base_smmlv"
              label="Año base del SMMLV"
              required
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El año base del SMMLV es requerido'
                  ),
              ]"
              @update:modelValue="models.year_base_smmlv = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Año base del SMMLV</p>
              <p class="text-weight-medium no-margin">
                {{ models.year_base_smmlv }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-3 col-md-3" v-if="isSsmlv">
            <GenericInputComponent
              v-if="props.action !== 'view'"
              :default_value="models.estimated_smmlv"
              label="SMMLV estimado"
              :required="isSsmlv"
              :type="'text'"
              :rules="
                isSsmlv
                  ? [
                      (v: string) =>
                        useRules().is_required(
                          v,
                          `El SMMLV estimado es requerido`
                        ),
                      (v: string) => useRules().only_number_with_decimals(v),
                      (v: string) => useRules().max_length(v, 8),
                    ]
                  : []
              "
              @update:modelValue="models.estimated_smmlv = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">SMMLV estimado</p>
              <p class="text-weight-medium no-margin">
                {{ models.estimated_smmlv }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-3 col-md-3">
            <CurrencyInput
              v-if="props.action !== 'view'"
              v-model="propertyValue"
              :currency="'COP'"
              :placeholder="''"
              currencyLabel="Valor estimado del inmueble"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El valor estimado es requerido'),
                (val: string) => useRules().max_length(val, 17),
                (val: number) => useRules().minimal_quote(
                    1,
                    val,
                    'valor estimado del inmueble'
                  ),
              ]"
              @update:modelValue="models.property_value = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Valor estimado del inmueble
              </p>
              <p class="text-weight-medium no-margin">
                {{ useUtils().formatCurrency(`${models.property_value}`) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="q-pa-md q-pt-lg">
      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['value', 'status_id', 'actions']"
          @update-page="updateProcessedPage"
          @update-rows-per-page="updateProcessedPerPage"
        >
          <template #custom-header v-if="!'view'.includes(props.action)">
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-12">
                <div class="row justify-end">
                  <Button
                    class-custom="custom"
                    :outline="true"
                    :label="
                      props.action === 'create'
                        ? 'Agregar nomenclatura'
                        : 'Actualizar nomenclatura'
                    "
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      color: 'black',
                    }"
                    :disabled="isDisabledNomenclatureAddBtn"
                    :left-icon="defaultIconsLucide.plusCircleOutline"
                    @click="characteristicsFormisValid()"
                    :size="'md'"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #value="{ row }">
            <p class="text-weight-medium no-margin">
              {{ useUtils().formatCurrency(`${row.value}`) }}
            </p>
          </template>

          <template #status_id="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 1)" />
          </template>

          <template #actions>
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click=""
            />
          </template>
        </TableList>
      </section>

      <div v-show="tableProps.rows.length">
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Flujo financiero
          </p>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-xs-4 col-md-4">
            <GenericDateInputComponent
              v-if="props.action !== 'view'"
              :default_value="models.start_date"
              label="Fecha de inicio"
              required
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La fecha de inicio es requerida'
                  ),
              ]"
              :disabled="!isCreate"
              @update:modelValue="models.start_date = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de inicio*</p>
              <p class="text-weight-medium no-margin">
                {{ models.start_date }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericDateInputComponent
              v-if="props.action !== 'view'"
              :default_value="models.start_end"
              label="Fecha estimada de terminación"
              required
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La fecha de terminación es requerida'
                  ),
              ]"
              :option_calendar="
                useCalendarRules().only_after(models.start_date ?? '')
              "
              :disabled="!isCreate"
              @update:modelValue="models.start_end = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Fecha estimada de terminación
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.start_end }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <CurrencyInput
              v-if="props.action !== 'view'"
              v-model="models.total_value"
              :currency="'COP'"
              :placeholder="''"
              currencyLabel="Valor total de la etapa"
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().max_length(val, 40),
                (val: string) => useRules().min_length(val, 1),
              ]"
              :disabled="!isCreate"
              @update:modelValue="models.total_value = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Valor total de la etapa</p>
              <p class="text-weight-medium no-margin">
                {{ useUtils().formatCurrency(`${models.total_value}`) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <CurrencyInput
              v-if="props.action !== 'view'"
              v-model="models.financed_value"
              :currency="'COP'"
              :placeholder="''"
              currencyLabel="Valor financiado"
              :rules="[
                (val: string) => useRules().is_required(val, ''),
                (val: string) => useRules().max_length(val, 40),
                (val: string) => useRules().min_length(val, 1),
              ]"
              :disabled="!isCreate"
              @update:modelValue="models.financed_value = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Valor financiado</p>
              <p class="text-weight-medium no-margin">
                {{ useUtils().formatCurrency(`${models.financed_value}`) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="props.action !== 'view'"
              :default_value="models.associated_financing"
              :label="'Financiación asociada'"
              map_options
              :multiple="false"
              :manual_option="associated_financing"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La financiación es requerida'),
              ]"
              :required="true"
              :readonly="!isCreate"
              @update:modelValue="models.associated_financing = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Financiación asociada</p>
              <p class="text-weight-medium no-margin">
                {{ models.associated_financing }}
              </p>
            </div>
          </div>
        </div>

        <q-separator class="q-mt-sm" />

        <div class="q-mb-lg mt-2">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Documentos
          </p>
        </div>

        <section class="q-pl-md q-mt-lg">
          <UploadDocument
            v-for="element in dataUpload"
            :key="element.position"
            :file="element.file"
            @update:file="element.file = $event"
            @changeFile="
              (file: File | null) => handleFileChange(file, element.title)
            "
            :class="element.class"
            :title="element.title"
            :subtitle="element.subtitle"
            :required="element.required"
            displayMode="file"
            :view-close-file="['create', 'edit'].includes(action)"
          />
        </section>

        <div class="row q-col-gutter-md mt-2">
          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="props.action !== 'view'"
              :default_value="models.policies_id"
              :label="'Pólizas asociadas'"
              map_options
              :manual_option="business_trust_policy"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'Las pólizas son requeridas'),
              ]"
              required
              @update:modelValue="models.policies_id = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Pólizas asociadas</p>
              <p class="text-weight-medium no-margin">
                {{ models.policies_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="props.action !== 'view'"
              :default_value="models.guarantee_id"
              :label="'Garantías'"
              map_options
              :manual_option="business_trust_guarantee"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'Las garantías son requeridas'),
              ]"
              required
              @update:modelValue="models.guarantee_id = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Garantías</p>
              <p class="text-weight-medium no-margin">
                {{ models.guarantees_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="props.action !== 'view'"
              :default_value="models.financing_bank_id"
              :label="'Banco financiador'"
              map_options
              :manual_option="banks"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El banco es requerido'),
              ]"
              required
              @update:modelValue="models.financing_bank_id = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Banco financiador</p>
              <p class="text-weight-medium no-margin">
                {{ models.financing_bank_name }}
              </p>
            </div>
          </div>

          <div class="col-12">
            <GenericInputComponent
              :default_value="models.observations"
              label="Observaciones generales"
              :type="'textarea'"
              :readonly="'view'.includes(props.action)"
              :rules="[
                (v: string) =>
                  useRules().is_required(
                    v,
                    'Las observaciones generales son requeridas'
                  ),
                (v: string) => useRules().max_length(v, 500),
              ]"
              @update:modelValue="models.observations = $event"
            />
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IRealStateProjectStages
    business_trust_id: number
    stage_number?: number
  }>(),
  {}
)
// Emits
const emits = defineEmits(['stages', 'update:models'])

import { IRealStateProjectStages } from '@/interfaces/customs'

// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import UploadDocument from '@/components/common/UploadDocument/UploadDocument.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Composables
import { useCalendarRules, useRules } from '@/composables'

// Types
import { ActionType } from '@/interfaces/global'

// utils
import { useUtils } from '@/composables'

const defaultIconsLucide = useUtils().defaultIconsLucide

// Logic
import useRealStateProjectInformationForm from './PropertyFeaturesForm'

const {
  models,
  tableProps,
  dataUpload,
  departments,
  business_trust_third_parties,
  cities,
  development_type,
  base_calculation_property,
  characteristicsForm,
  houseDepartmentProps,
  associated_financing,
  business_trust_guarantee,
  business_trust_policy,
  isSsmlv,
  isTower,
  block_nomeclatures,
  banks,
  isNumber,
  propertyValue,
  isDisabledNomenclatureAddBtn,
  isCreate,
  characteristicsFormisValid,
  handleFileChange,
  updateProcessedPage,
  updateProcessedPerPage,
} = useRealStateProjectInformationForm(props, emits)

defineExpose({
  validatecCharacteristicsForm: async () => {
    return (
      (await characteristicsForm.value?.validate()) &&
      dataUpload.value.every((item) => item.file || !item.required)
    )
  },

  getModels: () => {
    return models.value
  },
  getNomenclatureAmount: () => tableProps.value.rows.length,
})
</script>
