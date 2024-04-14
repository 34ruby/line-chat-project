<template>
  <q-list bordered>
    <q-item 
      clickable
      v-ripple
      v-for="(user, index) in lineFriendUsers" :key="index"
      @click="selectUser(index, user)"
      :class="{ 'selectedBackground': selectedUserIndex === index, 'unSelectedBackground': selectedUserIndex !== index }"
    >
      <q-item-section avatar>
        <q-avatar>
          <img :src="user.profilePictureUrl">
        </q-avatar>
      </q-item-section>
      <q-item-section>{{ user.nickname }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { mapActions, mapState, useStore  } from 'vuex'
import { computed, ref } from 'vue'

const selectedUserIndex = ref(-1);

const store = useStore()

const props = defineProps({
  lineFriendUsers: Array
});

const selectUser = (index, user) => {
  selectedUserIndex.value = index;
  store.dispatch('user/selectUser', user)
};


</script>

<style lang="scss" scoped>
.selectedBackground {
  background-color: #f0f0f0;
}
.unSelectedBackground {
  background-color: #ffffff;
}
</style>