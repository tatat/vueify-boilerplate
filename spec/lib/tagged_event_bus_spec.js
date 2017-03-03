'use strict'

import SpecHelper from 'spec_helper'
import {TaggedEventBus, TaggedEventBusWithTag} from 'lib/tagged_event_bus'

const {expect, sinon} = SpecHelper

describe('TaggedEventBus', () => {
  let eventBus

  beforeEach(() => {
    eventBus = new TaggedEventBus()
  })

  it('should emit specified event for any tags', () => {
    const spy1 = sinon.spy()
    const spy2 = sinon.spy()

    eventBus.on('tag1', 'test', spy1)
    eventBus.on('tag2', 'test', spy2)

    eventBus.emit('test')

    expect(spy1).to.have.been.calledOnce
    expect(spy2).to.have.been.calledOnce
  })

  it('should remove listeners of specified event', () => {
    const spy1 = sinon.spy()
    const spy2 = sinon.spy()

    eventBus.on('tag1', 'test', spy1)
    eventBus.on('tag2', 'test', spy2)
    eventBus.off('tag1')

    eventBus.emit('test')

    expect(spy1).not.to.have.been.called
    expect(spy2).to.have.been.calledOnce
  })
})

describe('TaggedEventBusWithTag', () => {
  let eventBus
  let taggedEventBus1
  let taggedEventBus2

  beforeEach(() => {
    eventBus = new TaggedEventBus()
    taggedEventBus1 = new TaggedEventBusWithTag(eventBus, 'tag1')
    taggedEventBus2 = new TaggedEventBusWithTag(eventBus, 'tag2')
  })

  it('should emit specified event for any tags', () => {
    const spy1 = sinon.spy()
    const spy2 = sinon.spy()

    taggedEventBus1.on('test', spy1)
    taggedEventBus2.on('test', spy2)

    taggedEventBus1.emit('test')
    taggedEventBus2.emit('test')
    eventBus.emit('test')

    expect(spy1).to.have.been.calledThrice
    expect(spy2).to.have.been.calledThrice
  })

  it('should remove listeners of specified event', () => {
    const spy1 = sinon.spy()
    const spy2 = sinon.spy()

    taggedEventBus1.on('test', spy1)
    taggedEventBus2.on('test', spy2)
    taggedEventBus1.off()

    taggedEventBus1.emit('test')
    taggedEventBus2.emit('test')
    eventBus.emit('test')

    expect(spy1).not.to.have.been.called
    expect(spy2).to.have.been.calledThrice
  })
})
