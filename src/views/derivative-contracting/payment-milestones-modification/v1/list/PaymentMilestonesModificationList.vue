<template>
  <div class="q-mx-xl">
    <ContentComponent
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @to="goToURL('PaymentMilestonesModificationEdit')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2 
        :fields="filterConfig" 
        @filter="handleFilter" 
        @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-md">
        <TableList
          :title="registeredContractsAddendaTable.title"
          :loading="registeredContractsAddendaTable.loading"
          :columns="registeredContractsAddendaTable.columns"
          :rows="registeredContractsAddendaTable.rows"
          :pages="registeredContractsAddendaTable.pages"
          :custom-columns="['status', 'select']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          :no-data-label="'Haga clic en Buscar para ver contratos y adiciones registrados'"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="row.status.id === StatusID.ACTIVE"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="
                validateRouter(
                  'DerivativeContracting',
                  'TypesConfigurationPaymentList',
                  'edit'
                )
                  ? openAlertModal(
                      row.contract.status_id === StatusID.ACTIVE
                        ? 'inactivar'
                        : 'activar',
                      row.id
                    )
                  : null
              "
            />
          </template>

          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                size="sm"
                :val="row"
                color="orange"
                v-model="contractsAddendaSelected"
                @click="handleContractAddendaSelected(row)"
              />
            </div>
          </template>
        </TableList>
      </section>

      <section>
        <TableList
          :title="paymentMilestonesTable.title"
          :loading="paymentMilestonesTable.loading"
          :columns="paymentMilestonesTable.columns"
          :rows="paymentMilestonesTable.rows"
          :pages="paymentMilestonesTable.pages"
          :custom-columns="['actions', 'applies_budget']"
          @update-page="updatePage2"
          @update-rows-per-page="updatePerPage2"
        >
          <template #applies_budget="{ row }">
            <RadioYesNo
              :model-value="row.applies_budget == 1"
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
                  'TypesConfigurationPaymentList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="handleEdit(row)"
            />
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'TypesConfigurationPaymentList',
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
              @click="handleView(row)"
            />
          </template>
        </TableList>
      </section>

      <section v-if="contractsAddendaSelected">
        <div class="container-login-title text-left">
          <p
            class="text-weight-medium text-left q-px-md"
            :class="$q.screen.width <= 607 ? 'text-h5' : 'text-h6'"
          >
            Total programación
          </p>
        </div>
        <q-form ref="formElementRef">
          <section class="q-mt-md">
            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-6 col-md-3">
                <InputMoneyComponent
                  label="Monto extranjero"
                  :model-value="foreignAmountTotal ? String(foreignAmountTotal) : ''"
                  :default_value="foreignAmountTotal"
                  placeholder="Inserte"
                  required
                  :disabled="true"
                  :rules="[
                        (val: string) => useRules().is_required(val, 'El código es requerido'),
                        ]"
                  :hide_symbol="true"
                />
              </div>
              <div class="col-6 col-md-3">
                <InputMoneyComponent
                  label="Monto local"
                  :model-value="localAmountTotal ? String(localAmountTotal) : ''"
                  placeholder="Inserte"
                  required
                  :disabled="true"
                />
              </div>
            </div>
          </section>
        </q-form>
      </section>

      <section v-if="contractsAddendaSelected">
        <div class="container-login-title text-left">
          <p
            class="text-weight-medium text-left q-px-md"
            :class="$q.screen.width <= 607 ? 'text-h5' : 'text-h6'"
          >
            Total hitos de pago sin pagos realizados
          </p>
        </div>
        <q-form ref="formElementRef">
          <section class="q-mt-md">
            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-6 col-md-3">
                <InputMoneyComponent
                  label="Monto extranjero"
                  :model-value="foreignAmountTotal ? String(foreignAmountTotal) : ''"
                  placeholder="Inserte"
                  required
                  :disabled="true"
                  default_value="0"
                  :hide_symbol="true"
                />
              </div>
              <div class="col-6 col-md-3">
                <InputMoneyComponent
                  label="Monto local"
                  :model-value="localAmountTotal ? String(localAmountTotal) : ''"
                  placeholder="Inserte"
                  required
                  :disabled="true"
                  default_value="0"
                />
              </div>
            </div>
          </section>
        </q-form>
      </section>

      <AlertModalComponent
        ref="alertModalDeleteRef"
        :title="alertModalConfig.title"
        @confirm="deleteAction"
      >
      </AlertModalComponent>

      <AlertModalComponent
        ref="alertModalStatusRef"
        :title="alertModalConfig.title"
        @confirm="changeStatusAction"
      >
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Interfaces
import { StatusID } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

//logic
import usePaymentMilestonesModification from '@/views/derivative-contracting/payment-milestones-modification/v1/list/PaymentMilestonesModificationList'

const {
  localAmountTotal,
  foreignAmountTotal,
  handleContractAddendaSelected,

  headerProps,
  filterConfig,
  handleFilter,
  handleEdit,
  handleView,
  handleClear,
  defaultIconsLucide,
  goToURL,
  updatePage,
  updatePerPage,
  updatePage2,
  updatePerPage2,

  contractsAddendaSelected,
  registeredContractsAddendaTable,
  paymentMilestonesTable,
  alertModalConfig,
  openAlertModal,
  changeStatusAction,
  deleteAction,
  validateRouter,
} = usePaymentMilestonesModification()
</script>
