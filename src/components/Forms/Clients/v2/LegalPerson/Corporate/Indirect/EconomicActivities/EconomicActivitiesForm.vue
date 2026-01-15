<template>
  <q-expansion-item
    :model-value="isExpanded"
    expand-icon-class="text-primary_fiduciaria"
    @update:model-value="$emit('update:expanded', $event)"
  >
    <template v-slot:header>
      <q-item-section>
        <span class="text-black-90 text-weight-bold text-h6">
          Actividades económicas
        </span>
      </q-item-section>

      <q-item-section side>
        <Button
          v-if="action !== 'view'"
          label="Crear"
          :outline="false"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          color-icon="white"
          stop-propagation
          :disabled="false"
          @click="handleTableOptions('create')"
        />
      </q-item-section>
    </template>

    <VCard class="q-pa-lg q-mt-sm" style="margin-bottom: 0">
      <template #content-card>
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :custom-columns="
            ['create', 'edit'].includes(action)
              ? ['status', 'actions']
              : ['status']
          "
          :rows-per-page-options="[0]"
          hide-pagination
        >
          <template #custom-header>
            <span class="q-table__title text-black-90">
              {{ tableProperties.title }}
            </span>
          </template>

          <template #status="{ row }">
            <CustomToggle
              v-if="action !== 'view'"
              :value="isRowActive(row.status)"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
            />
            <ShowStatus v-else :type="Number(row.status) || 0" />
          </template>

          <template v-if="action !== 'view'" #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleTableOptions('edit', row)"
            />

            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete(row)"
            />
          </template>

          <template #custom-no-data>
            <div class="column justify-center items-center">
              <img
                src="@/assets/images/icons/no_data_accounting.svg"
                alt="Actualmente no hay registros"
                width="180px"
              />
              <div class="q-mt-lg text-black text-center">
                <p class="text-weight-bold text-h6 q-mb-xs">
                  Actualmente no hay registros
                </p>
                <p class="text-weight-medium">
                  Por favor, agregue uno para continuar con el proceso
                </p>
              </div>
            </div>
          </template>
        </TableList>
      </template>
    </VCard>
  </q-expansion-item>

  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      class="relative v-card-rounded q-px-xl q-py-lg generator-card"
      flat
      bordered
    >
      <Button
        class-custom="custom absolute-top-right q-ma-md z-top q-pa-sm"
        color="black"
        flat
        :outline="false"
        :left-icon="defaultIconsLucide.close"
        colorIcon="black"
        aria-label="Cerrar modal"
        @click="isModalOpen = false"
      />

      <div class="q-mt-xs q-mb-md">
        <span class="text-h6 text-black-90 text-weight-bold">
          {{ modalConfig.title }}
        </span>
      </div>

      <q-form
        ref="formElementRef"
        aria-label="Formulario para actividad económica"
      >
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pt-sm">
          <div class="col-12">
            <GenericSelectorComponent
              :default_value="models.economic_activity"
              label="Actividad económica (Código CIIU)"
              auto_complete
              return_object
              map_options
              :manual_option="ciius"
              required
              :disabled="action === 'edit'"
              :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'La actividad económica es requerida'
                  ),
              ]"
              @update:model-value="
                (val) => {
                  models.economic_activity = val?.value || null
                  models.economic_activity_code = val?.code || null
                  models.economic_activity_desc = val?.description || null
                }
              "
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="models.status"
              label="Estado"
              auto_complete
              map_options
              :manual_option="default_statuses"
              required
              :disabled="modalConfig.action !== 'edit'"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El estado es requerido'),
              ]"
              @update:model-value="models.status = $event"
            />
          </div>

          <div class="col-12 col-md-6 flex items-center">
            <q-checkbox
              v-model="models.is_ciiu_primary"
              label="¿Código CIIU principal?"
              color="orange"
              dense
              left-label
            />
          </div>
        </div>

        <q-separator class="q-mt-sm" />

        <div class="q-mt-lg q-mb-xs flex flex-center" style="gap: 8px">
          <Button
            class="custom"
            label="Cancelar"
            color="orange"
            size="md"
            no-caps
            unelevated
            outline
            :styleContent="{ color: 'black' }"
            @click="isModalOpen = false"
          />

          <Button
            class="custom"
            :label="modalConfig.btnText"
            color="orange"
            size="md"
            no-caps
            unelevated
            :outline="false"
            @click="onSave"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ActionType } from '@/interfaces/global'
import { IEconomicActivityCorporateForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import useEconomicActivitiesForm from '@/components/Forms/Clients/v2/LegalPerson/Corporate/Indirect/EconomicActivities/EconomicActivitiesForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IEconomicActivityCorporateForm[]
    isExpanded?: boolean
  }>(),
  {
    isExpanded: true,
  }
)

const emits = defineEmits<{
  (e: 'update:data', value: IEconomicActivityCorporateForm[]): void
  (e: 'update:expanded', value: boolean): void
}>()

const {
  default_statuses,
  ciius,
  defaultIconsLucide,
  formElementRef,
  models,
  isModalOpen,
  modalConfig,
  tableProperties,
  isRowActive,
  handleTableOptions,
  handleDelete,
  onSave,
} = useEconomicActivitiesForm(props, emits)
</script>

<style scoped lang="scss">
.generator-card {
  width: 820px;
  max-width: 90vw;
  border-radius: 15px !important;
}

:deep(.q-table__title) {
  font-size: 1.125rem !important;
  font-weight: bold !important;
}
</style>
