<style src="../node_modules/normalize.css/normalize.css"></style>
<style lang="stylus">
body,
html
  color #333333
  font-family sans-serif

.main
  padding 10px
</style>

<template lang="pug">
.root
  router-view
</template>

<script>
'use strict'

import VueRouter from 'vue-router'
import IndexComponent from 'components/index.vue'
import WellcomeComponent from 'components/wellcome.vue'

const router = new VueRouter({
  history: false,
  routes: [
    {path: '/', name: 'root', component: IndexComponent},
    {path: '/wellcome', name: 'wellcome', component: WellcomeComponent},
  ]
})

export default {router}
</script>
