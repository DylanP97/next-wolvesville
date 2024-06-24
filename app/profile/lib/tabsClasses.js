export class Attribute {
  constructor(label, options) {
    (this.label = label), (this.options = options);
  }
}

export class Tab {
  constructor(title, emoji, attributes) {
    (this.title = title), (this.emoji = emoji), (this.attributes = attributes);
  }
}
