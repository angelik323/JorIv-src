<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="isLoaded"
              v-show="tabActive === 'information'"
              ref="informationFormRef"
              :data="initialData.information"
              :action="'edit'"
            />

            <ParametersForm
              v-show="tabActive === 'parameters'"
              ref="parametersFormRef"
              :data="initialData.parameters"
              :action="'edit'"
            />

            <ProfilesForm
              v-show="tabActive === 'profiles'"
              ref="profilesFormRef"
              :data="initialData.profiles"
              :action="'edit'"
            />

            <ParticipationTypesForm
              v-show="tabActive === 'participationTypes'"
              ref="participationTypesFormRef"
              :data="initialData.participationTypes"
              :action="'edit'"
            />

            <OperatingChannelsForm
              v-show="tabActive === 'operatingChannels'"
              ref="operatingChannelsFormRef"
              :data="initialData.operatingChannels"
              :action="'edit'"
            />

            <PrintGroupsForm
              v-show="tabActive === 'printGroups'"
              ref="printGroupsFormRef"
              :data="initialData.printGroups"
              :action="'edit'"
            />

            <section class="mx-1 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  outline
                  label="Atrás"
                  :leftIcon="defaultIconsLucide.chevronLeft"
                  :color-icon="'#762344'"
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.chevronRight"
                  :color-icon="'white'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  label="Finalizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleSubmitForm"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ParticipationTypesForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/ParticipationTypes/ParticipationTypesForm.vue'
import OperatingChannelsForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/OperatingChannels/OperatingChannelsForm.vue'
import PrintGroupsForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/PrintGroups/PrintGroupsForm.vue'
import InformationForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/Information/InformationForm.vue'
import ParametersForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/Parameters/ParametersForm.vue'
import ProfilesForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/Profiles/ProfilesForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useCollectiveInvestmentFundsEdit from '@/views/fics/collective-investment-funds/v1/edit/CollectiveInvestmentFundsEdit'

const {
  nextTab,
  backTab,
  isLoaded,
  tabActive,
  initialData,
  headerProps,
  filteredTabs,
  tabActiveIdx,
  handleGoToList,
  profilesFormRef,
  handleSubmitForm,
  parametersFormRef,
  printGroupsFormRef,
  informationFormRef,
  defaultIconsLucide,
  operatingChannelsFormRef,
  participationTypesFormRef,
} = useCollectiveInvestmentFundsEdit()
</script>
