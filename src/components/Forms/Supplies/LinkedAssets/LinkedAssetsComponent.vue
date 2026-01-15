<template>
  <article>
    <div class="q-mx-xl q-py-xl">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions']"
      >
        <!-- Custom title table -->
        <template #custom-header>
          <div class="row q-col-gutter-sm" style="width: 100%">
            <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
              <p class="q-my-none text-weight-medium text-h5">
                {{ tableProps.title }}
              </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
              <q-btn
                v-if="['create', 'edit'].includes(action)"
                no-caps
                :icon="defaultIcons.plus"
                unelevated
                size="100%"
                color="indigo-10"
                class="fix__radius--min min-h__40 full-width"
                @click="openDialog = true"
              >
                Añadir
              </q-btn>

              <q-btn
                v-else
                no-caps
                outline
                unelevated
                size="100%"
                color="indigo-10"
                :disable="tableProps.rows.length == 0"
                class="btn__table-excel full-width"
                @click="exportXLSX"
              >
                <img
                  class="image__excel-btn q-mr-sm"
                  src="@/assets/images/excel.svg"
                  alt="Excel Icon"
                />
                Descargar excel
              </q-btn>
            </div>
          </div>
        </template>

        <template #actions="{ row }">
          <!-- Editar -->
          <q-btn
            v-if="['create', 'edit'].includes(action)"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.edit"
            color="indigo-10"
            @click="editRecord(row, row.id)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="primary"
            >
              <p class="q-ma-none text-body2">Editar</p>
            </q-tooltip>
          </q-btn>
          <!-- Eliminar -->
          <q-btn
            v-if="['create', 'edit'].includes(action)"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.delete"
            color="indigo-10"
            @click="deleteRowValidation(row.id)"
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
      </TableList>
    </div>

    <!-- Añadir activo -->
    <Modal
      title="Añadir activo"
      min-width="80%"
      :open-dialog="openDialog"
      @update:openDialog=";(openDialog = false), onResetForm()"
    >
      <template #content-modal>
        <q-form ref="linkedAssetsCreateForm" class="mb-3 row q-col-gutter-md">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericSelector
              label="Activo*"
              auto_complete
              :manual_option="general_assets"
              first_filter_option="label"
              second_filter_option="label"
              :map_options="true"
              :required="true"
              :default_value="models.asset_id"
              @update:modelValue="models.asset_id = $event"
              :rules="[(v: string) => !!v || 'El activo es requerido']"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericInput
              label="Cantidad*"
              :required="true"
              type="number"
              :default_value="models.quantity"
              @update:modelValue="models.quantity = $event"
              :rules="[
                (v: string) => !!v || 'La cantidad es requerida', 
                (v: number) => v > 0|| 'Debe ser un numero mayor a 0', 
                (v: string) => /^[0-9]*$/.test(v) || 'Debe de tener solo números ',
                (v: string) =>  v.length <= 10 || 'Debe de tener máximo 10 caracteres'
            ]"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericDateInput
              label="Fecha de asociación"
              :default_value="models.association_date"
              :required="true"
              :option_calendar="
                options_calendar_date_less_than_or_equal_to_the_current_date
              "
              @update:modelValue="models.association_date = $event"
              :rules="[
                (v: string) => !!v || 'La fecha de asociación es requerida', 
                (v: string) => date_before_or_equal_to_the_current_date(v)
              ]"
            />
          </div>

          <div class="col-12">
            <q-separator />
          </div>
          <div class="col-12">
            <div class="row justify-end q-gutter-md">
              <div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 content-center">
                <q-btn
                  outline
                  class="btn__standart full-width"
                  color="indigo-10"
                  label="Cancelar"
                  no-caps
                  unelevated
                  @click=";(openDialog = false), onResetForm()"
                />
              </div>
              <div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 content-center">
                <q-btn
                  class="btn__standart full-width"
                  color="indigo-10"
                  label="Añadir"
                  no-caps
                  unelevated
                  @click="addToTable"
                />
              </div>
            </div>
          </div>
        </q-form>
      </template>
    </Modal>

    <!-- Editar activo -->
    <Modal
      title="Editar activo"
      min-width="80%"
      :open-dialog="openDialogEdit"
      @update:openDialog=";(openDialogEdit = false), onResetForm()"
    >
      <template #content-modal>
        <q-form ref="linkedAssetsCreateForm" class="mb-3 row q-col-gutter-md">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericSelector
              label="Activo*"
              auto_complete
              :manual_option="general_assets"
              :map_options="true"
              first_filter_option="label"
              second_filter_option="label"
              :required="true"
              :default_value="models.asset_id"
              @update:modelValue="models.asset_id = $event"
              :rules="[(v: string) => !!v || 'El activo es requerido']"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericInput
              label="Cantidad*"
              :required="true"
              type="number"
              :default_value="models.quantity"
              @update:modelValue="models.quantity = $event"
              :rules="[
                (v: string) => !!v || 'La cantidad es requerida', 
                (v: number) => v > 0|| 'Debe ser un numero mayor a 0', 
                (v: string) => /^[0-9]*$/.test(v) || 'Debe de tener solo números ',
                (v: string) =>  v.length <= 10 || 'Debe de tener máximo 10 caracteres'
            ]"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericDateInput
              label="Fecha de asociación"
              :default_value="models.association_date"
              :required="false"
              :option_calendar="
                options_calendar_date_less_than_or_equal_to_the_current_date
              "
              @update:modelValue="models.association_date = $event"
              :rules="[
                (v: string) => !!v || 'La fecha de asociación es requerida', 
                (v: string) => date_before_or_equal_to_the_current_date(v)
              ]"
            />
          </div>

          <div class="col-12">
            <q-separator />
          </div>
          <div class="col-12">
            <div class="row justify-end q-gutter-md">
              <div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 content-center">
                <q-btn
                  outline
                  class="btn__standart full-width"
                  color="indigo-10"
                  label="Cancelar"
                  no-caps
                  unelevated
                  @click=";(openDialogEdit = false), onResetForm()"
                />
              </div>
              <div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 content-center">
                <q-btn
                  class="btn__standart full-width"
                  color="indigo-10"
                  label="Actualizar"
                  no-caps
                  unelevated
                  @click="addTableRowEdit"
                />
              </div>
            </div>
          </div>
        </q-form>
      </template>
    </Modal>
  </article>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ISuppliesRequest | null
  }>(),
  {}
)
// Components
import Modal from '@/components/common/Modal/ModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Interfaces
import { ISuppliesRequest } from '@/interfaces/global'

// Logic View
import useLinkedAssets from '@/components/Forms/Supplies/LinkedAssets/LinkedAssetsComponent'

const {
  models,
  tableProps,
  defaultIcons,
  openDialog,
  general_assets,
  linkedAssetsCreateForm,
  openDialogEdit,

  //   Methods
  addToTable,
  deleteRowValidation,
  editRecord,
  onResetForm,
  addTableRowEdit,
  exportXLSX,
  date_before_or_equal_to_the_current_date,
  options_calendar_date_less_than_or_equal_to_the_current_date,
} = useLinkedAssets(props)
</script>
