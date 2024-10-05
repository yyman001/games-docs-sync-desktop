<template>
  <a-modal
    title="游戏存档恢复"
    :visible="isVisible"
    :footer="null"
    :maskClosable="false"
    @cancel="onRemoveTempDir"
    width="60%"
  >
    <FieldSetGroup v-if="treeData.length" title="文件列表">
      <div class="file-content">
        <a-directory-tree
          default-expand-all
          multiple
          :treeLine="true"
          :checkable="true"
          :height="280"
          v-model:checkedKeys="selectedKeys"
          :tree-data="treeData"
        />
      </div>
    </FieldSetGroup>
    <div class="backup-content">
      <a-row>
        <a-input
          :disabled="true"
          addon-before="游戏存档路径:"
          :value="docPath"
          style="margin-bottom: 16px"
        >
          <template #addonAfter>
            <a-tooltip placement="left" title="打开路径">
              <FolderOpenOutlined @click="openPath(docPath)" />
            </a-tooltip>
          </template>
        </a-input>
      </a-row>

      <a-row>
        <a-input
          addon-before="备份文件路径:"
          :disabled="true"
          :value="backupFilePath"
          style="margin-bottom: 16px"
        >
          <template #addonAfter>
            <a-tooltip placement="left" title="打开存档文件">
              <FolderOpenOutlined @click="openExternal(backupFilePath)"/>
            </a-tooltip>
          </template>
        </a-input>
      </a-row>
    </div>

    <div class="flex justify-end space-x-4 steps-action">
      <a-button @click="onRemoveTempDir"> 取消 </a-button>
      <a-button type="primary" @click="onRestoreBackup"> 还原 </a-button>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'
import { FolderOpenOutlined } from '@ant-design/icons-vue'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'
import { openExternal, openPath } from '@/utils/shell'
import { useRestoreFileStoreWhitOut } from '@/store/restoreFile'
import { storeToRefs } from 'pinia'

defineComponent({
  name: 'modal-restore'
})

const useRestore = useRestoreFileStoreWhitOut()
const { onRemoveTempDir, onRestoreBackup } = useRestore
const { docPath, backupFilePath, isVisible, selectedKeys, treeData, nodeSize } =
  storeToRefs(useRestore)
</script>

<style></style>
