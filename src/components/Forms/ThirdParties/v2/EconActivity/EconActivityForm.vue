<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import EconActivityGenerator from '@/components/Forms/EconActivityGenerator/EconActivityGenerator.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { defaultIcons } from '@/utils'
import { useEconActivityForm } from './EconActivityForm'

// Interfaces
import { IThirdParty } from '@/interfaces/global'

// Props
const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IThirdParty | null
  }>(),
  {}
)

const {
  models,
  isActivityGeneratorOpen,
  customColumns,
  tableProperties,
  itemToEdit,
  formElementRef,
  isLoading,
  ciius,
  cities,
  addToTable,
  deleteRecord,
  editRecord,
  setMainItem,
  handleSave,
} = useEconActivityForm(props)
</script>

<template>
  <div class="q-pa-lg">
    <section>
      <q-form ref="formElementRef">
        <p class="text-black text-weight-medium text-h6 q-mb-md">
          Actividad económica (Código CIIU)
        </p>

        <div
          class="row q-col-gutter-sm"
          v-if="['create', 'edit'].includes(formType)"
        >
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericSelectorComponent
              :default_value="models.ciiu"
              :manual_option="ciius"
              label="Actividad Económica (Código CIIU)"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              required
              :map_options="true"
              :rules="[(val: any) => !!val || 'La actividad económica es requerida']"
              @update:modelValue="models.ciiu = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericSelectorComponent
              :default_value="models.city"
              :manual_option="cities"
              label="Ciudad"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              required
              :map_options="true"
              :rules="[(val: any) => !!val || 'La ciudad es requerida']"
              :placeholder="isLoading ? 'Cargando...' : 'Seleccionar'"
              @update:modelValue="models.city = $event"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12 col-md-2 col-lg-2 place-content--center"
          >
            <q-btn
              class="full-width btn-filter"
              size="md"
              rounded
              no-caps
              outline
              dense
              :icon="defaultIcons.plusCircleOutline"
              label="Añadir"
              @click="addToTable"
            />
          </div>
        </div>
      </q-form>
    </section>

    <section class="q-mt-md" v-if="tableProperties.rows.length > 0">
      <TableList
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :custom-columns="customColumns"
        :hide-bottom="true"
      >
        <!-- Custom title table -->
        <template #custom-header>
          <p class="text-black text-weight-bold text-body1">
            {{ tableProperties.title }}
          </p>
        </template>

        <!-- Custom -->
        <template #is_main="{ row }">
          <div style="box-sizing: border-box">
            <q-checkbox
              :disable="['view'].includes(formType)"
              color="orange"
              :model-value="row.is_main"
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

          <q-btn
            flat
            round
            size="md"
            icon="mdi-trash-can-outline"
            color="orange"
            class="no-border"
            @click="deleteRecord(row.id, row.is_main)"
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
    <template v-else>
      <div class="column justify-center items-center q-col-gutter-y-lg q-mt-sm">
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
  </div>

  <EconActivityGenerator
    v-model:is-open="isActivityGeneratorOpen"
    required
    :itemToEdit="itemToEdit"
    @save="handleSave"
  />
</template>
