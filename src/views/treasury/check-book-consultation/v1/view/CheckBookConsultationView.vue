<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'CheckbookConsultationList' })"
    >
      <section class="q-my-md q-pl-lg">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <p class="text-subtitle2 text-bold q-mb-xs">Negocio</p>
            <div>{{ checkbookRaw?.business_name || '-' }}</div>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-subtitle2 text-bold q-mb-xs">Banco</p>
            <div>{{ checkbookRaw?.bank_name || '-' }}</div>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-subtitle2 text-bold q-mb-xs">Cuenta bancaria</p>
            <div>{{ checkbookRaw?.bank_account_name || '-' }}</div>
          </div>
        </div>

        <TableList
          title="Listado de historial de cheques constituidos"
          :columns="columns"
          :rows="checkbookRaw?.history ?? []"
          :custom-columns="['status']"
          :loading="false"
          :hide-bottom="true"
          :wrap-cells="true"
        >
          <template #status="{ row }">
            <div
              class="bg-orange-1 text-orange text-caption q-px-sm q-py-xs rounded-borders"
              style="display: inline-block; font-weight: 500"
            >
              {{ row.status?.name || '-' }}
            </div>
          </template>
        </TableList>

        <div class="row q-mt-lg">
          <div class="col-12 flex justify-end">
            <Button
              label="Finalizar"
              :outline="false"
              color="orange"
              size="md"
              :classCustom="'text-capitalize btn-filter custom'"
              @click="$router.push({ name: 'CheckbookConsultationList' })"
            />
          </div>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import useCheckbookView from './CheckBookConsultationView'

const { headerProps, checkbookRaw, columns } = useCheckbookView()
</script>
