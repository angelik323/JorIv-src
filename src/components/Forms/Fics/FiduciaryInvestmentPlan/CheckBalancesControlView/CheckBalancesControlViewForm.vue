<template>
  <q-form ref="formInformation">
    <VCard>
      <template #content-card>
        <section v-if="['view'].includes(action)">
          <div class="mx-3 mt-1 mb-3">
            <p class="text-weight-bold text-black-90 size-18">Datos básicos</p>
            <div class="row q-col-gutter-x-sm q-col-gutter-y-md mt-1">
              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Fondo de inversión</p>
                  <p class="text-weight-medium no-margin">
                    {{ models.fund_code ? models.fund_code : 'No registrado' }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Descripción de fondo</p>
                  <p class="text-weight-medium no-margin">
                    {{ models.fund_name ? models.fund_name : 'No registrado' }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Negocio</p>
                  <p class="text-weight-medium no-margin">
                    {{ models.business ? models.business : 'No registrado' }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Plan de inversión</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.fiduciary_investment_plan
                        ? models.fiduciary_investment_plan
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Nombre titular</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.account_holder_name
                        ? models.account_holder_name
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Tipo de participación
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.participation_type
                        ? models.participation_type
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </VCard>
    <VCard>
      <template #content-card>
        <section>
          <div class="mx-3 mt-1 mb-3">
            <div class="row q-col-gutter-x-sm q-col-gutter-y-md mt-1">
              <div class="col-12 col-md-4">
                <GenericDateInputComponent
                  label="Fecha de consulta"
                  :default_value="models.last_closing_date"
                  required
                  :mask="'YYYY-MM-DD'"
                  placeholder="AAAA-MM-DD"
                  :rules="[]"
                  @update:model-value="models.last_closing_date = $event"
                />
              </div>
            </div>
          </div>
        </section>
        <q-separator class="my-20" />
        <section>
          <div class="mx-3 mt-2 mb-3">
            <div class="row center">
              <p class="text-weight-bold text-black-90 size-18">
                Listado de aportes
              </p>
              <Button
                :outline="true"
                label="Descargar excel"
                :leftImg="excelIcon"
                tooltip="Descargar excel"
                @click="exportExcel"
                :disabled="check_balances_control_table_by_date.length === 0"
              />
            </div>
            <div>
              <TableList
                :loading="tableDetailsProps.loading"
                :columns="tableDetailsProps.columns"
                :rows="tableDetailsProps.rows"
                :hidePagination="true"
                selection="single"
                @selected="handleSelectionDetail"
                row-key="operation_id"
              />
            </div>
            <div class="row q-col-gutter-x-sm q-col-gutter-y-md mt-1">
              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Saldo del aporte</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.operation_value != null
                        ? formatCurrencyString(models.operation_value)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Saldo canje</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.clearing_balance != null
                        ? formatCurrencyString(models.clearing_balance)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Saldo congelado</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.freeze_balance != null
                        ? formatCurrencyString(models.freeze_balance)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Disponible sin deducción
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.available_balance != null
                        ? formatCurrencyString(models.available_balance)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Rendimientos</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.returns != null
                        ? formatCurrencyString(models.returns)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="mx-3 mt-2 mb-3 row end">
          <Button
            :outline="false"
            color="orange"
            class="btn-filter flex custom text-white"
            @click="openAlertModal"
            label="Ver rendimiento por base"
            :right-icon="'ChevronRight'"
            color-icon="white"
            :styleContent="{
              'font-size': '13px',
            }"
          />
        </section>
      </template>
    </VCard>
    <VCard>
      <template #content-card>
        <section>
          <div class="mx-3 mt-2 mb-3">
            <p class="text-weight-bold text-black-90 size-18">
              Deducción e impuestos
            </p>
            <div class="row q-col-gutter-x-sm q-col-gutter-y-md mt-1">
              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">GMF</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.gmf != null
                        ? formatCurrencyString(models.gmf)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Retención en la fuente
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.retention != null
                        ? formatCurrencyString(models.retention)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Penalización</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.penalty != null
                        ? formatCurrencyString(models.penalty)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Neto con impuesto</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.net_with_tax != null
                        ? formatCurrencyString(models.net_with_tax)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Neto sin impuesto</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.net_without_tax != null
                        ? formatCurrencyString(models.net_without_tax)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section v-if="['view'].includes(action)">
          <div class="mx-3 mt-2 mb-3">
            <div class="row end q-col-gutter-x-sm q-col-gutter-y-md mt-1">
              <div class="col-12 col-md-4">
                <Button
                  :outline="false"
                  color="orange"
                  class="btn-filter flex custom text-white"
                  @click="handleGoMovements"
                  label="Movimientos por plan de inversión"
                  classCustom="full-width"
                  :right-icon="'ChevronRight'"
                  color-icon="white"
                  :styleContent="{
                    'font-size': '13px',
                  }"
                />
              </div>
            </div>
          </div>
        </section>
        <q-separator class="my-20" />

        <section v-if="['view'].includes(action)">
          <div class="mx-3 mt-2 mb-3">
            <div class="row end q-col-gutter-x-sm q-col-gutter-y-md mt-1">
              <div>
                <Button
                  :outline="false"
                  color="orange"
                  class="btn-filter flex custom text-white"
                  @click="handleGoBack"
                  label="Finalizar"
                  :right-icon="'ChevronRight'"
                  color-icon="white"
                  :styleContent="{
                    'font-size': '13px',
                  }"
                />
              </div>
            </div>
          </div>
        </section>
      </template>
    </VCard>
  </q-form>
  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 670px"
    :showImgDefault="false"
    @close="closeAlertModal"
    :showBtnConfirm="false"
    :showBtnCancel="false"
  >
    <template #default-body>
      <div class="px-20">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :hidePagination="true"
          customNoDataMessageTitle=""
          customNoDataMessageSubtitle=""
        />
      </div>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Interfaces
import { IFicCheckBalancesViewPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// logic view
import useCheckBalancesControlViewForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/CheckBalancesControlView/CheckBalancesControlViewForm'

const props = withDefaults(defineProps<IFicCheckBalancesViewPropsForm>(), {})

const {
  check_balances_control_table_by_date,
  tableDetailsProps,
  formInformation,
  alertModalRef,
  tableProps,
  models,
  handleSelectionDetail,
  formatCurrencyString,
  handleGoMovements,
  closeAlertModal,
  openAlertModal,
  handleGoBack,
  exportExcel,
} = useCheckBalancesControlViewForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>

<style src="./CheckBalancesControlViewForm.scss" lang="scss" scoped />
