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
    }

    isWithinSRGBGAmut() {
        return false;
    }
}

export default ColorCell;