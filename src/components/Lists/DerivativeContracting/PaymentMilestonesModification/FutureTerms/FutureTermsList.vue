<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Vigencias futuras</div>
    
    <TableList
      :loading="tablePropsFutureValidity.loading"
      :columns="tablePropsFutureValidity.columns || []"
      :rows="tablePropsFutureValidity.rows"
      :pages="tablePropsFutureValidity.pages"
      @update-page="updatePage"
      @update-rows-per-page="updatePerPage"
    >
    </TableList>

    <div class="row justify-end q-mt-lg q-gutter-md">
      <Button
        label="Cerrar"
        outline
        color="orange"
        class-custom="btn-filter custom"
        @click="$emit('cancel')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import useFutureTermsList from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/FutureTerms/FutureTermsList'

const emits = defineEmits(['cancel'])

const props = defineProps<{
  milestones_id: number
}>()

const {
  tablePropsFutureValidity,
  updatePage,
  updatePerPage
} = useFutureTermsList(props)


</script>
