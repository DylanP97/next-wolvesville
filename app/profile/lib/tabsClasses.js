export class Attribute {
  constructor(path, label, options) {
    (this.path = path), (this.label = label), (this.options = options);
  }
}

export class Tab {
  constructor(title, emoji, attributes) {
    (this.title = title), (this.emoji = emoji), (this.attributes = attributes);
  }
}
