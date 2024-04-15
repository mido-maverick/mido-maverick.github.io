function main() {
    // Define variables for the renderer, scene, camera, and cube
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xf08020 });
    const cube = new THREE.Mesh(geometry, material);
    
    // Set camera position
    camera.position.z = 5;
    
    // Add cube to the scene
    scene.add(cube);

    // Set up renderer
    renderer.setSize(640, 360);

    // Append renderer's DOM element to the document body
    document.body.appendChild(renderer.domElement);

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
