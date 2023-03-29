describe("One-Domentional Collision", function() {
  it("two segments do not collide", function() {
    expect(((new Range(0, 5)).collide(new Range(7, 10)))).toBe(false);
  });

  it("two segments collide", function() {
    expect(((new Range(0, 5)).collide(new Range(4, 11)))).toBe(true);
  });

  it("one segment completely covers other segment collide", function() {
    expect(((new Range(0, 20)).collide(new Range(4, 11)))).toBe(true);
  });

  it("invert one segment completely covers other segment collide", function() {
    expect(((new Range(4, 11)).collide(new Range(0, 20)))).toBe(true);
  });

  it("right side of segment is exclusive, must not collide", function() {
    expect(((new Range(1, 4)).collide(new Range(4, 7)))).toBe(false);
    expect(((new Range(4, 7)).collide(new Range(1, 4)))).toBe(false);
  });

  it("first segment components in descending order shouldn't change result", function() {
    expect(((new Range(4, 1)).collide(new Range(3, 5)))).toBe(true);
  });

  it("second segment components in descending order shouldn't change result", function() {
    expect(((new Range(1, 4)).collide(new Range(5, 3)))).toBe(true);
  });

  it("when second segment on right side of first segment do not collide", function() {
    expect(((new Range(5, 3)).collide(new Range(1, 2)))).toBe(false);
  });

  it("two segments do not collide", function() {
    expect((new Range(0, 5)).collide(new Range(7, 10))).toBe(false);
  });

  it("[0, 5] overlaps [3, 7] in [3, 5]", function() {
    const overlap = (new Range(0, 5)).overlap(new Range(3, 7));

    expect(overlap.from).toBe(3);
    expect(overlap.to).toBe(5);
  });

  it("[3, 7] overlaps [0, 5] in [3, 5]", function() {
    const overlap = (new Range(3, 7)).overlap(new Range(0, 5));

    expect(overlap.from).toBe(3);
    expect(overlap.to).toBe(5);
  });

  it("[7, 3] overlaps [0, 5] in [3, 5]", function() {
    const overlap = (new Range(7, 3)).overlap(new Range(0, 5));

    expect(overlap.from).toBe(3);
    expect(overlap.to).toBe(5);
  });

  it("[7, 3] overlaps [5, 0] in [3, 5]", function() {
    const overlap = (new Range(7, 3)).overlap(new Range(5, 0));

    expect(overlap.from).toBe(3);
    expect(overlap.to).toBe(5);
  });

  it("overlap throws when ranges do not overlap", function() {
    expect(function () {
      (new Range(0, 7)).overlap(new Range(10, 12));
    }).toThrow();
  });
});

describe("2D-Rectangle Collision", function() {
  it("can create a parametrized rectangle", function() {
    let rectangle = new Rectangle(4, 5, 6, 7);
    expect(rectangle.x).toBe(4);
    expect(rectangle.y).toBe(5);
    expect(rectangle.width).toBe(6);
    expect(rectangle.height).toBe(7);
  });

  it("contains return true for a point inside of the rectangle", function() {
    let rectangle = new Rectangle(1, 1, 10, 20);
    expect(rectangle.contains(2, 2)).toBe(true);
  });

  it("contains return false for a point inside of the rectangle", function() {
    let rectangle = new Rectangle(1, 1, 10, 20);
    expect(rectangle.contains(50, 2)).toBe(false);
    expect(rectangle.contains(2, 50)).toBe(false);
  });

  it("collide returns false for 2 non-colliding rectangles", function() {
    expect((new Rectangle(0, 0, 100, 20)).collide(new Rectangle(0, 40, 20, 20))).toBe(false);
  });

  it("collide returns true for 2 colliding rectangles", function() {
    expect((new Rectangle(0, 0, 100, 20)).collide(new Rectangle(10, 10, 20, 20))).toBe(true);
  });

  it("overlap for bottom right corner return correct ovelap rectangle", function() {
    const rectangle = new Rectangle(0, 0, 50, 20);
    const other_rectangle = new Rectangle(30, 10, 30, 40);

    const overlap = rectangle.overlap(other_rectangle);
    expect(overlap.x).toBe(30);
    expect(overlap.y).toBe(10);
    expect(overlap.width).toBe(20);
    expect(overlap.height).toBe(10);
  });

  it("ove more overlap for bottom right corner return correct ovelap rectangle", function() {
    const rectangle = new Rectangle(10, 10, 70, 40);
    const other_rectangle = new Rectangle(30, 30, 100, 40);

    const overlap = rectangle.overlap(other_rectangle);
    expect(overlap.x).toBe(30);
    expect(overlap.y).toBe(30);
    expect(overlap.width).toBe(50);
    expect(overlap.height).toBe(20);
  });
});


describe("Cuboid Collision", function() {
  it("collides", function() {
    const cuboid = new Cuboid(0, 0, 0, 100, 200, 300);
    const overlap = cuboid.overlap(new Cuboid(50, 40, 30, 10, 200, 300));

    expect(overlap.x).toBe(50);
    expect(overlap.y).toBe(40);
    expect(overlap.z).toBe(30);

    expect(overlap.width).toBe(10);
    expect(overlap.height).toBe(160);
    expect(overlap.depth).toBe(270);
  });
});
