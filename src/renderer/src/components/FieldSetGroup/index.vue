<template>
  <fieldset class="fieldset rounded-md">
    <legend>{{ title }}</legend>
    <slot></slot>
  </fieldset>
</template>

<script>
export default {
  name: 'fieldSetGroup',
  props: {
    title: {
      type: String,
      default: 'Group name'
    }
  }
}
</script>

<style lang="scss">
.fieldset {
  margin-bottom: 10px;
  padding: 15px;
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  legend {
    margin: 0;
    padding: 2px;
    width: auto;
    font-size: 14px;
  }
}
</style>
