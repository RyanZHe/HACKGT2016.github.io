(function () {

	var projector = new THREE.Projector();
	var webglEl = document.getElementById('webgl');

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	var mySet = new Set();

	var distances = {
		Mercury: 3.9,
		Venus: 7.32,
		Earth: 10,
		Mars: 15.24,
		Jupiter: 52.03,
		Saturn: 95.39,
		Uranus: 191.8,
		Neptune: 300.6,
		Moon: 0.0257003846
	};

	var radiuses = {
		Mercury: 0.01630370796,
		Venus: 0.04045512118,
		Earth: 0.04263429658,
		Mars: 0.02268414635,
		Jupiter: 0.4772661504,
		Saturn: 0.4032811403,
		Uranus: 0.1708513619,
		Neptune: 0.1624354667,
		Sun: 4.65046792 * (4/5),
		Moon: 0.01160444322
	};

	var multipliyer = {
		Mercury: 5,
		Venus: 5,
		Earth: 5,
		Mars: 5,
		Jupiter: 5,
		Saturn: 5,
		Uranus: 5,
		Neptune: 5,
		Sun: 1,
		Moon: 5
	}

	var speeds =  {
		Mercury: 0.018,
		Venus: 0.018,
		Earth: 0.018,
		Mars: 0.018,
		Jupiter: 0.018,
		Saturn: 0.018,
		Uranus: 0.018,
		Neptune: 0.018,
		Sun: 0.018,
		Moon: 0.018
	};

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 0.04263429658 * 5,
		segments = 64,
		rotation = 6;  

	var rendered = false;

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.0001, 100000);
	camera.position.z = 1.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	controls = new THREE.OrbitControls(camera);
	controls.minDistance = 0.509;
	controls.maxDistance = 10000;
	controls.enablePan = false;

	scene.add(new THREE.AmbientLight(0x333333));

	var light1 = new THREE.DirectionalLight(0xffffff, 1);
	light1.position.set(5,3,5);
	var light2 = new THREE.DirectionalLight(0xffffff, 1);
	light2.position.set(-0.5,0,-0.5);
	scene.add(light1);
	scene.add(light2);

	var sphereGeometry = new THREE.SphereGeometry(radius, segments, segments);
    var sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation; 
	scene.add(sphere);

	var moon = createMoon(radiuses.Moon * multipliyer.Moon, segments);
    moon.position.set(distances.Moon + radiuses.Moon + radius, 0, 0);
    moon.rotation.y = rotation;
    /*var moonOTL = createOutlineMesh(radiuses.Moon, segments);
    moonOTL.position.set(distances.Moon + radiuses.Moon + radius, distances.Moon + radiuses.Moon + radius, distances.Moon + radiuses.Moon + radius);
    moonOTL.scale.multiplyScalar(1.01);*/
    scene.add(moon);
    //scene.add(moonOTL);

    var sun1 = createSun(radiuses.Sun * multipliyer.Sun, segments);
    sun1.position.set(distances.Earth, 0, 0);    
    sun1.rotation.y = rotation;
    /*var sunOTL = createOutlineMesh(radiuses.Sun, segments);
    sunOTL.position.set(distances.Earth, distances.Earth, distances.Earth);
    sunOTL.scale.multiplyScalar(1.01);*/
    scene.add(sun1);
    //scene.add(sunOTL);

    var mercury = createMercury(radiuses.Mercury * multipliyer.Mercury, segments);
    mercury.position.set(10 - distances.Mercury, 0, 0);    
    mercury.rotation.y = rotation;
    /*var mercuryOTL = createOutlineMesh(radiuses.Mercury, segments);
    mercuryOTL.position.set(10 - distances.Mercury, 10 - distances.Mercury, 10 - distances.Mercury);
    mercuryOTL.scale.multiplyScalar(1.01);*/
    scene.add(mercury);
    //scene.add(mercuryOTL);

    var venus = createVenus(radiuses.Venus * multipliyer.Venus, segments);
    venus.position.set(10 - distances.Venus, 0, 0);    
    venus.rotation.y = rotation;
    /*var venusOTL = createOutlineMesh(radiuses.Venus, segments);
    venusOTL.position.set(10 - distances.Venus, 10 - distances.Venus, 10 - distances.Venus);
    venusOTL.scale.multiplyScalar(1.01);*/
    scene.add(venus);
    //scene.add(venusOTL);

    var mars = createMars(radiuses.Mars * multipliyer.Mars, segments);
    mars.position.set(10 - distances.Mars, 0, 0);    
    mars.rotation.y = rotation;
    /*var marsOTL = createOutlineMesh(radiuses.Mars, segments);
    marsOTL.position.set(10 - distances.Mars, 10 - distances.Mars, 10 - distances.Mars);
    marsOTL.scale.multiplyScalar(1.01);*/
    scene.add(mars);
    //scene.add(marsOTL);

    var jupiter = createJupiter(radiuses.Jupiter * multipliyer.Jupiter, segments);
    jupiter.position.set(10 - distances.Jupiter, 0, 0);    
    jupiter.rotation.y = rotation;
    /*var jupiterOTL = createOutlineMesh(radiuses.Jupiter, segments);
    jupiterOTL.position.set(10 - distances.Jupiter, 10 - distances.Jupiter, 10 - distances.Jupiter);
    jupiterOTL.scale.multiplyScalar(1.01);*/
    scene.add(jupiter);
    //scene.add(jupiterOTL);

    var saturn = createSaturn(radiuses.Saturn * multipliyer.Saturn, segments);
    saturn.position.set(10 - distances.Saturn, 0, 0);    
    saturn.rotation.y = rotation;
    /*var saturnOTL = createOutlineMesh(radiuses.Saturn, segments);
    saturnOTL.position.set(10 - distances.Saturn, 10 - distances.Saturn, 10 - distances.Saturn);
    saturnOTL.scale.multiplyScalar(1.01);*/
    scene.add(saturn);
    //scene.add(saturnOTL);

    var uranus = createUranus(radiuses.Uranus * multipliyer.Uranus, segments);
    uranus.position.set(10 - distances.Uranus, 0, 0);    
    uranus.rotation.y = rotation;
    /*var uranusOTL = createOutlineMesh(radiuses.Uranus, segments);
    uranusOTL.position.set(10 - distances.Uranus, 10 - distances.Uranus, 10 - distances.Uranus);
    uranusOTL.scale.multiplyScalar(1.01);*/
    scene.add(uranus);
    //scene.add(uranusOTL);

    var neptune = createNeptune(radiuses.Neptune * multipliyer.Neptune, segments);
    neptune.position.set(10 - distances.Neptune, 0, 0);    
    neptune.rotation.y = rotation;
    /*var neptuneOTL = createOutlineMesh(radiuses.Neptune, segments);
    neptuneOTL.position.set(10 - distances.Neptune, 10 - distances.Neptune, 10 - distances.Neptune);
    neptuneOTL.scale.multiplyScalar(1.01);*/
    scene.add(neptune);
    //scene.add(neptuneOTL);

    var cloud = createClouds(radius, segments);
	cloud.rotation.y = rotation;
	scene.add(cloud);

	var stars = createStars(9000000, 64);
	scene.add(stars);

    /*var outlineMesh1 = createOutlineMesh(radius, segments);
    outlineMesh1.position = sphere.position;
    outlineMesh1.scale.multiplyScalar(1.01);
    scene.add(outlineMesh1);*/
    var material = new THREE.MeshPhongMaterial( {map: THREE.ImageUtils.loadTexture('images/texture-atlas.jpg')} );

    var arrayURL = [];

    preloadImages(arrayURL);

	webglEl.appendChild(renderer.domElement);

	render();

	function render() {
		controls.update();
		//sphere.rotation.y += 0.0005;
		//clouds.rotation += 0.0008;
		cloud.rotation.y += 0.004;
		sun1.rotation.y += speeds.Sun;
		moon.rotation.y += speeds.Moon;
		mercury.rotation.y += speeds.Mercury;
		venus.rotation.y += speeds.Venus;
		sphere.rotation.y += speeds.Earth;
		saturn.rotation.y += speeds.Saturn;
		uranus.rotation.y += speeds.Uranus;
		neptune.rotation.y += speeds.Neptune;

		//var degree = Math.atan(moon.position.y/moon.position.x);
		//moon.position.y = (distances.moon + radiuses.moon) * Math.sin(0.001 + degree);
		//moon.position.x = (distances.moon + radiuses.moon) * Math.cos(0.001 + degree);
		// mesh.rotation.x += .04;
		// mesh.rotation.y += .02;		
		var frustum = new THREE.Frustum();
		/*var cameraViewProjectionMatrix = new THREE.Matrix4();
		var cameraPos = camera.matrixWorld.getPosition().clone();
		var earthPos = sphere.matrixWorld.getPosition().clone();*/
		var cameraPos = new THREE.Vector3();
		cameraPos.setFromMatrixPosition(camera.matrixWorld);
		var earthPos = new THREE.Vector3();
		earthPos.setFromMatrixPosition(sphere.matrixWorld);
		var distance = cameraPos.distanceTo(earthPos);

		mySet.forEach(function(value) {
			var spherePos = new THREE.Vector3();
			spherePos.setFromMatrixPosition(value.matrixWorld);
			var dist = cameraPos.distanceTo(spherePos);
			if (dist < 1.0) {
				//console.log(value.name + spherePos);
			}
		});
		window.addEventListener( 'mousemove', onMouseMove, false ); 
		//document.addEventListener('mousedown', onDocumentMouseDown, false);
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createOutlineMesh(radius1, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius1, 64, 64), 
			new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.BackSide })
		);
	}

	function createMoon(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/moon_COLOR.png'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/moon_NRM.png'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/moon_SPEC.png'),
				specular:    new THREE.Color("rgb(30,30,30)")								
			})
		);
	}

	function createSun(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/700328main_20121014_003615_flat.jpg'),								
			})
		);
	}

	function createMercury(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/Mercury.jpg'),								
			})
		);
	}

	function createVenus(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/Venus.jpg'),								
			})
		);
	}

	function createMars(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/Mars.jpg'),								
			})
		);
	}

	function createJupiter(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/Jupiter.jpg'),								
			})
		);
	}

	function createSaturn(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/Saturn.jpg'),								
			})
		);
	}

	function createUranus(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/Uranus.jpg'),								
			})
		);
	}

	function createNeptune(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/Neptune.jpg'),								
			})
		);
	}

	function createSphere(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			sphereGeometry,
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    new THREE.Color("rgb(30,30,30)")								
			})
		);
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

	function preloadImages(array) {
		if (!preloadImages.list) {
			preloadImages.list = [];
		}
		var list = preloadImages.list;
		for (var i = 0; i < array.length; i++) {
			var img = new Image();
			img.onload = function() {
				var index = list.indexOf(this);
				if (index !== -1) {
					list.splice(index, 1);
				}
			}
			list.push(img);
			img.src = array[i];
		}
	}

	function toScreenPosition(obj, camera) {
		var vector = new THREE.Vector3();

		var widthHalf = 0.5 * renderer.context.canvas.width;
		var heightHalf = 0.5 * renderer.context.canvas.height;

		obj.updateMatrixWorld();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(camera);

		vector.x = (vector.x * widthHalf) + widthHalf;
		vector.y = - (vector.y * heightHalf) + heightHalf;

		return {
			x: vector.x,
			y: vector.y
		};
	}

	function onMouseMove( event ) {
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 +1;   
	}

	var gui = new dat.GUI();
	var speedGUI = gui.addFolder('Self-rotation Speed');
	speedGUI.add(speeds, 'Mercury', -0.06, 0.06);
	speedGUI.add(speeds, 'Venus', -0.06, 0.06);
	speedGUI.add(speeds, 'Earth', -0.06, 0.06);
	speedGUI.add(speeds, 'Mars', -0.06, 0.06);
	speedGUI.add(speeds, 'Jupiter', -0.06, 0.06);
	speedGUI.add(speeds, 'Saturn', -0.06, 0.06);
	speedGUI.add(speeds, 'Uranus', -0.06, 0.06);
	speedGUI.add(speeds, 'Neptune', -0.06, 0.06);
	speedGUI.add(speeds, 'Sun', -0.06, 0.06);
	speedGUI.add(speeds, 'Moon', -0.06, 0.06);
	/*var radiusGUI = gui.addFolder('Radius');
	radiusGUI.add(multipliyer, 'Mercury', 1, 5);
	radiusGUI.add(multipliyer, 'Venus', 1, 5);
	radiusGUI.add(multipliyer, 'Earth', 1, 5);
	radiusGUI.add(multipliyer, 'Mars', 1, 5);
	radiusGUI.add(multipliyer, 'Jupiter', 1, 5);
	radiusGUI.add(multipliyer, 'Saturn', 1, 5);
	radiusGUI.add(multipliyer, 'Uranus', 1, 5);
	radiusGUI.add(multipliyer, 'Neptune', 1, 5);
	radiusGUI.add(multipliyer, 'Sun', 1, 5);
	radiusGUI.add(multipliyer, 'Moon', 1, 5);*/

	/*var mercuryGUI = gui.addFolder('Mercury');
		mercuryGUI.add(text, 'speed', 1, 365);
		var venusGUI = gui.addFolder('Venus');
		venusGUI.add(text, 'speed', 1, 365);
		var earthGUI = gui.addFolder('Earth');
		earthGUI.add(text, 'speed', 1, 365);
		var marsGUI = gui.addFolder('Mars');
		marsGUI.add(text, 'speed', 1, 365);
		var jupiterGUI = gui.addFolder('Jupiter');
		jupiterGUI.add(text, 'speed', 1, 365);
		var saturnGUI = gui.addFolder('Saturn');
		saturnGUI.add(text, 'speed', 1, 365);
		var uranusGUI = gui.addFolder('Uranus');
		uranusGUI.add(text, 'speed', 1, 365);
		var neptuneGUI = gui.addFolder('Neptune');
		neptuneGUI.add(text, 'speed', 1, 365);
		var moonGUI = gui.addFolder("Moon");
		moonGUI.add(text, 'speed', 1, 365);*/
}());