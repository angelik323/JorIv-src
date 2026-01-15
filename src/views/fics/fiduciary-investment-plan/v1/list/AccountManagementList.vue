<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="handleGoTo('FiduciaryInvestmentPlanList')"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <section v-if="tabActive === 'information'">
        <section class="q-mt-md">
          <VCard>
            <template #content-card>
              <div class="row q-col-gutter-lg mx-1 mt-1 mb-3">
                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">Fondo de inversión</p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response
                          ?.collective_investment_fund?.fund_code ??
                        'No registrado'
                      }}
                    </p>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">Descripción fondo</p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response
                          ?.collective_investment_fund?.fund_name ??
                        'No registrado'
                      }}
                    </p>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">Plan de inversión</p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response?.code ??
                        'No registrado'
                      }}
                    </p>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">Fecha de regístro</p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response?.created_at
                          ? useUtils().formatDate(
                              fiduciary_investment_plan_response.created_at,
                              'YYYY-MM-DD'
                            )
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
                        fiduciary_investment_plan_response?.parameters
                          ?.fic_participation_type?.description ??
                        'No registrado'
                      }}
                    </p>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">
                      Identificación titular
                    </p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response
                          ?.holder_identifications?.holder?.document ??
                        'No registrado'
                      }}
                    </p>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">Nombre titular</p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response
                          ?.holder_identifications?.holder?.name ??
                        'No registrado'
                      }}
                    </p>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">Negocio</p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response?.parameters
                          ?.business_trust?.business_code ?? 'No registrado'
                      }}
                    </p>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-black-90">
                    <p class="text-weight-bold no-margin">
                      Descripción negocio
                    </p>
                    <p class="text-weight-medium no-margin">
                      {{
                        fiduciary_investment_plan_response?.parameters
                          ?.business_trust?.name ?? 'No registrado'
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </VCard>
        </section>

        <section>
          <div class="row">
            <div class="col-12 col-md-6">
              <p class="text-medium text-h5">
                {{ tableProps.title }}
              </p>
            </div>

            <div class="col-12 col-md-6 q-gutter-md text-right">
              <Button
                v-if="tableProps.rows.length > 0"
                :outline="true"
                label="Descargar excel"
                class-custom="custom"
                color="orange"
                :leftImg="excelIcon"
                tooltip="Descargar excel"
                @click="exportExcel"
              />

              <Button
                :left-icon="defaultIconsLucide.plusCircleOutline"
                :outline="false"
                label="Agregar"
                class="mr-3"
                color="orange"
                color-icon="white"
                :styleContent="{
                  'place-items': 'center',
                  'white-space': 'nowrap',
                }"
                @click="
                  handleGoTo(
                    'AccountManagementCreate',
                    searchId,
                    fiduciary_investment_plan_response
                      ?.collective_investment_fund?.fund_id
                  )
                "
              />
            </div>
          </div>
        </section>

        <section class="q-mt-xl">
          <VCard>
            <template #content-card>
              <div class="mx-1">
                <TableList
                  :loading="tableProps.loading"
                  :columns="tableProps.columns"
                  :rows="tableProps.rows"
                  :pages="tableProps.pages"
                  :custom-columns="['status']"
                  @update-page="updatePage"
                >
                  <template #status="{ row }">
                    <CustomToggle
                      :value="isRowActive(row.inscription_status.status_id)"
                      :width="100"
                      :height="30"
                      checked-text="Activo"
                      unchecked-text="Inactivo"
                      readonly
                      @click="openAlertModal(row)"
                    />
                  </template>
                </TableList>

                <AlertModalComponent
                  ref="alertModalRef"
                  styleModal="min-width: 480px"
                  :title="alertModalConfig.description"
                  :show-img-default="false"
                  @confirm="changeStatusAction"
                >
                  <template #default-img>
                    <q-img
                      src="@/assets/images/icons/alert_popup_delete.svg"
                      max-width="80px"
                      width="80px"
                      fit="contain"
                    />
                  </template>
                </AlertModalComponent>
              </div>
            </template>
          </VCard>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

//  Assets
import excelIcon from '@/assets/images/excel.svg'

// Composables
import { useUtils } from '@/composables'

// Logic view
import useAccountManagementList from '@/views/fics/fiduciary-investment-plan/v1/list/AccountManagementList'

const {
  tabs,
  searchId,
  tabActive,
  tableProps,
  handleGoTo,
  updatePage,
  headerProps,
  isRowActive,
  exportExcel,
  tabActiveIdx,
  alertModalRef,
  openAlertModal,
  alertModalConfig,
  defaultIconsLucide,
  changeStatusAction,
  fiduciary_investment_plan_response,
} = useAccountManagementList()
</script>
