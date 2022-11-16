'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
          <router-link to="/bug/loginSignup">Login/signup</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <button @click="setPage(1)">next</button>
        <button @click="setPage(-1)">prev</button>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        byTitle: '',
        page: 0,
      },
      totalPages: 0,
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    onChangeLoginStatus() {

    },
    loadBugs() {
      bugService.query(this.filterBy).then(({ totalPages, filteredBugs }) => {
        this.totalPages = totalPages
        this.bugs = filteredBugs
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
    setPage(diff) {
      this.filterBy.page += diff
      if (this.filterBy.page >= this.totalPages) this.filterBy.page = 0
      if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1
      this.loadBugs()
    }
  },
  computed: {
    // bugsToDisplay() {
    //   if (!this.filterBy?.title) return this.bugs
    //   return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
    // },
  },
  components: {
    bugList,
    bugFilter,
  },
}
