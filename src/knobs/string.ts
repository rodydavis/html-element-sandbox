import { KnobValue } from "./base";

import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

export const tagName = "knob-string";

@customElement(tagName)
export class StringKnob extends KnobValue<string> {
  constructor(name: string, val: string) {
    super(name, val);
  }

  static styles = KnobValue.styles;

  @property({ type: String, attribute: "value" })
  _value = "";

  buildInput() {
    return html`<input
      type="text"
      .value=${this.resolveValue(this.value)}
      @input=${this.onChange}
    />`;
  }

  onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StringKnob;
  }
}
