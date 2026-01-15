<template>
  <section class="q-mt-xl q-mx-sm">
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['actions', 'select']"
      @update-page="updatePage"
      @update-rows-per-page="updatePerPage"
    >
      <template #custom-header>
        <div
          class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
        >
          <span class="text-subtitle1 text-weight-bold">
            {{ tableProps.title }}
          </span>
          <Button
            :outline="false"
            :label="'Crear'"
            :class-custom="'items-center'"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color-icon="white"
            :style-content="{ 'align-items': 'center' }"
            @click="openModalAccountingBlock('create', null)"
          />
        </div>
      </template>

      <template #select="{ row }">
        <div class="px-1 flex justify-center">
          <q-radio
            dense
            size="sm"
            v-model="accountingBlockSelected"
            :val="row"
            color="orange"
          />
        </div>
      </template>

      <template #actions="{ row }">
        <Button
          :disable="!row.can_edit"
          :left-icon="defaultIconsLucide.edit"
          color="primary"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          :color-icon="!row.can_edit ? 'gray' : '#f45100'"
          :tooltip="!row.can_edit ? 'Desactivado' : 'Editar'"
          @click="openModalAccountingBlock('edit', row.id)"
        />
      </template>
    </TableList>

    <ModalAccountingBlock
      :title="titleModalAccountingBlock"
      classTitle="text-h6 text-weight-bold q-pa-md"
      :openDialog="showModalAccountingBlock"
      :minWidth="$q.screen.width <= 607 ? '100%' : '70%'"
      @update:openDialog="closeModalAccountingBlock()"
    >
      <template #content-modal>
        <AccountingBlockForm
          v-if="showModalAccountingBlock"
          :action="actionModal"
          @close-modal="closeModalAccountingBlock()"
          @update-fetch-table="listAction()"
        />
      </template>
    </ModalAccountingBlock>
  </section>
</template>

<script setup lang="ts">
// Components
import AccountingBlockForm from '@/components/Forms/Fics/AccountingParameters/AccountingBlock/AccountingBlockForm.vue'
import ModalAccountingBlock from '@/components/common/Modal/ModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useAccountingBlockList from '@/components/Lists/Fics/AccountingParameters/AccountingBlock/AccountingBlockList'

const {
  tableProps,
  updatePage,
  updatePerPage,
  defaultIconsLucide,
  accountingBlockSelected,
  titleModalAccountingBlock,
  actionModal,
  openModalAccountingBlock,
  showModalAccountingBlock,
  closeModalAccountingBlock,
  listAction,
} = useAccountingBlockList()
</script>
