<template>
  <div class="q-pa-lg">
    <q-form ref="formElementRef" aria-label="Formulario de datos accionistas">
      <section>
        <div class="q-mb-lg">
          <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
            Composición accionaria
          </p>
        </div>

        <RadioYesNo
          v-model="models.has_shareholders"
          class="q-mt-md q-ml-sm"
          hasTitle
          title="¿Tienes socios o accionistas con una participación directa o indirecta igual o superior al 5%?*"
          :hasSubtitle="false"
          required
          :is-disabled="['view'].includes(action)"
        />
        <q-separator class="q-mt-sm" />
      </section>

      <section v-if="models.has_shareholders" class="q-mt-lg">
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :custom-columns="['actions']"
          :hide-header="tableProperties.rows.length === 0"
          :rows-per-page-options="[0]"
          hide-pagination
        >
          <template #custom-header>
            <div
              class="row justify-between items-center q-col-gutter-x-md q-col-gutter-y-sm full-width"
            >
              <div class="col-auto">
                <p class="q-table__title no-margin break-word">
                  {{ tableProperties.title }}
                </p>
              </div>

              <div class="col-auto">
                <Button
                  v-if="action !== 'view'"
                  label="Agregar nuevo socio"
                  size="md"
                  no-caps
                  unelevated
                  :outline="false"
                  :left-icon="defaultIconsLucide.plusCircleOutline"
                  color-icon="white"
                  @click="isSelectionOpen = true"
                />
              </div>
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="action === 'view'"
              :left-icon="defaultIconsLucide.eye"
              class-custom="custom"
              color="orange"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleOptions({ option: 'view', row })"
            />

            <template v-else>
              <Button
                :left-icon="defaultIconsLucide.edit"
                class-custom="custom"
                color="orange"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Editar"
                @click="handleOptions({ option: 'edit', row })"
              />

              <Button
                :left-icon="defaultIconsLucide.trash"
                class-custom="custom"
                color="orange"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="handleOptions({ option: 'delete', row })"
              />
            </template>
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
      </section>
    </q-form>
  </div>

  <SelectionModalV1
    v-model:is-open="isSelectionOpen"
    @click="handleOptions({ option: 'create', type: $event })"
  />

  <ShareholderGeneratorV1
    v-model:is-open="isGeneratorOpen"
    :person-type="personType"
    :form-type="formType"
    :item-to-edit="itemToEdit"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { ActionType } from '@/interfaces/global'
import { IBaseShareholdersForm } from '@/interfaces/customs/clients/Clients'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Shareholder generator V1.
// TODO: Por refactorizar
import SelectionModalV1 from '@/components/Forms/Clients/v2/LegalPerson/Shareholders/ShareholderGeneratorV1/SelectionModal.vue'
import ShareholderGeneratorV1 from '@/components/Forms/Clients/v2/LegalPerson/Shareholders/ShareholderGeneratorV1/ShareholderGenerator.vue'

// Logic view
import useShareholdersForm from '@/components/Forms/Clients/v2/LegalPerson/Shareholders/ShareholdersForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IBaseShareholdersForm | null
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:data', value: IBaseShareholdersForm | null) => void>()

const {
  defaultIconsLucide,
  formElementRef,
  models,

  isSelectionOpen,
  isGeneratorOpen,
  personType,
  formType,
  itemToEdit,

  tableProperties,
  handleOptions,
  handleSave,
  validateTotalPercent,
} = useShareholdersForm(props, emits)

defineExpose({
  isRequiredForm: () =>
    !(
      models.value.has_shareholders === true &&
      tableProperties.value.rows.length === 0
    ),
  itHasTotalPercent: () => validateTotalPercent(),
  validateForm: () => formElementRef.value?.validate(),
})
</script>

<style scoped lang="scss">
:deep(.q-table__title) {
  font-size: 1.125rem !important;
  font-weight: bold !important;
}
</style>
