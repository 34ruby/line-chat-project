<template>
  <q-page class="flex flex-center">
    <div id="lineChat">
      <div class="flex chatArea">
        <ChatRoom />
      </div>
      <div class="settingArea">
        <SettingForm />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ChatRoom from 'src/components/ChatRoom.vue'
import SettingForm from 'src/components/SettingForm.vue'


</script>

<style lang="scss" scoped>
#lineChat {
  display: flex;
  width: 1200px;
  height: 720px;
  .chatArea {
    background-color: rgba(0,0,0,0.4);
    flex-direction: column;
    width: 60%;
    margin-right: 32px;
    border-radius: 16px;
  }
  .settingArea{
    background-color: rgba(0,0,0,0.4);
    width: 40%;
    border-radius: 16px;
  }
}
</style>
