<template>
  <div class="email-display">
    <div class="mb-4">
      <button class="button" @click="toggleArchived">{{email.archived ? 'Move to inbox (e)' : 'Archive (e)' }}</button>
      <button class="button" @click="toggleRead" >{{email.read ? 'Mark Unread (r)' : 'Mark Read (r)' }}  </button>
      <button class="button" @click="goNewer">Newer (k)</button>
      <button class="button" @click="goOlder">Older (j)</button>
    </div>
    <h2 class="mb-0">
      Subject: <strong>{{ email.subject }}</strong>
    </h2>
    <div>
      <em>From {{ email.from }} on {{ format(new Date(email.sentAt) , "MMM do yyyy") }}</em>
    </div>
    <div v-html="marked(email.body)"></div>
  </div>
</template>

<script>

import { format } from "date-fns";

import marked from 'marked';

import axios from 'axios';

import useKeydown from '../composables/use-keydown';

export default {
  emits: ['changeEmail'],
  props: {
    email: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
     const toggleRead = () => { emit('changeEmail', { toggleRead: true, save: true, })  }
     const toggleArchived = () => { emit('changeEmail', { toggleArchive: true, save: true, closeModal: true })  }
     const goNewer = () => { emit('changeEmail', { changeIndex: -1 })  }
     const goOlder = () => { emit('changeEmail', { changeIndex: +1 })  }
     const goNewerAndArchive = () => { emit('changeEmail', { changeIndex: +1, toggleArchive: true, save: true })  }
     const goOlderAndArchive = () => { emit('changeEmail', { changeIndex: -1, toggleArchive: true, save: true })  }

     useKeydown([
       { key: 'r', fn: toggleRead},
       { key: 'e', fn: toggleArchived},
       { key: 'k', fn: goNewer},
       { key: 'j', fn: goOlder},
       { key: '[', fn: goNewerAndArchive},
       { key: ']', fn: goOlderAndArchive},
     ])


      return {
          format,
          marked,
          toggleRead,
          toggleArchived,
          goNewer,
          goOlder,
      }
  }
};
</script>

<style>
</style>