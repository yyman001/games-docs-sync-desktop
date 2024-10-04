<template>
  <a-modal
    title="备份"
    :visible="isVisible"
    :footer="null"
    :maskClosable="false"
    @cancel="onModalClose"
    :closable="!loading"
    width="60%"
  >
    <a-spin tip="执行中..." :spinning="loading">
      <FieldSetGroup v-if="treeData.length" title="文件列表">
        <div class="file-content">
          <a-alert :message="`勾选内容大小: ${nodeSize}`" type="info" show-icon />
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
            addon-before="存档路径:"
            :value="GAME_DOC_PATH"
            style="margin-bottom: 16px"
          >
            <template #addonAfter>
              <a-tooltip placement="left" title="打开路径">
                <FolderOpenOutlined @click="openItem(GAME_DOC_PATH)" />
              </a-tooltip>
            </template>
          </a-input>
        </a-row>

        <a-row>
          <a-input
            addon-before="备份路径:"
            :value="GAME_FILES_BACKUP_PATH"
            style="margin-bottom: 16px"
          >
            <template #addonAfter>
              <a-tooltip placement="left" title="修改路径">
                <FolderOpenOutlined />
              </a-tooltip>
            </template>
          </a-input>
        </a-row>
      </div>

      <div class="steps-action">
        <a-button @click="onModalClose"> 取消 </a-button>
        <a-button :disabled="loading" type="primary" @click="handleStartBackup"> 备份 </a-button>
      </div>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, unref, watch } from 'vue'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'
import { FolderOpenOutlined } from '@ant-design/icons-vue'

import { openItem } from '@/utils/shell'
import { injectStrict } from '@/utils/injectStrict'
import { BackModal, modal } from '@/hooks/useModal'
import useDocTree from './useDocTree'
import { useBackupFile, IBackupParams } from './useBackupFile'

export default defineComponent({
  name: 'modal-backup',
  components: {
    FieldSetGroup,
    FolderOpenOutlined
  },

  setup(props: any, { emit }) {
    const { selectedKeys, treeData, createNode, nodeSize } = useDocTree()
    const { loading, onStartBackup } = useBackupFile()

    const { isVisible, onModalClose, GAME_DOC_DIR, GAME_DOC_PATH, GAME_FILES_BACKUP_PATH } =
      injectStrict<BackModal>(modal)

    watch(GAME_DOC_PATH, (path) => {
      if (!path) return
      createNode(path, GAME_DOC_DIR.value)
    })

    watch(isVisible, (val) => {
      if (!val) {
        GAME_DOC_PATH.value = ''
      }
    })

    const handleStartBackup = async () => {
      try {
        await onStartBackup({
          docPath: unref(GAME_DOC_PATH),
          backPath: unref(GAME_FILES_BACKUP_PATH),
          gameDocDir: unref(GAME_DOC_DIR),
          saveFiles: unref(selectedKeys)
        } as IBackupParams)
        onModalClose()
      } catch (e) {
        console.error(e)
      }
    }

    return {
      isVisible,
      onModalClose,

      GAME_DOC_PATH,
      GAME_FILES_BACKUP_PATH,

      loading,
      selectedKeys,
      nodeSize,
      treeData,

      openItem,
      handleStartBackup
    }
  }
})
</script>

<style></style>
