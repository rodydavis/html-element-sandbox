import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./knobs/boolean";
import "./knobs/string";
import "./knobs/number";
import "./knobs/color";
import "./knobs/list";
import "./knobs/group";
import { KnobValue } from "./knobs/base";
import { BooleanKnob } from "./knobs/boolean";

export const tagName = "html-element-sandbox";

@customElement(tagName)
export class HTMLElementSandbox extends LitElement {
  static styles = css`
    main {
      --knobs-width: 300px;
      --code-height: calc(100% * 0.4);
      --mobile-height: 350px;
      display: grid;
      grid-template-areas: "preview" "knobs" "code";
      grid-template-columns: 100%;
      grid-template-rows: var(--mobile-height) auto auto;
      height: 100%;
      width: 100%;
    }
    #preview {
      grid-area: preview;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #272727;
      background-color: whitesmoke;
    }
    @media (min-width: 600px) {
      main {
        grid-template-areas:
          "preview knobs"
          "code knobs";
        grid-template-columns: calc(100% - var(--knobs-width)) var(
            --knobs-width
          );
        grid-template-rows: calc(100% - var(--code-height)) var(--code-height);
      }
      #preview {
        border-bottom: none;
      }
      slot[name="knobs"] {
        overflow-y: auto;
      }
      pre {
        overflow-y: scroll;
      }
    }
    section {
      flex: 1;
    }
    slot[name="knobs"] {
      grid-area: knobs;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #000;
    }
    slot[name="code"] {
      grid-area: code;
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
    this.init();
  }

  init() {
    this.setUpKnobs();
    this.code = this.getCode();
    // Update the code every time a knob value changes
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
      // Text Knobs (knob-text)
      div.querySelectorAll("[knob-text]").forEach((el) => {
        const elemId = el.getAttribute("knob-text") || "";
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
          // CSS Knobs (knob-css-*)
          if (attrName.startsWith("knob-css-")) {
            const cssKey = attrName.replace("knob-css-", "");
            const knob = this.querySelector(`#${attr.value}`);
            if (
              knob &&
              knob instanceof KnobValue &&
              el instanceof HTMLElement
            ) {
              knob.addEventListener("value", () => {
                const val = knob.value;
                if (knob.hasAttribute("suffix")) {
                  // Add suffix to the value (e.g. px)
                  el.style.setProperty(
                    cssKey,
                    val + knob.getAttribute("suffix")
                  );
                } else {
                  // No suffix, just set the value
                  el.style.setProperty(cssKey, val);
                }
              });
              knob.init();
            }
          }
          // Attribute Knobs (knob-attr-*)
          if (attrName.startsWith("knob-attr-")) {
            const attrKey = attrName.replace("knob-attr-", "");
            const knob = this.querySelector(`#${attr.value}`);
            if (knob && knob instanceof KnobValue) {
              knob.addEventListener("value", () => {
                const val = knob.value;
                if (knob instanceof BooleanKnob) {
                  if (val) {
                    // <div hidden>
                    el.setAttribute(attrKey, "");
                  } else {
                    // <div>
                    el.removeAttribute(attrKey);
                  }
                } else {
                  // <div value="foo">
                  el.setAttribute(attrKey, val);
                }
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
        const lines = this.elementToString(child.children[0]);
        // Trim empty lines
        const linesArray = lines.split("\n");
        const filteredLines = linesArray.filter((line) => line.trim() !== "");
        return filteredLines.join("\n");
      }
    }
    return "";
  }

  elementToString(node: Element) {
    const sb: string[] = [];
    const tag = node.tagName.toLowerCase();
    const attrs = node.attributes;
    // Add attributes
    if (attrs.length > 0) {
      sb.push(`<${tag}`);
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.name.startsWith("knob-")) continue;
        // If the attribute is a boolean attribute, add it only if it's true
        if (attr.value === "") {
          sb.push(` ${attr.name}`);
        } else {
          sb.push(` ${attr.name}="${attr.value}"`);
        }
      }
      sb.push(">");
    } else {
      sb.push(`<${tag}>`);
    }
    if (node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        // If the child is a text node, add the content
        if (child instanceof Text) {
          sb.push(child.textContent || "");
        } else if (child instanceof Element) {
          // If the child is an element, recurse
          sb.push(this.elementToString(child));
        }
      }
    }
    sb.push(`</${tag}>`);
    return sb.join("\n");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: HTMLElementSandbox;
  }
}
