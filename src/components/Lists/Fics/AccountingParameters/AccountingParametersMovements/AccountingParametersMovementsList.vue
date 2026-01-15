<template>
  <section class="q-mt-xl q-mx-sm">
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['actions']"
      :custom-no-data-message-title="tableProps.customNoDataMessageTitle"
      :custom-no-data-message-subtitle="tableProps.customNoDataMessageSubtitle"
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
            :disable="!accounting_block_selected"
            :outline="false"
            :label="'Crear'"
            :class-custom="'items-center'"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color-icon="white"
            :style-content="{ 'align-items': 'center' }"
            @click="
              $router.push({ name: 'AccountingParametersMovementsCreate' })
            "
          />
        </div>
      </template>

      <template #actions="{ row }">
        <Button
          :left-icon="defaultIconsLucide.copy"
          color="primary"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Copiar'"
          @click="
            $router.push({
              name: 'AccountingParametersMovementsCopy',
              params: { id: row.id },
            })
          "
        />

        <Button
          :left-icon="defaultIconsLucide.edit"
          color="primary"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Editar'"
          @click="
            $router.push({
              name: 'AccountingParametersMovementsEdit',
              params: { id: row.id },
            })
          "
        />

        <Button
          :left-icon="defaultIconsLucide.trash"
          color="negative"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Eliminar'"
          @click="openAlertModal('eliminar', row.id)"
        />
      </template>
    </TableList>

    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      @confirm="deleteAction"
    >
    </AlertModalComponent>
  </section>
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useAccountingParametersMovementsList from '@/components/Lists/Fics/AccountingParameters/AccountingParametersMovements/AccountingParametersMovementsList'

const {
  tableProps,
  updatePage,
  updatePerPage,
  defaultIconsLucide,
  alertModalRef,
  alertModalConfig,
  openAlertModal,
  deleteAction,
  accounting_block_selected,
} = useAccountingParametersMovementsList()
</script>
