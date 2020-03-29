import * as THREE from '../../lib/three.module.js'
import { OrbitControls } from '../../lib/OrbitControls.js'
import Config from './Config.js'

let that = null;
export class Stage {
  constructor(container) {
    this.fuArr = []
    this.viceCamera = null
    this.tmpTarget = new THREE.Vector3()
    this.orbitControls = null
    this.cameraHelper = null
    this.container = container;
    this.initFlag = false;
    that = this;
    // 场景
    this.scene = new THREE.Scene();
    this.scene.name = "moumade";
    window.scene = this.scene;

    // 环境光
    var ambient = new THREE.AmbientLight(0xffffff, 1.0);
    ambient.name = "ambient";
    this.scene.add(ambient);

    // 渲染器
    this.containerEle = document.querySelector(container);
    let vW = this.containerEle.clientWidth;
    let vH = this.containerEle.clientHeight;
    vH = vW / Config.STAGE_ASPECT_RATIO
    console.error(vW, vH);
    this.containerEle.style.width = `${vW}px`
    this.containerEle.style.height = `${vH}px`

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.renderer.setClearColor(0xffffff, 1.0);
    // this.renderer.autoClear = true;
    // this.renderer.autoClearColor = true;
    // this.renderer.autoClearDepth = true
    // this.renderer.autoClearStencil = true
    // this.renderer.autoScaleCubemaps = true
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(vW, vH, false);
    this.containerEle.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)

    this.camera.lookAt(0, 0, 0)
    this.camera.name = "camera";
    this.scene.add(this.camera);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    // this.initControls();
    this.camera.position.set(0, 0, 50)
  }

  initControls() {
    let control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control = control
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    control.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    control.dampingFactor = 0.35;
    //是否可以缩放
    control.enableZoom = true;
    control.zoomSpeed = 0.35;
    //是否自动旋转
    control.autoRotate = false;
    //设置相机距离原点的最远距离
    // control.minDistance = 22; //1000
    //设置相机距离原点的最远距离
    // control.maxDistance = 50; //3000
    //是否开启右键拖拽
    control.enablePan = false;
  }

  handleResize() {
    // 获取新的大小
    let vpW = document.body.offsetWidth;
    // let vpH = that.containerEle.clientHeight;
    let vpH = vpW / Config.STAGE_ASPECT_RATIO
    that.containerEle.style.width = `${vpW}px`
    that.containerEle.style.height = `${vpH}px`
    console.error(vpW, vpH);

    // 设置场景
    that.renderer.domElement.width = vpW;
    that.renderer.domElement.height = vpH;
    that.renderer.setSize(that.containerEle.clientWidth, that.containerEle.clientHeight);
    // 设置相机
    that.camera.aspect = vpW / vpH;
    that.camera.updateProjectionMatrix();
  }


  run() {
    this._loop()
  }
  addViceCamera(viceCamera) {
    this.viceCamera = viceCamera
  }
  onUpdate(fu) {
    this.fuArr.push(fu)
  }
  _loop() {
    that.camera.updateProjectionMatrix();
    that.camera.updateMatrixWorld()
    that.renderer.render(that.scene, that.camera);
    that.fuArr.forEach(fun => {
      fun()
    });
    that.control && that.control.update()
    requestAnimationFrame(that._loop)
  }

  changeCamera(camera) {
    this.camera = camera
    // console.error(camera.name);
  }
}

