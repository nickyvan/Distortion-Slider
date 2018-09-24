import * as THREE from 'three';
import { TimelineMax, TweenMax } from 'gsap';
// const OrbitControls = require('three-orbit-controls')(THREE);

export default class ShaderMaker {
  constructor(el) {
    this.el = el;
    this.next = document.getElementsByClassName('nav-next')[0];
    this.opt = {
      intensity1: 1,
      intensity2: 2,
      angle1: 30,
      angle2: 30
    };
    this.init();
  }
  init = () => {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      this.el.offsetWidth / -2,
      this.el.offsetWidth / 2,
      this.el.offsetHeight / 2,
      this.el.offsetHeight / -2,
      1,
      1000
    );

    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: false });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff, 0.0);
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
    this.el.appendChild(this.renderer.domElement);
    this.loadTexture('./images/image01.jpg','./images/image02.jpg','./images/disp02.jpg');

    window.addEventListener('resize',()=> this.resize(),false);
    this.next.addEventListener('click',()=>{console.log(1);this.change()},false)
  };
  loadTexture = (image1, image2, dispImage) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';

    this.texture1 = loader.load(image1, this.render);
    this.texture2 = loader.load(image2, this.render);
    this.disp = loader.load(dispImage, this.render);

    //https://threejs.org/docs/#api/en/textures/Texture-- More about Three.repeatWrapping Three.linnerFilter
    this.disp.wrapS = this.disp.wrapT = THREE.RepeatWrapping;
    this.texture1.magFilter = this.texture2.magFilter = THREE.LinearFilter;
    this.texture1.minFilter = this.texture2.minFilter = THREE.LinearFilter;
    this.createShader();
  };
  createShader = () => {
    const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `;

    const fragment = `
    varying vec2 vUv;
    uniform float dispFactor;
    uniform sampler2D disp;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform float angle1;
    uniform float angle2;
    uniform float intensity1;
    uniform float intensity2;
    mat2 getRotM(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }
    void main() {
      vec4 disp = texture2D(disp, vUv);
      vec2 dispVec = vec2(disp.r, disp.g);
      vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * intensity1 * dispFactor;
      vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
      vec4 _texture1 = texture2D(texture1, distortedPosition1);
      vec4 _texture2 = texture2D(texture2, distortedPosition2);
      gl_FragColor = mix(_texture1, _texture2, dispFactor);
    }
    `;
    this.mate = new THREE.ShaderMaterial({
      uniforms: {
        intensity1: { type: 'f', value: this.opt.intensity1 },
        intensity2: { type: 'f', value: this.opt.intensity2 },
        dispFactor: { type: 'f', value: 0.0 },
        angle1: { type: 'f', value: this.opt.angle1 },
        angle2: { type: 'f', value: this.opt.angle2 },
        texture1: { type: 't', value: this.texture1 },
        texture2: { type: 't', value: this.texture2 },
        disp: { type: 't', value: this.disp }
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      opacity: 1.0
    });

    this.geometry = new THREE.PlaneBufferGeometry(
      this.el.offsetWidth,
      this.el.offsetHeight,
      1
    );
    const object = new THREE.Mesh(this.geometry, this.mate);
    this.scene.add(object);
  };
  change = () => {
    console.log(1)
    TweenMax.to(this.mate.uniforms.dispFactor, 0.6, {
      value: this.mate.uniforms.dispFactor.value===0?1:0,
      ease: 'Power4.EaseOut',
      onUpdate: ()=>this.render(),
      onComplete: ()=>this.render(),
    });
  }
  render = () => {
    this.renderer.render(this.scene, this.camera);
  };
  resize = () => {
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
  };
}
