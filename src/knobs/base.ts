import { css, html, LitElement, TemplateResult } from "lit";
import { property } from "lit/decorators.js";

export class Knob extends LitElement {
  constructor(name: string) {
    super();
    this.name = name;
  }

  @property() name: string;
}

export abstract class KnobValue<T> extends Knob {
  constructor(name: string, public val: T) {
    super(name);
    this._value = val;
    this.notify();
  }

  static styles = css`
    .knob {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0.5rem;
    }
    .knob label {
      flex: 1;
    }
  `;

  _value: T;

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    this.notify();
  }

  notify() {
    const value = this.value;
    this.onValue(value);
    this.dispatchEvent(
      new CustomEvent("value", {
        detail: value,
        bubbles: true,
        composed: true,
      })
    );
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="knob">
        <label>${this.name}</label>
        ${this.buildInput()}
      </div>
    `;
  }

  onValue(_val: T) {}

  init() {
    this.notify();
  }

  resolveValue(val: T) {
    return val;
  }

  abstract buildInput(): TemplateResult;
}
