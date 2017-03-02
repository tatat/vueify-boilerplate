<style lang="stylus">
</style>

<template lang="pug">
.main
  h1 {{pageTitle}}
  p
    router-link(v-bind:to="{name: 'wellcome'}") Wellcome
</template>

<script>
'use strict'

import PagesMixin from 'mixins/pages_mixin'

export default {
  mixins: [PagesMixin],

  data() {
    return {
      pageTitle: 'Index'
    }
  }
}
</script>
