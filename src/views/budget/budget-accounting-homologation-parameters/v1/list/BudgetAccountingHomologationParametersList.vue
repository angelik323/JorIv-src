<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-lg">
        <TableList
          :loading="budgetStructureTableProperties.loading"
          :columns="budgetStructureTableProperties.columns"
          :rows="budgetStructureTableProperties.rows"
          :pages="budgetStructureTableProperties.pages"
          :custom-columns="['radio']"
        >
          <template #custom-header>
            <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
              {{ budgetStructureTableProperties.title }}
            </p>
          </template>
          <template #radio="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.selected"
              :options="[{ label: '', value: true }]"
              @update:model-value=""
            />
          </template>
        </TableList>
      </section>
      <section class="q-mt-md">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-md">
          {{ businessTableProperties.title }}
        </p>
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter=""
          @clear-filters=""
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :loading="businessTableProperties.loading"
          :columns="businessTableProperties.columns"
          :rows="businessTableProperties.rows"
          :pages="businessTableProperties.pages"
          :custom-columns="['status', 'actions']"
        >
          <template #radio="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.selected"
              :options="[{ label: '', value: true }]"
              @update:model-value=""
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('', row.id)"
            />
          </template>
        </TableList>
      </section>
      <section class="q-mt-xl">
        <TableList
          :loading="accountingBudgetTableProperties.loading"
          :columns="accountingBudgetTableProperties.columns"
          :rows="accountingBudgetTableProperties.rows"
          :pages="accountingBudgetTableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updateAccountingBudgetPage"
          @update-rows-per-page="updateAccountingBudgetRowsPerPage"
        >
          <template #custom-header>
            <div class="row justify-between full-width">
              <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
                {{ accountingBudgetTableProperties.title }}
              </p>
              <div class="row q-gutter-md">
                <Button
                  v-if="
                    validateRouter(
                      'Budget',
                      'BudgetAccountingHomologationParametersList',
                      'create'
                    )
                  "
                  :outline="false"
                  label="Crear"
                  left-icon="PlusCircle"
                  color-icon="white"
                  :styleContent="{
                    'place-items': 'center',
                    'border-radius': '20px',
                    'font-size': '13px',
                  }"
                  @click="
                    goToURL('AccountingBudgetHomologationParametersCreate')
                  "
                />
                <Button
                  v-if="
                    validateRouter(
                      'Budget',
                      'BudgetAccountingHomologationParametersList',
                      'export'
                    )
                  "
                  class-custom="custom"
                  label="Descargar excel"
                  color="orange"
                  outline
                  :styleContent="{
                    'place-items': 'center',
                    color: 'black',
                  }"
                  :left-img="imgButtonHeaderTable"
                  @click="downloadAccountingBudgetParameters"
                />
              </div>
            </div>
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'Budget',
                  'BudgetAccountingHomologationParametersList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                goToURL('AccountingBudgetHomologationParametersEdit', row.id)
              "
            />
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'Budget',
                  'BudgetAccountingHomologationParametersList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL('AccountingBudgetHomologationParametersView', row.id)
              "
            />
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'Budget',
                  'BudgetAccountingHomologationParametersList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openDeleteAccountingBudgetParameterModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <section class="q-mt-xl">
        <TableList
          :loading="budgetAccountingTableProperties.loading"
          :columns="budgetAccountingTableProperties.columns"
          :rows="budgetAccountingTableProperties.rows"
          :pages="budgetAccountingTableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updateBudgetAccountingPage"
          @update-rows-per-page="updateBudgetAccountingRowsPerPage"
        >
          <template #custom-header>
            <div class="row justify-between full-width">
              <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
                {{ budgetAccountingTableProperties.title }}
              </p>
              <div class="row q-gutter-md">
                <Button
                  v-if="
                    validateRouter(
                      'Budget',
                      'BudgetAccountingHomologationParametersList',
                      'create'
                    )
                  "
                  :outline="false"
                  label="Crear"
                  left-icon="PlusCircle"
                  color-icon="white"
                  :styleContent="{
                    'place-items': 'center',
                    'border-radius': '20px',
                    'font-size': '13px',
                  }"
                  @click="
                    goToURL('BudgetAccountingHomologationParametersCreate')
                  "
                />
                <Button
                  v-if="
                    validateRouter(
                      'Budget',
                      'BudgetAccountingHomologationParametersList',
                      'export'
                    )
                  "
                  class-custom="custom"
                  label="Descargar excel"
                  color="orange"
                  outline
                  :styleContent="{
                    'place-items': 'center',
                    color: 'black',
                  }"
                  :left-img="imgButtonHeaderTable"
                  @click="downloadBudgetAccountingParameters"
                />
              </div>
            </div>
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'Budget',
                  'BudgetAccountingHomologationParametersList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                goToURL('BudgetAccountingHomologationParametersEdit', row.id)
              "
            />
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'Budget',
                  'BudgetAccountingHomologationParametersList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL('BudgetAccountingHomologationParametersView', row.id)
              "
            />
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'Budget',
                  'BudgetAccountingHomologationParametersList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openDeleteBudgetAccountingParameterModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <AlertModalComponent
        ref="deleteAccountingBudgetParameterModalRef"
        styleModal="min-width: 480px"
        :title="`¿Desea eliminar parámetros homologación contabilidad a presupuesto?`"
        @confirm="deleteAccountingBudgetParameter"
      >
      </AlertModalComponent>
      <AlertModalComponent
        ref="deleteBudgetAccountingParameterModalRef"
        styleModal="min-width: 480px"
        :title="`¿Desea eliminar parámetros homologación presupuesto a contabilidad?`"
        @confirm="deleteBudgetAccountingParameter"
      >
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Logic view
import useBudgetAccountingHomologationParametersList from '@/views/budget/budget-accounting-homologation-parameters/v1/list/BudgetAccountingHomologationParametersList'

const {
  headerProps,
  filterConfig,
  defaultIconsLucide,
  businessTableProperties,
  budgetStructureTableProperties,
  accountingBudgetTableProperties,
  budgetAccountingTableProperties,
  deleteAccountingBudgetParameterModalRef,
  deleteBudgetAccountingParameterModalRef,
  goToURL,
  validateRouter,
  updateAccountingBudgetPage,
  updateBudgetAccountingPage,
  deleteAccountingBudgetParameter,
  deleteBudgetAccountingParameter,
  updateAccountingBudgetRowsPerPage,
  updateBudgetAccountingRowsPerPage,
  downloadAccountingBudgetParameters,
  downloadBudgetAccountingParameters,
  openDeleteAccountingBudgetParameterModal,
  openDeleteBudgetAccountingParameterModal,
} = useBudgetAccountingHomologationParametersList()
</script>
