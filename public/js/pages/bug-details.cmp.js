'use strict'

import { bugService } from '../services/bug-service.js'
import userMsg from '../cmps/user-msg.cmp.js'
import { eventBus } from '../services/eventBus-service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <span :class='"severity" + bug.severity'>Description: {{bug.description}}</span>

        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },

  created() {
    this.getBug()
  },
  methods: {
    getBug(){
      const { bugId } = this.$route.params
      if (bugId) {
        bugService.getById(bugId).then((bug) => {
          this.bug = bug
        }).catch(err => {
          eventBus.emit('show-msg', { txt: err, type: 'fail' })
          setTimeout(this.getBug, 7000)
        })
      }
    }
  },
  components: {
    userMsg,
  }
}
