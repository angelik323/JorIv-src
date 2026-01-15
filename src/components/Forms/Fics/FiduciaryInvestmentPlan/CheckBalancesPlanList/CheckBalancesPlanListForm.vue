<template>
  <q-form ref="formInformation">
    <VCard>
      <template #content-card>
        <section v-if="['view'].includes(action)">
          <div class="mx-3 mt-1 mb-3">
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
                  <p class="text-weight-bold no-margin">Fecha de cierre</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      models.last_closing_date
                        ? models.last_closing_date
                        : 'No registrado'
                    }}
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
            </div>
          </div>
        </section>
      </template>
    </VCard>
  </q-form>
</template>
<script setup lang="ts">
// Components
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IFicCheckBalancesViewPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// logic view
import useCheckBalancesPlanListForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/CheckBalancesPlanList/CheckBalancesPlanListForm'

const props = withDefaults(defineProps<IFicCheckBalancesViewPropsForm>(), {})
const { formInformation, models } = useCheckBalancesPlanListForm(props)
</script>
