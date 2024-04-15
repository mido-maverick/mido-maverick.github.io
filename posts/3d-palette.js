main();

function main()
{
    const create3DEnvironment = () =>
    {

        const scene = new THREE.Scene();

        const fieldOfView = 75;
        const aspect = 16/9;
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
        camera.position.z = 5;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0xf08020});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(640, 360);
        renderer.render(scene, camera);
        document.body.appendChild(renderer.domElement);
    }

    create3DEnvironment();
}