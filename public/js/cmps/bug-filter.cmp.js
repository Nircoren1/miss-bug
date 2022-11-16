'use strict'

export default {
  template: `
        <section class="bug-filter">
            <span>Filter by title: </span>
            <input @input="setFilterBy" type="text" v-model="filterBy.byTitle">
        </section>
    `,
  data() {
    return {
      filterBy: {
        byTitle: '',
      },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
  },
}
