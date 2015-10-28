function getRandom( min, max ) {
  return Math.random() * ( max - min ) + min;
}

function shuffle( array ) {
  var n = array.length, t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }

  return array;
}

function move_wapuu( cube, speed ) {
    cube.position.z += speed;
    if ( cube.parent ) {
        requestAnimationFrame( function(){
            if ( cube.position.z > -1 && cube.position.z <= 0.5 ) {
                move_wapuu( cube, 0.005 );
            } else if ( cube.position.z > 0.5 && cube.position.z <= 10 ) {
                move_wapuu( cube, 0.25 );
            } else if ( cube.position.z > 10 ) {
                scene.remove( cube );
            } else {
                move_wapuu( cube, speed );
            }
        } );
    }
}

function rotate( timestamp ) {
    logo.rotation.y += 0.05;
    if ( logo.parent ) {
        requestAnimationFrame( rotate );
    }
}

function animate( timestamp ) {
    renderer.render( scene, camera );
    controls.update();
    manager.render( scene, camera, timestamp );
    requestAnimationFrame( animate );
}

function add_cosmos( scene ) {
    var pgeometry = new THREE.Geometry();
    for ( var n = 0; n < 1000; n++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = ( Math.random() - 0.5 ) * 10;
        vertex.y = ( Math.random() - 0.5 ) * 10;
        vertex.z = ( Math.random() - 0.5 ) * 10;
        pgeometry.vertices.push( vertex );
    }
    var pmaterial = new THREE.PointsMaterial( {
        size: 0.01,
        color: 0xFFFFE0,
        blending: THREE.AdditiveBlending,
        transparent: true,
        fog: true
    } );
    var particles = new THREE.Points( pgeometry, pmaterial );
    particles.fog = new THREE.FogExp2( 0xffffff, 1 );
    scene.add( particles );
}

function add_logo( scene ) {
    var texloader = new THREE.TextureLoader();
    var tex = texloader.load( 'wapuus/original-wapuu.png' );
    var material = new THREE.MeshBasicMaterial( { map: tex } );
    material.transparent = true;
    material.side = THREE.DoubleSide;

    var geometry = new THREE.PlaneGeometry( 2, 2 );
    logo = new THREE.Mesh( geometry, material );
    logo.position.x = 0;
    logo.position.y = 0;
    logo.position.z = -10;
    scene.add( logo );

    rotate();
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 11 );
    controls = new THREE.VRControls( camera );
    effect = new THREE.VREffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );
    manager = new WebVRManager( renderer, effect, { hideButton: false } );

    add_cosmos( scene );
    add_logo( scene );

    wapuus = shuffle( wapuus );
    wapuu_objects = [];
    for ( var i = 0; i < wapuus.length; i++ ) {
        var texloader = new THREE.TextureLoader();
        var tex = texloader.load( wapuus[i] );
        var material = new THREE.MeshBasicMaterial( { map: tex } );
        material.transparent = true;
        material.side = THREE.DoubleSide;

        var geometry = new THREE.PlaneGeometry( 1, 1 );
        var wapuu = new THREE.Mesh( geometry, material );

        wapuu_objects.push( wapuu );
    }

    animate();

    setTimeout( run, 5000 );
}

function run( e ){
    scene.remove( logo );
    for ( var i = 0; i < wapuu_objects.length; i++ ) {
        setTimeout( function( index ) {
            scene.add( wapuu_objects[index] );

            var scale = getRandom( 1, 5 ) / 10;
            wapuu_objects[index].scale.x = scale;
            wapuu_objects[index].scale.y = scale;

            wapuu_objects[index].position.x = getRandom( 0, 12 ) / 10 - 0.6;
            wapuu_objects[index].position.y = getRandom( 0, 12 ) / 10 - 0.6;
            wapuu_objects[index].position.z = -11;
            var speed = getRandom( 10, 50 ) / 100;

            move_wapuu( wapuu_objects[index], speed );

            if ( ( index + 1 ) == wapuu_objects.length ) {
                add_logo( scene );
                setTimeout( run, 10000 );
            }
        }, i * 2000, i );
    }
}

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );

document.body.appendChild( renderer.domElement );

var scene, camera, controls, effect, manager, logo, wapuu_objects;
init();
