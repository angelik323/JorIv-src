<template>
  <div class="q-pa-lg">
    <section class="q-mt-md">
      <p class="text-black-90 text-subtitle1 text-weight-bold">
        {{ instructionsTableProps.title }}
      </p>
      <VCard>
        <template #content-card>
          <TableList
            :loading="instructionsTableProps.loading"
            :columns="instructionsTableProps.columns"
            :rows="instructionsTableProps.rows"
            :pages="instructionsTableProps.pages"
            hide-pagination
            :rows-per-page-options="[0]"
            selection="single"
            v-model:selected="selectedInstruction"
            class="q-ma-sm"
          />
        </template>
      </VCard>

      <p class="text-black-90 text-subtitle1 text-weight-bold">
        {{ beneficiariesTableProps.title }}
      </p>
      <VCard>
        <template #content-card>
          <TableList
            :loading="beneficiariesTableProps.loading"
            :columns="beneficiariesTableProps.columns"
            :rows="beneficiariesTableProps.rows"
            :pages="beneficiariesTableProps.pages"
            hide-pagination
            :rows-per-page-options="[0]"
            class="q-ma-sm"
          />
        </template>
      </VCard>

      <p class="text-black-90 text-subtitle1 text-weight-bold">
        {{ authorizersTableProps.title }}
      </p>
      <VCard>
        <template #content-card>
          <TableList
            :loading="authorizersTableProps.loading"
            :columns="authorizersTableProps.columns"
            :rows="authorizersTableProps.rows"
            :pages="authorizersTableProps.pages"
            :custom-columns="['id']"
            hide-pagination
            :rows-per-page-options="[0]"
            class="q-ma-sm"
          >
            <template #id> 1 </template>
          </TableList>
        </template>
      </VCard>
    </section>
  </div>
</template>
<script setup lang="ts">
//Components
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'

//Interfaces
import { ISecondAuthorizationBasicDataForm } from '@/interfaces/customs/accounts-payable/SecondAuthorization'

//Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/BasicDataForm/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: ISecondAuthorizationBasicDataForm | null
  }>(),
  {}
)

const {
  selectedInstruction,
  instructionsTableProps,
  beneficiariesTableProps,
  authorizersTableProps,
} = useBasicDataForm(props)
</script>
