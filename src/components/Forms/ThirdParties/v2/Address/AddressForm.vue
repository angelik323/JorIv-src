<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import { useAddressForm } from './AddressForm'
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
  formElementRef,
  isAddressGeneratorOpen,
  customColumns,
  tableProperties,
  locationToEdit,
  handleOptions,
  setMainItem,
  handleSaveAddress,
} = useAddressForm(props)
</script>

<template>
  <div class="q-pa-lg">
    <q-form ref="formElementRef">
      <section v-if="['create', 'edit'].includes(formType)">
        <p class="text-black text-weight-medium text-h6 q-mb-md">
          Dirección de residencia
        </p>

        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-none">
              Dirección de residencia*
            </p>
            <q-input
              :model-value="undefined"
              placeholder=""
              dense
              outlined
              readonly
              class="q-field--with-bottom"
              @click="
                tableProperties.rows.length === 5
                  ? undefined
                  : handleOptions('create')
              "
            />
          </div>

          <div
            class="col-xs-12 col-sm-12 col-md-3 col-lg-3 place-content--center"
          >
            <q-btn
              @click="
                tableProperties.rows.length === 5
                  ? undefined
                  : handleOptions('create')
              "
              class="q-py-sm q-px-lg"
              size="md"
              rounded
              no-caps
              outline
              dense
              label="Insertar dirección"
            />
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

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La direccion es requerida']"
    :locationToEdit="locationToEdit"
    @save="handleSaveAddress"
  />
</template>
