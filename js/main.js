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

function animate( timestamp ) {
    controls.update();
    manager.render( scene, camera, timestamp );
    TWEEN.update();
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
    scene.add( logo );

    var position = { x : 0, y: 0, z: -20 };
    var target = { x : 0, y: 0, z: -5 };
    var tween = new TWEEN.Tween( position ).to( target, 4000 );
    tween.onUpdate( function(){
        logo.position.x = position.x;
        logo.position.y = position.y;
        logo.position.z = position.z;
    } );

    tween.easing( TWEEN.Easing.Elastic.InOut );
    tween.start();

    var rotate = new TWEEN.Tween().to( {}, 10000 );
    rotate.onUpdate( function(){
        logo.rotation.y += Math.PI / 50;
    } );
    rotate.start();
}

function init() {
    add_cosmos( scene );
    add_logo( scene );

    animate();

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

    setTimeout( run, 10000 );
}

function run( e ){
    scene.remove( logo );
    for ( var i = 0; i < wapuu_objects.length; i++ ) {
        setTimeout( function( index ) {
            scene.add( wapuu_objects[index] );

            var scale = parseInt( getRandom( 1, 5 ) ) / 5;
            wapuu_objects[index].scale.x = scale;
            wapuu_objects[index].scale.y = scale;

            var speed = parseInt( getRandom( 2000, 6000 ) );

            var position = { x : parseInt( getRandom( 0, 8 ) ) - 4, y: parseInt( getRandom( 0, 8 ) ) - 4, z: -11 };
            var target = { x : parseInt( getRandom( 0, 8 ) ) - 4, y: parseInt( getRandom( 0, 8 ) ) - 4, z: 11 };
            var tween = new TWEEN.Tween( position ).to( target, speed );
            tween.onUpdate( function(){
                wapuu_objects[index].position.x = position.x;
                wapuu_objects[index].position.y = position.y;
                wapuu_objects[index].position.z = position.z;
            } );
            tween.onStop( function(){
                scene.remove( wapuu_objects[index] );
            } );
            tween.start();

            if ( ( index + 1 ) == wapuu_objects.length ) {
                add_logo( scene );
                setTimeout( run, 10000 );
            }
        }, i * 1000, i );
    }
}

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );

document.body.appendChild( renderer.domElement );

var scene, camera, controls, effect, manager, logo, wapuu_objects;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 11 );
controls = new THREE.VRControls( camera );
effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );
manager = new WebVRManager( renderer, effect, { hideButton: false } );

init();
