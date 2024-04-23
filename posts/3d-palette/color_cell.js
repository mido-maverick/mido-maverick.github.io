// color_cell.js

class ColorCell {
    constructor(size, position, paletteGridSpan) {
        const oklab = culori.oklab('black');
        oklab.l = position.z / (paletteGridSpan * Math.sqrt(3)) * 2 + 0.5;
        oklab.a = position.x / (paletteGridSpan * Math.sqrt(3)) * 2;
        oklab.b = position.y / (paletteGridSpan * Math.sqrt(3)) * 2;
        const rgb = culori.convertOklabToRgb(oklab);
        this.color = new THREE.Color().setRGB(rgb.r, rgb.g, rgb.b);
        const geometry = new THREE.CircleGeometry(size / 2, 6);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
    }

    isWithinSRGBGamut() {
        return this.color.r.toFixed(6) >= 0.0 &&
            this.color.g.toFixed(6) >= 0.0 &&
            this.color.b.toFixed(6) >= 0.0 &&
            this.color.r.toFixed(6) <= 1.0 &&
            this.color.g.toFixed(6) <= 1.0 &&
            this.color.b.toFixed(6) <= 1.0;
    }
}

export default ColorCell;