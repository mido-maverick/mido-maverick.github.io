// main.js

import PaletteGrid from "./palette_grid.js";
import ColorCell from "./color_cell.js";

function main() {
    const width = 768;
    const height = 512;
    const paletteGridSpan = 10;
    const paletteGridSegmentCount = 8;
    const colorCellSize = 0.8 * paletteGridSpan / paletteGridSegmentCount;

    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(3 * paletteGridSpan, width / height, 0.1, 1000);
    const polarGridHelper = createPolarGridHelper();
    const axesHelper = new THREE.AxesHelper(2 * paletteGridSpan);
    const skybox = createSkybox();

    const paletteGrid = new PaletteGrid(paletteGridSpan, paletteGridSegmentCount);
    const colorCells = createColorCells(paletteGrid.coordinates);

    const initialCameraPosition = { r: 4 * paletteGridSpan, theta: -Math.PI / 4, fixedZ: 3 };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let dragging = false;
    let prevMousePosition = { x: 0, y: 0 };

    updateCameraPosition();
    updateCameraUp();
    updateCameraLookAt();

    renderer.setSize(width, height);
    document.querySelector('main').appendChild(renderer.domElement);

    colorCells.forEach(colorCell => scene.add(colorCell.mesh));
    scene.add(skybox);
    scene.add(axesHelper);
    scene.add(polarGridHelper);

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    animate();

    function animate(time) {
        time *= 0.001;

        colorCells.forEach(colorCell => { colorCell.mesh.lookAt(camera.position); });

        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    }

    function createPolarGridHelper() {
        const polarGridHelper = new THREE.PolarGridHelper(5 * paletteGridSpan, 12, 12);
        polarGridHelper.rotation.x = Math.PI / 2;
        return polarGridHelper;
    }

    function createSkybox() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./skybox_1024x.png');
        const skyboxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    }

    function createColorCells(coordinates) {
        const colorCells = [];
        coordinates.forEach(coordinate => {
            // 0 ~ 359
            const hue = (Math.atan2(coordinate.y, coordinate.x) / Math.PI * 180 % 360);
            // 1 ~ ?
            const saturation = Math.min(1, Math.sqrt(coordinate.x * coordinate.x + coordinate.y * coordinate.y) / (paletteGridSpan / 2));
            // 0 ~ ?
            const lightness = ((coordinate.z + paletteGridSpan) / (paletteGridSpan * Math.sqrt(3)));

            const Okhsl = culori.okhsl('white');
            Okhsl.h = hue;
            Okhsl.s = saturation;
            Okhsl.l = lightness;
            const Oklab = culori.convertOkhslToOklab(Okhsl);
            const rgb = culori.convertOklabToRgb(Oklab);
            const color = new THREE.Color().setRGB(rgb.r, rgb.g, rgb.b);

            const colorCell = new ColorCell(colorCellSize, color);
            colorCell.mesh.position.copy(coordinate);
            colorCells.push(colorCell);
        });
        return colorCells;
    }

    function updateCameraPosition() {
        camera.position.x = initialCameraPosition.r * Math.cos(initialCameraPosition.theta);
        camera.position.y = initialCameraPosition.r * Math.sin(initialCameraPosition.theta);
        camera.position.z = initialCameraPosition.fixedZ;
        updateCameraLookAt(0, 0, 0);
    }

    function updateCameraUp() {
        camera.up.set(0, 0, 1);
    }

    function updateCameraLookAt() {
        camera.lookAt(0, 0, 0);
    }

    function onMouseDown(event) {
        dragging = true;
        prevMousePosition.x = event.clientX;
        prevMousePosition.y = event.clientY;
    }

    function onMouseMove(event) {
        if (dragging) {
            const deltaTheta = (event.clientX - prevMousePosition.x) * -0.005;
            initialCameraPosition.theta += deltaTheta;
            updateCameraPosition();
            prevMousePosition.x = event.clientX;
            prevMousePosition.y = event.clientY;
        }
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        //raycaster.setFromCamera(mouse, camera);
        //const intersects = raycaster.intersectObjects(colorCells, true);
        //if (intersects.length > 0) {
        //    const intersectedObject = intersects[0].object;
        //    //console.log('Mouse is pointing at:', intersectedObject);
        //}
    }

    function onMouseUp(event) {
        dragging = false;
    }
}

main();
