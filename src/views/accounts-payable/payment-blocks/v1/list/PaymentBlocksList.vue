<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('PaymentBlocksCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />

        <section class="mb-3">
          <TableList
            ref="tableRef"
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="tableProps.customColumns"
            selection="single"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
            @update:selected="handleSelectPaymentBlock"
          >
            <template #actions="{ row }">
              <Button
                v-if="
                  validateRouter('AccountsPayable', 'PaymentBlocksList', 'edit')
                "
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="goToURL('PaymentBlocksEdit', row.id)"
              />

              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'PaymentBlocksList',
                    'delete'
                  )
                "
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openDeleteModal(row.id, 'block')"
              />

              <Button
                v-if="
                  validateRouter('AccountsPayable', 'PaymentBlocksList', 'list')
                "
                :outline="false"
                :left-icon="defaultIconsLucide.briefcase"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Negocios"
                @click="openBusinessesModal(row)"
              />
            </template>
          </TableList>

          <AlertModalComponent
            ref="alertBusinessesModalRef"
            styleModal="min-width: 800px"
            :showImgDefault="false"
            :titleHeader="alertBusinessesModalConfig.titleHeader"
            :show-btn-cancel="false"
            :show-btn-confirm="false"
          >
            <template #default-body>
              <div class="mx-3">
                <FiltersComponentV2
                  v-if="tableBusinessesProps.rows.length > 0"
                  :fields="filterBusinessesConfig"
                  @filter="handleFilterBusinesses"
                  @clear-filters="handleClearFiltersBusinesses"
                />

                <TableList
                  :title="tableBusinessesProps.title"
                  :loading="tableBusinessesProps.loading"
                  :columns="tableBusinessesProps.columns"
                  :rows="tableBusinessesProps.rows"
                  :pages="tableBusinessesProps.pages"
                  :custom-columns="tableBusinessesProps.customColumns"
                  @update-page="updatePageBusinesses"
                  @update-rows-per-page="updatePerPageBusinesses"
                >
                  <template #status_id="{ row }">
                    <ShowStatus :type="Number(row.status_id)" />
                  </template>
                </TableList>
              </div>
            </template>
          </AlertModalComponent>

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
        </section>

        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <section v-if="tabActive === 'conceptos'" class="my-3">
          <div class="flex justify-between mb-3">
            <p class="text-h5">Listado de conceptos de pago</p>

            <Button
              v-if="
                validateRouter('AccountsPayable', 'PaymentBlocksList', 'create')
              "
              label="Asignar"
              size="md"
              unelevated
              :outline="false"
              class="text-capitalize btn-filter"
              color-icon="white"
              :disabled="selectedPaymentBlockIds === 0"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              @click="openConceptModal({} as IPaymentConceptItem, 'create')"
            />
          </div>

          <FiltersComponentV2
            v-if="tableConceptsProps.rows.length > 0"
            :fields="filterConceptConfig"
            @filter="handleFilterConcept"
            @clear-filters="handleClearFiltersConcept"
          />

          <TableList
            ref="tableConceptRef"
            :title="tableConceptsProps.title"
            :loading="tableConceptsProps.loading"
            :columns="tableConceptsProps.columns"
            :rows="tableConceptsProps.rows"
            :pages="tableConceptsProps.pages"
            :custom-columns="tableConceptsProps.customColumns"
            :hide-header="tableConceptsProps.rows.length === 0"
            selection="single"
            @update-page="updatePageConcepts"
            @update-rows-per-page="updatePerPageConcepts"
            @update:selected="handleSelectPaymentConcept"
          >
            <template #actions="{ row }">
              <Button
                v-if="
                  validateRouter('AccountsPayable', 'PaymentBlocksList', 'edit')
                "
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="openConceptModal(row, 'edit')"
              />

              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'PaymentBlocksList',
                    'delete'
                  )
                "
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openDeleteModal(row.payment_concept_id, 'concept')"
              />
            </template>
          </TableList>

          <AlertModalComponent
            ref="alertConceptModalRef"
            :styleModal="
              alertConceptModalConfig.mode == 'edit'
                ? 'min-width: 800px'
                : 'min-width: 1100px'
            "
            :showImgDefault="false"
            :titleHeader="alertConceptModalConfig.titleHeader"
            :textBtnConfirm="alertConceptModalConfig.textBtnConfirm"
            :textBtnCancel="alertConceptModalConfig.textBtnCancel"
            @confirm="handleConceptConfirm()"
          >
            <template #default-body>
              <div v-if="alertConceptModalConfig.mode == 'edit'">
                <PaymentConceptForm
                  ref="paymentConceptFormRef"
                  :data="alertConceptModalConfig.data"
                  @update:data="alertConceptModalConfig.data = $event"
                />
              </div>
              <div v-else class="mx-3">
                <TableList
                  :title="tableAddConceptsProps.title"
                  :loading="tableAddConceptsProps.loading"
                  :columns="tableAddConceptsProps.columns"
                  :rows="tableAddConceptsProps.rows"
                  :custom-columns="tableAddConceptsProps.customColumns"
                  :hide-bottom="tableAddConceptsProps.hideBottom"
                  :hide-pagination="tableAddConceptsProps.hidePagination"
                  @update-page="updatePageConcepts"
                  @update-rows-per-page="updatePerPageConcepts"
                  @update:selected="handleSelectPaymentConcept"
                >
                  <template #custom-header-action>
                    <Button
                      label="Agregar"
                      size="md"
                      unelevated
                      :outline="false"
                      class="text-capitalize btn-filter"
                      color-icon="white"
                      :disabled="selectedPaymentBlockIds === 0"
                      :left-icon="defaultIconsLucide.plusCircleOutline"
                      @click="handleAddConcept"
                    />
                  </template>

                  <template #payment_concept_id="{ row }">
                    <GenericSelectorComponent
                      :default_value="row.payment_concept_id"
                      :manual_option="payment_concept_codes_payment_block"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(val: string) => is_required(val, 'El concepto de pago es obligatorio')]"
                      @update:model-value="changePaymenConcept($event, row)"
                    />
                  </template>

                  <template #payment_concept_name="{ row }">
                    <GenericInputComponent
                      type="text"
                      :default_value="row.payment_concept_name"
                      :required="false"
                      :disabled="true"
                      placeholder="-"
                      @update:model-value=""
                    />
                  </template>

                  <template #obligation_type="{ row }">
                    <GenericInputComponent
                      type="text"
                      :default_value="row.obligation_type"
                      :required="false"
                      :disabled="true"
                      placeholder="-"
                      @update:model-value=""
                    />
                  </template>

                  <template #from_budget_item_id="{ row }">
                    <GenericSelectorComponent
                      :default_value="row.from_budget_item_id"
                      :manual_option="budget_item_codes_payment_block"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(val: string) => is_required(val, 'El rubro es obligatorio')]"
                      @update:model-value="changeFromBudgetItem($event, row)"
                    />
                  </template>

                  <template #to_budget_item_id="{ row }">
                    <GenericSelectorComponent
                      :default_value="row.to_budget_item_id"
                      :manual_option="budget_item_codes_payment_block"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(val: string) => is_required(val, 'El rubro es obligatorio')]"
                      @update:model-value="changeToBudgetItem($event, row)"
                    />
                  </template>

                  <template #from_budget_resource_id="{ row }">
                    <GenericSelectorComponent
                      :default_value="row.from_budget_resource_id"
                      :manual_option="budget_resource_codes"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(val: string) => is_required(val, 'El recurso es obligatorio')]"
                      @update:model-value="
                        changeFromBudgetResource($event, row)
                      "
                    />
                  </template>

                  <template #to_budget_resource_id="{ row }">
                    <GenericSelectorComponent
                      :default_value="row.to_budget_resource_id"
                      :manual_option="budget_resource_codes"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(val: string) => is_required(val, 'El recurso es obligatorio')]"
                      @update:model-value="changeToBudgetResource($event, row)"
                    />
                  </template>

                  <template #actions="{ index }">
                    <Button
                      :outline="false"
                      :left-icon="defaultIconsLucide.trash"
                      color="orange"
                      :flat="true"
                      :class-custom="'custom'"
                      tooltip="Eliminar"
                      @click="handleRemoveConcept(index)"
                    />
                  </template>
                </TableList>
              </div>
            </template>
          </AlertModalComponent>
        </section>

        <section v-if="tabActive === 'conceptos'" class="mb-3">
          <TableList
            ref="tableSettlementConceptsRef"
            :title="tableSettlementConceptsProps.title"
            :loading="tableSettlementConceptsProps.loading"
            :columns="tableSettlementConceptsProps.columns"
            :rows="paginatedRowsSettlement"
            :custom-columns="tableSettlementConceptsProps.customColumns"
            :pages="tableSettlementConceptsProps.pages"
            :hide-pagination="tableSettlementConceptsProps.hidePagination"
            :hide-header="tableSettlementConceptsProps.rows.length === 0"
            @update-page="updatePageSettlement"
            @update-rows-per-page="updatePerPageSettlement"
          >
            <template #custom-header-action>
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'PaymentBlocksList',
                    'create'
                  )
                "
                label="Asignar"
                size="md"
                unelevated
                :outline="false"
                class="text-capitalize btn-filter"
                color-icon="white"
                :disabled="
                  selectedPaymentBlockIds === 0 ||
                  selectedPaymentConceptIds === 0
                "
                :left-icon="defaultIconsLucide.plusCircleOutline"
                @click="
                  openSettlementModal({} as ISettlementConcepts, 'create')
                "
              />
            </template>

            <template #is_main_concept="{ row }">
              <Icon
                v-if="row.is_main_concept"
                name="CheckCircle2"
                :size="20"
                color="orange"
              />
              <Icon v-else name="XCircle" :size="20" color="grey" />
            </template>

            <template #actions="{ row }">
              <Button
                v-if="
                  validateRouter('AccountsPayable', 'PaymentBlocksList', 'edit')
                "
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="openSettlementModal(row, 'edit')"
              />

              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'PaymentBlocksList',
                    'delete'
                  )
                "
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openDeleteModal(row.id, 'settlement')"
              />
            </template>
          </TableList>

          <AlertModalComponent
            ref="alertSettlementModalRef"
            :styleModal="
              alertSettlementModalConfig.mode == 'edit'
                ? 'min-width: 400px'
                : 'min-width: 1100px'
            "
            :showImgDefault="false"
            :titleHeader="alertSettlementModalConfig.titleHeader"
            :textBtnConfirm="alertSettlementModalConfig.textBtnConfirm"
            :textBtnCancel="alertSettlementModalConfig.textBtnCancel"
            @confirm="handleSettlementConfirm()"
          >
            <template #default-body>
              <div v-if="alertSettlementModalConfig.mode == 'edit'">
                <SettlementConceptForm
                  ref="settlementConceptFormRef"
                  :data="alertSettlementModalConfig.data"
                  @update:data="alertSettlementModalConfig.data = $event"
                />
              </div>
              <div v-else class="mx-3">
                <TableList
                  :title="tableAddSettlementConceptsProps.title"
                  :loading="tableAddSettlementConceptsProps.loading"
                  :columns="tableAddSettlementConceptsProps.columns"
                  :rows="tableAddSettlementConceptsProps.rows"
                  :custom-columns="
                    tableAddSettlementConceptsProps.customColumns
                  "
                  :hide-bottom="tableAddSettlementConceptsProps.hideBottom"
                  :hide-pagination="
                    tableAddSettlementConceptsProps.hidePagination
                  "
                >
                  <template #custom-header-action>
                    <Button
                      label="Agregar"
                      size="md"
                      unelevated
                      :outline="false"
                      class="text-capitalize btn-filter"
                      color-icon="white"
                      :disabled="selectedPaymentConceptIds === 0"
                      :left-icon="defaultIconsLucide.plusCircleOutline"
                      @click="handleAddSettlement"
                    />
                  </template>

                  <template #settlement_concept_id="{ row }">
                    <GenericSelectorComponent
                      :default_value="row.settlement_concept_id"
                      :manual_option="settlement_concept"
                      :auto_complete="true"
                      :required="true"
                      :map_options="true"
                      :rules="[(val: string) => is_required(val, 'El concepto de liquidación es obligatorio')]"
                      @update:model-value="changeSettlementConcept($event, row)"
                    />
                  </template>

                  <template #settlement_concept_name="{ row }">
                    <GenericInputComponent
                      type="text"
                      :default_value="row.settlement_concept_name"
                      :required="false"
                      :disabled="true"
                      placeholder="-"
                      @update:model-value=""
                    />
                  </template>

                  <template #is_main_concept="{ row }">
                    <div class="flex justify-center">
                      <RadioYesNo
                        v-model="row.is_main_concept"
                        :isDisabled="false"
                        :isRadioButton="false"
                        :hasTitle="false"
                        :hasSubtitle="false"
                      />
                    </div>
                  </template>

                  <template #actions="{ index }">
                    <Button
                      :outline="false"
                      :left-icon="defaultIconsLucide.trash"
                      color="orange"
                      :flat="true"
                      :class-custom="'custom'"
                      tooltip="Eliminar"
                      @click="handleRemoveSettlement(index)"
                    />
                  </template>
                </TableList>
              </div>
            </template>
          </AlertModalComponent>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import PaymentConceptForm from '@/components/Forms/AccountsPayable/PaymentBlocks/PaymentConceptEdit/PaymentConceptForm.vue'
