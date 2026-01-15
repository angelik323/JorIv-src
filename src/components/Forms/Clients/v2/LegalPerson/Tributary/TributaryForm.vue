<template>
  <q-form ref="formTributaryRef" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información tributaria del proveedor
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos necesarios para saber si su nuevo cliente como
          persona júridica es una expuesta políticamente.
        </p>
      </div>

      <section v-if="isLegalPersonIndirect">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos principales
        </p>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Obligaciones tributarias"
              :default_value="models.fiscal_responsibility"
              :manual_option="fiscal_responsability"
              map_options
              auto_complete
              required
              :rules="[(val: string) => !!val || 'El país es requerido']"
              @update:modelValue="models.fiscal_responsibility = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">País de ubicación</p>
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
              :is-disabled="['view'].includes(action)"
            />
          </div>
        </div>

        <q-separator class="q-my-lg" />
      </section>

      <section v-if="isLegalPersonIndirect">
        <div class="flex justify-between">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Retenciones y conceptos tributarios a aplicar al proveedor
          </p>

          <Button
            :outline="false"
            :label="'Asignar'"
            :class-custom="'items-center'"
            color-icon="white"
            :left-icon="useUtils().defaultIconsLucide.plusCircle"
            :style-content="{ 'align-items': 'center' }"
            @click="handleShowModalAssign(true)"
          />
        </div>

        <TributaryList
          :action="ActionTypeEnum.VIEW"
          :selected-settlement-formulas-list="settlementFormulas"
        ></TributaryList>
      </section>

      <RadioYesNo
        v-model="models.files_tax_return"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Declara renta?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <RadioYesNo
        v-model="models.files_foreign_taxes"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Debe la persona jurídica declarar impuestos en un país diferente a Colombia?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.files_foreign_taxes">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              País{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="
                countries.filter(
                  (country) => country.label.toLowerCase() !== 'colombia'
                )
              "
              :map_options="true"
              :required="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :default_value="models.country_id"
              :auto_complete="true"
              @update:modelValue="models.country_id = $event"
              :rules="[(val: string) => !!val || 'El país es requerido']"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.country_id ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código GIIN{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.giin_code!"
              :rules="[
                (v: string) => !!v || 'El código GIIN es requerido',
                (v: string) => /^[\p{L}\d ]*$/u.test(v) || 'Solo caracteres alfanuméricos',
                (v: string) => v.length <= 20 || 'Debe contener como máximo 20 caracteres',
              ]"
              @update:model-value="models.giin_code = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.giin_code ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </template>
    </section>

    <section>
      <RadioYesNo
        v-model="models.is_branches"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿La persona jurídica tiene sucursales subsidiarios y/o filiales de otros países?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.is_branches">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Describa la actividad económica en sucursales o filiales{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              type="textarea"
              required
              :default_value="models.description_economic_activity"
              :rules="[
                (v) => !!v || 'La descripción es requerida',
                (v) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v) =>
                  v.length <= 1000 ||
                  'Debe contener como máximo 1.000 caracteres',
              ]"
              @update:model-value="
                models.description_economic_activity = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.description_economic_activity ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />

        <div class="q-my-md">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Dirección
          </p>
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              País{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.branch_country_id"
              :manual_option="countries"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'El país es requerido']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.branch_country_id ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-9">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Dirección{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <q-input
              v-if="['create', 'edit'].includes(action)"
              :model-value="models.branch_address"
              placeholder="Inserte"
              dense
              outlined
              readonly
              required
              :rules="[(val: string) => !!val || 'La dirección es requerida']"
              class="full-width"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.branch_address ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :countries="
      countries.filter((country) => country.label.toLowerCase() !== 'colombia')
    "
    :locationToEdit="{
      address: models.branch_address || '',
      country: {
        id: models.branch_country_id ? Number(models.branch_country_id) : null,
      },
    }"
    @save="
      ($event) => {
        models.branch_address = $event.address ?? null
        models.branch_country_id = $event.country?.id ?? null
      }
    "
  />
  <ModalComponent
    :openDialog="showModalAssign"
    :minWidth="$q.screen.width <= 607 ? '100%' : '80%'"
    @update:openDialog="handleShowModalAssign()"
  >
    <template #content-modal>
      <AssignSettlementParametersForm
        v-if="showModalAssign"
        :action="action"
        :assign-data-form="assignDataForm"
        :selected-settlement-formulas-list="settlementFormulas"
        @close:modal="handleShowModalAssign()"
        @update:selected-settlement-formulas-list="
          onUpdateSelectedSettlementFormulasList($event)
        "
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import Button from '@/components/common/Button/Button.vue'
import TributaryList from '@/components/Lists/Clients/LegalPerson/Tributary/TributaryList.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import AssignSettlementParametersForm from './AssignSettlementParameters/AssignSettlementParametersForm.vue'

// Logic form
import useTributaryForm from '@/components/Forms/Clients/v2/LegalPerson/Tributary/TributaryForm'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType, ActionTypeEnum } from '@/interfaces/global'
import {
  IClientIndirectBasicForm,
  IClientLegalPersonIndirectTributaryForm,
} from '@/interfaces/customs/clients/ClientIndirectLegalPerson'

const props = defineProps<{
  action: ActionType
  basicInformationDataForm: IClientIndirectBasicForm | null
  tributaryDataForm: IClientLegalPersonIndirectTributaryForm | null
}>()

const emit = defineEmits<{
  (e: 'close:modal'): void
  (e: 'update:table', data: any): void
  (e: 'update:tributary-data-form', data: any): void
}>()

const {
  models,
  formTributaryRef,
  isAddressGeneratorOpen,
  isLegalPersonIndirect,
  showModalAssign,
  assignDataForm,
  settlementFormulas,

  countries,
  fiscal_responsability,

  handleShowModalAssign,
  onUpdateSelectedSettlementFormulasList,
} = useTributaryForm(props, emit)

defineExpose({
  validateForm: () => formTributaryRef.value?.validate(),
})
</script>
