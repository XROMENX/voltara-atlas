import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../public/transformer/vendor/three.module.js';
import {parts} from '../public/transformer/data.js';

function viewer() {
  const elements=new Map(), frames=new Map(), events=new Map();
  let frameId=0, renders=0, renderer;
  const element=()=>({style:{},dataset:{},children:[],value:'',open:false,
    classList:{toggle(){},remove(){}},append(...items){this.children.push(...items);},appendChild(item){this.children.push(item);},prepend(){},
    setAttribute(){},addEventListener(name,fn){this[name]=fn;},remove(){this.removed=true;},
    showModal(){this.open=true;},close(){this.open=false;this.closeEvent?.();},
    clientWidth:1000,clientHeight:700,getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700})});
  const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
  const document={hidden:false,getElementById:get,createElement:element,querySelectorAll:()=>[],querySelector:()=>element(),addEventListener:(name,fn)=>events.set(name,fn)};
  class Renderer {
    constructor(){renderer=this;this.domElement=element();this.shadowMap={};}
    setPixelRatio(){} setClearColor(){} setSize(){}
    render(scene){scene.updateMatrixWorld(true);renders++;}
  }
  class Controls extends THREE.EventDispatcher {
    constructor(){super();this.target=new THREE.Vector3();this.autoRotate=false;this.dampingFrames=0;}
    update(){if(this.dampingFrames-->0)this.dispatchEvent({type:'change'});}
  }
  const context={THREE:{...THREE,WebGLRenderer:Renderer},OrbitControls:Controls,parts,document,
    window:{addEventListener:(name,fn)=>events.set(name,fn)},history:{replaceState(){}},location:{hash:''},URLSearchParams,
    matchMedia:()=>({matches:false}),devicePixelRatio:1,innerWidth:1000,performance,
    ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){this.fn();}},
    requestAnimationFrame:fn=>{const id=++frameId;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
  vm.createContext(context);
  const source=readFileSync(new URL('../public/transformer/app.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
  vm.runInContext(source+'\nthis.probe={meshes,groups,controls,select,update,setMode(value){mode=value;update();}};',context);
  const tick=()=>{const queued=[...frames.values()];frames.clear();queued.forEach(fn=>fn());};
  return {...context.probe,document,get,events,renderer,tick,pending:()=>frames.size,renders:()=>renders};
}

test('viewer preserves every piece while sharing immutable resources within component boundaries',()=>{
  const v=viewer();
  assert.equal(v.meshes.length,1179);
  assert.equal(Object.keys(v.groups).length,41);
  assert.ok(new Set(v.meshes.map(o=>o.geometry)).size<250);
  assert.ok(new Set(v.meshes.map(o=>o.material)).size<130);
  const owners=new Map();
  for(const mesh of v.meshes){
    const previous=owners.get(mesh.material);
    if(previous)assert.equal(previous,mesh.userData.id,'material must not leak selection between components');
    owners.set(mesh.material,mesh.userData.id);
  }
  v.select('core');
  for(const mesh of v.meshes)assert.equal(mesh.material.emissive.getHex(),mesh.userData.id==='core'?0x4b632e:0);
  v.setMode('xray');
  for(const id of ['tank','lid','cooling','headers','pumps','valves'])assert.equal(v.groups[id].visible,false);
  assert.equal(v.groups.core.visible,true);
  v.setMode('solid');assert.equal(v.groups.tank.visible,true);
});

test('rendering stops when idle, resumes for edits, damping and rotation, and pauses when hidden',()=>{
  const v=viewer();
  assert.equal(v.pending(),1,'initial updates coalesce into one frame');
  assert.ok(!v.get('loading').removed,'loader remains until first frame');
  v.tick();assert.equal(v.renders(),1);assert.equal(v.pending(),0);assert.equal(v.get('loading').removed,true);
  for(let i=0;i<5;i++)v.update();assert.equal(v.pending(),1);assert.equal(v.renderer.shadowMap.needsUpdate,true);
  v.tick();assert.equal(v.pending(),0);
  v.controls.dampingFrames=3;v.controls.dispatchEvent({type:'change'});
  for(let i=0;i<4;i++)v.tick();assert.equal(v.pending(),0,'damping must settle');
  v.get('rotate').onclick();v.tick();assert.equal(v.pending(),1,'auto rotation keeps rendering');
  v.get('rotate').onclick();v.tick();assert.equal(v.pending(),0,'turning rotation off stops rendering');
  v.update();v.document.hidden=true;v.events.get('visibilitychange')();assert.equal(v.pending(),0);
  v.document.hidden=false;v.events.get('visibilitychange')();assert.equal(v.pending(),1);v.tick();assert.equal(v.pending(),0);
  v.select('tank');assert.equal(v.pending(),1,'selection updates the view');
});
