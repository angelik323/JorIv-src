<template>
  <div class="q-gutter-lg">
    <div class="col-12 col-md-10">
      <q-list bordered class="fixed-variables__container q-mx-md">
        <q-item
          v-for="variable in fixed_variables"
          :key="variable.id"
          clickable
          v-ripple
          class="fixed-variables__item"
          @click="handleAddVariable(variable)"
        >
          <q-item-section>
            <div class="text-caption text-black-90 text-weight-medium">
              {{ variable.name }}
            </div>
          </q-item-section>
        </q-item>

        <q-item v-if="!fixed_variables.length" dense>
          <q-item-section class="text-black-90">Sin variables</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
// logic
import useFixedVariablesForm from '@/components/Forms/Normative/FixedVariablesForm/FixedVariablesForm'

const props = defineProps<{
  onAddVariable?: (variable: { code: string; name: string }) => void
}>()

const { addVariableToEditor, fixed_variables } = useFixedVariablesForm({
  onAddVariable: props.onAddVariable,
})

const handleAddVariable = (variable: any) => {
  addVariableToEditor(variable)
}
</script>

<style
  lang="scss"
  src="@/components/Forms/Normative/FixedVariablesForm/FixedVariablesForm.scss"
  scoped
/>
