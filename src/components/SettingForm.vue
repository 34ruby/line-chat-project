<template>
  <div class="settingForm">
    <UserList :lineFriendUsers="lineFriendUsers" />
    <q-btn @click="alert = true" class="bg-white" flat>QR CODEを見る</q-btn>
  </div>
  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">MY QR CODE</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-img src="../assets/qrcode.png"></q-img>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import UserList from './setting/UserList.vue'
import {ref, onMounted } from 'vue'
import axios from 'axios'

const lineFriendUsers = ref([])

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    lineFriendUsers.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
};

onMounted(fetchUsers)

const alert = ref(false)

</script>

<style lang="scss" scoped>
.settingForm {
  height: 660px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 32px;
}
</style>