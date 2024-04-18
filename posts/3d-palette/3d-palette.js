function main() {
    const width = 768;
    const height = 512;
    const paletteSize = 10;
    const paletteDivision = 12;
    const cellSize = 0.5 * paletteSize / paletteDivision;

    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    const gridHelper = createGridHelper();
    const axesHelper = new THREE.AxesHelper(1);
    const skybox = createSkybox();

    const colorCellPositions = createColorCellPositions(paletteDivision);
    const colorCells = createColorCells(colorCellPositions);

    const initialCameraPosition = { r: 4 * paletteSize, theta: -Math.PI / 4, fixedZ: 3 };
    let dragging = false;
    let prevMousePosition = { x: 0, y: 0 };

    updateCameraPosition();
    updateCameraUp();
    updateCameraLookAt();

    renderer.setSize(width, height);
    document.querySelector('main').appendChild(renderer.domElement);

    colorCells.forEach(cell => scene.add(cell));
    scene.add(skybox);
    //scene.add(axesHelper);
    //scene.add(gridHelper);

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    animate();

    function animate(time) {
        time *= 0.001;

        colorCells.forEach(cell => { cell.lookAt(camera.position); });

        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    }

    function createGridHelper() {
        const gridHelper = new THREE.GridHelper(5 * paletteSize, 5 * paletteSize);
        gridHelper.rotation.x = Math.PI / 2;
        return gridHelper;
    }

    function createSkybox() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./skybox_1024x.png');
        const skyboxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    }

    function createColorCellPositions(paletteDivision) {
        const colorCellPositions = [];
        const rotationMatrix = new THREE.Matrix4().set(
            Math.sqrt(6) / 3, -Math.sqrt(6) / 6, -Math.sqrt(6) / 6, 0,
                           0,  Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0,
            Math.sqrt(3) / 3,  Math.sqrt(3) / 3,  Math.sqrt(3) / 3, 0,
                           0,                 0,                 0, 1
        );
        const translationMatrix = new THREE.Matrix4().makeTranslation(0, 0, -paletteSize * Math.sqrt(3) / 2);
        for (let x = 0; x <= paletteSize; x += paletteSize / (paletteDivision)) {
            for (let y = 0; y <= paletteSize; y += paletteSize / (paletteDivision)) {
                for (let z = 0; z <= paletteSize; z += paletteSize / (paletteDivision)) {
                    const vector = new THREE.Vector3(x, y, z).applyMatrix4(rotationMatrix).applyMatrix4(translationMatrix);
                    colorCellPositions.push(vector);
                }
            }
        }
        return colorCellPositions;
    }

    function createColorCells(positions) {
        const colorCells = [];
        positions.forEach(coord => {
            const hue = (Math.atan2(coord.y, coord.x) / Math.PI * 180 % 360);
            const saturation = Math.min(1, Math.sqrt(coord.x * coord.x + coord.y * coord.y) / (paletteSize / 2));
            const lightness = ((coord.z + paletteSize) / (paletteSize * Math.sqrt(3)));

            const Okhsl = culori.okhsl('white');
            Okhsl.h = hue;
            Okhsl.s = saturation;
            Okhsl.l = lightness;
            console.log(Okhsl.l);
            const Oklab = culori.convertOkhslToOklab(Okhsl);
            const rgb = culori.convertOklabToRgb(Oklab);
            const color = new THREE.Color().setRGB(rgb.r, rgb.g, rgb.b);

            const geometry = new THREE.CircleGeometry(cellSize / 2, 6);
            const material = new THREE.MeshBasicMaterial({ color: color });
            const colorCell = new THREE.Mesh(geometry, material);
            colorCell.position.copy(coord);
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
    }

    function onMouseUp(event) {
        dragging = false;
    }
}

main();
