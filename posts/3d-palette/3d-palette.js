function main() {
    // Define variables for the renderer, scene, camera, and cubes
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 3/2, 0.1, 1000);
    const gridHelper = createGridHelper(); // Create grid helper
    const axesHelper = new THREE.AxesHelper(1); // 1 is the length of the axes
    const skybox = createSkybox(); // Create skybox

    const colorCellCoordinates = createColorCellCoordinates(5);
    const cubes = createCubes(colorCellCoordinates); // Create cubes based on coordinates

    // Set initial camera position and orientation
    const initialCameraPosition = { r: 10, theta: Math.PI / 4, fixedZ: 5 }; // Initial polar coordinates (r, θ) and fixed Z-coordinate
    updateCameraPosition(); // Update camera position based on initial polar coordinates
    updateCameraUp(); // Update camera up vector
    updateCameraLookAt(); // Make the camera look at the origin

    // Set up renderer
    renderer.setSize(768, 512);

    // Append renderer's DOM element to the document body
    document.querySelector('main').appendChild(renderer.domElement);

    // Add objects to the scene
    cubes.forEach(cube => scene.add(cube));
    scene.add(gridHelper);
    scene.add(axesHelper);
    scene.add(skybox); // Add skybox to the scene

    // Animation loop
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

    // Function to create the grid helper
    function createGridHelper() {
        const gridHelper = new THREE.GridHelper(12, 12); // 10x10 grid
        gridHelper.rotation.x = Math.PI / 2; // Rotate to align with XY plane
        return gridHelper;
    }

    // Function to create the skybox
    function createSkybox() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('skybox_1024x.png'); // Replace 'sky_texture.jpg' with the path to your sky texture
        const skyboxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000); // Adjust size as needed
        return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    }

    function createColorCellCoordinates(n) {
        let colorCellCoordinates = [];
        for (let x = 0; x < n; x++) {
            for (let y = 0; y < n; y++) {
                for (let z = 0; z < n; z++) {
                    colorCellCoordinates.push(new THREE.Vector3(x, y, z));
                }
            }
        }
        return colorCellCoordinates;
    }

    // Function to create cubes based on coordinates
    function createCubes(coordinates) {
        const cubes = [];
        const cubeSize = 0.25; // Adjust size as needed

        coordinates.forEach(coord => {
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const material = new THREE.MeshBasicMaterial({ color: 0xf08020 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.copy(coord); // Set cube position based on coordinate
            cubes.push(cube);
        });

        return cubes;
    }

    // Function to update camera position based on polar coordinates (r, θ) and fixed Z-coordinate
    function updateCameraPosition() {
        camera.position.x = initialCameraPosition.r * Math.cos(initialCameraPosition.theta);
        camera.position.y = initialCameraPosition.r * Math.sin(initialCameraPosition.theta);
        camera.position.z = initialCameraPosition.fixedZ;
    }

    // Function to update camera up vector
    function updateCameraUp() {
        camera.up.set(0, 0, 1); // Set the "up" direction to be parallel to the positive Z-axis
    }

    // Function to update camera lookAt to always look at the origin
    function updateCameraLookAt() {
        camera.lookAt(0, 0, 0);
    }
}

main();
