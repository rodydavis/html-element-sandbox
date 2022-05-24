import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { StringKnob } from "./string";

export const tagName = "knob-color";

@customElement(tagName)
export class ColorKnob extends StringKnob {
  buildInput() {
    return html`<input
      type="color"
      .value=${this.resolveValue(this.value)}
      @input=${this.onChange}
    />`;
  }

  resolveValue(value: string) {
    if (value && value.startsWith("--")) {
      const style = getComputedStyle(document.body);
      return style.getPropertyValue(value);
    }
    return value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ColorKnob;
  }
}
