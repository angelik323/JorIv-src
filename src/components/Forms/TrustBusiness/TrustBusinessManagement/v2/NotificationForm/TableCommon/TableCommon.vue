<template>
  <section>
    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        {{ title }}
      </p>
    </div>

    <section
      class="q-mt-sm justify-center q-gutter-md ml-2 mr-4 mt-0 editable-table"
    >
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="paginated"
        :pages="tableProps.pages"
        @updatePage="(val) => (tableProps.pages.currentPage = val)"
        @updateRowsPerPage="update_rows_per_page"
        :custom-columns="['name', 'actions']"
        :hide-header="tableProps.rows.length === 0"
      >
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

        <template #custom-header-action>
          <Button
            v-if="!is_view"
            :label="'Agregar'"
            :size="'md'"
            :unelevated="true"
            :outline="false"
            :left-icon="defaultIconsLucide.plusCircle"
            :color-icon="'white'"
            :class="'text-capitalize btn-filter custom'"
            @click="addRow"
          />
        </template>

        <template #name="{ row }">
          <div class="flex items-center justify-center">
            <GenericSelectorComponent
              v-if="!is_view"
              :key="row.third_party_id"
              class_custom_popup="custom"
              :manual_option="getOptions(row)"
              :map_options="true"
              :required="true"
              :class_name="'full-width'"
              :default_value="row.third_party_id"
              :auto_complete="true"
              @update:modelValue="updateRow(row, $event)"
              :rules="[
                (v: string) => is_required(v, 'El usuario es requerido'),
                (v: number) =>  not_exist_in_array(v, idsInArray as number[])
             ]"
            />
            <p v-else class="text-black-90 mb-0">
              {{
                (row.third_party?.document_type?.abbreviation
                  ? row.third_party.document_type.abbreviation + ' '
                  : '') +
                  (row.third_party?.document
                    ? row.third_party.document + ' '
                    : '') +
                  (row.name ?? row.third_party_id ?? 'No registrado')
              }}
            </p>
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openAlertModal(row)"
          />
        </template>
      </TableList>
    </section>
  </section>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    :title="alertModalConfig.description"
    @confirm="deleteRow()"
  >
  </AlertModalComponent>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: INotificationAuthorizeTrustBusiness[]
    action: ActionType
    title: string
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:models', value: INotificationAuthorizeTrustBusiness[]) => void
  >()

// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { INotificationAuthorizeTrustBusiness } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// logic-view
import useTableCommon from './TableCommon'

const {
  defaultIconsLucide,
  is_view,
  idsInArray,
  alertModalConfig,
  alertModalRef,

  //
  tableProps,
  paginated,

  addRow,
  deleteRow,
  is_required,
  not_exist_in_array,
  getOptions,
  updateRow,
  update_rows_per_page,
  openAlertModal,
} = useTableCommon(props, emits)
</script>
