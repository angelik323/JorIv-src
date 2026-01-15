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
      <ListLetterFormatForm
        ref="letterFormatForm"
        :action="'edit'"
        :data="model"
        class="q-mt-md"
      >
        <template #custom-action-button>
          <Button
            :outline="false"
            :class-custom="'custom q-mr-md'"
            label="Actualizar"
            size="md"
            color="orange"
            @click="onSubmit"
          />
        </template>
      </ListLetterFormatForm>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ListLetterFormatForm from '@/components/Forms/Treasury/ListLetterFormat/Form/ListLetterFormatForm.vue'
import Button from '@/components/common/Button/Button.vue'
import useLetterFormatEdit from './ListLetterFormatEdit'

const { headerProps, letterFormatForm, model, onSubmit } = useLetterFormatEdit()
</script>
