<script lang="ts" setup>
import { ElInput } from 'element-plus'
import type { InputProps } from 'element-plus'

defineOptions({
  name: 'ElInput',
})

// 完整透传 element-plus props
const props = defineProps<InputProps>()

// 完整透传事件
const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear'])
</script>

<template>
  <ElInput
    v-bind="props"
    v-on="$attrs"
    @update:modelValue="(val) => emit('update:modelValue', val)"
  />
</template>
