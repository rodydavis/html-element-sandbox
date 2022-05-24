import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./knobs/boolean";
import "./knobs/string";
import "./knobs/number";
import "./knobs/color";
import "./knobs/group";
import { KnobValue } from "./knobs/base";

@customElement("html-element-sandbox")
export class HTMLElementSandbox extends LitElement {
  static styles = css`
    main {
      --knobs-width: 300px;
      --code-height: calc(100% * 0.4);
      display: grid;
      grid-template-areas:
        "preview knobs"
        "code knobs";
      grid-template-columns: calc(100% - var(--knobs-width)) var(--knobs-width);
      grid-template-rows: calc(100% - var(--code-height)) var(--code-height);
      height: 100%;
      width: 100%;
    }
    section {
      flex: 1;
    }
    slot[name="knobs"] {
      grid-area: knobs;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #000;
      overflow-y: auto;
    }
    slot[name="code"] {
      grid-area: code;
      overflow-y: auto;
    }
    pre {
      margin: 0;
      font-family: Monaco, Courier, monospace;
      padding: 16px;
      background-color: #272727;
      color: #c8c8c8;
    }
    code {
      font-size: 0.8rem;
      white-space: pre-wrap;
    }
    #preview {
      grid-area: preview;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `;

  @state() code = "";

  render() {
    return html`<main>
      <section id="preview">
        <slot></slot>
      </section>
      <slot name="knobs"> </slot>
      <slot name="code">
        <pre><code>${this.code}</code></pre>
      </slot>
    </main>`;
  }

  firstUpdated() {
    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  init() {
    this.setUpKnobs();
    this.code = this.getCode();
    this.addEventListener("value", () => {
      this.code = this.getCode();
    });
  }

  setUpKnobs() {
    const root = this.shadowRoot!;
    const preview = root.getElementById("preview")!;
    const template = this.querySelector("template");
    if (template) {
      const div = document.createElement("div");
      div.appendChild(template.content.cloneNode(true));
      // Text Knobs
      div.querySelectorAll("[data-knob-text]").forEach((el) => {
        const elemId = el.getAttribute("data-knob-text") || "";
        const knob = this.querySelector(`#${elemId}`);
        if (knob && knob instanceof KnobValue) {
          knob.addEventListener("value", () => {
            const val = knob.value;
            el.textContent = val;
          });
          el.addEventListener("input", (e) => {
            const target = e.target as HTMLElement;
            knob.value = target.textContent;
          });
          knob.init();
        }
      });
      div.querySelectorAll("*").forEach((el) => {
        const attrs = el.attributes;
        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          const attrName = attr.name;
          // CSS Knobs
          if (attrName.startsWith("data-knob-css-")) {
            const cssKey = attrName.replace("data-knob-css-", "");
            const knob = this.querySelector(`#${attr.value}`);
            if (
              knob &&
              knob instanceof KnobValue &&
              el instanceof HTMLElement
            ) {
              knob.addEventListener("value", () => {
                const val = knob.value;
                if (knob.hasAttribute("suffix")) {
                  el.style.setProperty(
                    cssKey,
                    val + knob.getAttribute("suffix")
                  );
                } else {
                  el.style.setProperty(cssKey, val);
                }
              });
              knob.init();
            }
          }
          // Attribute Knobs
          if (attrName.startsWith("data-knob-attr-")) {
            const attrKey = attrName.replace("data-knob-attr-", "");
            const knob = this.querySelector(`#${attr.value}`);
            if (knob && knob instanceof KnobValue) {
              knob.addEventListener("value", () => {
                const val = knob.value;
                el.setAttribute(attrKey, val);
              });
              knob.init();
            }
          }
        }
      });
      preview.appendChild(div);
    }
  }

  getCode() {
    const root = this.shadowRoot!;
    const preview = root.getElementById("preview")!;
    if (preview.children.length > 0) {
      const child = preview.children[1];
      if (child && child.children.length > 0) {
        return this.elementToString(child.children[0]);
      }
    }
    return "";
  }

  elementToString(node: Element) {
    const sb: string[] = [];
    sb.push(`<${node.tagName.toLowerCase()}`);
    const attrs = node.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (attr.name.startsWith("data-knob-")) continue;
      sb.push(` ${attr.name}="${attr.value}"`);
    }
    sb.push(">");
    if (node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child instanceof Text) {
          sb.push(child.textContent || "");
        } else if (child instanceof Element) {
          sb.push(this.elementToString(child));
        }
      }
    }
    sb.push(`</${node.tagName.toLowerCase()}>`);
    return sb.join("\n");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "html-element-sandbox": HTMLElementSandbox;
  }
}
