
document.addEventListener('DOMContentLoaded', function() {
    const moon = document.querySelector('#moon');
    const africa = document.querySelector('#africa');

    let rotationSpeed = 0.2;

    function animate() {
        requestAnimationFrame(animate);

        // Rotate the moon
        moon.object3D.rotation.y += rotationSpeed * 0.01;

        // Keep Africa facing the camera
        africa.object3D.rotation.y = -moon.object3D.rotation.y;
    }

    animate();

    // Add click event to toggle rotation
    document.addEventListener('click', function() {
        rotationSpeed = rotationSpeed === 0 ? 0.2 : 0;
    });
});
