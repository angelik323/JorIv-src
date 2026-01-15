<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'DispersionGroupList' })"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <DispersionGroupInfo :action="'view'" />
          </template>
        </VCard>
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'nit', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              @click="onDdownloadExcel"
              :left-img="imgButtonHeaderTable"
              :disabled="tableProps.rows.length === 0"
            />
          </template>
        </TableList>
        <section class="mx-4 mb-4">
          <q-separator class="q-mb-md" />

          <div class="row justify-end q-gutter-md">
            <Button
              label="Finalizar"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onClose"
            />
          </div>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import DispersionGroupInfo from '@/components/Forms/Treasury/DispersionGroup/information/DispersionGroupInfo.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useDispersionGroupView from '@/views/treasury/dispersion-group/v1/view/DispersionGroupView'

// Utils
import imgButtonHeaderTable from '@/assets/images/excel.svg'

const {
  headerProps,
  tableProps,
  onDdownloadExcel,
  updatePerPage,
  updatePage,
  onClose,
} = useDispersionGroupView()
</script>
