<template>


<button class="button" @click="selectScreen('inbox')" :disabled="selectedScreen === 'inbox'">Inbox</button>
<button class="button" @click="selectScreen('archived')" :disabled="selectedScreen === 'archived'">Archived</button>

  <BulkActionBar :emails="filteredEmails"></BulkActionBar>

  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in filteredEmails"
        :key="email.id"
        :class="['clickable', { read: email.read }]"
        @click="openEmail(email)"
      >
        <td @click.stop><input type="checkbox" @click="emailSelection.toggle(email)" :checked="emailSelection.emails.has(email)"/></td>
        <td>{{ email.from }}</td>
        <td>
          <p>
            <strong> {{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>

        <td class="date">
          {{ format(new Date(email.sentAt), "MMM do yyyy") }}
        </td>

        <td>
          <button class="button" @click="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>

  <ModalView v-if="openedEmail" @closedModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script>
import { format } from "date-fns";

import { ref } from "vue";

import axios from "axios";

import MailView from "./MailView.vue";
import ModalView from "./ModalView.vue";
import BulkActionBar from "./BulkActionBar.vue";

import useEmailSelection from '../composables/use-email-selection';

export default {
  components: {
    MailView,
    ModalView,
    BulkActionBar,
  },
  async setup() {
    const { data: emails } = await axios.get("http://localhost:3004/emails");
    
    return {
      format,
      emails: ref(emails),
      openedEmail: ref(null),
      emailSelection: useEmailSelection(),
      selectedScreen: ref('inbox'),
    };
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1;
      });
    },
    filteredEmails() {
      const showArchived = this.selectedScreen === 'archived';
      return this.sortedEmails.filter((x) => x.archived === showArchived);
    },
  },
  methods: {
    updateEmail(email) {
      axios.put(`http://localhost:3004/emails/${email.id}`, email);
    },
    selectScreen(newScreen) {
      this.selectedScreen = newScreen;
      this.emailSelection.clear();
    },
    openEmail(email) {
      if (email) {
        email.read = true;
        this.updateEmail(email);
      }

      this.openedEmail = email;
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    changeEmail({ toggleRead, toggleArchive, save, closeModal, changeIndex }) {
      let email = this.openedEmail;

      if (toggleRead) {
        email.read = !email.read;
      }

      if (toggleArchive) {
        email.archived = !email.archived;
      }

      if (save) {
        this.updateEmail(email);
      }

      if (closeModal) {
        this.openedEmail = null;
      }

      if (changeIndex) {
        const emails = this.filteredEmails;

        const currentIndex = emails.indexOf(this.openedEmail);
        const newEmail = emails[currentIndex + changeIndex];

        this.openEmail(newEmail);
      }
    },
  },
};
</script>

<style>
</style>