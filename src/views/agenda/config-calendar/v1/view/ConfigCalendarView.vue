<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <Card>
          <template #content-card>
            <div class="q-pa-lg">
              <div class="row q-mb-xl">
                <div class="col-12">
                  <div class="q-gutter-md row items-center justify-between">
                    <div class="col-md-5">
                      <GenericSelectorComponent
                        :default_value="yearSelected"
                        :manual_option="year_list"
                        label="Seleccione año"
                        :auto_complete="true"
                        :first_filter_option="'label'"
                        :second_filter_option="'label'"
                        :required="true"
                        :map_options="true"
                        :rules="[]"
                        :clearable="false"
                        @update:modelValue="yearSelected = $event"
                      />
                    </div>
                    <div class="col-auto">
                      <Button
                        label="Descargar PDF"
                        left-icon="File"
                        color="orange"
                        :class-custom="'custom'"
                        :outline="true"
                        colorIcon="#762344"
                        :styleText="{ color: 'black' }"
                        @click="downloadCalendar()"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="container-calendar-list">
                  <div
                    v-for="(month, index) in month_list"
                    :key="index"
                    class="calendar-item"
                  >
                    <FixedCalendar
                      :year="yearSelected"
                      :month="month.value"
                      :offDays="offDays[index]"
                    />
                  </div>
                </div>
              </div>
              <div class="flex justify-end q-mt-lg">
                <Button
                  :outline="false"
                  label="Finalizar"
                  color="orange"
                  class="btn-filter custom"
                  @click="handleGoToList"
                />
              </div>
            </div>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FixedCalendar from '@/components/fixed-calendar/FixedCalendar.vue'
import Button from '@/components/common/Button/Button.vue'
import Card from '@/components/common/VCard/VCard.vue'

import useConfigCalendarView from '@/views/agenda/config-calendar/v1/view/ConfigCalendarView'

const {
  offDays,
  year_list,
  month_list,
  yearSelected,
  handleGoToList,
  headerProperties,
  downloadCalendar,
} = useConfigCalendarView()
</script>

<style lang="scss" src="./ConfigCalendarView.scss" />
