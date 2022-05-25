import { KnobValue } from "./base";

import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

export const tagName = "knob-boolean";

@customElement(tagName)
export class BooleanKnob extends KnobValue<boolean> {
  constructor(name: string, val: boolean) {
    super(name, val);
  }

  static styles = KnobValue.styles;

  @property({
    type: Boolean,
    attribute: "value",
    // converter: {
    //   fromAttribute: (val: string) => val === "true",
    //   toAttribute: (val: boolean) => (val ? "true" : "false"),
    // },
  })
  _value = false;

  buildInput() {
    return html`<input
      type="checkbox"
      .checked=${this.resolveValue(this.value)}
      @change=${this.onChange}
    />`;
  }

  onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.checked;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: BooleanKnob;
  }
}
