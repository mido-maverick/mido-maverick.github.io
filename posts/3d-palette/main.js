// main.js

import PaletteGrid from "./palette_grid.js";
import ColorCell from "./color_cell.js";

function main() {
    // Constants
    const width = 960;
    const height = 540;
    const paletteGridSpan = 10;
    const paletteGridSegmentCount = 24;
    const colorCellSize = Math.sqrt(3) * paletteGridSpan / paletteGridSegmentCount;

    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    const polarGridHelper = createPolarGridHelper();
    const axesHelper = new THREE.AxesHelper(2 * paletteGridSpan);
    const skybox = createSkybox();

    const paletteGrid = new PaletteGrid(paletteGridSpan, paletteGridSegmentCount);
    const colorCells = createColorCells(paletteGrid.coordinates);

    const cameraPolarCoordinates = { r: 2 * paletteGridSpan, thetaHorizontal: -Math.PI / 4, thetaVertical: 0 };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Variables
    let dragging = false;
    let prevMousePosition = { x: 0, y: 0 };

    // Render setup
    renderer.setSize(width, height);
    document.querySelector('main').appendChild(renderer.domElement);

    // Scene setup
    colorCells.forEach(colorCell => {
        if (colorCell.isWithinSRGBGamut() && true) {
            scene.add(colorCell.mesh);
        }
    });
    scene.add(skybox);
    //scene.add(axesHelper);
    //scene.add(polarGridHelper);

    // Event listeners
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Animation
    animate();


    // Functions
    function animate(time) {
        updateCameraPosition();
        updateCameraUp();
        updateCameraLookAt();

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
        coordinates.forEach(coordinate => { colorCells.push(new ColorCell(colorCellSize, coordinate, paletteGridSpan)); });
        return colorCells;
    }

    function updateCameraPosition() {
        camera.position.x = cameraPolarCoordinates.r * Math.cos(cameraPolarCoordinates.thetaVertical) * Math.cos(cameraPolarCoordinates.thetaHorizontal);
        camera.position.y = cameraPolarCoordinates.r * Math.cos(cameraPolarCoordinates.thetaVertical) * Math.sin(cameraPolarCoordinates.thetaHorizontal);
        camera.position.z = cameraPolarCoordinates.r * Math.sin(cameraPolarCoordinates.thetaVertical);
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
            const deltaThetaHorizontal = (event.clientX - prevMousePosition.x) * 0.005;
            const deltaThetaVertical = (event.clientY - prevMousePosition.y) * 0.005;
            cameraPolarCoordinates.thetaHorizontal -= deltaThetaHorizontal;
            cameraPolarCoordinates.thetaVertical += deltaThetaVertical;
            cameraPolarCoordinates.thetaVertical = Math.min(Math.PI / 2, cameraPolarCoordinates.thetaVertical);
            cameraPolarCoordinates.thetaVertical = Math.max(-Math.PI / 2, cameraPolarCoordinates.thetaVertical);
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
