// color_cell.js

class ColorCell {
    constructor(size, position, paletteGridSpan) {
        const okhsl = culori.okhsl('black');
        okhsl.h = (Math.atan2(position.y, position.x) / Math.PI * 180 % 360);
        okhsl.s = Math.min(1, Math.sqrt(position.x * position.x + position.y * position.y) / (paletteGridSpan / 2));
        okhsl.l = ((position.z + paletteGridSpan) / (paletteGridSpan * Math.sqrt(3)));
        const oklab = culori.convertOkhslToOklab(okhsl);
        const rgb = culori.convertOklabToRgb(oklab);
        this.color = new THREE.Color().setRGB(rgb.r, rgb.g, rgb.b);
        const geometry = new THREE.CircleGeometry(size / 2, 6);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        //console.log('h:', okhsl.h.toFixed(3), 's:', okhsl.s.toFixed(3), 'l:', okhsl.l.toFixed(3));
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