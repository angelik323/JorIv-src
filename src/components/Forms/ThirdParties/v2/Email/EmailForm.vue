<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import EmailGenerator from '@/components/Forms/EmailGenerator/EmailGenerator.vue'
import { useRules, useUtils } from '@/composables'
import { useEmailForm } from './EmailForm'
import Button from '@/components/common/Button/Button.vue'

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
  emailForm,
  isEmailGeneratorOpen,
  customColumns,
  tableProperties,
  itemToEdit,
  formElementRef,
  handleOptions,
  setMainItem,
  handleSave,
} = useEmailForm(props)
</script>

<template>
  <div class="q-pa-lg">
    <q-form ref="formElementRef">
      <section v-if="['create', 'edit'].includes(formType)">
        <p class="text-black text-weight-medium text-h6 q-mb-md">
          Correo electrónico
        </p>

        <div class="row">
          <div
            class="col-12 row items-center q-col-gutter-x-md q-col-gutter-y-xs"
          >
            <div class="col-12 col-md-4">
              <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-none">
                Correo electrónico*
              </p>

              <q-input
                name="email"
                outlined
                v-model="emailForm.email"
                dense
                type="text"
                placeholder="Inserte"
                clearable
                required
                :rules="[
                  (val: string) => useRules().email_validation(val),  
                  (val) => useRules().max_length(val, 254),
                ]"
                @keypress.enter.prevent="handleOptions('create', emailForm)"
              />
            </div>

            <div class="col-auto">
              <Button
                :outline="true"
                label="Añadir"
                :left-icon="useUtils().defaultIconsLucide.plusCircleOutline"
                color-icon="#762343"
                :styleContent="{
                  'place-items': 'center',
                  'border-radius': '20px',
                  'font-size': '13px',
                }"
                @click="handleOptions('create', emailForm)"
                :disable="tableProperties.rows.length == 5"
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

  <EmailGenerator
    v-model:is-open="isEmailGeneratorOpen"
    required
    :itemToEdit="itemToEdit"
    @save="handleSave"
  />
</template>
