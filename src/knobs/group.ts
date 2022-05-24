import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Knob } from "./base";

export const tagName = "knob-group";

@customElement(tagName)
export class GroupKnob extends Knob {
  constructor(name: string, knobs: Knob[] = []) {
    super(name);
    this.knobs = knobs;
  }

  static styles = css`
    details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    details summary {
      padding: 0.5rem;
    }
  `;

  knobs: Knob[];

  @property({ type: Boolean }) expanded = false;

  render() {
    return html`<details ?open=${this.expanded}>
      <summary>${this.name}</summary>
      <div class="collection">
        <slot></slot>
        ${this.knobs.map((knob) => html`${knob}`)}
      </div>
    </details>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: GroupKnob;
  }
}
