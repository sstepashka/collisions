"use strict";

class Cuboid {
  constructor(x, y, z, width, height, depth) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }

  get #x_range() {
    return new Range(this.x, this.x + this.width);
  }

  get #y_range() {
    return new Range(this.y, this.y + this.height);
  }

  get #z_range() {
    return new Range(this.z, this.z + this.depth);
  }

  collide(other) {
    return this.#x_range.collide(other.#x_range) && this.#y_range.collide(other.#y_range) && this.#z_range.collide(other.#z_range);
  }

  overlap(other) {
    if (!this.collide(other)) {
      throw 'Cuboids do not collide.';
    }

    const x_overlap = this.#x_range.overlap(other.#x_range);
    const y_overlap = this.#y_range.overlap(other.#y_range);
    const z_overlap = this.#z_range.overlap(other.#z_range);

    return new Cuboid(
      x_overlap.from,
      y_overlap.from,
      z_overlap.from,
      x_overlap.length,
      y_overlap.length,
      z_overlap.length,
    );
  }
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;
  }

  collide(other) {
    return this.#x_range.collide(other.#x_range) && this.#y_range.collide(other.#y_range);
  }

  contains(x, y) {
    return this.#x_range.contains(x) && this.#y_range.contains(y);
  }

  get #x_range() {
    return new Range(this.x, this.x + this.width);
  }

  get #y_range() {
    return new Range(this.y, this.y + this.height);
  }

  overlap(other) {
    if (!this.collide(other)) {
      throw 'Rectangles do not collide.';
    }

    const x_overlap = this.#x_range.overlap(other.#x_range);
    const y_overlap = this.#y_range.overlap(other.#y_range);

    return new Rectangle(
      x_overlap.from,
      y_overlap.from,
      x_overlap.length,
      y_overlap.length);
  }
};

class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  get length() {
    return Math.abs(this.to - this.from);
  }

  #minmax(one, two) {
    if (one > two) {
      return [two, one];
    }

    return [one, two];
  }

  #normalize_range(range) {
    const [from, to] = this.#minmax(range.from, range.to);
    return new Range(from, to);
  }

  contains(value) {
    let [min, max] = this.#minmax(this.from, this.to);
    return value > min && value < max;
  }

  collide(other) {
    const norm_one = this.#normalize_range(this);
    const norm_two = this.#normalize_range(other);

    return norm_one.to > norm_two.from && norm_two.to > norm_one.from;
  }

  overlap(other) {
    if (!this.collide(other)) {
      throw 'Ranges do not collide.';
    }

    const norm_this = this.#normalize_range(this);
    const norm_other = this.#normalize_range(other);

    return new Range(
      Math.max(norm_this.from, norm_other.from),
      Math.min(norm_this.to, norm_other.to));
  }
};

