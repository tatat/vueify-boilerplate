'use strict'

import Vue from 'vue'

export class TaggedEventBus {
  constructor() {
    this.bus = new Vue()
    this.listeners = []
  }

  on(tag, name, listener) {
    this.listeners.push({tag, name, listener})
    this.bus.$on(name, listener)

    return this
  }

  off(tag, name = null, listener = null) {
    let condition = l => l.tag === tag

    if (name != null)
      condition = (c => l => c(l) && l.name === name)(condition)

    if (listener != null)
      condition = (c => l => c(l) && l.listener === listener)(condition)

    for (let i = this.listeners.length - 1, l; i >= 0; i --) {
      l = this.listeners[i]

      if (condition(l)) {
        this.listeners.splice(i, 1)
        this.bus.$off(l.name, l.listener)
      }
    }

    return this
  }

  emit(name, ...args) {
    return this.bus.$emit(name, ...args)
  }

  with(tag) {
    return new TaggedEventBusWithTag(this, tag)
  }
}

export class TaggedEventBusWithTag {
  constructor(eventBus, tag) {
    this.eventBus = eventBus
    this.tag = tag
  }

  on(name, listener) {
    this.eventBus.on(this.tag, name, listener)
    return this
  }

  off(name = null, listener = null) {
    this.eventBus.off(this.tag, name, listener)
    return this
  }

  emit(name, ...args) {
    return this.eventBus.emit(name, ...args)
  }
}
