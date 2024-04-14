<template>
  <div class="chatRoom">
    <MessageList />
    <q-input borderless v-model="inputText" maxlength="255" @keyup.enter="sendMessage(inputText)" class="textInputArea">
      <template v-slot:after>
        <q-btn round flat icon="send" @click="sendMessage(inputText)" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import MessageList from './message/MessageList.vue'
import { onMounted, onUnmounted, ref, computed, watch, getCurrentInstance } from 'vue'
import moment from 'moment'
import 'moment-timezone'
import { useStore } from 'vuex'
import axios from 'axios'

const store = useStore();

const inputText = ref('');

const userChatId = computed(() => store.state.user.selectedUser)

watch(userChatId, async (newUserId) => {
  if (newUserId) {
    try {
        const response = await axios.get(`http://localhost:3000/api/messages/${newUserId.userId}`);
        updateChatRoom(newUserId.userId)
    } catch (error) {
        console.error('Error fetching messages:', error)
    }
  }
}, {immediate: false})


const clearText = () => {
  inputText.value = ''
}

const internalInstance = getCurrentInstance()
const socket = internalInstance.appContext.config.globalProperties.$socket

const sendMessage = (inputText) => {
  const timestamp = moment().tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss")
  const messageData = {
    userId: userChatId.value.userId,
    text: inputText,
    timestamp: timestamp
  };
  socket.emit('sendMessage', messageData);
  updateChatRoom(messageData.userId)
  clearText()
}

const updateChatRoom = async (userId) => {
  await store.dispatch('message/fetchMessages', userId)
};


onMounted(() => {
  if (socket) {
    socket.on('message', (newMessage) => {
      console.log('Received message:', newMessage)
      updateChatRoom(newMessage.userId)
    });

    socket.on('chatMessage', (msg) => {
      console.log('Received chatMessage:', msg)
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    });
  } else {
    console.error('Socket instance is not available')
  }
});

onUnmounted(() => {
  if (socket) {
    socket.off('message')
    socket.off('chatMessage')
    socket.off('error')
  }
});

</script>

<style lang="scss" scoped>
.chatRoom {
  height: 720px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .textInputArea {
    margin: 16px;
    background-color: white;
    border-radius: 16px;
    padding: 0 16px;
  }
}
</style>
