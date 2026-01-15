<template>
  <q-form ref="formManager" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Miembros de la junta directiva
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione la información de los miembros de la junta directiva de su
          nuevo cliente como persona jurídica.
        </p>
      </div>

      <RadioYesNo
        v-model="models.board_directors"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Cuenta con junta directiva o consejo directivo?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />
    </section>

    <!-- Tabla principal -->
    <template v-if="models.board_directors">
      <section class="q-mt-lg">
        <div v-if="action !== 'view'" class="row justify-end q-mb-md">
          <Button
            size="md"
            :outline="false"
            label="Agregar nuevo directivo"
            :class-custom="'items-center'"
            :left-icon="useUtils().defaultIconsLucide.plusCircle"
            color-icon="white"
            :style-content="{ 'align-items': 'center' }"
            @click="isSelectionOpen = true"
          />
        </div>

        <TableList
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :custom-columns="['actions']"
          :hide-header="tableProperties.rows.length === 0"
          hide-pagination
        >
          <!-- Título -->
          <template #custom-header>
            <p
              v-show="tableProperties.rows.length !== 0"
              class="text-black text-weight-bold text-body1"
            >
              {{ tableProperties.title }}
            </p>
          </template>

          <!-- Acciones -->
          <template #actions="{ row }">
            <Button
              v-if="action == 'view'"
              :leftIcon="useUtils().defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleOptions({ option: 'view', row })"
            />

            <Button
              v-if="action !== 'view'"
              :leftIcon="useUtils().defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="handleOptions({ option: 'edit', row })"
            />

            <Button
              v-if="action !== 'view'"
              :leftIcon="useUtils().defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="handleOptions({ option: 'delete', row })"
            />
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
    </template>
  </q-form>

  <SelectionModal
    v-model:is-open="isSelectionOpen"
    @click="handleOptions({ option: 'create', type: $event })"
  />

  <ManagerGenerator
    v-model:is-open="isGeneratorOpen"
    :person-type="personType"
    :form-type="formType"
    :item-to-edit="itemToEdit"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import Button from '@/components/common/Button/Button.vue'
import SelectionModal from './ManagerGenerator/SelectionModal.vue'
import ManagerGenerator from './ManagerGenerator/ManagerGenerator.vue'
import { useUtils } from '@/composables'
import useManagerForm from './ManagerForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  isSelectionOpen,
  isGeneratorOpen,
  personType,
  formType,
  itemToEdit,
  formManager,
  tableProperties,
  handleOptions,
  handleSave,
} = useManagerForm(props)

defineExpose({
  isRequiredForm: () =>
    !(
      models.value.board_directors === true && tableProperties.rows.length === 0
    ),
  validateForm: () => formManager.value?.validate(),
})
</script>
