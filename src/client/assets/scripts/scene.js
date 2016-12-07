let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);
document.body.appendChild( renderer.domElement ); //point this to an angular view

let geometry = new THREE.BoxGeometry( 1, 2, 2 );
let material = new THREE.MeshBasicMaterial( { color: 'blue' } );
let cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

let render = function () {
  boost = boost || 0;

  requestAnimationFrame( render );
  cube.rotation.y += 0.01;
  cube.scale.y = (boost[100] / 50) + 0.01

  renderer.render(scene, camera);
};

render();