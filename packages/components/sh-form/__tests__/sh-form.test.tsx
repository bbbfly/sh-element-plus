import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import ShForm from '../src/sh-form.vue'

const AXIOM = 'Rem is the best girl'

describe('ShForm.vue', () => {
  test('render test', () => {
    const wrapper = mount(() => <ShForm>{AXIOM}</ShForm>)

    expect(wrapper.text()).toEqual(AXIOM)
  })
})
