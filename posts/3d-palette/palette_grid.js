// palette_grid.js

class PaletteGrid {
    constructor(span, segmentCount) {
        this.span = span;
        this.segments = segmentCount;
        this.coordinates = [];
        const rotationMatrix = new THREE.Matrix4().set(
            Math.sqrt(6) / 3, -Math.sqrt(6) / 6, -Math.sqrt(6) / 6, 0,
                           0,  Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0,
            Math.sqrt(3) / 3,  Math.sqrt(3) / 3,  Math.sqrt(3) / 3, 0,
                           0,                 0,                 0, 1
        );
        const translationMatrix = new THREE.Matrix4().makeTranslation(0, 0, -span * Math.sqrt(3) / 2);
        for (let x = 0; x <= span; x += span / (segmentCount)) {
            for (let y = 0; y <= span; y += span / (segmentCount)) {
                for (let z = 0; z <= span; z += span / (segmentCount)) {
                    const coordinate = new THREE.Vector3(x, y, z).applyMatrix4(rotationMatrix).applyMatrix4(translationMatrix);
                    this.coordinates.push(coordinate);
                }
            }
        }
    }
}

export default PaletteGrid;