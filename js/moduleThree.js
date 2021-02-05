import * as THREE from "three";

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";
import gsap from 'gsap';

let OrbitControls = require("three-orbit-controls")(THREE);
const createInputEvents = require('simple-input-events');
const event = createInputEvents(window)
export default class Sketch {
    constructor(selector) {
        this.scene = new THREE.Scene();
        THREE.DefaultLoadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {

            console.log(itemsLoaded / itemsTotal * 100);

        };
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container = document.getElementById("container");
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );


        this.camera.position.set(0, 0, 3);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.paused = false;
        this.mouse = new THREE.Vector2()



        this.setupResize();
        this.tabEvents();

        this.addObjects();
        this.resize();
        this.render();

        this.mouseMoveEvent()
        this.materials = [];
        this.meshes = [];
        this.groups = [];
        this.handleImages();
    }

    handleImages() {
        let images = []
        window.addEventListener('load', () => {
            images = [...document.querySelectorAll('img')];
            images.forEach((im, i) => {

                let mat = this.material.clone();
                this.materials.push(mat);
                let group = new THREE.Group()


                mat.wireframe = false;
                mat.uniforms.texture1.value = new THREE.Texture(im);
                mat.uniforms.texture1.value.needsUpdate = true;

                let geo = new THREE.PlaneBufferGeometry(1, 1, 500, 100);

                let mesh = new THREE.Mesh(geo, mat)


                mesh.scale.x = this.camera.aspect;

                group.add(mesh)
                this.groups.push(group)
                this.scene.add(group)
                this.meshes.push(mesh);
                mesh.position.y = i * 1.5;

                group.rotation.y = -0;
                group.rotation.x = -0;
                group.rotation.z = -0;

                group.position.x = 0;
            })
        })
    }

    mouseMoveEvent() {
        let targetX = 0
        let targetY = 0
        let yLerp = 0
        let xLerp = 0
        const ease = 0.05

        let that = this

        event.on('move', ({ position }) => {
            targetX = position[0] / this.width;
            targetY = 1. - position[1] / this.height;

            this.meshes.forEach((e, i) => {
                this.meshes[i].material.uniforms.mouse.value = this.mouse
            })

        })


        function animate() {
            xLerp += ((targetX - xLerp) * ease) // This is where the magic happens
            yLerp += ((targetY - yLerp) * ease) // This is where the magic happens
            that.mouse.x = xLerp
            that.mouse.y = yLerp
            requestAnimationFrame(animate)
        }
        animate()
    }

    settings() {
        let that = this;
        this.settings = {
            time: 0,
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, "time", 0, 100, 0.01);
        this.gui.addImage(this.settings, 'texturePath').onChange((image) => {
            body.append(image);
        })
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.imageAspect = 640 / 480;
        let a1;
        let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = (this.width / this.height) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;
        const dist = this.camera.position.z;
        const height = 1;

        this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

        if (this.meshes) {
            this.meshes.forEach(i => {
                if (this.width / this.height > 1) {
                    this.meshes[i].scale.x = this.camera.aspect;

                } else {
                    this.meshes[i].scale.x = this.camera.aspect;

                }
            })
        }
        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        let that = this;
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                distanceFromCenter: { type: "f", value: 0 },
                direction: { type: "f", value: 0 },
                alpha: { type: 'f', value: 1 },
                mouse: { type: "v2", value: new THREE.Vector2(0., 0.) },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                },
                imageResolution: {
                    type: 'v2',
                    value: new THREE.Vector2(640, 480),
                },
                progress: { type: "f", value: 1 },
                texture1: { type: 't', value: null },
                resolution: { type: "v4", value: new THREE.Vector4() },
            },

            transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment
        });

        // this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

        // this.plane = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.plane);
    }

    tabEvents() {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.stop()
            } else {
                this.play();
            }
        });
    }

    stop() {
        this.paused = true;
    }

    play() {
        this.paused = false;
    }

    render() {
        if (this.paused) return;
        this.time += 0.05;
        if (this.materials) {
            this.materials.forEach((m) => {
                m.uniforms.time.value = this.time
            })
        }
        this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}