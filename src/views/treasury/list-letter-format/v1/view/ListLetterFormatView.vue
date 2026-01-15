<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ListLetterFormatList' })"
    >
      <div v-if="tabActive === 'basic_data'" class="q-pa-lg">
        <ListLetterFormatForm
          v-if="letterFormat"
          :data="letterFormat"
          action="view"
        >
          <template #actions>
            <div class="row justify-end q-mt-lg">
              <Button
                :outline="false"
                rightIcon="mdi-chevron-right"
                label="Finalizar"
                size="md"
                color="orange"
                classCustom="text-capitalize btn-filter custom"
                @click="$router.push({ name: 'ListLetterFormatList' })"
              />
            </div>
          </template>
        </ListLetterFormatForm>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ListLetterFormatForm from '@/components/Forms/Treasury/ListLetterFormat/Form/ListLetterFormatForm.vue'
import useLetterFormatView from './ListLetterFormatView'

const { headerProps, tabActive, letterFormat } = useLetterFormatView()
</script>
