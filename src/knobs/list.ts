import { KnobValue } from "./base";

import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

export const tagName = "knob-list";

@customElement(tagName)
export class ListKnob extends KnobValue<string> {
  constructor(name: string, val: string) {
    super(name, val);
  }

  static styles = KnobValue.styles;

  @property({
    type: String,
    attribute: "value",
  })
  _value = "";

  buildInput() {
    const options = this.getOptions();
    return html`<select @change=${this.onChange}>
      ${Array.from(options).map(
        (option) =>
          html`<option
            value=${option.value}
            .selected=${this.value === option.value}
          >
            ${option.textContent}
          </option>`
      )}
    </select>`;
  }

  getOptions() {
    const options = this.querySelectorAll(
      "option"
    ) as NodeListOf<HTMLOptionElement>;
    return Array.from(options);
  }

  onChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ListKnob;
  }
}
