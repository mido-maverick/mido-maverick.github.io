function main() {
    // Define variables for the renderer, scene, camera, and cube
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 16/9, 0.1, 1000);
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xf08020 });
    const cube = new THREE.Mesh(geometry, material);
    
    // Set cube position
    cube.position.set(0, 0, 0);
    
    // Add cube to the scene
    scene.add(cube);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10); // 10x10 grid
    gridHelper.rotation.x = Math.PI / 2; // Rotate to align with XY plane
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5); // 5 is the length of the axes
    scene.add(axesHelper);

    // Set initial camera position and orientation
    const initialCameraPosition = { r: 5, theta: Math.PI / 4, fixedZ: 3 }; // Initial polar coordinates (r, θ) and fixed Z-coordinate
    updateCameraPosition(); // Update camera position based on initial polar coordinates
    updateCameraUp(); // Update camera up vector
    updateCameraLookAt(); // Make the camera look at the origin

    // Set up renderer
    renderer.setSize(1280, 720);

    // Append renderer's DOM element to the document body
    document.body.appendChild(renderer.domElement);

    // Variables to track mouse movement
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Event listeners for mouse input
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Function to handle mouse down event
    function onMouseDown(event) {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    // Function to handle mouse move event
    function onMouseMove(event) {
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            // Update camera position based on mouse movement
            const rotationSpeed = 0.01;
            initialCameraPosition.theta += deltaMove.x * rotationSpeed; // Update theta based on horizontal mouse movement
            updateCameraPosition(); // Update camera position based on new polar coordinates
            updateCameraLookAt(); // Update camera lookAt to always look at the origin

            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }

    // Function to handle mouse up event
    function onMouseUp(event) {
        isDragging = false;
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
}

main();
