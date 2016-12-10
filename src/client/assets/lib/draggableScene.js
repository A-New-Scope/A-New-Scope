  //variable declarations
  var container, stats;
  var camera, scene, renderer;
  // var objects = [];
  var plane = new THREE.Plane();
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2(),
  offset = new THREE.Vector3(),
  intersection = new THREE.Vector3(),
  INTERSECTED, SELECTED;
  //call init and anim
  init();
  anim();

  //init
  function init() {
    container = document.getElementById('scene')

    //configure camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();

    //generate cubes
    var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    for ( var i = 0; i < 5; i ++ ) {
      var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: 00000000, transparent: true, opacity: 0.8}) );
      object.position.x = 0;
      object.position.y = 0;
      object.position.z = 0;
      object.scale.x = 1;
      object.scale.y = 1;
      object.scale.z = 1;
      scene.add( object );
    }

    //config renderer
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    //renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild( renderer.domElement );

    //add listeners
    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
    window.addEventListener( 'resize', onWindowResize, false );
  }

  //reconfigure camera on window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  //reposition cubes if selected
  function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    if ( SELECTED ) {
      if ( raycaster.ray.intersectPlane( plane, intersection ) ) {
        SELECTED.position.copy( intersection.sub( offset ) );
      }
      return;
    }
    var intersects = raycaster.intersectObjects(scene.children );
    if ( intersects.length > 0 ) {
      if ( INTERSECTED != intersects[ 0 ].object ) {
        if ( INTERSECTED ) {INTERSECTED.material.color.set(00000000)};
        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.material.color.set( 0xff0000 );
        plane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection( plane.normal ),
          INTERSECTED.position );
      }
    } else {
      if ( INTERSECTED ) {INTERSECTED.material.color.set(00000000)};
      INTERSECTED = null;
    }
  }

  //select cubes
  function onDocumentMouseDown( event ) {
    event.preventDefault();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(scene.children);
    if ( intersects.length > 0 ) {
      SELECTED = intersects[ 0 ].object;
      if ( raycaster.ray.intersectPlane( plane, intersection ) ) {
        offset.copy( intersection ).sub( SELECTED.position );
      }
    }
  }

  //deselect cubes
  function onDocumentMouseUp( event ) {
    event.preventDefault();
    if ( INTERSECTED ) {
      SELECTED = null;
    }
  }

  //anim and render
  function anim() {
    requestAnimationFrame( anim );
    render();
  }

  function render() {
    var temp = false
    for(var i = 0; i < scene.children.length; i ++){
      scene.children[i].scale.y = boost[i * 100]/40 + 1
      scene.children[i].rotation.y += 0.001
    }
    renderer.render( scene, camera );
  }

  function resetPos(){
    for(var i = 0; i < scene.children.length; i ++){
      scene.children[i].position.x = 0;
      scene.children[i].position.y = 0;
      scene.children[i].position.z = 0;
    }
  }