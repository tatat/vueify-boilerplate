'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Application from 'application.vue'
import {TaggedEventBus} from 'lib/tagged_event_bus'

Vue.use(VueRouter)

const sharedState = {}
const eventBus = new TaggedEventBus()

Object.defineProperty(Vue.prototype, 'eventBus', {
  get() { return eventBus.with(this) }
})

Vue.mixin({
  data() {
    return {sharedState}
  },

  destroyed() {
    this.eventBus.off()
  }
})

document.addEventListener('DOMContentLoaded', () => new Vue(Application).$mount('#root'))
