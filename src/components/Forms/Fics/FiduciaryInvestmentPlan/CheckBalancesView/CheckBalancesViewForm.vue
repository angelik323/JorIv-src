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
                Detalle saldo plan de inversión
              </p>
              <Button
                :outline="true"
                label="Descargar excel"
                :leftImg="excelIcon"
                tooltip="Descargar excel"
                @click="exportExcel"
                :disabled="
                  !models.last_closing_date || !check_balances_by_date_form
                "
              />
            </div>
            <div class="row q-col-gutter-x-sm q-col-gutter-y-md mt-1">
              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Saldo total del plan de inversión
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.plan_balance
                        ? formatCurrency(models.plan_balance)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Control de cancelación
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.cancelation_control
                        ? formatCurrency(models.cancelation_control)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Saldo reservado</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.reserved_balance
                        ? formatCurrency(models.reserved_balance)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Saldo canje</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.clearing_balance
                        ? formatCurrency(models.clearing_balance)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Saldo congelado</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.freeze_balance
                        ? formatCurrency(models.freeze_balance)
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Disponible sin deducción
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.available_balance
                        ? formatCurrency(models.available_balance)
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
                      models.returns
                        ? formatCurrency(models.returns)
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
              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">GMF</p>
                  <p class="text-weight-medium no-margin">
                    {{ formatCurrency(models.gmf ? models.gmf : '0') }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Retención en la fuente
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      formatCurrency(models.retention ? models.retention : '0')
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Penalización</p>
                  <p class="text-weight-medium no-margin">
                    {{ formatCurrency(models.penalty ? models.penalty : '0') }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Neto con impuesto</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      formatCurrency(
                        models.net_with_tax ? models.net_with_tax : '0'
                      )
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">Neto sin impuesto</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      formatCurrency(
                        models.net_without_tax ? models.net_without_tax : '0'
                      )
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Negocio plan de inversión
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.business_plan
                        ? models.business_plan
                        : 'No registrado'
                    }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-md-3">
                <div class="text-black-90">
                  <p class="text-weight-bold no-margin">
                    Tipo de participación
                  </p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.participation_type_plan
                        ? models.participation_type_plan
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
            <div class="row justify-end items-center q-gutter-sm">
              <Button
                :outline="false"
                color="orange"
                class="btn-filter flex custom text-white"
                @click="handleGoMovements"
                label="Movimientos por plan de inversión"
                :right-icon="'ChevronRight'"
                color-icon="white"
                :styleContent="{
                  'font-size': '13px',
                }"
              />

              <Button
                :outline="false"
                color="orange"
                class="btn-filter flex custom text-white"
                @click="handleGoControl"
                label="Saldos con control de aportes"
                :right-icon="'ChevronRight'"
                color-icon="white"
                :styleContent="{
                  'font-size': '13px',
                }"
              />
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
import useCheckBalancesViewForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/CheckBalancesView/CheckBalancesViewForm'

const props = withDefaults(defineProps<IFicCheckBalancesViewPropsForm>(), {})

const {
  check_balances_by_date_form,
  formInformation,
  alertModalRef,
  tableProps,
  models,
  handleGoMovements,
  closeAlertModal,
  handleGoControl,
  openAlertModal,
  formatCurrency,
  handleGoBack,
  exportExcel,
} = useCheckBalancesViewForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>

<style src="./CheckBalancesViewForm.scss" lang="scss" scoped />
