# HTML Element Sandbox

![](screenshots/preview.png)

```html
<html-element-sandbox>
  <template>
    <button
      class="button"
      data-knob-text="label"
      data-knob-css-color="fg-color"
      data-knob-css-background-color="bg-color"
      data-knob-css-border-radius="shape"
      data-knob-css-font-size="text-font-size"
      data-knob-css-padding="padding"
      data-knob-attr-contenteditable="content-editable"
    >
      Elevated
    </button>
    <link rel="stylesheet" href="style.css" />
  </template>
  <div slot="knobs">
    <knob-string id="label" name="Data" value="BUTTON"></knob-string>
    <knob-group name="Style" expanded>
      <knob-color
        id="bg-color"
        name="Background Color"
        value="--md-sys-color-primary"
      ></knob-color>
      <knob-color
        id="fg-color"
        name="Foreground Color"
        value="--md-sys-color-on-primary"
      ></knob-color>
      <knob-number
        id="text-font-size"
        name="Font Size"
        value="20"
        suffix="px"
      ></knob-number>
      <knob-number
        id="shape"
        name="Border Radius"
        value="20"
        suffix="px"
      ></knob-number>
      <knob-number
        id="padding"
        name="Padding"
        value="20"
        suffix="px"
      ></knob-number>
    </knob-group>
    <knob-group name="Attributes" expanded>
      <knob-boolean
        id="content-editable"
        name="Content Editable"
        value="false"
      ></knob-boolean>
    </knob-group>
  </div>
</html-element-sandbox>
<script type="module" src="https://rodydavis.github.io/html-element-sandbox/html-element-sandbox.es.js"></script>
```
