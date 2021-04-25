import { reactive } from 'vue';

import axios from 'axios';

// if we put it outside of the function the state will persist between different uses
const emails = reactive(new Set());

export const useEmailSelection = function() {

    const toggle = function(email) {
        if (emails.has(email)) {
            emails.delete(email)
        } else {
            emails.add(email)
        }
    }

    const clear = function() {
        emails.clear()
    }
    
    const addMultiple = function(newEmails) {
        newEmails.forEach(email => {
            emails.add(email);
        })
    }

    const forSelected = (fn) => {
        emails.forEach((email) => {
            fn(email)
            axios.put(`http://localhost:3004/emails/${email.id}`, email);
        })
    }

    const markRead = () =>  forSelected((e) => e.read = true);
    const markUnread = () => forSelected((e) => e.read = false);
    const markArchived = () => {
        forSelected((e) => e.archived = true);
        clear();
    }

    return {
        emails,
        toggle,
        markRead,
        markUnread,
        markArchived,
        clear,
        addMultiple,
    }

}

export default useEmailSelection;