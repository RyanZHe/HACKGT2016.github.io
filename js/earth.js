(function () {

	var projector = new THREE.Projector();
	var webglEl = document.getElementById('webgl');

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	var mySet = new Set();

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 0.5,
		segments = 256,
		rotation = 6;  

	var sphere2;
	var sphere3;
	var sphere4;
	var sphere5;

	var rendered = false;

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 1000);
	camera.position.z = 1.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	controls = new THREE.OrbitControls(camera);
	controls.minDistance = 0.509;
	controls.maxDistance = 100;
	controls.enablePan = false;

	scene.add(new THREE.AmbientLight(0x333333));

	var light1 = new THREE.DirectionalLight(0xffffff, 1);
	light1.position.set(5,3,5);
	var light2 = new THREE.DirectionalLight(0xffffff, 1);
	light2.position.set(-5,0,-5);
	scene.add(light1);
	scene.add(light2);

	var sphereGeometry = new THREE.SphereGeometry(radius, segments, segments);
    var sphere = createSphere(radius, segments);
    var moon = createMoon(radius, segments);
    moon.position.set(5, 1, 5);
    moon.rotation.y = rotation;
    scene.add(moon);

	sphere.rotation.y = rotation; 
	scene.add(sphere);

    var cloud = createClouds(radius, segments);
	cloud.rotation.y = rotation;
	scene.add(cloud);

	var stars = createStars(90, 64);
	scene.add(stars);

	var outlineMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.BackSide } );
    var outlineMesh1 = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), outlineMaterial);
    outlineMesh1.position = sphere.position;
    outlineMesh1.scale.multiplyScalar(1.01);
    scene.add(outlineMesh1);

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
		var degree = Math.atan(moon.position.y/moon.position.x);
		moon.position.y = 5*Math.sin(0.001 + degree);
		moon.position.x = 5*Math.cos(0.001 + degree);
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
		/*camera.updateMatrixWorld();
		camera.matrixWorldInverse.getInverse( camera.matrixWorld );
		cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
		frustum.setFromMatrix( cameraViewProjectionMatrix );

		//console.log( frustum.intersectsObject(mesh) );
		//console.log(  "X: " + toScreenPosition(mesh, camera).x + ", Y: " + toScreenPosition(mesh, camera).y);
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObjects( scene.children );

		for ( var i = 0; i < intersects.length; i++ ) {
			if (intersects[ i ].object.material.color.equals(new THREE.Color( 0xff0000 ))) {
		 		intersects[ i ].object.material.color.set( 0xffffff );
		 	} else {
				intersects[ i ].object.material.color.set( 0xff0000 );
		 	}
		}*/
		//console.log(distance);
		/*if (distance < 0.6 && rendered) {
			var ori = scene.getObjectByName('https://maps.googleapis.com/maps/api/staticmap?center=39,121&zoom=5&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4');
			console.log(ori.name);
			zoom(ori, 6);
		}
		if (distance < 0.7 && !rendered) {
			//zoomIn();
			var ori = scene.getObjectByName('https://maps.googleapis.com/maps/api/staticmap?center=26.7,107.5&zoom=4&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4');
			zoom(ori, 5);
			/*mySet.forEach(function(value) {
				zoom(value);
			});
			rendered = true;
		} else if (distance > 0.7){
			deleteR();
			rendered = false;
		}*/
		window.addEventListener( 'mousemove', onMouseMove, false ); 
		//document.addEventListener('mousedown', onDocumentMouseDown, false);
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createMoon(radius, segments) {
		THREE.ImageUtils.crossOrigin = '';
		return new THREE.Mesh(
			new THREE.SphereGeometry(0.1362717858, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/moon_COLOR.png'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/moon_NRM.png'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/moon_SPEC.png'),
				specular:    new THREE.Color("rgb(30,30,30)")								
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

	/*function onDocumentMouseDown(event) {
		event.preventDefault();
		var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 1);
		vector.unproject(vector, camera);

		var raycaster1 = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
		raycaster1.setFromCamera(mouse, camera);
		//var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).nomalize());

		var intersects = raycaster1.intersectObjects( scene.children );

		if (intersects.length > 0) {
			intersects[0].object.material.color.setHex(0xff0000);
		}
	}*/

	/*function zoomIn() {
		var sphereSupplement2 = new THREE.SphereGeometry(radius + 0.001 + 0.002, 17, 17, 0.953 * 5.55 - 0.3, 0.525, 0.95, 0.325);
	    sphere2 = new THREE.Mesh(sphereSupplement2, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center=32,140&zoom=5&size=640x640&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		scene.add(sphere2);
		var sphereSupplement3 = new THREE.SphereGeometry(radius + 0.001 + 0.002, 17, 17, 0.953 * 5 - 0.3, 0.525, 0.95, 0.325);
	    sphere3 = new THREE.Mesh(sphereSupplement3, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center=32,110&zoom=5&size=640x640&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		scene.add(sphere3);
		var sphereSupplement4 = new THREE.SphereGeometry(radius + 0.001 + 0.002, 17, 17, 0.953 * 5.55- 0.3, 0.525, 1.275, 0.325);
	    sphere4 = new THREE.Mesh(sphereSupplement4, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center=7,140&zoom=5&size=640x640&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		scene.add(sphere4);
		var sphereSupplement5 = new THREE.SphereGeometry(radius + 0.001 + 0.002, 17, 17, 0.953 * 5 - 0.3, 0.525, 1.275, 0.325);
	    sphere5 = new THREE.Mesh(sphereSupplement5, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center=7,110&zoom=5&size=640x640&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		scene.add(sphere5);
	}*/

	/*function deleteR() {
		scene.remove(sphere2);
		scene.remove(sphere3);
		scene.remove(sphere4);
		scene.remove(sphere5);
	}*/

	/*function zoom(sphere, level) {
		var indeces = sphere.name.slice(54,-64);
		var split = indeces.indexOf(',');
		var yAxis = parseInt(indeces.slice(0, split));
		var xAxis = parseInt(indeces.slice(split + 1, indeces.length));
		console.log(yAxis + " " + xAxis);
		var urlAddress = sphere.name;
		var sphereSupplement2 = new THREE.SphereGeometry(radius + 0.004, 17, 17, sphere.geometry.parameters.phiStart + (sphere.geometry.parameters.phiLength) / 2, (sphere.geometry.parameters.phiLength) / 2, sphere.geometry.parameters.thetaStart, sphere.geometry.parameters.thetaLength / 2);
	    sphere2 = new THREE.Mesh(sphereSupplement2, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis + 13 * Math.pow(2, -(level - 5))) +','+ (xAxis + 14 * Math.pow(2, -(level - 5))) +'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		sphere2.name = 'https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis + 13 * Math.pow(2, -(level - 5))) +','+ (xAxis + 14 * Math.pow(2, -(level - 5))) +'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4';
		scene.add(sphere2);
		//console.log(sphere2.phiStart + " " + sphere2.thetaStart);
		var sphereSupplement3 = new THREE.SphereGeometry(radius + 0.004, 17, 17, sphere.geometry.parameters.phiStart, (sphere.geometry.parameters.phiLength) / 2, sphere.geometry.parameters.thetaStart, sphere.geometry.parameters.thetaLength / 2);
	    sphere3 = new THREE.Mesh(sphereSupplement3, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis + 13 * Math.pow(2, -(level - 5))) +','+ (xAxis - 14 * Math.pow(2, -(level - 5)))+'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		sphere3.name = 'https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis + 13 * Math.pow(2, -(level - 5))) +','+ (xAxis - 14 * Math.pow(2, -(level - 5)))+'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4';
		scene.add(sphere3);
		
		var sphereSupplement4 = new THREE.SphereGeometry(radius + 0.004, 17, 17, sphere.geometry.parameters.phiStart + (sphere.geometry.parameters.phiLength) / 2, (sphere.geometry.parameters.phiLength) / 2, sphere.geometry.parameters.thetaStart + sphere.geometry.parameters.thetaLength / 2, sphere.geometry.parameters.thetaLength / 2);
	    sphere4 = new THREE.Mesh(sphereSupplement4, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis - 13 * Math.pow(2, -(level - 5))) +','+ (xAxis + 14 * Math.pow(2, -(level - 5))) +'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		sphere4.name = 'https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis - 13 * Math.pow(2, -(level - 5))) +','+ (xAxis + 14 * Math.pow(2, -(level - 5))) +'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4';
		scene.add(sphere4);
		
		var sphereSupplement5 = new THREE.SphereGeometry(radius + 0.004, 17, 17, sphere.geometry.parameters.phiStart, (sphere.geometry.parameters.phiLength) / 2, sphere.geometry.parameters.thetaStart + sphere.geometry.parameters.thetaLength / 2, sphere.geometry.parameters.thetaLength / 2);
	    sphere5 = new THREE.Mesh(sphereSupplement5, new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis - 13 * Math.pow(2, -(level - 5))) +','+ (xAxis - 14 * Math.pow(2, -(level - 5))) +'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4')}));
		sphere5.name = 'https://maps.googleapis.com/maps/api/staticmap?center='+ (yAxis - 13 * Math.pow(2, -(level - 5))) +','+ (xAxis - 14 * Math.pow(2, -(level - 5))) +'&zoom=' + level + '&size=640x640&key=AIzaSyA3LpL2suuBAYHBSEDGp7py7c3fr2Mvui4';
		scene.add(sphere5);
		//console.log(sphere2);
	}*/
}());