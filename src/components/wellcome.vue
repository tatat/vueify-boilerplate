<style lang="stylus">
</style>

<template lang="pug">
.main
  h1 {{pageTitle}}
</template>

<script>
'use strict'

import PagesMixin from 'mixins/pages_mixin'

export default {
  mixins: [PagesMixin],

  data() {
    return {
      pageTitle: 'Wellcome'
    }
  }
}
</script>
