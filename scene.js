var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 2, 2 );
var material = new THREE.MeshBasicMaterial( { color: 'blue' } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
  boost = boost || 0;

  requestAnimationFrame( render );
  cube.rotation.y += 0.01;
  cube.scale.y = (boost[0] / 100) + 0.01

  renderer.render(scene, camera);
};

render();