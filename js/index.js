let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x404040 );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 3;

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth /  window.innerHeight;
    camera.updateProjectionMatrix();
});

loadFiles(['shader/my_bubble_shader.vert', 'shader/my_bubble_shader.frag'], function (shaderText) {

  let geometry = new THREE.SphereGeometry(1, 40, 40);

  let material = new THREE.ShaderMaterial({
      uniforms: {
        directionalLightPos: { type: "v3", value: new THREE.Vector3(0.0, 10.0, 5.0) },
        directionalLightColor: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
        ambientLightColor: { type: "v3", value: new THREE.Vector3(0.25, 0.25, 0.25) },
        materialColor: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
        backgroundColor: { type: "v3", value: new THREE.Vector3().fromArray(scene.background.toArray()) },
        surfaceThickness: { type: "f", value: 600.0 },
        refractiveIndex: { type: "f", value: 1.33 },
      },
      vertexShader: shaderText[0],
      fragmentShader: shaderText[1],
      wireframe: false,
  });
  let mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  };
  animate();

  const gui = new dat.GUI();

  const bubbleFolder = gui.addFolder('Bubble');
  bubbleFolder.add( material.uniforms.surfaceThickness, "value", 0.0, 1000.0, 1.0 ).name("Thickness");
  bubbleFolder.add( material.uniforms.refractiveIndex, "value", 1.0, 10.0, 0.01 ).name("Refractive Index");
  bubbleFolder.open();

  const lightFolder = gui.addFolder('Light');
  lightFolder.add( material.uniforms.directionalLightPos.value, "x", -10.0, 10.0, 0.1 ).name("X");
  lightFolder.add( material.uniforms.directionalLightPos.value, "y", 0.0, 10.0, 0.1 ).name("Y");
  lightFolder.add( material.uniforms.directionalLightPos.value, "z", 0.0, 10.0, 0.1 ).name("Z");
  lightFolder.add( material.uniforms.directionalLightColor.value, "x", 0.0, 1.0, 0.01 ).name("R");
  lightFolder.add( material.uniforms.directionalLightColor.value, "y", 0.0, 1.0, 0.01 ).name("G");
  lightFolder.add( material.uniforms.directionalLightColor.value, "z", 0.0, 1.0, 0.01 ).name("B");
  lightFolder.open();

}, function (url) {
    alert('Failed to download "' + url + '"');
});
