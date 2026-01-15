<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
        :custom-columns="['description', 'actions']"
      >
        <template #description="{ row }">
          <GenericInput
            v-if="props.action === 'edit' && props.id === row.id"
            :default_value="models.observation"
            :rules="[]"
            @update:model-value="models.observation = $event"
          />
          <span v-else>{{ row.observation }}</span>
        </template>

        <template #actions="{ row }">
          <Button
            v-if="
              props.action === 'view' &&
              !row.settlement_parameters &&
              props.id === row.id
            "
            label="Crear cálculo"
            color-bg="#762344"
            class-custom="custom"
            :outline="false"
            @click="
              $router.push({
                name: 'CalculationCommissionsCreate',
                params: {
                  id: row.id,
                },
              })
            "
          />
          <Button
            v-else
            label="Ver cálculo"
            color-bg="#762344"
            class-custom="custom"
            :outline="false"
            @click="
              $router.push({
                name: 'CalculationCommissionsRead',
                params: {
                  id: row.id,
                },
              })
            "
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import { ActionType } from '@/interfaces/global'
import { IFiduciaryBusinessCommissionsForm } from '@/interfaces/customs'

import useDescriptionsForm from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/Descriptions/Descriptions'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IFiduciaryBusinessCommissionsForm | null
    id?: number | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IFiduciaryBusinessCommissionsForm): void
}>()

const { formElementRef, models, tableProps, updatePage, updatePerPage } =
  useDescriptionsForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
