<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import PhoneNumberGenerator from '@/components/Forms/PhoneNumberGenerator/PhoneNumberGenerator.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import MainPhone from '@/components/phone-selector/MainPhone.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'
import { useRules } from '@/composables'
import { usePhoneNumberForm } from './PhoneNumberForm'
import { IThirdParty } from '@/interfaces/global'

// Props
const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IThirdParty | null
  }>(),
  {}
)

// Handle emits to view:
const emit = defineEmits(['onContinue', 'onBack'])

const {
  phoneNumberForm,
  isNumberGeneratorOpen,
  customColumns,
  tableProperties,
  phoneNumberToEdit,
  formElementRef,
  phone_types,
  handleOptions,
  setMainItem,
  handleSave,
} = usePhoneNumberForm(props)
</script>

<template>
  <div class="q-pa-lg">
    <q-form ref="formElementRef">
      <section v-if="['create', 'edit'].includes(formType)">
        <p class="text-black text-weight-medium text-h6 q-mb-md">Teléfonos</p>

        <div class="row">
          <div class="col-12 col-md-10 row q-col-gutter-x-md q-col-gutter-y-xs">
            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                :default_value="phoneNumberForm.type?.id ?? null"
                return_object
                :manual_option="phone_types"
                label="Tipo de teléfono"
                :auto_complete="true"
                :first_filter_option="'label'"
                :second_filter_option="'label'"
                :required="true"
                :clearable="false"
                :map_options="true"
                :rules="[(val: any) => !!val || 'El tipo de número es requerido']"
                @update:modelValue="
                  ({ value, label }: any) => {
                    phoneNumberForm.number = ''
                    phoneNumberForm.type = value
                      ? { id: value, name: label }
                      : undefined
                  }
                "
              />
            </div>

            <div class="col-12 col-md-4 place-content--center">
              <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-none">
                Número de
                {{
                  phoneNumberForm.type?.id === 'phone' ? 'teléfono' : 'celular'
                }}*
              </p>

              <GenericInputComponent
                v-if="phoneNumberForm.type?.id === 'phone'"
                :default_value="phoneNumberForm.number"
                type="number"
                required
                :rules="[
                  (v: string) => useRules().is_required(v, 'El número de telefono es requerido'),
                  (v: string) => useRules().max_length(v, 10),
                  (v: string) => useRules().min_length(v, 10),
                ]"
                @update:model-value="phoneNumberForm.number = $event"
              />

              <MainPhone
                v-else-if="phoneNumberForm.type?.id === 'mobile'"
                class="q-field--with-bottom"
                :clean_value="phoneNumberForm.number ? false : true"
                v-model:phoneNumber="phoneNumberForm.number"
                :rules="[
                  (v: string) => useRules().is_required(v, 'El número de celular es requerido'),
                ]"
                @update:phoneNumber="phoneNumberForm.number = $event"
              />
            </div>

            <div class="">
              <p class="mb-0 invisible">Button</p>
              <Button
                :left-icon="defaultIconsLucide.plusCircleOutline"
                :label="'Añadir'"
                outline
                color-icon="#762345"
                :styleContent="{ 'place-items': 'center' }"
                @click="handleOptions('create', phoneNumberForm)"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="q-mt-md">
        <TableList
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :custom-columns="customColumns"
          :hide-header="tableProperties.rows.length === 0"
          :hide-bottom="true"
        >
          <!-- Custom title table -->
          <template #custom-header>
            <p
              v-show="tableProperties.rows.length !== 0"
              class="text-black text-weight-bold text-body1"
            >
              {{ tableProperties.title }}
            </p>
          </template>

          <!-- Custom -->
          <template #isMain="{ row }">
            <div style="box-sizing: border-box">
              <q-checkbox
                :disable="['view'].includes(formType)"
                color="orange"
                :model-value="row.isMain"
                @click="setMainItem(row.id)"
              />
            </div>
          </template>

          <!-- Actions -->
          <template #actions="{ row }">
            <q-btn
              flat
              round
              size="md"
              icon="mdi-pencil-outline"
              color="orange"
              class="no-border"
              @click="handleOptions('edit', row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Editar</p>
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              size="md"
              icon="mdi-trash-can-outline"
              color="orange"
              class="no-border"
              @click="handleOptions('delete', row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Eliminar</p>
              </q-tooltip>
            </q-btn>
          </template>

          <template #custom-no-data>
            <div
              class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
            >
              <img
                src="@/assets/images/icons/no_data_2.svg"
                alt="No hay datos para mostrar"
                width="180px"
              />
              <p class="text-weight-bold text-h5 text-center">
                No hay datos para mostrar
              </p>
            </div>
          </template>
        </TableList>
      </section>
    </q-form>
  </div>

  <PhoneNumberGenerator
    v-model:is-open="isNumberGeneratorOpen"
    required
    :phoneNumberToEdit="phoneNumberToEdit"
    @save="handleSave"
  />
</template>
