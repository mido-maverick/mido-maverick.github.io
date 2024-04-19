// color_cell.js

class ColorCell {
    constructor(size, color) {
        const geometry = new THREE.CircleGeometry(size / 2, 6);
        const material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);;
        this.color;
    }
}

export default ColorCell;