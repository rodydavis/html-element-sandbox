import { KnobValue } from "./base";

import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

export const tagName = "knob-number";

@customElement(tagName)
export class NumberKnob extends KnobValue<number> {
  constructor(name: string, val: number) {
    super(name, val);
  }

  static styles = KnobValue.styles;

  @property({
    type: Number,
    attribute: "value",
    converter: {
      fromAttribute: (val: string) => parseFloat(val),
      toAttribute: (val: boolean) => val.toString(),
    },
  })
  _value = 0;

  buildInput() {
    return html`<input
      type="number"
      .valueAsNumber=${this.resolveValue(this.value)}
      @change=${this.onChange}
    />`;
  }

  onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.valueAsNumber;
  }

  resolveValue(val: number): number {
    return val;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: NumberKnob;
  }
}
