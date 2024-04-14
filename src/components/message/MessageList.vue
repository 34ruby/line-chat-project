<template>
  <div class="message-list">
    <ul ref="messageListRef">
      <li v-for="(message, index) in textArray" :key="index">
        <div v-if="message.nickname" class="chatCloud">
          <div class="userProfile">
            <img :src="message.profilePictureUrl" width=32>
              <span class="userName">
                {{ message.nickname }}
              </span>
          </div>
          <div class="userMessage">
            {{ message.message }}
          </div> 
          <div class="dateMessage">
            {{ setJpTime(message.createdAt) }}
          </div>
        </div>
        <div v-else style="text-align: right;">
          <div class="myMessage">
            {{ message.message }}
          </div> 
          <div class="dateMessage">
            {{ setJpTime(message.createdAt) }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onUpdated, ref, computed } from 'vue'
import moment from 'moment'
import { useStore } from 'vuex'

const store = useStore()

const textArray = computed(() => store.state.message.messages)

const messageListRef = ref(null)

onUpdated(() => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
});

const setJpTime = (date) => {
  return moment(date).tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss")
}
</script>


<style lang="scss" scoped>
.message-list {
  margin: 16px;
  height: 600px;
}

.message-list ul {
  padding: 0;
  height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.message-list ul::-webkit-scrollbar {
  display: none;
}
.message-list li {
  list-style: none;
  margin: 8px 0;
}

.chatCloud {
  img {
    border-radius: 16px;
  }
  .userProfile {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }
  .userMessage {
    padding: 8px 16px;
    display: inline-block;
    background-color: white;
    border-radius: 8px;
    max-width: 680px;
    overflow-wrap: break-word;
    margin-top: 8px;
  }
  .userName {
    margin-left: 8px;
    color: #353535;
    font-weight: bold;
  }
}

.myMessage {
  display: inline-block;
  padding: 8px 16px;
  background-color: white;
  border-radius: 8px;
  max-width: 680px;
  overflow-wrap: break-word;
}

.dateMessage {
  font-size: 10pt;
  color: #353535;
  margin-top: 4px;
}
</style>