import SettlementConceptForm from '@/components/Forms/AccountsPayable/PaymentBlocks/SettlementConceptEdit/SettlementConceptForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// logic view
import usePaymentBlocksList from '@/views/accounts-payable/payment-blocks/v1/list/PaymentBlocksList'
import {
  IPaymentConceptItem,
  ISettlementConcepts,
} from '@/interfaces/customs/accounts-payable/PaymentBlocks'

const {
  // configs
  headerProps,
  filterConfig,
  tableProps,
  alertModalConfig,
  tableConceptsProps,
  tableSettlementConceptsProps,
  alertConceptModalConfig,
  tableAddConceptsProps,
  alertSettlementModalConfig,
  tableAddSettlementConceptsProps,
  tabs,
  tabActive,
  tabActiveIdx,
  filterConceptConfig,
  alertBusinessesModalConfig,
  tableBusinessesProps,
  filterBusinessesConfig,

  // selects
  payment_concept_codes_payment_block,
  budget_item_codes_payment_block,
  budget_resource_codes,
  settlement_concept,

  // refs
  paymentConceptFormRef,
  settlementConceptFormRef,
  alertModalRef,
  tableRef,
  tableConceptRef,
  tableSettlementConceptsRef,
  alertConceptModalRef,
  selectedPaymentBlockIds,
  alertSettlementModalRef,
  selectedPaymentConceptIds,
  paginatedRowsSettlement,
  alertBusinessesModalRef,

  // utils
  defaultIconsLucide,

  // rules
  is_required,

  // methods
  handleRemoveSettlement,
  handleFilter,
  handleClearFilters,
  openDeleteModal,
  goToURL,
  updatePage,
  updatePerPage,
  validateRouter,
  handleDelete,
  handleSelectPaymentBlock,
  updatePageConcepts,
  updatePerPageConcepts,
  handleSelectPaymentConcept,
  openConceptModal,
  handleConceptConfirm,
  handleAddConcept,
  handleRemoveConcept,
  changePaymenConcept,
  openSettlementModal,
  handleAddSettlement,
  changeSettlementConcept,
  handleSettlementConfirm,
  changeFromBudgetItem,
  changeToBudgetItem,
  changeFromBudgetResource,
  changeToBudgetResource,
  updatePageSettlement,
  updatePerPageSettlement,
  handleFilterConcept,
  handleClearFiltersConcept,
  openBusinessesModal,
  handleFilterBusinesses,
  handleClearFiltersBusinesses,
  updatePageBusinesses,
  updatePerPageBusinesses,
} = usePaymentBlocksList()
</script>
