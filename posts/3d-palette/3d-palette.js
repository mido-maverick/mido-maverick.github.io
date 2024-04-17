function main() {
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 3/2, 0.1, 1000);
    const gridHelper = createGridHelper();
    const axesHelper = new THREE.AxesHelper(1);
    const skybox = createSkybox();
    const colorCellCoordinates = createColorCellCoordinates(6);
    const cubes = createCubes(colorCellCoordinates);

    const initialCameraPosition = { r: 10, theta: Math.PI / 4, fixedZ: 5 };
    updateCameraPosition();
    updateCameraUp();
    updateCameraLookAt();

    renderer.setSize(768, 512);
    document.querySelector('main').appendChild(renderer.domElement);

    cubes.forEach(cube => scene.add(cube));
    scene.add(gridHelper, axesHelper, skybox);

    function animate(time) {
        time *= 0.001;
        cubes.forEach(cube => {
            cube.rotation.x = time;
            cube.rotation.y = time;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    function createGridHelper() {
        const gridHelper = new THREE.GridHelper(12, 12);
        gridHelper.rotation.x = Math.PI / 2;
        return gridHelper;
    }

    function createSkybox() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('skybox_1024x.png');
        const skyboxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    }

    function createColorCellCoordinates(n) {
        const colorCellCoordinates = [];
        const rotationMatrix = new THREE.Matrix4().set(
            Math.sqrt(6)/3, -Math.sqrt(6)/6, -Math.sqrt(6)/6, 0,
                         0,  Math.sqrt(6)/6, -Math.sqrt(6)/6, 0,
            Math.sqrt(3)/3,  Math.sqrt(3)/3,  Math.sqrt(3)/3, 0,
                         0,               0,               0, 1
        );
        const translationMatrix = new THREE.Matrix4().makeTranslation(0, 0, -4);
        for (let x = 0; x < n; x++) {
            for (let y = 0; y < n; y++) {
                for (let z = 0; z < n; z++) {
                    const vector = new THREE.Vector3(x, y, z).applyMatrix4(rotationMatrix).applyMatrix4(translationMatrix);
                    colorCellCoordinates.push(vector);
                }
            }
        }
        return colorCellCoordinates;
    }

    function createCubes(coordinates) {
        const cubes = [];
        const cubeSize = 0.25;
        coordinates.forEach(coord => {
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const material = new THREE.MeshBasicMaterial({ color: 0xf08020 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.copy(coord);
            cubes.push(cube);
        });
        return cubes;
    }

    function updateCameraPosition() {
        camera.position.x = initialCameraPosition.r * Math.cos(initialCameraPosition.theta);
        camera.position.y = initialCameraPosition.r * Math.sin(initialCameraPosition.theta);
        camera.position.z = initialCameraPosition.fixedZ;
    }

    function updateCameraUp() {
        camera.up.set(0, 0, 1);
    }

    function updateCameraLookAt() {
        camera.lookAt(0, 0, 0);
    }
}

main();