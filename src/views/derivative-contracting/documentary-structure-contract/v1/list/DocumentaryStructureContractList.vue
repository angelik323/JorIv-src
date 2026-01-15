<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'DerivativeContracting',
          'TypesContractingDocumentsList',
          'create'
        )
          ? headerProps.btnLabel
          : undefined
      "
      :btn-icon="headerProps.btnIcon"
      :btn-color="headerProps.btnColor"
      :btn-text-color="headerProps.btnTextColor"
      :indentation="headerProps.indentation"
      :content-indentation="headerProps.contentIndentation"
      @to="$router.push({ name: 'DocumentaryStructureContractCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleFilterClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="[
            'selected',
            'handle_stamp_duty',
            'requires_publication',
            'policy_management',
            'actions',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #selected="{ row }">
            <RadioYesNo
              v-model="selectedDocument"
              :options="[{ label: '', value: row.id }]"
              @update:model-value="handleSelectionChange(row.id)"
            />
          </template>

          <template #handle_stamp_duty="{ row }">
            <RadioYesNo
              v-model="row.handle_stamp_duty"
              :isRadioButton="false"
              :isDisabled="true"
              :customClass="'flex justify-center'"
            />
          </template>

          <template #requires_publication="{ row }">
            <RadioYesNo
              v-model="row.requires_publication"
              :isRadioButton="false"
              :isDisabled="true"
              :customClass="'flex justify-center'"
            />
          </template>

          <template #policy_management="{ row }">
            <RadioYesNo
              v-model="row.policy_management"
              :isRadioButton="false"
              :isDisabled="true"
              :customClass="'flex justify-center'"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'DocumentaryStructureContractList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="primary"
              :class-custom="'custom'"
              :flat="true"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'DocumentaryStructureContractEdit',
                  params: { id: row.id },
                })
              "
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'DocumentaryStructureContractList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="negative"
              :class-custom="'custom'"
              :flat="true"
              :outline="false"
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
        />
      </section>

      <section class="q-mt-xl" v-if="tableProps.rows.length > 0">
        <TableList
          :title="annexedTableProps.title"
          :loading="annexedTableProps.loading"
          :columns="annexedTableProps.columns"
          :rows="annexedTableProps.rows"
          :pages="annexedTableProps.pages"
          :custom-columns="['status_id']"
          @update-page="updateAnnexedPage"
          @update-rows-per-page="updateAnnexedPerPage"
        >
          <template #status_id="{ row }">
            <div class="flex justify-center">
              <CustomToggle
                v-if="
                  validateRouter(
                    'DerivativeContracting',
                    'DocumentaryStructureContractList',
                    'edit'
                  )
                "
                :value="row.status_id === StatusID.ACTIVE"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="
                  openAnnexedAlertModal(
                    row.status_id === StatusID.ACTIVE ? 'inactivar' : 'activar',
                    row.id
                  )
                "
              />
            </div>
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalAnnexedDocumentRef"
          :title="alertModalAnnexedDocumentConfig.title"
          @confirm="changeStatusAnnexedDocumentAction()"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useDocumentaryStructureContractList from '@/views/derivative-contracting/documentary-structure-contract/v1/list/DocumentaryStructureContractList'

const {
  defaultIconsLucide,
  headerProps,
  tableProps,
  annexedTableProps,
  filterConfig,
  alertModalRef,
  alertModalConfig,
  alertModalAnnexedDocumentRef,
  alertModalAnnexedDocumentConfig,
  selectedDocument,
  StatusID,

  handleFilter,
  handleFilterClear,
  updatePage,
  updatePerPage,
  updateAnnexedPage,
  updateAnnexedPerPage,
  deleteAction,
  changeStatusAnnexedDocumentAction,
  openAlertModal,
  openAnnexedAlertModal,
  handleSelectionChange,
  validateRouter,
} = useDocumentaryStructureContractList()
</script>
