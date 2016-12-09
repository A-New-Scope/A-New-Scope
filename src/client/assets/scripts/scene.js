let ww = window.innerWidth;
let wh = window.innerHeight;
let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 0, 1000);
let light = new THREE.DirectionalLight(0xffffff, 1);
let particles = new THREE.Object3D();
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('scene')});


//Init let with mouse position
let mouse = {x: 0, y: 0};
let mouseMove = function (e) {
  //3D universe come from the center so I substract half of the screen on the mouse position
  //By doing that, the cursor on the left will give -window/2 and on the right window/2
  //For the Y axis it's a bit different because the top equal 0 but in the scene the top is the positive side
  mouse.x = e.clientX - (ww / 2);
  mouse.y = (wh / 2) - e.clientY;
};


let createParticle = function(color, speed, direct) {
  //Create a geometry used for the particles which contains nothing for now

  let geometry = new THREE.Geometry();
  //Create a vector which equal to the mouse position
  let vertices = new THREE.Vector3(
  mouse.x,
  mouse.y,
  -10
  );
  //We apply our vector inside the geometry
  geometry.vertices.push(vertices);
  //We create a white material
  //sizeAttenuation defines if the particle will be small if far from the camera
  let material = new THREE.PointsMaterial({
    color: color,
    size: 3,
    transparent: true,
    sizeAttenuation: false
  });
  //Point cloud is a specific Mesh for particles
  let particle = new THREE.Points(geometry, material);
  //We create a random speed for each particle for aesthetics
  particle.speed = speed;

  //We set a random position for each particle
  particle.direction = direct;

  particles.add(particle);
};

let animateDot = function () {
  boost = boost || 0;
  requestAnimationFrame(animateDot);

  //Create a new particle
  createParticle(0Xffffff, Math.random() / 150 + 0.002, {
    x: (Math.random() - .5) * ww * 2,
    y: (Math.random() - .5) * wh * 2
  });
  createParticle(0xffffff, Math.random() / 100 + 0.002, {
    x: (Math.random() - .3) * ww * 2,
    y: (Math.random() - .3) * wh * 2
  });
  createParticle(0X004008, Math.random() / 100 + 0.002, {
    x: (Math.random() - .1) * ww * 1.5,
    y: (Math.random() - .1) * wh * 1.5
  });
  createParticle(0xFFB102, boost[50] / 100 + 0.05, {
    x: (Math.random() - boost[10]/100) * ww * 2,
    y: (Math.random() - boost[10]/100) * wh * 2
  });

  //We loop through all our particles
  for (let i = 0, j = particles.children.length; i < j; i++) {
  //Get the next particle
    let particle = particles.children[i];

    particle.scale.x = boost[100] / 1000 + .05;
    particle.scale.y = boost[10] / 1000 + .05;
	//We move our particle closer to its destination
    particle.geometry.vertices[0].x += (particle.direction.x - particle.geometry.vertices[0].x) * particle.speed;
    particle.geometry.vertices[0].y += (particle.direction.y - particle.geometry.vertices[0].y) * particle.speed;
  //We reduce the opacity of the particle
    particle.material.opacity -= .005;
  //Prevents ThreeJs the particle has moved
    particle.geometry.verticesNeedUpdate = true;

  //If the opacity of the particle is too low
    if (particle.material.opacity < .05) {
    //We remove our particle from the scene
      particles.remove(particle);
    //The loop must go through the same 'i' because we removed one particle from the array
      i--;
      j--;
    }
  }

  renderer.render(scene, camera);
};

let init = function() {
  camera.lookAt(new THREE.Vector3());
  controls = new OrbitControls(camera, renderer.domElement);

/* WEBGL RENDERER */
  renderer.setSize(ww, wh);

/* SCENE */

/* CAMERA */
  camera.position.set( 0, 0, 500);
  camera.lookAt(scene.position);
  scene.add(camera);


/* LIGHT */
  light.position.set( 0, 250, 700 );
  scene.add(light);

//particles will be the 3D object containing all the particles
  scene.add(particles);

//Add events listeners on the page
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('touchemove', mouseMove);

  renderer.render(scene, camera);

//Init request animation frame
  animateDot();
};

init();