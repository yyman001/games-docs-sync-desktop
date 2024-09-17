<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'
import {
  FolderOutlined,
  AppstoreOutlined,
  AppstoreAddOutlined,
  SettingOutlined,
  ReloadOutlined,
  RedoOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons-vue'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { storeToRefs } from 'pinia'
import { useConfigStoreWhitOut } from '@/store/config'
import { useCloudStoreWhitOut } from '@/store/cloud'
import { showOpenDialog } from '@/utils/ipc'

const tabs = [
  { name: '基本设置', value: 'base' },
  { name: '备份/还原设置', value: 'backup' },
  { name: '云同步设置', value: 'cloud' },
  { name: '关于', value: 'about' }
]
const { cloudType, cloudTypeList, targetCloudAccount, cloudAccountConfig } =
  storeToRefs(useCloudStoreWhitOut())
const {
  loadConfig,
  handleSetConfig,
  resetCloudConfig,
  onSwitchCloud,
  hanldeSaveConfig,
  handleSave
} = useCloudStoreWhitOut()
const useConfigStore = useConfigStoreWhitOut()
const { setDefaultTempPath, setDefaultBackPath, setDefalutConfigPath } = useConfigStore
const { tempPath, backPath, configFilePath } = storeToRefs(useConfigStore)
const setCustomBackPath = async () => {
  const openPath = await showOpenDialog()
  if (openPath) {
    useConfigStore.setBackPath(openPath)
  }
}
const setCustomTempPath = async () => {
  const openPath = await showOpenDialog()
  if (openPath) {
    useConfigStore.setTempPath(openPath)
  }
}
</script>

<template>
  <ScrollArea class="w-full h-full p-4 border rounded-md config-page bg-slate-100">
    <template v-for="{ value, name } in tabs" :key="value">
      <Card class="mb-4">
        <CardHeader>
          <CardTitle>{{ name }}</CardTitle>
          <CardDescription v-if="value === 'backup'">默认操作目录在主应用目录下</CardDescription>
        </CardHeader>
        <CardContent>
          <template v-if="value === 'base'"> <a-checkbox> 随开机启动 </a-checkbox> </template>
          <template v-else-if="value === 'backup'">
            <field-set-group title="临时操作路径">
              <div style="margin-bottom: 16px">
                <a-input :value="tempPath">
                  <template #addonBefore>
                    <a-tooltip title="设置临时操作目录">
                      <SettingOutlined @click="setCustomTempPath" />
                    </a-tooltip>
                  </template>

                  <template #addonAfter>
                    <a-tooltip title="恢复默认">
                      <ReloadOutlined @click="setDefaultTempPath" />
                    </a-tooltip>
                  </template>
                </a-input>
              </div>
            </field-set-group>

            <field-set-group title="备份路径">
              <div style="margin-bottom: 16px">
                <a-input :value="backPath">
                  <template #addonBefore>
                    <a-tooltip title="设置备份目录">
                      <SettingOutlined @click="setCustomBackPath" />
                    </a-tooltip>
                  </template>

                  <template #addonAfter>
                    <a-tooltip title="恢复默认">
                      <ReloadOutlined @click="setDefaultBackPath" />
                    </a-tooltip>
                  </template>
                </a-input>
              </div> </field-set-group
          ></template>
          <template v-else-if="value === 'cloud'">
            <field-set-group title="云配置">
              <div>
                <a-input :value="configFilePath" style="margin-bottom: 16px">
                  <template #addonBefore>
                    <a-tooltip title="导入配置">
                      <SettingOutlined @click="handleSetConfig(configFilePath)" />
                    </a-tooltip>
                  </template>
                  <template #addonAfter>
                    <a-tooltip title="恢复默认" @click="setDefalutConfigPath">
                      <RedoOutlined />
                    </a-tooltip>
                  </template>
                </a-input>
                <a-button type="primary" @click="loadConfig(configFilePath)">重新载入配置</a-button>
                <a-divider />

                <field-set-group title="账号设置">
                  <div class="colud-type" style="margin-bottom: 16px">
                    云盘类型:
                    <a-select
                      style="width: 100px"
                      size="small"
                      :value="cloudType"
                      :options="cloudTypeList"
                      @change="onSwitchCloud"
                    ></a-select>
                  </div>
                  <a-form
                    :model="cloudAccountConfig"
                    name="basic"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                  >
                    <template v-if="cloudType === 'ali-oss'">
                      <a-form-item
                        label="AccessKeyId"
                        name="accessKeyId"
                        :rules="[{ required: true, message: 'Please input your accessKeyId!' }]"
                      >
                        <a-input v-model:value="cloudAccountConfig.aliOss.accessKeyId" />
                      </a-form-item>

                      <a-form-item
                        label="AccessKeySecret"
                        name="accessKeySecret"
                        :rules="[{ required: true, message: 'Please input your accessKeySecret!' }]"
                      >
                        <a-input v-model:value="cloudAccountConfig.aliOss.accessKeySecret" />
                      </a-form-item>

                      <a-form-item
                        label="Bucket"
                        name="bucket"
                        :rules="[{ required: true, message: 'Please input your bucket!' }]"
                      >
                        <a-input v-model:value="cloudAccountConfig.aliOss.bucket" />
                      </a-form-item>
                    </template>

                    <template v-if="cloudType === 'jianguoyun'">
                      <!-- 账号 -->
                      <a-form-item>
                        <a-input
                          placeholder="账号"
                          v-model:value="cloudAccountConfig.jianguoyun.usearname"
                        >
                          <template #addonBefore>
                            <UserOutlined />
                          </template>
                        </a-input>
                      </a-form-item>
                      <!-- 密码 -->
                      <a-form-item>
                        <a-input-password
                          type="password"
                          placeholder="密码"
                          v-model:value="cloudAccountConfig.jianguoyun.password"
                        >
                          <template #addonBefore>
                            <LockOutlined />
                          </template>
                        </a-input-password>
                      </a-form-item>
                    </template>

                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                      <a-button type="primary" @click="handleSave(configFilePath)">保存</a-button>
                    </a-form-item>
                  </a-form>
                </field-set-group>
              </div>
            </field-set-group></template
          >
          <template v-else-if="value === 'about'"> 这是一个免费开源程序 </template>
        </CardContent>
      </Card>
    </template>
  </ScrollArea>
</template>

<style></style>
