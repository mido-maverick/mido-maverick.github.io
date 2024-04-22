// color_cell.js

class ColorCell {
    constructor(size, position, paletteGridSpan) {
        const oklab = culori.oklab('black');
        oklab.l = position.z / (paletteGridSpan * Math.sqrt(3)) + 0.5;
        oklab.a = position.x / (paletteGridSpan * Math.sqrt(3));
        oklab.b = position.y / (paletteGridSpan * Math.sqrt(3));
        const rgb = culori.convertOklabToRgb(oklab);
        this.color = new THREE.Color().setRGB(rgb.r, rgb.g, rgb.b);
        const geometry = new THREE.CircleGeometry(size / 2, 6);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        //console.log('l:', oklab.l.toFixed(3), 'a:', oklab.a.toFixed(3), 'b:', oklab.b.toFixed(3));
        //console.log('r:', rgb.r.toFixed(3), 'g:', rgb.g.toFixed(3), 'b:', rgb.b.toFixed(3));
    }

    isWithinSRGBGamut() {
        return this.color.r >= 0.0 &&
            this.color.g >= 0.0 &&
            this.color.b >= 0.0 &&
            this.color.r <= 1.0 &&
            this.color.g <= 1.0 &&
            this.color.b <= 1.0;
    }
}

export default ColorCell;