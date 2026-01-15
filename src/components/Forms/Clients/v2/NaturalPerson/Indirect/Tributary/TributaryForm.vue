<template>
  <q-form ref="formTributary" class="q-pa-lg">
    <section>

      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información de responsabilidad tributaria
          
        </p>
      </div>

      <div class="q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos principales
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center q-mt-lg">

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['edit', 'create'].includes(action)"
            class="full-width"
            :default_value="models.tax_info.tax_obligations"
            label="Obligaciones tributarias"
            placeholder="Seleccione"
            required
            :manual_option="fiscal_responsability"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :rules="[(v: string) => !!v || 'Las obligaciones tributarias son requeridas']"
            @update:model-value="models.tax_info.tax_obligations = $event"
            :disabled="['view'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Obligaciones tributarias</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info.tax_obligations ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4 flex justify-end">
          <div class="row items-center no-wrap">
            <div v-if="['edit', 'create'].includes(action)">
              <div class="col-auto text-black-10 text-weight-500">¿Declara Renta?*</div>
              <div class="col">
                <RadioYesNo
                  v-model="models.tax_info.files_tax_return"
                class="q-pl-sm"
                :hasTitle="false"
                :hasSubtitle="false"
                :is-disabled="['view'].includes(action)"
                />
              </div>
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">¿Declara Renta?</p>
              <p class="text-weight-medium no-margin">
                {{ models.tax_info.files_tax_return ? 'SI' : 'NO' }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 flex justify-end">
          <div v-if="['edit', 'create'].includes(action)" class="row items-center no-wrap">
            <div class="col-auto text-black-10 text-weight-500">Responsable de IVA*</div>
            <div class="col">
              <RadioYesNo
                v-model="models.tax_info.vat_responsibility"
                class="q-pl-sm"
                :hasTitle="false"
                :hasSubtitle="false"
                :is-disabled="['view'].includes(action)"
                :options="[
                  { label: 'SI', value: 'SI' },
                  { label: 'NO', value: 'NO' }
                ]"
              />
            </div>
          </div>
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Responsable de IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info.vat_responsibility ? 'SI' : 'NO' }}
            </p>
          </div>
        </div>

      </div>

      <q-separator class="q-my-lg" />

      <div class="q-mt-lg flex items-center justify-between">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Retenciones y conceptos tributarios a aplicar al proveedor
        </p>

        <Button
          v-if="['edit', 'create'].includes(action)"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          label="Asignar"
          color="white"
          color-icon="white"
          :outline="false"
          :dropdown-grouped="true"
          @click="handleOpenAssignModal"
        />
      </div>

      <ModalComponent
        v-model:openDialog="openAssignParamsModal"
        title="Asignar parámetros de liquidación"
        minWidth="80%"
      >
        <template #content-modal>

          <!-- DATOS FIJOS -->
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center">
            <div class="col-12 col-md-6">
              <GenericInputComponent
                :default_value="thirdPartyFullName"
                label="Tercero"
                type="text"
                placeholder="Tercero"
                required
                :rules="[(v: string) => useRules().is_required(v, 'El tercero')]"
                disabled
              />
            </div>
          </div>

          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center">
            <div class="col-12 col-md-12">
              <section>

                <TableList
                  :hide-pagination="true"
                  :hide-bottom="true"
                  :loading="tableLiquidationParamsProps.loading"
                  :columns="tableLiquidationParamsProps.columns"
                  :rows="tableLiquidationParamsProps.rows"
                  :custom-columns="[
                    'selected_ui',
                    'iva',
                    'retelca',
                    'retefuente',
                    'multiretelca',
                    'impuestos_municipales',
                    'principal'
                  ]"
                  @update:selected="onSelectedLiquidationRows"
                >
                  <template #header-selected_ui>
                    <div class="flex justify-center">
                      <q-checkbox
                        :model-value="allRowsSelected"
                        :indeterminate="someRowsSelected && !allRowsSelected"
                        color="orange"
                        dense
                        class="checkbox-large"
                        @update:model-value="toggleSelectAll"
                      />
                    </div>
                  </template>
                  <template #selected_ui="{ row }">
                    <div class="flex justify-center">
                      <q-checkbox
                        :model-value="isRowSelected(row.id)"
                        color="orange"
                        dense
                        class="checkbox-large"
                        @update:model-value="toggleRowSelected(row)"
                      />
                    </div>
                  </template>

                  <template #iva="{ row }">
                    <div class="flex justify-center">
                      <q-checkbox
                        :model-value="Boolean(row.iva)"
                        color="orange"
                        dense
                        class="cde-checkbox"
                        readonly
                      />
                    </div>
                  </template>
                  <template #retelca="{ row }">
                    <div class="flex justify-center">
                      <q-checkbox
                        :model-value="Boolean(row.retelca)"
                        color="orange"
                        dense
                        class="cde-checkbox"
                        readonly
                    />
                    </div>
                  </template>

                  <template #retefuente="{ row }">
                    <div class="flex justify-center">
                      <q-checkbox
                        :model-value="Boolean(row.retefuente)"
                        color="orange"
                        dense
                        class="cde-checkbox"
                        readonly
                      />
                    </div>
                  </template>

                  <template #multiretelca="{ row }">
                    <div class="flex justify-center">
                      <q-checkbox
                        :model-value="Boolean(row.multiretelca)"
                        color="orange"
                        dense
                        class="cde-checkbox"
                        readonly
                      />
                    </div>
                  </template>

                  <template #impuestos_municipales="{ row }">
                    <div class="flex justify-center">
                      <q-checkbox
                        :model-value="Boolean(row.impuestos_municipales)"
                        color="orange"
                        dense
                        class="cde-checkbox"
                        readonly
                      />
                    </div>
                  </template>

                  <template #principal="{ row }">
                    <div class="flex justify-center">
                      <q-radio
                        v-model="principalSelected"
                        :val="row.id"
                        color="orange"
                        class="cursor-pointer"
                        @update:model-value="handleSetPrincipal(row)"
                      />
                    </div>
                  </template>

                </TableList>
              </section>
            </div>
          </div>

        <div class="q-mt-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                Detalle conceptos
          </p>
        </div>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center">
          <div class="col-12 col-md-6">
            <GenericInputComponent
              label="Nombre concepto IVA"
              type="text"
              placeholder="Nombre concepto IVA"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'El nombre del concepto IVA')
              ]"
              :default_value="form.iva_concept"
              @update:model-value="form.iva_concept = $event"
              disabled
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericInputComponent
              label="Tarifa IVA"
              type="text"
              placeholder="Tarifa IVA"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'La tarifa IVA')
              ]"
              :default_value="String(form.iva_tarifa)"
              @update:model-value="form.iva_tarifa = $event"
              disabled
            />
          </div>
        </div>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center">
          <div class="col-12 col-md-6">
            <GenericInputComponent
              label="Nombre concepto Reteiva"
              type="text"
              placeholder="Nombre concepto Reteiva"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'El nombre del concepto Reteiva')
              ]"
              :default_value="String(form.reteiva_concept)"
              @update:model-value="form.reteiva_concept = $event"
              disabled
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericInputComponent
              label="Tarifa Reteiva"
              type="text"
              placeholder="Tarifa Reteiva"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'La tarifa Reteiva')
              ]"
              :default_value="String(form.reteiva_tarifa)"
              @update:model-value="form.reteiva_tarifa = $event"
              disabled
            />
          </div>
        </div>

          <div class="row justify-center q-mt-lg">
            <Button
              :outline="false"
              label="Crear"
              size="md"
              color="orange"
              class="text-capitalize btn-filter custom q-ml-sm"
              @click="handleCreateLiquidationParams(() => (openAssignParamsModal = false))"
            />
          </div>

        </template>
      </ModalComponent>

      <section>
        <TableList
          :hide-pagination="true"
          :hide-bottom="true"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="[
            'iva', 'retelca','retefuente','multiretelca','impuestos_municipales'
          ]"
        >

          <template #iva="{ row }">
            <q-checkbox
              :model-value="Boolean(row.iva)"
              color="orange"
              dense
              readonly
              class="checkbox-large"
            />
          </template>

          <template #retelca="{ row }">
            <q-checkbox
              :model-value="Boolean(row.retelca)"
              color="orange"
              dense
              readonly
              class="checkbox-large"
            />
          </template>

          <template #retefuente="{ row }">
            <q-checkbox
              :model-value="Boolean(row.retefuente)"
              color="orange"
              dense
              readonly
              class="checkbox-large"
            />
          </template>

          <template #multiretelca="{ row }">
            <q-checkbox
              :model-value="Boolean(row.multiretelca)"
              color="orange"
              dense
              readonly
              class="checkbox-large"
            />
          </template>

          <template #impuestos_municipales="{ row }">
            <q-checkbox
              :model-value="Boolean(row.impuestos_municipales)"
              color="orange"
              dense
              readonly
              class="checkbox-large"
            />
          </template>

        </TableList>
      </section>

      <q-separator class="q-my-lg" />

      <div class="q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información financiera
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center">
        <div class="col-12 col-md-6">
          <div v-if="['edit', 'create'].includes(action)" class="row items-center no-wrap">
            <div class="col-auto text-black-10 text-weight-500">¿Tiene nacionalidad colombiana?*</div>
            <div class="col">
              <RadioYesNo
                v-model="models.nationality.has_different_nationality"
                class="q-pl-sm"
                :hasTitle="false"
                :hasSubtitle="false"
                :is-disabled="['view'].includes(action)"
              />
            </div>
          </div>
          <div v-else class="text-black-90 mt-2">
            <p class="text-weight-bold no-margin">¿Tiene nacionalidad colombiana?</p>
            <p class="text-weight-medium no-margin">
              {{ models.nationality.has_different_nationality ? 'SI' : 'NO' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center q-mt-sm" v-if="models.nationality.has_different_nationality === false">
        <div class="col-12 col-md-4">
          <div v-if="['edit', 'create'].includes(action)">
            <GenericSelectorComponent
              class="full-width"
              :default_value="models.address.country_id"
              label="País"
              placeholder="Seleccione"
              :manual_option="countries"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :required="models.nationality.has_different_nationality === false"
              :rules="[
                (v: string) =>
                  models.nationality.has_different_nationality === false
                    ? useRules().is_required(v, 'El país es requerido')
                    : true
              ]"
              @update:model-value="models.address.country_id = $event"
              :disabled="['view'].includes(action)"
            />
          </div>
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País</p>
            <p class="text-weight-medium no-margin">
              {{ models.address.country_id
                  ? getCountryByID(Number(models.address.country_id))
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div v-if="['edit', 'create'].includes(action)">
           
           <GenericSelectorComponent
              class="full-width"
              :default_value="models.nationality.nationality"
              label="Nacionalidad"
              placeholder="Seleccione"
              :manual_option="nationalities"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :required="models.nationality.has_different_nationality === false"
              :rules="[
                (v: string) =>
                  models.nationality.has_different_nationality === false
                    ? useRules().is_required(v, 'La nacionalidad es requerida')
                    : true
              ]"
              @update:model-value="models.nationality.nationality = $event"
              :disabled="['view'].includes(action)"
            />
          </div>
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nacionalidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.nationality.nationality ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center q-mt-sm">
        <div class="col-12 col-md-12">
          <div v-if="['edit', 'create'].includes(action)" class="row items-center no-wrap">
            <div class="col-auto text-black-10 text-weight-500">
              ¿Tiene responsabilidad tributaria internacional en un país diferente a Colombia?
            </div>
            <div class="col">
              <RadioYesNo
                v-model="models.tax_info.has_tax_responsibility_outside_colombia"
                class="q-pl-sm"
                :hasTitle="false"
                :hasSubtitle="false"
                :is-disabled="['view'].includes(action)"
              />
            </div>
          </div>
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">¿Tiene responsabilidad tributaria internacional en un país diferente a Colombia?</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info.has_tax_responsibility_outside_colombia ? 'SI' : 'NO' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <div v-if="models.tax_info.has_tax_responsibility_outside_colombia === true">
        <div class="q-mt-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Dirección</p>
        </div>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center q-mt-sm">
          <div class="col-12 col-md-4">
            <div v-if="['edit', 'create'].includes(action)">
              <GenericSelectorComponent
                class="full-width"
                :default_value="models.address.country_id"
                label="País de tributario"
                placeholder="Seleccione"
                map_options
                first_filter_option="label"
                second_filter_option="label"
                :manual_option="countries"
                :required="models.tax_info.has_tax_responsibility_outside_colombia === true"
                :rules="[
                  v =>
                    models.tax_info.has_tax_responsibility_outside_colombia
                    ? useRules().is_required(v, 'El país de tributario es requerido')
                    : true
                ]"
                @update:model-value="models.address.country_id = $event"
                :disabled="['view'].includes(action)"
              />
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">País de tributario</p>
              <p class="text-weight-medium no-margin">
                {{ models.address.country_id
                  ? getCountryByID(Number(models.address.country_id))
                  : 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div v-if="['edit', 'create'].includes(action)">
              <GenericInputComponent
                :default_value="models.tax_info.address.address"
                label="Dirección"
                placeholder="Inserte"
                :required="models.tax_info.has_tax_responsibility_outside_colombia === true"
                :rules="[
                  v =>
                    models.tax_info.has_tax_responsibility_outside_colombia
                      ? useRules().is_required(v, 'La dirección es requerida')
                      : true
                ]"
                @update:model-value="models.tax_info.address.address = $event"
                :disabled="['view'].includes(action)"
              />
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Dirección</p>
              <p class="text-weight-medium no-margin">
                {{ models.tax_info.address.address?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div v-if="['edit', 'create'].includes(action)">
              <GenericInputComponent
                class="full-width"
                :default_value="models.address.postal_address"
                label="Dirección postal"
                placeholder="Inserte"
                :required="models.tax_info.has_tax_responsibility_outside_colombia === true"
                :rules="[
                  v =>
                    models.tax_info.has_tax_responsibility_outside_colombia
                      ? useRules().is_required(v, 'La dirección postal es requerida')
                      : true
                ]"
                @update:model-value="models.address.postal_address = $event"
                :disabled="['view'].includes(action)"
              />
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Dirección postal</p>
              <p class="text-weight-medium no-margin">
                {{ models.address.postal_address ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center q-mt-sm">
          <div class="col-12">
            <q-separator class="q-mb-md" />
            <div class="row items-center no-wrap" v-if="['edit', 'create'].includes(action)">
              <div class="col-auto text-black-10 text-weight-500">
                ¿Ha otorgado poder de representación a través de notaría a una persona en una jurisdicción diferente a Colombia?
              </div>
              <div class="col">
                <RadioYesNo
                  v-model="models.address.has_notary_power_abroad"
                  class="q-pl-sm"
                  :hasTitle="false"
                  :hasSubtitle="false"
                  :is-disabled="['view'].includes(action)"
                />
              </div>
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">¿Ha otorgado poder de representación a través de notaría a una persona en una jurisdicción diferente a Colombia?</p>
              <p class="text-weight-medium no-margin">
                {{ models.address.has_notary_power_abroad ? 'SI' : 'NO' }}
              </p>
            </div>
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <div class="q-mt-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Detalle</p>
        </div>
        
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center q-mt-sm">
          <div class="col-12 col-md-4">
            <div v-if="['edit', 'create'].includes(action)">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['show'].includes(action) ? 'text-black-10 ' : 'text-grey-7'
              "
            >
              Teléfono*
            </p>
            <PhoneInput
              class="full-width"
              :default_value="models.tax_info.foreign_phone"
              :required="models.tax_info.has_tax_responsibility_outside_colombia === true"
              :rules="[
                val =>
                  models.tax_info.has_tax_responsibility_outside_colombia
                    ? useRules().is_required(val, 'El teléfono es requerido')
                    : true
              ]"
              @update:model-value="models.tax_info.foreign_phone = $event"
              :is-disabled="['view'].includes(action)"
            />
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Teléfono</p>
              <p class="text-weight-medium no-margin">
                {{ models.tax_info.foreign_phone ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div v-if="['edit', 'create'].includes(action)">
              <GenericSelectorComponent
                class="full-width"
                :default_value="models.details.tin_status"
                label="Estado del código TIN"
                placeholder="Seleccione"
                :required="models.tax_info.has_tax_responsibility_outside_colombia === true"
                :rules="[
                  v =>
                    models.tax_info.has_tax_responsibility_outside_colombia
                      ? !!v || 'El estado del TIN es requerido'
                      : true
                ]"
                @update:model-value="models.details.tin_status = $event"
                :disabled="['view'].includes(action)"
                :manual_option="third_party_tin_options"
                map_options
                first_filter_option="label"
                second_filter_option="label"
              />
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estado del código TIN</p>
              <p class="text-weight-medium no-margin">
                {{ models.details.tin_status ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4" v-if="models.details.tin_status === 'Posee TIN'">
            <div v-if="['edit', 'create'].includes(action)">
              <GenericInputComponent
                :default_value="models.details.tin"
                label="TIN"
                placeholder="Inserte"
                :required="models.details.tin_status === 'Posee TIN'"
                :rules="[
                  v =>  
                    models.details.tin_status === 'Posee TIN'
                      ? !!v || 'El TIN es requerido'
                      : true
                ]"
                @update:model-value="models.details.tin = $event"
                :disabled="['view'].includes(action)"
              />
            </div>
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">TIN</p>
              <p class="text-weight-medium no-margin">
                {{ models.details.tin ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Components
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import useTributaryForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Tributary/TributaryForm'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ILiquidationParamRow, ISettlementFormulaTributary, ITributaryForm, SettlementParametersResult } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITributaryForm | null
    settlement_formulas_list?: any
    thirdParty?: string
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'update:data', value: ITributaryForm | null): void
  (e: 'validate:form'): void
  (e: 'insert:address'): void
}>()

const handleOpenAssignModal = () => {
  syncSelectedFromModel()
  openAssignParamsModal.value = true
}

const form = ref({
  iva_concept: '',
  iva_tarifa: 0,
  reteiva_concept: '',
  reteiva_tarifa: 0
});

const handleSetPrincipal = (row: ILiquidationParamRow) => {
  const results: SettlementParametersResult = getSettlementParameters(
    row, 
    props.settlement_formulas_list as ISettlementFormulaTributary[]
  );

  form.value = { ...form.value, ...results };
};

const {
  models,
  formTributary,
  tableProps,
  defaultIconsLucide,
  tableLiquidationParamsProps,
  countries,
  fiscal_responsability,
  nationalities,
  third_party_tin_options,
  principalSelected,
  thirdPartyFullName,
  onSelectedLiquidationRows,
  handleCreateLiquidationParams,
  getCountryByID,
  isRowSelected,
  toggleRowSelected,
  syncSelectedFromModel,
  allRowsSelected,
  someRowsSelected,
  toggleSelectAll,
  getSettlementParameters
} = useTributaryForm(props, emit)

const openAssignParamsModal = ref(false)

defineExpose({
  validateForm: () => formTributary.value?.validate()
})
</script>

<style scoped>
.checkbox-large {
  transform: scale(1.4);
  transform-origin: center;
}
</style>
