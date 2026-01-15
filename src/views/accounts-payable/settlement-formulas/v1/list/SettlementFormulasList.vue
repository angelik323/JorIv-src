<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('AccountsPayable', 'SettlementFormulasList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('SettlementFormulasCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
        <NoDataState
          v-if="isSettlementFormulasListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="[
              'applies_withholding_tax',
              'applies_vat',
              'applies_vat_withholding',
              'applies_ica_withholding',
              'applies_territorial_taxes',
              'actions',
            ]"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          >
            <template
              v-for="col in [
                'applies_withholding_tax',
                'applies_vat',
                'applies_vat_withholding',
                'applies_ica_withholding',
                'applies_territorial_taxes',
              ]"
              #[col]="{ row }"
              :key="col"
            >
              <Icon
                v-if="row[col]"
                name="CheckCircle2"
                :size="20"
                color="orange"
              />
              <Icon v-else name="XCircle" :size="20" color="grey" />
            </template>

            <template #actions="{ row }">
              <!-- Editar -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'SettlementFormulasList',
                    'edit'
                  )
                "
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="goToURL('SettlementFormulasEdit', row.id)"
              />
              <!-- Eliminar -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'SettlementFormulasList',
                    'delete'
                  )
                "
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openAlertModal(row)"
              />
            </template>
          </TableList>
        </section>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleDelete()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'

//Logic
import useSettlementFormulasList from '@/views/accounts-payable/settlement-formulas/v1/list/SettlementFormulasList'

const {
  defaultIconsLucide,
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isSettlementFormulasListEmpty,
  alertModalRef,
  alertModalConfig,
  handleFilter,
  handleClearFilters,
  openAlertModal,
  handleDelete,
  updatePage,
  updateRowsPerPage,
  goToURL,
  validateRouter,
} = useSettlementFormulasList()
</script>
