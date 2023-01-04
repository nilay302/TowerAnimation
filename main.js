function init() {
    //*creating new scene in THREE
	var scene = new THREE.Scene();
    // var gui = new dat.GUI();
    var clock = new THREE.Clock()
    //*using fog in the scene
    var enableFog = true;

    if(enableFog){
    scene.fog = new THREE.FogExp2(0xffffff, 0.01);
    }

    //*defining box and plane shape
    var boxGrid = getBoxGrid(20, 2.5);
    boxGrid.name = "boxGrid"
    // var box = getBox(1,1,1);
    var plane = getPlane(100);
    // var spotLight = getSpotLight(1);
    var directionalLight = getDirectionalLight(1);
    var sphere = getSphere(0.05);

    //*used to get a clear geometric idea about the directional light(helper)
    // var helper = new THREE.CameraHelper(directionalLight.shadow.camera)

    // var ambientLight = getAmbientLight(10);


    //giving name to the plane(can be used as a id)
    plane.name = 'plane-1';

    //moving the box up using the height property
	// box.position.y = box.geometry.parameters.height/2;

    //rotating thee plane in x axis
	plane.rotation.x = Math.PI/2;
    directionalLight.position.x = 13;
    directionalLight.position.y = 10;
    directionalLight.position.z = 10;
    directionalLight.intensity = 2;
	

    //adding box and plane to the scene
	// scene.add(box);
    scene.add(boxGrid);
	scene.add(plane);
    scene.add(directionalLight);
    directionalLight.add(sphere);

    //creating camera(PerspectiveCamera)
	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	);

    //using orthographic camera
    // var camera = new THREE.OrthographicCamera(
	// 	-15,
    //     15,
    //     15,  //top frustum
    //     -15,  //bottom frustum
    //     1,  //near plane
    //     1000  //far plane
	// );
        var cameraYPosition = new THREE.Group();
        var cameraZPosition = new THREE.Group();
        var cameraYRotation = new THREE.Group();
        var cameraXRotation = new THREE.Group();
        var cameraZRotation = new THREE.Group();

        cameraZRotation.name = 'cameraZRotation';
        cameraYPosition.name = 'cameraYPosition';
        cameraZPosition.name = 'cameraZPosition';
        cameraYRotation.name = 'cameraYRotation';
        cameraXRotation.name = 'cameraXRotation';

        
        
        cameraZRotation.add(camera);
        cameraYPosition.add(cameraZRotation);
        cameraZPosition.add(cameraYPosition);
        cameraXRotation.add(cameraZPosition);
        cameraYRotation.add(cameraXRotation);
        scene.add(cameraYRotation);

        cameraXRotation.rotation.x = -Math.PI/2;
        cameraYPosition.position.y = 1;
        cameraZPosition.position.z = 80;
        
        new TWEEN.Tween({val: 100})
		.to({val: -30}, 12000)
		.onUpdate(function() {
			cameraZPosition.position.z = this.val;
		})
		.start();

        new TWEEN.Tween({val: -Math.PI/2})
		.to({val: 0}, 6000)
		.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			cameraXRotation.rotation.x = this.val;
		})
		.start();

        new TWEEN.Tween({val: 0})
		.to({val: Math.PI/2}, 6000)
		.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			cameraYRotation.rotation.y = this.val;
		})
		.start();

        // gui.add(cameraZPosition.position,'z',0,100)
        // gui.add(cameraYRotation.rotation,'y',-Math.PI,Math.PI)
        // gui.add(cameraXRotation.rotation,'x',-Math.PI,Math.PI);
        // gui.add(cameraZRotation.rotation,'z',-Math.PI,Math.PI)

    //creating renderer
	var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)');

    //adding renderer to id usinf DOM
	document.getElementById('webgl').appendChild(renderer.domElement);
    
    //to control the camera movement:
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    //calling update function
	update(renderer,scene, camera, controls,clock);

    return scene;
}

function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 3, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 3, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
}

function getBox(w,h,d){
    var geometry = new THREE.BoxGeometry(w,h,d);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)'
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow = true;
    return mesh;
}
function getSphere(size){
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255,255,255)'
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    )
    return mesh;
}
function getPlane(size){
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side:THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;
    return mesh;
}

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff,intensity);
    light.castShadow = true;
    return light;
}
function getSpotLight(intensity){
    var light = new THREE.SpotLight(0xffffff,intensity);
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}
function getDirectionalLight(intensity){
    var light = new THREE.DirectionalLight(0xffffff,intensity);
    light.castShadow = true;
    light.shadow.camera.left = -40;
    light.shadow.camera.bottom = -40;
    light.shadow.camera.top = 40;
    light.shadow.camera.right = 40;

    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;

    return light;
}
function getAmbientLight(intensity){
    var light = new THREE.AmbientLight('rgb(10,30,50)',intensity);
    //ambient light dont cast any shadow
    // light.castShadow = true;
    return light;
}


function update(renderer, scene, camera, controls, clock){
    //rendering the scene
    renderer.render(
		scene,
		camera,
	);
        controls.update();
        TWEEN.update();
        var timeElapsed = clock.getElapsedTime();
        // var cameraZPosition = scene.getObjectByName('cameraZPosition');
        var cameraZRotation = scene.getObjectByName('cameraZRotation');
        // var cameraXRotation = scene.getObjectByName('cameraXRotation');

        // if(cameraXRotation.rotation.x < 0){
        //     cameraXRotation.rotation.x += 0.01
        // }
        cameraZRotation.rotation.z = noise.simplex2(timeElapsed*1.5,timeElapsed*1.5)*0.02;
       
        // if(cameraZPosition.position.z > -100)
        // cameraZPosition.position.z -= 0.25;
        // console.log(timeElapsed);
     
        var boxGrid = scene.getObjectByName('boxGrid');
        boxGrid.children.forEach((element,index) => {
            var x = timeElapsed  + index;
            element.scale.y = (noise.simplex2(x,x)+1)/2 +0.001;
            element.position.y = element.scale.y/2;
        });
    
    //continuous animation
    requestAnimationFrame(function(){
        update(renderer,scene,camera, controls, clock);
    })
}

var scene = init();