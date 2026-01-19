// Mock Layout State
const initialLayout = {
  rows: 4,
  cols: 12,
  cells: [
    { id: "c1", row: 0, col: 0, rowSpan: 2, colSpan: 6 },
    { id: "c2", row: 0, col: 6, rowSpan: 2, colSpan: 6 },
    { id: "c3", row: 2, col: 0, rowSpan: 2, colSpan: 6 },
    { id: "c4", row: 2, col: 6, rowSpan: 2, colSpan: 6 },
  ],
};

// Utils
const isCellOccupied = (layout, row, col) => {
  return (
    layout.cells.find((cell) => {
      const rowEnd = cell.row + cell.rowSpan;
      const colEnd = cell.col + cell.colSpan;
      return row >= cell.row && row < rowEnd && col >= cell.col && col < colEnd;
    }) !== undefined
  );
};

// Logic: Find Position
const findPositionForNewBox = (layout, colSpan, rowSpan) => {
  const currentMaxRow =
    layout.cells.length > 0
      ? Math.max(...layout.cells.map((c) => c.row + c.rowSpan))
      : 0;

  // Bug fix verification: Scan limit
  const scanLimit = Math.max(layout.rows, currentMaxRow) + rowSpan + 1;

  for (let r = 0; r < scanLimit; r++) {
    for (let c = 0; c <= layout.cols - colSpan; c++) {
      let fits = true;
      for (let ir = 0; ir < rowSpan; ir++) {
        for (let ic = 0; ic < colSpan; ic++) {
          if (isCellOccupied(layout, r + ir, c + ic)) {
            fits = false;
            break;
          }
        }
        if (!fits) break;
      }
      if (fits) return { row: r, col: c };
    }
  }
  return { row: currentMaxRow, col: 0 };
};

// Logic: Check Collision (Swap)
const checkCollision = (cells) => {
  return cells.some((c1, i) => {
    return cells.some((c2, j) => {
      if (i === j) return false;
      return (
        c1.row < c2.row + c2.rowSpan &&
        c1.row + c1.rowSpan > c2.row &&
        c1.col < c2.col + c2.colSpan &&
        c1.col + c1.colSpan > c2.col
      );
    });
  });
};

// TEST 1: Delete Box at 0,0 and find position
console.log("=== TEST 1: Delete & Add ===");
let layout = JSON.parse(JSON.stringify(initialLayout));
console.log("Initial cells:", layout.cells.length);

// Delete/Remove
const idToRemove = "c1"; // at 0,0
layout.cells = layout.cells.filter((c) => c.id !== idToRemove);
console.log(
  "Deleted c1. Remaining cells:",
  layout.cells.map((c) => c.id),
);

// Find position for 4x2 box
const pos = findPositionForNewBox(layout, 4, 2);
console.log("Found position for 4x2 box:", pos);

if (pos.row === 0 && pos.col === 0) {
  console.log("PASSED: Correctly found the empty spot at 0,0");
} else {
  console.error("FAILED: Did not find 0,0. Found:", pos);
  process.exit(1);
}

// TEST 2: Invalid Swap (Overlap)
console.log("\n=== TEST 2: Swap Safety (Overlap) ===");
// Setup mismatch sizes
layout = {
  rows: 4,
  cols: 12,
  cells: [
    { id: "Big", row: 0, col: 0, rowSpan: 4, colSpan: 4 }, // Big box
    { id: "Small", row: 0, col: 4, rowSpan: 2, colSpan: 2 }, // Small box next to it
    { id: "Other", row: 2, col: 4, rowSpan: 2, colSpan: 2 }, // Another box below small
  ],
};
// Try swapping Big and Small
const c1 = layout.cells[0]; // Big
const c2 = layout.cells[1]; // Small

const newCells = layout.cells.map((c) => {
  if (c.id === "Big") return { ...c, row: c2.row, col: c2.col }; // Big moves to 0,4
  if (c.id === "Small") return { ...c, row: c1.row, col: c1.col }; // Small moves to 0,0
  return c;
});

// Big is now at 0,4 (4x4). It spans cols 4-8, rows 0-4.
// 'Other' is at 2,4 (2x2). Spans cols 4-6, rows 2-4.
// They SHOULD overlap.
const collision = checkCollision(newCells);
console.log("Overlap detected:", collision);

if (collision) {
  console.log("PASSED: Prevented invalid swap.");
} else {
  console.error("FAILED: Allowed overlapping swap!");
  process.exit(1);
}

// TEST 3: Valid Swap
console.log("\n=== TEST 3: Valid Swap ===");
// Setup compatible sizes or positions
layout = {
  rows: 4,
  cols: 12,
  cells: [
    { id: "A", row: 0, col: 0, rowSpan: 2, colSpan: 6 },
    { id: "B", row: 0, col: 6, rowSpan: 2, colSpan: 6 },
  ],
};
const cellsSwap = layout.cells.map((c) => {
  if (c.id === "A") return { ...c, row: 0, col: 6 };
  if (c.id === "B") return { ...c, row: 0, col: 0 };
  return c;
});
const collision3 = checkCollision(cellsSwap);
console.log("Overlap detected:", collision3);

if (!collision3) {
  console.log("PASSED: Allowed valid swap.");
} else {
  console.error("FAILED: Blocked valid swap!");
  process.exit(1);
}

console.log("\nALL TESTS PASSED");
