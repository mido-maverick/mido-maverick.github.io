function main() {
    // Define variables for the renderer, scene, camera, and cube
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 3/2, 0.1, 1000);
    const cube = createCube();
    const gridHelper = createGridHelper(); // Create grid helper
    const axesHelper = new THREE.AxesHelper(1); // 1 is the length of the axes
    const skybox = createSkybox(); // Create skybox

    // Set initial camera position and orientation
    const initialCameraPosition = { r: 5, theta: Math.PI / 4, fixedZ: 3 }; // Initial polar coordinates (r, θ) and fixed Z-coordinate
    updateCameraPosition(); // Update camera position based on initial polar coordinates
    updateCameraUp(); // Update camera up vector
    updateCameraLookAt(); // Make the camera look at the origin

    // Set up renderer
    renderer.setSize(768, 512);

    // Append renderer's DOM element to the document body
    document.querySelector('main').appendChild(renderer.domElement);

    // Add objects to the scene
    scene.add(cube);
    scene.add(gridHelper);
    scene.add(axesHelper);
    scene.add(skybox); // Add skybox to the scene

    // Animation loop
    function animate(time) {
        time *= 0.001;

        const rotation = time;
        cube.rotation.x = rotation;
        cube.rotation.y = rotation;

        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    }

    animate();

    // Function to create the cube
    function createCube() {
        const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        const material = new THREE.MeshBasicMaterial({ color: 0xf08020 });
        return new THREE.Mesh(geometry, material);
    }

    // Function to create the grid helper
    function createGridHelper() {
        const gridHelper = new THREE.GridHelper(10, 10); // 10x10 grid
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
