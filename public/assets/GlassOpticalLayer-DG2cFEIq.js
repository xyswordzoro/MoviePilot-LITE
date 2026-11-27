import{b as e,__mp_tla as __mp_tla_0}from"./date-D9OW3Y__.js";import{bc as n,bd as t,be as i,bf as a,bg as r,S as o,bh as l,bi as u,bj as s,bk as c,bl as p,bm as d,bn as f,bo as m,bp as v,bq as h,br as g,bs as x,bt as y,bu as w,bv as S,bw as T,bx as M,by as R,bz as D,bA as E,bB as b,bC as P,bD as k,bE as W,bF as A,__mp_tla as __mp_tla_1}from"./index-B4nzwswN.js";import{u as z,__mp_tla as __mp_tla_2}from"./usePagePresentationMotion-BOLTq2to.js";let De;let __mp_tla=Promise.all([(()=>{try{return __mp_tla_0}catch{}})(),(()=>{try{return __mp_tla_1}catch{}})(),(()=>{try{return __mp_tla_2}catch{}})()]).then(async()=>{const{computed:F}=await e("vue"),{useDisplay:L}=await e("vuetify");const{inject:C}=await e("vue"),U=16.667;function H(e){return Math.min(1,Math.max(0,e))}function I(e,n,t){return e+(n-e)*t}async function V(e){const{camera:n,geometry:t,renderer:i,three:a}=e,r=e.quality;let o=Math.max(1,e.viewportWidth),l=Math.max(1,e.viewportHeight),u=.5,s=.5,c=0,p=Number.NEGATIVE_INFINITY,d=Number.NEGATIVE_INFINITY,f=0,m=0,v=0,h={x:.5,y:.5},g={x:0,y:1},x={x:0,y:0},y=!1,w=!1,S=!1;const T=i.extensions?.has?.("EXT_color_buffer_float")?a.HalfFloatType:a.UnsignedByteType,M=()=>{const e=new a.WebGLRenderTarget(1,1,{depthBuffer:!1,format:a.RGBAFormat,magFilter:a.LinearFilter,minFilter:a.LinearFilter,stencilBuffer:!1,type:T,wrapS:a.ClampToEdgeWrapping,wrapT:a.ClampToEdgeWrapping});return e.texture.generateMipmaps=!1,e};let R=M(),D=M();const E={uEnergyDecay:{value:1},uHeightDecay:{value:1},uImpulse:{value:0},uImpulseCenter:{value:new a.Vector2(.5,.5)},uImpulseDirection:{value:new a.Vector2(0,1)},uImpulseOffset:{value:0},uImpulseSigma:{value:24},uImpulseSpeed:{value:0},uPrevious:{value:null},uPropagation:{value:.18},uQuality:{value:"high"===r?1:0},uReset:{value:1},uRestoring:{value:"high"===r?.028:.035},uStep:{value:1},uTexelSize:{value:new a.Vector2(1,1)},uVelocityDecay:{value:1},uViewportSize:{value:new a.Vector2(o,l)}},b=new a.ShaderMaterial({depthTest:!1,depthWrite:!1,fragmentShader:"\nprecision highp float;\n\nuniform sampler2D uPrevious;\nuniform vec2 uTexelSize;\nuniform vec2 uViewportSize;\nuniform vec2 uImpulseCenter;\nuniform vec2 uImpulseDirection;\nuniform float uImpulse;\nuniform float uImpulseOffset;\nuniform float uImpulseSigma;\nuniform float uImpulseSpeed;\nuniform float uPropagation;\nuniform float uRestoring;\nuniform float uVelocityDecay;\nuniform float uHeightDecay;\nuniform float uEnergyDecay;\nuniform float uStep;\nuniform float uQuality;\nuniform float uReset;\nvarying vec2 vUv;\n\nvec3 decodeState(vec4 sampleValue) {\n  if (sampleValue.b < (1.0 / 255.0)) return vec3(0.0);\n\n  return vec3(sampleValue.rg * 2.0 - 1.0, sampleValue.b);\n}\n\nfloat sampleHeight(vec2 offset) {\n  return decodeState(texture2D(uPrevious, clamp(vUv + offset, vec2(0.0), vec2(1.0)))).x;\n}\n\nvoid main() {\n  if (uReset > 0.5) {\n    gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);\n    return;\n  }\n\n  vec3 previous = decodeState(texture2D(uPrevious, vUv));\n  float h = previous.x;\n  float velocity = previous.y;\n  float energy = previous.z;\n  float cardinal1 = (\n    sampleHeight(vec2(uTexelSize.x, 0.0)) +\n    sampleHeight(vec2(-uTexelSize.x, 0.0)) +\n    sampleHeight(vec2(0.0, uTexelSize.y)) +\n    sampleHeight(vec2(0.0, -uTexelSize.y))\n  ) * 0.25;\n  float cardinal2 = (\n    sampleHeight(vec2(uTexelSize.x * 2.0, 0.0)) +\n    sampleHeight(vec2(-uTexelSize.x * 2.0, 0.0)) +\n    sampleHeight(vec2(0.0, uTexelSize.y * 2.0)) +\n    sampleHeight(vec2(0.0, -uTexelSize.y * 2.0))\n  ) * 0.25;\n  float diagonal1 = (\n    sampleHeight(vec2(uTexelSize.x, uTexelSize.y)) +\n    sampleHeight(vec2(-uTexelSize.x, uTexelSize.y)) +\n    sampleHeight(vec2(uTexelSize.x, -uTexelSize.y)) +\n    sampleHeight(vec2(-uTexelSize.x, -uTexelSize.y))\n  ) * 0.25;\n  float diagonal2 = (\n    sampleHeight(vec2(uTexelSize.x * 2.0, uTexelSize.y * 2.0)) +\n    sampleHeight(vec2(-uTexelSize.x * 2.0, uTexelSize.y * 2.0)) +\n    sampleHeight(vec2(uTexelSize.x * 2.0, -uTexelSize.y * 2.0)) +\n    sampleHeight(vec2(-uTexelSize.x * 2.0, -uTexelSize.y * 2.0))\n  ) * 0.25;\n  float balancedMean = cardinal1 * 0.72 + cardinal2 * 0.28;\n  float highMean = cardinal1 * 0.46 + diagonal1 * 0.22 + cardinal2 * 0.20 + diagonal2 * 0.12;\n  float curvature = mix(balancedMean, highMean, uQuality) - h;\n\n  float speedResponse = smoothstep(0.0, 1.0, uImpulseSpeed);\n  vec2 shiftedCenter = uImpulseCenter +\n    uImpulseDirection * uImpulseOffset * mix(0.35, 1.0, speedResponse) / max(uViewportSize, vec2(1.0));\n  vec2 impulseDelta = (vUv - shiftedCenter) * uViewportSize;\n  float directionLength = length(uImpulseDirection);\n  vec2 flowDirection = directionLength > 0.0001 ? uImpulseDirection / directionLength : vec2(0.0, 1.0);\n  vec2 flowPerpendicular = vec2(-flowDirection.y, flowDirection.x);\n  float along = dot(impulseDelta, flowDirection);\n  float across = dot(impulseDelta, flowPerpendicular);\n  float directionalRadius = length(vec2(along * 0.72, across * 1.24));\n  float directionality = step(0.0001, directionLength) * mix(0.32, 0.72, speedResponse);\n  float radius = mix(length(impulseDelta), directionalRadius, directionality);\n  float sigma = max(uImpulseSigma * mix(0.86, 1.05, speedResponse), 1.0);\n  float normalizedRadius = radius / sigma;\n  float core = exp(-0.5 * pow(normalizedRadius, 2.0));\n  float ring = exp(-0.5 * pow((radius - 1.6 * sigma) / (0.55 * sigma), 2.0));\n  float centerRelease = smoothstep(0.0, 0.55, normalizedRadius);\n  float annularCore = normalizedRadius * core;\n  float radialImpulse = (0.72 * annularCore - 0.3 * ring) * centerRelease * uImpulse;\n  float wakeEnvelope = exp(-0.5 * (\n    pow(along / (1.25 * sigma), 2.0) +\n    pow(across / (0.72 * sigma), 2.0)\n  ));\n  float directionalImpulse = clamp((-along / sigma) * wakeEnvelope * uImpulse * 0.9, -0.62, 0.62);\n  float impulse = clamp(\n    mix(radialImpulse, directionalImpulse, directionality),\n    -0.62,\n    0.62\n  );\n\n  velocity = clamp(\n    (\n      velocity +\n      curvature * uPropagation * uStep -\n      h * uRestoring * uStep +\n      impulse * mix(0.52, 0.82, speedResponse)\n    ) * uVelocityDecay,\n    -1.0,\n    1.0\n  );\n  h = clamp((h + velocity * uStep) * uHeightDecay, -1.0, 1.0);\n  energy = clamp(max(max(energy * uEnergyDecay, abs(h)), abs(impulse)), 0.0, 1.0);\n  gl_FragColor = vec4(h * 0.5 + 0.5, velocity * 0.5 + 0.5, energy, 1.0);\n}\n",uniforms:E,vertexShader:"\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = position.xy * 0.5 + 0.5;\n  gl_Position = vec4(position.xy, 0.0, 1.0);\n}\n"}),P=new a.Scene,k=new a.Mesh(t,b);k.frustumCulled=!1,P.add(k);const W=e=>{const t=i.getRenderTarget();try{i.setScissorTest(!1),i.setRenderTarget(e),i.render(P,n)}finally{i.setRenderTarget(t)}},A=(e,n)=>{if(S)return!1;const t=Math.max(1,e),i=Math.max(1,n),a=((e,n)=>{const t="high"===r?Math.min(1,Math.max(.25,192/e,128/n)):Math.min(1,Math.max(.16,128/e,96/n));return{height:Math.max(1,Math.round(n*t)),width:Math.max(1,Math.round(e*t))}})(t,i),u=o!==t||l!==i,s=R.width!==a.width||R.height!==a.height;return!(!u&&!s)&&(o=t,l=i,s&&(R.setSize(a.width,a.height),D.setSize(a.width,a.height)),E.uTexelSize.value.set(1/a.width,1/a.height),E.uViewportSize.value.set(o,l),L(),!0)},z=()=>"high"===r?I(90,280,s):I(70,220,s),F=e=>{if(!Number.isFinite(p))return 0;const n=Math.max(0,e-p-40),t=H((d-e)/40);return c*2**(-n/z())*t},L=()=>{S||(E.uReset.value=1,E.uPrevious.value=null,W(R),W(D),E.uReset.value=0,c=0,p=Number.NEGATIVE_INFINITY,d=Number.NEGATIVE_INFINITY,f=0,m=0,v=0,x={x:0,y:0},g={x:0,y:1},y=!1,w=!1)};try{const e=A(o,l);if(await i.compileAsync(P,n),S)throw new Error("Ripple resources were disposed during compilation");e||L()}catch(C){throw b.dispose(),R.dispose(),D.dispose(),C}return{dispose(){S||(S=!0,b.dispose(),R.dispose(),D.dispose())},inject(e){if(S)return;const n=e.timestamp,t=F(n),i=Math.min(.8,Math.max(.22,.22+.58*H(e.speed)));c=Math.max(t,i),p=n,d=n+(40+("high"===r?I(220,920,s):I(160,680,s))),m=Math.max(m,i),v=Math.max(v,H(e.speed)),h={x:H(e.point.x),y:H(e.point.y)};const a=Math.hypot(e.direction.x,e.direction.y);a>1e-4&&(x.x+=e.direction.x/a,x.y+=e.direction.y/a),w=!0,y=!1},get texture(){return w&&!S?R.texture:null},get texelSize(){return E.uTexelSize.value},setParameters(e,n){u=H(e/100),s=H(n/100)},resize:A,reset:L,step(e){if(S||!w)return!1;if(y||e>=d||F(e)<.006)return L(),!1;const n=f>0?Math.max(0,e-f):U,t=Math.min(33.334,Math.max(4,n)),i=t>U?2:1,a=Math.min(U,Math.max(4,t/i)),c=n/i,p=z(),T=.82*p,M=.72*p,b=Math.sqrt(o/Math.max(R.width,1)*(l/Math.max(R.height,1))),P="high"===r?4:6.25,k="high"===r?I(.11,.16,u):I(.12,.18,u);if(m>0){const e=Math.hypot(x.x,x.y);g=e>1e-4?{x:x.x/e,y:x.y/e}:{x:0,y:0}}E.uImpulseCenter.value.set(h.x,h.y),E.uImpulseDirection.value.set(g.x,g.y),E.uImpulseOffset.value=56*u,E.uImpulseSpeed.value=v,E.uImpulseSigma.value=I(54,97.2,u),E.uPropagation.value=Math.min(.18,Math.max(.08,k*(P/b)**2)),E.uRestoring.value="high"===r?.028:.035,E.uStep.value=a/U,E.uVelocityDecay.value=2**(-c/p),E.uHeightDecay.value=2**(-c/T),E.uEnergyDecay.value=2**(-c/M);for(let r=0;r<i;r+=1){E.uPrevious.value=R.texture,E.uImpulse.value=0===r?m:0,W(D);const e=R;R=D,D=e}return m=0,v=0,x={x:0,y:0},f=e,s<=0&&(y=!0),!0}}}const B=1/.52**2,q=`
precision highp float;

uniform sampler2D uPrevious;
uniform vec2 uPointer;
uniform vec2 uVelocity;
uniform vec2 uTexelSize;
uniform float uInjection;
uniform float uDecay;
uniform float uViewportAspect;
varying vec2 vUv;

void main() {
  vec4 previous = (
    texture2D(uPrevious, vUv) * 0.5 +
    texture2D(uPrevious, vUv + vec2(uTexelSize.x, 0.0)) * 0.125 +
    texture2D(uPrevious, vUv - vec2(uTexelSize.x, 0.0)) * 0.125 +
    texture2D(uPrevious, vUv + vec2(0.0, uTexelSize.y)) * 0.125 +
    texture2D(uPrevious, vUv - vec2(0.0, uTexelSize.y)) * 0.125
  );
  float previousEnergy = previous.z;
  vec2 flow = previousEnergy < 0.001 ? vec2(0.0) : (previous.xy * 2.0 - 1.0) * uDecay;
  float energy = previousEnergy * uDecay;
  vec2 delta = vUv - uPointer;
  delta.x *= uViewportAspect;
  float distanceSquared = dot(delta, delta);
  float injection = exp(-distanceSquared * ${(70*B).toFixed(3)}) * uInjection;
  float speed = length(uVelocity);
  vec2 direction = speed > 0.0001 ? uVelocity / speed : vec2(0.0, -1.0);
  vec2 perpendicular = vec2(-direction.y, direction.x);
  float shear = dot(delta, perpendicular) * exp(-distanceSquared * ${(42*B).toFixed(3)});

  flow += (direction * min(speed * 9.0, 0.9) - perpendicular * shear * 0.85) * injection * 0.44;
  energy = max(energy, injection);

  gl_FragColor = vec4(flow * 0.5 + 0.5, energy, 1.0);
}
`,O=`  vec2 wakeDirection = length(uWakeDirection) > 0.0001 ? normalize(uWakeDirection) : vec2(0.0, -1.0);
  vec2 wakePerpendicular = vec2(-wakeDirection.y, wakeDirection.x);
  vec2 trailRefraction = vec2(0.0);
  float trailEnergy = 0.0;
  float trailSpatialSpan = 0.0;
  float motionRangeCompression = mix(1.0, 1.34, uMotionExpansion);
  const float dynamicRangeScale = ${.52.toFixed(2)};
  const float dynamicRangeDensity = ${B.toFixed(3)};`;const{nextTick:G,onScopeDispose:N,ref:Q,toValue:K,watch:_}=await e("vue");function $(){const e=new Map;return{get(n,t){const i=e.get(n);if(i)return e.delete(n),e.set(n,i),i;const a=t();for(e.set(n,a);e.size>3;){const n=e.keys().next().value;n&&e.delete(n)}return a.catch((()=>{e.get(n)===a&&e.delete(n)})),a}}}function Y(e,n){e.value=n,document.documentElement.dataset.glassRendererState=n}function X(e=!0){const n={fixed:new Set,scroll:new Set},t=new Map,i=(e,n)=>{if(document.querySelector(".v-overlay--active"))return null;const t=document.querySelector(".login-card");if(t){const i=t.getBoundingClientRect();if(e>=i.left&&e<=i.right&&n>=i.top&&n<=i.bottom)return document.querySelector(".login-root")?"scroll":"fixed"}const i=document.querySelectorAll(".agent-assistant-panel, .layout-navbar, .layout-vertical-nav");for(const a of i){const t=a.getBoundingClientRect();if(e>=t.left&&e<=t.right&&n>=t.top&&n<=t.bottom)return"fixed"}return"scroll"},a=e=>e.type.startsWith("touch"),r=r=>{if(!K(e)){if(a(r)&&("touchend"===r.type||"touchcancel"===r.type))for(const e of Array.from(r.changedTouches))t.delete(e.identifier);return}const o=a(r)?(e=>{const n=e.changedTouches.item(0);if(!n)return null;if("touchstart"===e.type){const e=i(n.clientX,n.clientY);return e&&t.set(n.identifier,e),e}return t.get(n.identifier)??null})(r):i(r.clientX,r.clientY);if(o){for(const e of n[o])e(r);if(a(r)&&("touchend"===r.type||"touchcancel"===r.type))for(const e of Array.from(r.changedTouches))t.delete(e.identifier)}};let o=!1;function l(){o&&(o=!1,t.clear(),window.removeEventListener("pointermove",r),window.removeEventListener("touchstart",r),window.removeEventListener("touchmove",r),window.removeEventListener("touchend",r),window.removeEventListener("touchcancel",r))}return _((()=>K(e)),(e=>{e?o||(o=!0,window.addEventListener("pointermove",r,{passive:!0}),window.addEventListener("touchstart",r,{passive:!0}),window.addEventListener("touchmove",r,{passive:!0}),window.addEventListener("touchend",r,{passive:!0}),window.addEventListener("touchcancel",r,{passive:!0})):l()}),{flush:"sync",immediate:!0}),N((()=>{n.fixed.clear(),n.scroll.clear(),l()})),{subscribe:(e,t)=>(n[e].add(t),()=>n[e].delete(t))}}const j=[{rank:1,selector:".agent-assistant-panel",space:"fixed"},{rank:1,selector:".login-card",space:"fixed"},{rank:2,selector:".layout-vertical-nav",space:"fixed"},{rank:2,selector:".layout-navbar",space:"fixed"},{rank:3,selector:".dashboard-grid-item-content > .dashboard-grid-auto-size > .dashboard-grid-content-measure > .v-card",space:"scroll"},{rank:3,selector:".dashboard-grid-item-content > .dashboard-grid-auto-size > .dashboard-grid-content-measure > :first-child > .v-card",space:"scroll"},{rank:3,selector:"[data-glass-optical-surface]",space:"scroll"},{rank:4,selector:".app-hover-lift-card",space:"scroll"},{rank:5,selector:".layout-page-content .v-card",space:"scroll"}],J=j.map((({selector:e})=>e)).join(","),Z=".app-hover-lift-card";function ee(e){return Boolean(e.closest('[data-glass-optical-mode="excluded"]'))}function ne(e){return!e.closest(".v-overlay")&&!ee(e)}function te(e,n){return".login-card"===e&&document.querySelector(".login-root")?"scroll":n}function ie(e){return e instanceof Element&&(e.matches(Z)||Boolean(e.querySelector(Z)))}const ae="\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = position.xy * 0.5 + 0.5;\n  gl_Position = vec4(position.xy, 0.0, 1.0);\n}\n";function re(e,n,t,i,o=window.location.href){const l=a(n,t),u="auto"===l.textureSource?r(i,o)?"wallpaper":"procedural":l.textureSource;return`${"frosted"===e?"frosted":"plain"}:${n}:${l.textureLimit}:${u}`}const oe=`
precision highp float;

uniform sampler2D uPreviousTexture;
uniform sampler2D uTexture;
uniform sampler2D uPreviousFrostedTexture;
uniform sampler2D uFrostedTexture;
uniform sampler2D uFlowTexture;
uniform vec2 uCoverScale;
uniform vec2 uPreviousCoverScale;
uniform vec2 uPresentationSize;
uniform vec2 uScrollOffset;
uniform vec2 uVisibleViewportSize;
uniform float uDeformationStrength;
uniform float uDynamicsOnly;
uniform float uDynamicsMode;
uniform float uFlowStrength;
uniform float uHasWallpaperTexture;
uniform float uHasFlowTexture;
uniform float uHasFrostedTexture;
uniform float uHasRippleTexture;
uniform vec4 uInteractionRadii[8];
uniform vec4 uInteractionRects[8];
uniform int uInteractionRectCount;
uniform float uMotion;
uniform float uMotionExpansion;
uniform float uMaxRefractionPixels;
uniform vec2 uPointer;
uniform vec2 uPointerVelocity;
uniform vec2 uWakeDirection;
uniform float uQuality;
uniform float uReflectionStrength;
uniform float uRippleDeformationStrength;
uniform vec2 uRippleTexelSize;
uniform sampler2D uRippleTexture;
uniform vec4 uRects[8];
uniform vec4 uRadii[8];
uniform float uSurfaceWeights[8];
uniform float uSurfaceDynamics[8];
uniform int uRectCount;
uniform float uAppearance;
uniform float uBackgroundVisibility;
uniform vec3 uTintColor;
uniform float uFrostDetailLevel;
uniform float uSurfaceDensity;
uniform float uTintDensity;
uniform float uTransmissionStrength;
uniform float uTranslationStrength;
uniform float uTextureMix;
uniform float uPreviousWallpaperExposure;
uniform float uWallpaperExposure;
uniform vec4 uTrail[4];
uniform int uTrailCount;
varying vec2 vUv;

float cornerRadius(vec2 centered, vec4 radii) {
  if (centered.x >= 0.0) return centered.y >= 0.0 ? radii.y : radii.z;

  return centered.y >= 0.0 ? radii.x : radii.w;
}

float roundedRectMask(vec2 local, vec2 rectSize, vec4 radii) {
  vec2 localPixels = (local - 0.5) * rectSize;
  float radius = cornerRadius(localPixels, radii);
  float safeRadius = min(max(radius, 0.0), min(rectSize.x, rectSize.y) * 0.5);
  vec2 centered = abs(localPixels) - (rectSize * 0.5 - vec2(safeRadius));
  float distanceToEdge = length(max(centered, 0.0)) + min(max(centered.x, centered.y), 0.0) - safeRadius;
  return 1.0 - smoothstep(0.0, 1.5, distanceToEdge);
}

vec2 coverUv(vec2 uv) {
  vec2 documentPixels = vec2(uv.x, 1.0 - uv.y) * uPresentationSize;
  vec2 viewportPixels = documentPixels - uScrollOffset;
  vec2 viewportUv = vec2(
    viewportPixels.x / max(uVisibleViewportSize.x, 1.0),
    1.0 - viewportPixels.y / max(uVisibleViewportSize.y, 1.0)
  );

  return vec2(0.5) + (viewportUv - vec2(0.5)) * uCoverScale;
}

vec2 rippleFieldUv(vec2 uv) {
  vec2 documentPixels = vec2(uv.x, 1.0 - uv.y) * uPresentationSize;
  vec2 viewportPixels = documentPixels - uScrollOffset;

  return vec2(
    viewportPixels.x / max(uVisibleViewportSize.x, 1.0),
    1.0 - viewportPixels.y / max(uVisibleViewportSize.y, 1.0)
  );
}

vec3 sampleRippleState(vec2 uv) {
  if (uHasRippleTexture < 0.5) return vec3(0.0);

  vec4 encoded = texture2D(uRippleTexture, uv);
  if (encoded.b < (1.0 / 255.0)) return vec3(0.0);

  return vec3(encoded.r * 2.0 - 1.0, encoded.g * 2.0 - 1.0, encoded.b);
}

vec3 compressWallpaperLuminance(vec3 color, float wallpaperExposure) {
  vec3 exposed = max(color * wallpaperExposure, vec3(0.0));
  float sourceLuminance = dot(exposed, vec3(0.2126, 0.7152, 0.0722));
  if (sourceLuminance <= 0.0001) return exposed;

  float shadowLift = (1.0 - smoothstep(0.06, 0.5, sourceLuminance)) * 0.22;
  float highlightCompression = smoothstep(0.72, 0.98, sourceLuminance) * 0.08;
  float compressedLuminance =
    sourceLuminance * (1.0 + shadowLift) * (1.0 - highlightCompression);

  return clamp(exposed * (compressedLuminance / sourceLuminance), 0.0, 1.0);
}

vec3 toneMapWallpaper(vec3 color, vec2 uv, float wallpaperExposure) {
  float tinted = step(0.5, uAppearance) * (1.0 - step(1.5, uAppearance));
  float frosted = step(1.5, uAppearance);
  float exposure = mix(0.86, 0.85, tinted);
  exposure = mix(exposure, 0.82, frosted);
  float saturation = mix(0.82, 0.95, tinted);
  saturation = mix(saturation, 0.9, frosted);
  float contrast = mix(1.02, 1.0, frosted);
  vec3 normalized = compressWallpaperLuminance(color, wallpaperExposure);
  float luminance = dot(normalized, vec3(0.2126, 0.7152, 0.0722));
  vec3 mapped = mix(vec3(luminance), normalized, saturation);
  mapped = clamp((mapped - vec3(0.5)) * contrast + vec3(0.5), 0.0, 1.0) * exposure;

  float top = 1.0 - uv.y;
  float linearStart = mix(0.1, 0.24, frosted);
  float linearEnd = mix(mix(0.3, 0.32, tinted), 0.48, frosted);
  float linearAbsorption = mix(linearStart, linearEnd, top);
  vec2 radialDelta = (uv - vec2(0.5, 0.82)) / vec2(0.78, 1.0);
  float radialAbsorption = smoothstep(0.24, 0.92, length(radialDelta)) * mix(0.12, 0.14, tinted);
  radialAbsorption *= 1.0 - frosted;
  vec3 absorbed = mapped * (1.0 - linearAbsorption) * (1.0 - radialAbsorption);
  float transmissionResponse =
    pow(clamp(uTransmissionStrength, 0.0, 1.0), mix(0.9, 0.78, uQuality));
  float referenceLiftProgress = smoothstep(0.7, 1.0, uTransmissionStrength);
  float highTransmissionProgress =
    clamp((uTransmissionStrength - 1.0) / 0.3, 0.0, 1.0);
  float transmissionMaterialScale = mix(1.0, 0.9, tinted);
  float frostedTransparencyProgress =
    smoothstep(0.6, 0.96, uBackgroundVisibility);
  float frostedTransmissionScale = mix(0.42, 0.72, frostedTransparencyProgress);
  transmissionMaterialScale = mix(transmissionMaterialScale, frostedTransmissionScale, frosted);
  float highlightProtection = smoothstep(0.68, 0.92, luminance);
  vec3 transmissionReference = normalized;
  float referenceLift =
    transmissionMaterialScale *
    (
      referenceLiftProgress * mix(0.18, 0.25, uQuality) +
      highTransmissionProgress * mix(0.1, 0.16, uQuality)
    );
  transmissionReference *= 1.0 + referenceLift * (1.0 - highlightProtection * 0.72);
  transmissionReference = min(transmissionReference, vec3(0.96));
  vec3 protectedHighlightReference = min(normalized, vec3(0.96));
  transmissionReference = mix(
    transmissionReference,
    protectedHighlightReference,
    highlightProtection * 0.78
  );
  float transmissionMix = min(
    transmissionResponse *
      transmissionMaterialScale *
      mix(0.58, 0.84, uQuality),
    0.84
  );

  return mix(absorbed, transmissionReference, transmissionMix);
}

vec3 sampleWallpaper(vec2 uv) {
  vec2 viewportUv = vec2(0.5) + (uv - vec2(0.5)) / max(uCoverScale, vec2(0.0001));
  vec2 previousUv = vec2(0.5) + (viewportUv - vec2(0.5)) * uPreviousCoverScale;
  vec3 previous;
  vec3 current;
  if (uAppearance > 1.5 && uHasFrostedTexture > 0.5) {
    float frostLod = (1.0 - uFrostDetailLevel) * 6.0;
    // 低分辨率预滤已经扩大了每个 texel 的原图 footprint，LOD 只追加当前纹理内的低通层级。
    float frostGradientScale = exp2(frostLod);
    previous = texture2DGradEXT(
      uPreviousFrostedTexture,
      previousUv,
      dFdx(previousUv) * frostGradientScale,
      dFdy(previousUv) * frostGradientScale
    ).rgb;
    current = texture2DGradEXT(
      uFrostedTexture,
      uv,
      dFdx(uv) * frostGradientScale,
      dFdy(uv) * frostGradientScale
    ).rgb;
  } else {
    previous = texture2D(uPreviousTexture, previousUv).rgb;
    current = texture2D(uTexture, uv).rgb;
  }

  if (uTextureMix <= 0.001) {
    return toneMapWallpaper(previous, viewportUv, uPreviousWallpaperExposure);
  }
  if (uTextureMix >= 0.999) {
    return toneMapWallpaper(current, viewportUv, uWallpaperExposure);
  }

  vec3 previousTone = toneMapWallpaper(previous, viewportUv, uPreviousWallpaperExposure);
  vec3 currentTone = toneMapWallpaper(current, viewportUv, uWallpaperExposure);

  return mix(previousTone, currentTone, uTextureMix);
}

vec3 sampleChromatic(vec2 uv, float separation) {
  return vec3(
    sampleWallpaper(uv + vec2(separation, 0.0)).r,
    sampleWallpaper(uv).g,
    sampleWallpaper(uv - vec2(separation, 0.0)).b
  );
}

vec3 sampleBalancedDiffuse(vec2 uv, vec2 axis, float radius) {
  vec2 firstOffset = axis * radius;
  vec2 secondOffset = vec2(-axis.y, axis.x) * radius;

  return (
    sampleWallpaper(uv) * 0.28 +
    sampleWallpaper(uv + firstOffset) * 0.18 +
    sampleWallpaper(uv - firstOffset) * 0.18 +
    sampleWallpaper(uv + secondOffset) * 0.18 +
    sampleWallpaper(uv - secondOffset) * 0.18
  );
}

vec3 sampleHighQualityDiffuse(vec2 uv, vec2 axis, float radius) {
  vec2 firstOffset = axis * radius;
  vec2 secondOffset = vec2(-axis.y, axis.x) * radius;
  vec2 firstDiagonal = normalize(firstOffset + secondOffset) * radius * 1.15;
  vec2 secondDiagonal = normalize(firstOffset - secondOffset) * radius * 1.15;

  return (
    sampleWallpaper(uv) * 0.2 +
    sampleWallpaper(uv + firstOffset) * 0.12 +
    sampleWallpaper(uv - firstOffset) * 0.12 +
    sampleWallpaper(uv + secondOffset) * 0.12 +
    sampleWallpaper(uv - secondOffset) * 0.12 +
    sampleWallpaper(uv + firstDiagonal) * 0.08 +
    sampleWallpaper(uv - firstDiagonal) * 0.08 +
    sampleWallpaper(uv + secondDiagonal) * 0.08 +
    sampleWallpaper(uv - secondDiagonal) * 0.08
  );
}

float getContentProtection(vec2 sourceUv) {
  if (uQuality < 0.5 || uHasWallpaperTexture < 0.5 || uAppearance > 1.5) return 1.0;

  vec2 sourceTexel = max(uCoverScale, vec2(0.0001)) / max(uVisibleViewportSize, vec2(1.0));
  vec3 horizontalStart = sampleWallpaper(sourceUv - vec2(sourceTexel.x * 2.5, 0.0));
  vec3 horizontalEnd = sampleWallpaper(sourceUv + vec2(sourceTexel.x * 2.5, 0.0));
  vec3 verticalStart = sampleWallpaper(sourceUv - vec2(0.0, sourceTexel.y * 2.5));
  vec3 verticalEnd = sampleWallpaper(sourceUv + vec2(0.0, sourceTexel.y * 2.5));
  float contentGradient = max(length(horizontalEnd - horizontalStart), length(verticalEnd - verticalStart));

  return mix(1.0, 0.44, smoothstep(0.07, 0.34, contentGradient));
}

vec2 softLimitDynamicRefraction(vec2 refraction) {
  vec2 presentation = max(uPresentationSize, vec2(1.0));
  vec2 refractionPixels = refraction * presentation;
  float limit = max(0.5, uMaxRefractionPixels);
  float limitScale = limit / sqrt(limit * limit + dot(refractionPixels, refractionPixels));

  return refractionPixels * limitScale / presentation;
}

void main() {
  float mask = 0.0;
  float edge = 0.0;
  float caustic = 0.0;
  float directionalReflection = 0.0;
  float topPrism = 0.0;
  float backlightAbsorption = 0.0;
  float materialEnergy = 0.0;
  float sharedMotionPresence = 0.0;
  float dynamicMask = 0.0;
  vec2 staticRefraction = vec2(0.0);
  vec2 dynamicRefraction = vec2(0.0);
${O}
  float interactionMask = uInteractionRectCount > 0 ? 0.0 : 1.0;
  for (int interactionIndex = 0; interactionIndex < 8; interactionIndex++) {
    if (interactionIndex >= uInteractionRectCount) break;

    vec4 interactionRect = uInteractionRects[interactionIndex];
    vec2 interactionLocal = (vUv - interactionRect.xy) / max(interactionRect.zw, vec2(0.0001));
    interactionMask = max(
      interactionMask,
      roundedRectMask(
        interactionLocal,
        interactionRect.zw * uPresentationSize,
        uInteractionRadii[interactionIndex]
      )
    );
  }

  for (int trailIndex = 0; trailIndex < 4; trailIndex++) {
    if (trailIndex >= uTrailCount) break;

    vec4 trail = uTrail[trailIndex];
    vec2 trailDelta = vUv - trail.xy;
    trailDelta *= uPresentationSize / max(uVisibleViewportSize.y, 1.0) * motionRangeCompression;
    vec2 trailSpanDelta = trail.xy - uPointer;
    trailSpanDelta *= uPresentationSize / max(uVisibleViewportSize.y, 1.0) * motionRangeCompression;
    trailSpatialSpan = max(trailSpatialSpan, length(trailSpanDelta) * trail.z);
    float along = dot(trailDelta, wakeDirection);
    float across = dot(trailDelta, wakePerpendicular);
    float trailAlongDensity = mix(42.0, 22.0, uMotionExpansion) * dynamicRangeDensity;
    float trailAcrossDensity = mix(210.0, 86.0, uMotionExpansion) * dynamicRangeDensity;
    float lobe =
      exp(-(along * along * trailAlongDensity + across * across * trailAcrossDensity)) * trail.z * uMotion;
    float wake = mix(0.88, 0.58, float(trailIndex) / 3.0);

    trailRefraction +=
      (wakeDirection * 0.0048 + wakePerpendicular * across * 0.018) *
      lobe *
      uDeformationStrength *
      uFlowStrength;
    trailEnergy += lobe * wake * mix(0.72, 0.42, float(trailIndex) / 3.0);
  }

  vec4 flowSample = uHasFlowTexture > 0.5 ? texture2D(uFlowTexture, vUv) : vec4(0.5, 0.5, 0.0, 1.0);
  vec2 temporalFlow =
    uHasFlowTexture > 0.5
      ? (flowSample.xy * 2.0 - 1.0) *
        flowSample.z *
        uMotion *
        uDeformationStrength *
        uFlowStrength
      : vec2(0.0);
  float flowSurfaceDetail = 0.0;
  if (uQuality > 0.5 && uHasFlowTexture > 0.5) {
    vec2 flowTexel = vec2(3.0) / max(uPresentationSize, vec2(1.0));
    vec3 flowLeft = texture2D(uFlowTexture, vUv - vec2(flowTexel.x, 0.0)).xyz;
    vec3 flowRight = texture2D(uFlowTexture, vUv + vec2(flowTexel.x, 0.0)).xyz;
    vec3 flowBottom = texture2D(uFlowTexture, vUv - vec2(0.0, flowTexel.y)).xyz;
    vec3 flowTop = texture2D(uFlowTexture, vUv + vec2(0.0, flowTexel.y)).xyz;
    float flowGradient = length(flowRight.xy - flowLeft.xy) + length(flowTop.xy - flowBottom.xy);
    float energyGradient = abs(flowRight.z - flowLeft.z) + abs(flowTop.z - flowBottom.z);
    flowSurfaceDetail = smoothstep(0.015, 0.24, flowGradient + energyGradient * 0.72) * uMotion;
  }
  float rippleMode = step(0.5, uDynamicsMode) * (1.0 - step(1.5, uDynamicsMode));
  vec3 rippleState = vec3(0.0);
  vec2 rippleGradient = vec2(0.0);
  if (rippleMode > 0.5 && uHasRippleTexture > 0.5) {
    vec2 rippleUv = rippleFieldUv(vUv);
    rippleState = sampleRippleState(rippleUv);
    float rippleLeft = sampleRippleState(rippleUv - vec2(uRippleTexelSize.x, 0.0)).x;
    float rippleRight = sampleRippleState(rippleUv + vec2(uRippleTexelSize.x, 0.0)).x;
    float rippleBottom = sampleRippleState(rippleUv - vec2(0.0, uRippleTexelSize.y)).x;
    float rippleTop = sampleRippleState(rippleUv + vec2(0.0, uRippleTexelSize.y)).x;
    rippleGradient = vec2(rippleRight - rippleLeft, rippleTop - rippleBottom) * 0.5;
  }
  float rippleGradientLength = length(rippleGradient);
  float rippleGradientEnergy = smoothstep(0.003, 0.08, rippleGradientLength);
  // 半浮点高度场保留连续波前；真实梯度直接决定方向和幅度，不放大量化噪声。
  vec2 rippleRefraction =
    rippleGradient * mix(230.0, 335.0, uQuality) * uRippleDeformationStrength;
  rippleRefraction /= max(uPresentationSize, vec2(1.0));
  float frosted = step(1.5, uAppearance);
  float rippleAppearanceScale = uAppearance > 1.5 ? 1.25 : (uAppearance > 0.5 ? 0.86 : 0.72);
  rippleRefraction *= rippleAppearanceScale;

  for (int i = 0; i < 8; i++) {
    if (i >= uRectCount) break;

    vec4 rect = uRects[i];
    float surfaceDynamic = uSurfaceDynamics[i];
    vec2 local = (vUv - rect.xy) / rect.zw;
    float rectMask = roundedRectMask(local, rect.zw * uPresentationSize, uRadii[i]) * uSurfaceWeights[i];
    if (rectMask <= 0.0) continue;

    float sideDistance = min(local.x, 1.0 - local.x);
    float nonBottomDistance = min(sideDistance, 1.0 - local.y);
    float edgeResponse = 1.0 - smoothstep(0.0, 0.16, nonBottomDistance);
    vec2 lens = local - vec2(0.5);
    vec2 lightDirection = normalize(vec2(-0.68, 0.74));
    float lightCoordinate = dot(lens, lightDirection);
    float broadLight =
      exp(-pow((lightCoordinate - 0.08) * 2.25, 2.0)) *
      (0.42 + edgeResponse * 0.58);
    float topEdge = 1.0 - smoothstep(0.0, 0.11, 1.0 - local.y);
    float rightEdge = 1.0 - smoothstep(0.0, 0.14, 1.0 - local.x);
    float bottomEdge = 1.0 - smoothstep(0.0, 0.14, local.y);
    float litResponse = clamp(0.5 + lightCoordinate * 1.15, 0.0, 1.0);
    float localDirectionalReflection = broadLight * mix(0.34, 1.0, litResponse) * rectMask;
    float localTopPrism = topEdge * mix(0.38, 1.0, 1.0 - local.x) * rectMask;
    float localBacklightAbsorption = max(rightEdge * 0.72, bottomEdge * 0.46) * rectMask;
    vec2 pointerDelta = uPointer - vUv;
    vec2 pointerDeltaAspect = pointerDelta;
    pointerDeltaAspect *= uPresentationSize / max(uVisibleViewportSize.y, 1.0) * motionRangeCompression;
    // 三材质共享指针几何足迹；磨砂身份由位移幅度、低通扩散和材质合成表达。
    float pointerSpread = mix(26.0, 17.0, uQuality);
    pointerSpread *= dynamicRangeDensity * mix(1.0, 0.46, uMotionExpansion);
    float sharedDirectionality = smoothstep(0.015, 0.18, trailSpatialSpan);
    float pointerAlong = dot(-pointerDeltaAspect, wakeDirection);
    float pointerAcross = dot(-pointerDeltaAspect, wakePerpendicular);
    float sharedWakeTravel =
      0.08 * sharedDirectionality * mix(0.86, 1.18, uMotionExpansion);
    float radialPointerShape = exp(-dot(pointerDeltaAspect, pointerDeltaAspect) * pointerSpread);
    float directionalPointerShape =
      exp(-(
        pow(pointerAlong + sharedWakeTravel * 0.45, 2.0) * pointerSpread * 0.72 +
        pointerAcross * pointerAcross * pointerSpread * 1.35
      ));
    float pointerEnergy =
      clamp(mix(radialPointerShape, directionalPointerShape, sharedDirectionality) * uMotion, 0.0, 1.0);
    float sharedWaveDensity = mix(2.81, 1.63, uMotionExpansion);
    float radialSharedWave =
      exp(-dot(pointerDeltaAspect, pointerDeltaAspect) * sharedWaveDensity);
    float directionalSharedWave =
      exp(-(
        pow(pointerAlong + sharedWakeTravel, 2.0) * sharedWaveDensity * 0.62 +
        pointerAcross * pointerAcross * sharedWaveDensity * 2.2
      ));
    float sharedWaveEnergy =
      mix(radialSharedWave, directionalSharedWave, sharedDirectionality) *
      clamp(length(uPointerVelocity) * 14.0 * uTranslationStrength, 0.0, 1.0) *
      mix(1.0, 0.78, sharedDirectionality) *
      uMotion *
      uMotion;
    vec2 wakeDelta = vUv - uPointer;
    wakeDelta *= uPresentationSize / max(uVisibleViewportSize.y, 1.0) * motionRangeCompression;
    float wakeAlong = dot(wakeDelta, wakeDirection);
    float wakeAcross = dot(wakeDelta, wakePerpendicular);
    float wakeTravel =
      0.014 * dynamicRangeScale *
      mix(0.82, 1.18, uQuality) *
      mix(1.0, 1.45, uMotionExpansion);
    float wakeWidth =
      mix(0.027, 0.044, uQuality) * dynamicRangeScale * mix(1.0, 1.72, uMotionExpansion);
    float wakeCoordinate = (wakeAlong + wakeTravel) / wakeWidth;
    float wakeShape = wakeCoordinate * exp(-0.5 * wakeCoordinate * wakeCoordinate);
    float wakeEnvelope =
      exp(
        -wakeAcross *
        wakeAcross *
        mix(280.0, 145.0, uQuality) *
        dynamicRangeDensity *
        mix(1.0, 0.44, uMotionExpansion)
      );
    vec2 wakeRefraction =
      wakeDirection *
      wakeShape *
      wakeEnvelope *
      mix(0.0045, 0.0075, uQuality) *
      uMotion *
      uDeformationStrength *
      uFlowStrength;
    float wakeEnergy = abs(wakeShape) * wakeEnvelope * uMotion;
    // 覆盖能量比位移核更快收敛，避免高斯尾部把真实折射扩成整块色调覆盖。
    float coverageDirectionality = max(
      sharedDirectionality,
      smoothstep(0.001, 0.012, length(uPointerVelocity))
    );
    float coverageWakeTravel =
      0.08 * coverageDirectionality * mix(0.86, 1.18, uMotionExpansion);
    float directionalCoverageAlong = pointerAlong + coverageWakeTravel * 0.45;
    float directionalCoverageShape = exp(-(
      directionalCoverageAlong * directionalCoverageAlong * pointerSpread * 0.55 +
      pointerAcross * pointerAcross * pointerSpread * 2.8
    ));
    float pointerCoverageShape = mix(
      radialPointerShape,
      directionalCoverageShape,
      coverageDirectionality
    );
    float pointerCoverageEnergy = pow(clamp(pointerCoverageShape * uMotion, 0.0, 1.0), 1.15);
    float liquidEnergy = clamp(max(
      pointerCoverageEnergy,
      max(min(1.0, trailEnergy) * 0.68, wakeEnergy * 0.82)
    ), 0.0, 1.0);
    float staticLens = 0.00008 + edgeResponse * mix(0.00045, 0.00072, uQuality);
    float pointerStrength = mix(mix(0.0055, 0.008, uQuality), mix(0.0085, 0.012, uQuality), frosted);
    float trailStrength = mix(mix(0.78, 1.08, uQuality), mix(0.96, 1.3, uQuality), frosted);
    float temporalStrength = mix(0.032, 0.042, frosted) * uQuality * (1.0 + flowSurfaceDetail * 0.5);
    vec2 specularDelta =
      vUv - (uPointer - wakeDirection * mix(0.006, 0.022, uMotionExpansion) * dynamicRangeScale);
    specularDelta *= uPresentationSize / max(uVisibleViewportSize.y, 1.0) * motionRangeCompression;
    float specularAlong = dot(specularDelta, wakeDirection);
    float specularAcross = dot(specularDelta, wakePerpendicular);
    float singleSpecular =
      exp(-(
        specularAlong * specularAlong * mix(58.0, 25.0, uMotionExpansion) * dynamicRangeDensity +
        specularAcross * specularAcross * mix(190.0, 78.0, uMotionExpansion) * dynamicRangeDensity
      )) *
      uMotion *
      mix(1.0, 1.24, uMotionExpansion);
    float localCaustic = singleSpecular * rectMask * surfaceDynamic * interactionMask;
    staticRefraction += lens * staticLens * mix(1.0, 0.72, frosted) * rectMask * surfaceDynamic;
    vec2 sampleTranslation =
      uPointerVelocity *
      mix(0.055, 0.075, uQuality) *
      uMotion *
      uTranslationStrength;
    dynamicRefraction += (
      sampleTranslation +
      // 收紧高斯半径时补偿向量峰值，避免范围缩小同时削弱用户设置的形变强度。
      pointerDelta * pointerEnergy * pointerStrength * uDeformationStrength / dynamicRangeScale +
      trailRefraction * trailStrength +
      temporalFlow * temporalStrength +
      wakeRefraction
    ) * rectMask * surfaceDynamic * interactionMask;
    dynamicRefraction += rippleRefraction * rippleMode * rectMask * surfaceDynamic * interactionMask;
    edge = max(edge, edgeResponse * rectMask * surfaceDynamic);
    caustic = max(caustic, localCaustic);
    caustic = max(
      caustic,
      rippleGradientEnergy * rippleState.z * rippleMode * rectMask * surfaceDynamic * interactionMask
    );
    directionalReflection = max(directionalReflection, localDirectionalReflection);
    topPrism = max(topPrism, localTopPrism);
    backlightAbsorption = max(backlightAbsorption, localBacklightAbsorption);
    materialEnergy = max(materialEnergy, liquidEnergy * rectMask * surfaceDynamic * interactionMask);
    materialEnergy = max(
      materialEnergy,
      rippleState.z * rippleMode * rectMask * surfaceDynamic * interactionMask
    );
    sharedMotionPresence = max(
      sharedMotionPresence,
      sharedWaveEnergy * rectMask * surfaceDynamic * interactionMask
    );
    dynamicMask = max(dynamicMask, rectMask * surfaceDynamic * interactionMask);
    mask = max(mask, rectMask);
  }

  if (mask <= 0.0) discard;

  float contentProtection = getContentProtection(coverUv(vUv + staticRefraction));
  dynamicRefraction *= contentProtection;
  // 高光足迹与壁纸位移强度独立校准，收紧反馈范围不能同步削弱三项动态参数。
  dynamicRefraction *= 1.2;
  dynamicRefraction = softLimitDynamicRefraction(dynamicRefraction);
  vec2 refraction = staticRefraction + dynamicRefraction;
  vec2 sourceUv = coverUv(vUv + refraction);
  float separation = edge * mix(0.00024, 0.00055, uQuality) * mix(1.0, 0.58, frosted);
  float usesPrefilteredFrost = frosted * uHasFrostedTexture;
  vec3 refracted = usesPrefilteredFrost > 0.5
    ? sampleWallpaper(sourceUv)
    : sampleChromatic(sourceUv, separation);
  float detailSeparation = separation * mix(1.45, 2.35, uQuality);
  vec3 detailed = usesPrefilteredFrost > 0.5
    ? refracted
    : sampleChromatic(sourceUv, detailSeparation);
  refracted = mix(refracted, detailed, mix(0.06, 0.16, uQuality) * (1.0 - frosted));
  vec2 diffusionAxis = length(refraction) > 0.00001 ? normalize(refraction) : wakePerpendicular;
  float diffusionRadius =
    mix(0.0022, 0.0038, uQuality) *
    (
      0.82 +
      materialEnergy * mix(0.28, 0.76, uMotionExpansion) +
      flowSurfaceDetail * dynamicMask * 0.38
    );
  float frostedDensity = frosted * (1.0 - uFrostDetailLevel);
  diffusionRadius *= 1.0 + frostedDensity * mix(1.15, 1.55, uQuality);
  vec3 diffused;
  if (usesPrefilteredFrost > 0.5) {
    diffused = refracted;
  } else if (uQuality > 0.5) {
    diffused = sampleHighQualityDiffuse(sourceUv, diffusionAxis, diffusionRadius);
  } else {
    diffused = sampleBalancedDiffuse(sourceUv, diffusionAxis, diffusionRadius);
  }
  refracted = mix(refracted, diffused, frosted);
  float refractedLuminance = dot(refracted, vec3(0.2126, 0.7152, 0.0722));
  float tinted = step(0.5, uAppearance) * (1.0 - step(1.5, uAppearance));
  float transmissionOffset = min(uTransmissionStrength - 1.0, 0.0);
  if (transmissionOffset < 0.0) {
    float dimming = mix(0.14, 0.18, uQuality) * mix(1.0, 0.65, frosted);
    refracted *= 1.0 + transmissionOffset * dimming;
  }
  refractedLuminance = dot(refracted, vec3(0.2126, 0.7152, 0.0722));
  float highlightBudget = mix(1.0, 0.34, smoothstep(0.48, 0.9, refractedLuminance));
  float frostedBrightCompression = smoothstep(0.58, 0.94, refractedLuminance) * frosted;
  refracted *= 1.0 - frostedBrightCompression * mix(0.16, 0.22, uQuality);
  vec3 frostedContrast = clamp((refracted - vec3(0.5)) * 1.16 + vec3(0.5), 0.0, 1.0);
  refracted = mix(
    refracted,
    frostedContrast,
    frosted * materialEnergy * mix(0.24, 0.58, uMotionExpansion)
  );
  vec3 highlight = vec3(0.84, 0.92, 1.0);
  float edgeHighlightMix = 0.12;
  float causticHighlightMix = 0.075;
  float liquidPresence = clamp(materialEnergy, 0.0, 1.0);
  float clearVisibilityProgress = clamp((uBackgroundVisibility - 0.18) / 0.78, 0.0, 1.0);
  float clearBaseAlpha = mix(0.08, 0.34, clearVisibilityProgress);
  float materialAlpha = clearBaseAlpha * mix(1.0, 2.5, liquidPresence);
  float proceduralEdgeAlpha = 0.14;
  float proceduralCausticAlpha = 0.075;

  if (uAppearance > 1.5) {
    highlight = vec3(0.94, 0.97, 1.0);
    edgeHighlightMix = 0.15;
    causticHighlightMix = 0.042;
    float frostedBaseAlpha = mix(0.46, 0.88, uSurfaceDensity);
    materialAlpha = frostedBaseAlpha * mix(0.9, 1.0, liquidPresence);
    proceduralEdgeAlpha = 0.16;
    proceduralCausticAlpha = 0.045;
  } else if (uAppearance > 0.5) {
    highlight = mix(vec3(1.0), uTintColor, mix(0.28, 0.72, uTintDensity));
    edgeHighlightMix = 0.17;
    causticHighlightMix = 0.085;
    float tintedVisibilityProgress = clamp((uBackgroundVisibility - 0.08) / 0.84, 0.0, 1.0);
    float tintedBaseAlpha = mix(0.16, 0.5, tintedVisibilityProgress);
    materialAlpha = tintedBaseAlpha * mix(1.0, 1.8, liquidPresence);
  }

  if (uHasWallpaperTexture < 0.5) {
    float proceduralReflection =
      (directionalReflection * 0.42 + topPrism * 0.66 + caustic * 0.72) *
      uReflectionStrength;
    vec3 proceduralHighlight = highlight * proceduralReflection;
    float proceduralAlpha =
      mask *
      (
        directionalReflection * proceduralEdgeAlpha +
        topPrism * proceduralEdgeAlpha * 0.76 +
        caustic * proceduralCausticAlpha
      ) *
      uReflectionStrength;
    gl_FragColor = vec4(proceduralHighlight, proceduralAlpha);
    return;
  }

  float reflectionMix =
    clamp(
      (directionalReflection * edgeHighlightMix + topPrism * edgeHighlightMix * 0.82) *
        uReflectionStrength *
        highlightBudget,
      0.0,
      0.36
    );
  float absorption =
    clamp(backlightAbsorption * mix(0.035, 0.075, frosted) * uReflectionStrength, 0.0, 0.14);
  refracted *= 1.0 - absorption;
  refracted = mix(refracted, highlight, reflectionMix);
  refracted += highlight * caustic * causticHighlightMix * uReflectionStrength * highlightBudget;

  if (uDynamicsOnly > 0.5) {
    float dynamicsPresence = max(materialEnergy, sharedMotionPresence * 0.36);
    float dynamicsAlpha =
      clamp(dynamicsPresence * mix(0.5, 0.72, uQuality) * mix(1.0, 1.12, frosted), 0.0, 0.82);
    gl_FragColor = vec4(refracted, dynamicsAlpha);
    return;
  }

  gl_FragColor = vec4(
    refracted,
    clamp(
      mask *
        (
          materialAlpha +
          (
            directionalReflection * 0.065 +
            topPrism * 0.05 +
            caustic * mix(0.028, 0.04, uQuality)
          ) *
            uReflectionStrength *
            highlightBudget
        ),
      0.0,
      0.94
    )
  );
}
`;function le(e){const n=getComputedStyle(e),t=e=>{const n=Number.parseFloat(e);return Number.isFinite(n)?n:0};return[t(n.borderTopLeftRadius),t(n.borderTopRightRadius),t(n.borderBottomRightRadius),t(n.borderBottomLeftRadius)]}function ue(e,n){const t=getComputedStyle(e);return"none"!==t.display&&"hidden"!==t.visibility&&Number.parseFloat(t.opacity||"1")>0&&n.width>=24&&n.height>=24}function se(e){const n=e.closest("[data-glass-optical-mode]")?.dataset.glassOpticalMode;return"static-material"===n?"static-material":"dynamic"}function ce(e){return"tinted"===e?1:"frosted"===e?2:0}function pe(e){const n=Q("loading"),A=Q(0),z=Q(""),F=Q(0),L=Q(""),C=Q(""),U=Q(0),H=Q(""),I=Q(""),B=Q(0),O=Q("");let X=null,pe=null,de=null,fe=null,me=null,ve=null,he=null,ge=1,xe=1,ye=!1,we=t.exposure,Se=null,Te=null,Me=1,Re=1,De=t.exposure,Ee=0,be=null,Pe=0,ke=0,We=null,Ae=null,ze=null,Fe=null,Le=1,Ce=1,Ue=null,He=null,Ie=0,Ve=0,Be="",qe=0,Oe=0,Ge=0,Ne=Number.NEGATIVE_INFINITY,Qe=.5*window.innerWidth,Ke=.5*window.innerHeight,_e=!1,$e=.5,Ye=.5,Xe=.5,je=.5,Je=null,Ze=0,en=!1,nn="",tn=0,an=null,rn=null,on=!1,ln=null,un=!1,sn=!1,cn=!1,pn=!1,dn=!1,fn=0,mn=window.scrollX,vn=window.scrollY,hn=null,gn=!1,xn=null,yn=null,wn=null,Sn=null,Tn=[],Mn=[],Rn=[],Dn=[],En=[],bn=[],Pn=new Set,kn=!0,Wn=null,An=null,zn=null,Fn=0,Ln=null,Cn=0;const Un=new Set;let Hn=!0,In=null,Vn={x:0,y:-1},Bn=!1,qn=null,On=0,Gn=0;const Nn=e.surfaceSpace??"fixed",Qn=()=>"scroll"===Nn||"fixed"===Nn&&"frosted"===K(e.appearance),Kn=e.wallpaperSourceCache??$();function _n(){pe&&(pe.uniforms.uHasWallpaperTexture.value=!ye||"scroll"===Nn&&un?0:1)}function $n(){null!==ln&&(window.clearTimeout(ln),ln=null)}function Yn(e=performance.now()){$n(),"scroll"===Nn&&un&&(un=!1,_n(),wt(e,!1),document.documentElement.removeAttribute("data-glass-scroll-presentation"))}function Xn(){"scroll"===Nn&&pe&&($n(),ln=window.setTimeout((()=>Yn()),180),un||(Yt()&&fe&&(en=!1,rt(),fe.reset(),pe.uniforms.uRippleTexture.value=fe.texture,pe.uniforms.uHasRippleTexture.value=0,si()),un=!0,_n(),document.documentElement.dataset.glassScrollPresentation="native",wt(performance.now(),!1)))}function jn(e){return!(e instanceof Element&&e!==document.documentElement&&e!==document.body)||Tn.some((n=>e.contains(n)))}function Jn(e){if(e instanceof WheelEvent&&0===e.deltaX&&0===e.deltaY)return;if(e instanceof KeyboardEvent){const n=e.target;if(n instanceof HTMLElement&&(n.isContentEditable||["INPUT","SELECT","TEXTAREA"].includes(n.tagName)))return;if(!["ArrowDown","ArrowUp","End","Home","PageDown","PageUp"," "].includes(e.key))return}const n=function(e){const n=document.scrollingElement??document.documentElement,t=e.target;if(!(t instanceof Element))return n;if(t.closest(".v-overlay"))return null;const i=e instanceof WheelEvent?e:null;for(let a=t;a&&a!==document.body;a=a.parentElement){const e=getComputedStyle(a),n=/(auto|overlay|scroll)/.test(e.overflowY)&&a.scrollHeight>a.clientHeight&&(!i||i.deltaY<0&&a.scrollTop>0||i.deltaY>0&&a.scrollTop+a.clientHeight<a.scrollHeight);if(/(auto|overlay|scroll)/.test(e.overflowX)&&a.scrollWidth>a.clientWidth&&(!i||i.deltaX<0&&a.scrollLeft>0||i.deltaX>0&&a.scrollLeft+a.clientWidth<a.scrollWidth)||n)return a}return n}(e);n&&jn(n)&&Xn()}function Zn(t){!1!==e.syncDocumentState?Y(n,t):n.value=t}function et(){if("fixed"===Nn)return{height:window.innerHeight,width:window.innerWidth};const n=e.canvas.value?.parentElement;return{height:Math.max(window.innerHeight,n?.scrollHeight??0,document.documentElement.scrollHeight),width:Math.max(window.innerWidth,n?.scrollWidth??0,document.documentElement.scrollWidth)}}function nt(){const e=pe?.uniforms.uPresentationSize.value;return e?{height:e.y,width:e.x}:{height:window.innerHeight,width:window.innerWidth}}function tt(e,n){return"fixed"===Nn?{x:e,y:n}:{x:e+window.scrollX,y:n+window.scrollY}}function it(e){const n=e.getBoundingClientRect(),t="scroll"===Nn?window.scrollX:0,i="scroll"===Nn?window.scrollY:0;return{height:n.height,radii:[...le(e)],rank:0,width:n.width,x:n.left+t,y:n.top+i}}function at(n=!0){if(n&&wn?.disconnect(),"scroll"===Nn){const n=e.canvas.value?.parentElement;n&&wn?.observe(n)}for(const e of Tn)wn?.observe(e)}function rt(){null!==Ae&&(cancelAnimationFrame(Ae),Ae=null)}function ot(){null!==rn&&cancelAnimationFrame(rn),rn=null,on=!1,sn=!1,cn=!1,pn=!1,dn=!1,fn=0,$n()}function lt(){null!==ze&&(cancelAnimationFrame(ze),ze=null)}function ut(){null!==Ln&&cancelAnimationFrame(Ln),Ln=null,Cn=0,Un.clear()}function st(){null!==Fe&&(window.clearTimeout(Fe),Fe=null)}function ct(e,n){e?.dispose(),n?.dispose()}function pt(){pe&&ve&&(Se&&Se!==ve&&ct(Se,Te),Se=null,Te=null,Me=ge,Re=xe,De=we,pe.uniforms.uPreviousTexture.value=ve,pe.uniforms.uPreviousFrostedTexture.value=he?.texture??ve,pe.uniforms.uPreviousCoverScale.value.copy(pe.uniforms.uCoverScale.value),pe.uniforms.uPreviousWallpaperExposure.value=we,pe.uniforms.uTextureMix.value=1,Ee=0,be=null,lt())}function dt(e){ze=null,"hidden"!==document.visibilityState&&(wt(e),Se&&null===ze&&(ze=requestAnimationFrame(dt)))}function ft(){null===ze&&Se&&"hidden"!==document.visibilityState&&(ze=requestAnimationFrame(dt))}async function mt(e,n,t,i){if(!pe||!X)return null;const a=pe,r=function(){if(me)return me;if(!pe||!X)return null;const e={uDirection:{value:new X.Vector2(1,0)},uTexture:{value:null},uTextureSize:{value:new X.Vector2(1,1)}},n=new X.ShaderMaterial({depthTest:!1,depthWrite:!1,fragmentShader:"\nprecision highp float;\n\nuniform sampler2D uTexture;\nuniform vec2 uDirection;\nuniform vec2 uTextureSize;\nvarying vec2 vUv;\n\nvoid main() {\n  vec2 texel = uDirection / max(uTextureSize, vec2(1.0));\n  vec3 color =\n    texture2D(uTexture, vUv).rgb * 0.227027 +\n    texture2D(uTexture, vUv + texel * 1.384615).rgb * 0.316216 +\n    texture2D(uTexture, vUv - texel * 1.384615).rgb * 0.316216 +\n    texture2D(uTexture, vUv + texel * 3.230769).rgb * 0.070270 +\n    texture2D(uTexture, vUv - texel * 3.230769).rgb * 0.070270;\n  gl_FragColor = vec4(color, 1.0);\n}\n",uniforms:e,vertexShader:ae}),t=new X.Scene,i=new X.Mesh(pe.geometry,n);return i.frustumCulled=!1,t.add(i),me={material:n,mesh:i,scene:t,uniforms:e},me}();if(!r)return null;const o=Math.min(1,i/Math.max(n,t)),l=Math.max(1,Math.round(n*o)),u=Math.max(1,Math.round(t*o)),s=(e=!1)=>new X.WebGLRenderTarget(l,u,{depthBuffer:!1,generateMipmaps:e,magFilter:X.LinearFilter,minFilter:e?X.LinearMipmapLinearFilter:X.LinearFilter,stencilBuffer:!1}),c=s(),p=s(!0),d=a.renderer.getRenderTarget();try{return a.renderer.initTexture(e),await a.renderer.compileAsync(r.scene,a.camera),pe!==a?(p.dispose(),null):(r.uniforms.uDirection.value.set(1,0),r.uniforms.uTexture.value=e,r.uniforms.uTextureSize.value.set(n,t),a.renderer.setRenderTarget(c),a.renderer.render(r.scene,a.camera),r.uniforms.uDirection.value.set(0,1),r.uniforms.uTexture.value=c.texture,r.uniforms.uTextureSize.value.set(n,t),a.renderer.setRenderTarget(p),a.renderer.render(r.scene,a.camera),p)}catch(f){throw p.dispose(),f}finally{pe===a&&a.renderer.setRenderTarget(d),c.dispose()}}function vt(){de&&(de.dispose(),de=null,pe&&(pe.uniforms.uFlowTexture.value=null,pe.uniforms.uHasFlowTexture.value=0))}function ht(){Gn+=1,fe?.dispose(),fe=null,pe&&(pe.uniforms.uRippleTexture.value=null,pe.uniforms.uHasRippleTexture.value=0,pe.uniforms.uRippleTexelSize.value.set(1,1))}function gt(){if(!pe||!X)return;const e=Vt();$t()&&e.flowField?de||(de=function(e){const{camera:n,geometry:t,pointer:i,renderer:a,three:r,velocity:o}=e;let l=!1;const u=()=>new r.WebGLRenderTarget(1,1,{depthBuffer:!1,magFilter:r.LinearFilter,minFilter:r.LinearFilter,stencilBuffer:!1});let s=u(),c=u();const p={uDecay:{value:1},uInjection:{value:0},uPointer:{value:i},uPrevious:{value:null},uTexelSize:{value:new r.Vector2(1,1)},uVelocity:{value:o},uViewportAspect:{value:window.innerWidth/Math.max(window.innerHeight,1)}},d=new r.ShaderMaterial({depthTest:!1,depthWrite:!1,fragmentShader:q,uniforms:p,vertexShader:"\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = position.xy * 0.5 + 0.5;\n  gl_Position = vec4(position.xy, 0.0, 1.0);\n}\n"}),f=new r.Scene,m=new r.Mesh(t,d);return m.frustumCulled=!1,f.add(m),{clearInput(){p.uDecay.value=0,p.uInjection.value=0},dispose(){l||(l=!0,d.dispose(),s.dispose(),c.dispose())},finishFrame(){p.uInjection.value=0},resize(e,n,t,i){if(l)return;const a=Math.max(96,Math.round(.25*e)),r=Math.max(96,Math.round(.25*n));s.width===a&&s.height===r||(s.setSize(a,r),c.setSize(a,r)),p.uTexelSize.value.set(1/a,1/r),p.uViewportAspect.value=t/Math.max(i,1)},setFrameParameters(e,n){p.uDecay.value=e,p.uInjection.value=n},step(){if(l)return s.texture;a.setScissorTest(!1),p.uPrevious.value=s.texture,a.setRenderTarget(c),a.render(f,n),a.setRenderTarget(null);const e=s;return s=c,c=e,s.texture}}}({camera:pe.camera,geometry:pe.geometry,pointer:pe.uniforms.uPointer.value,renderer:pe.renderer,three:X,velocity:pe.uniforms.uPointerVelocity.value}),pe.uniforms.uHasFlowTexture.value=1):vt()}async function xt(){if(!pe||!X)return;if(!Yt())return void ht();if(fe)return;const n=pe,t=++Gn,i="high"===K(e.quality)?"high":"balanced";let a;try{a=await V({camera:n.camera,geometry:n.geometry,quality:i,renderer:n.renderer,three:X,viewportHeight:window.innerHeight,viewportWidth:window.innerWidth})}catch(r){if(t!==Gn||pe!==n||!Yt())return;throw r}t===Gn&&pe===n&&Yt()?(fe=a,a.setParameters(K(e.translationStrength??Qt()),K(e.flowStrength??Qt())),n.uniforms.uRippleTexture.value=a.texture,n.uniforms.uRippleTexelSize.value.copy(a.texelSize),n.uniforms.uHasRippleTexture.value=a.texture?1:0):a.dispose()}async function yt(){if(!pe)return;en=!1,Je=null,rt(),Ci(),si(),Ge=0,Qe=.5*window.innerWidth,Ke=.5*window.innerHeight,_e=!0,Vn={x:0,y:-1};const n=Kt();pe.uniforms.uDynamicsMode.value=Xt(),pe.uniforms.uTranslationStrength.value="fluid"===n?jt():0,pe.uniforms.uDeformationStrength.value="fluid"===n?Jt():0,pe.uniforms.uFlowStrength.value="fluid"===n?Zt():0,pe.uniforms.uMotionExpansion.value="fluid"===n?ei():0,pe.uniforms.uMaxRefractionPixels.value=ni(),pe.uniforms.uRippleDeformationStrength.value="ripple"===n?Math.min(1,Math.max(0,K(e.deformationStrength??Qt())/100)):0,pe.uniforms.uTrailCount.value="fluid"===n?Vt().trailCount:0,"fluid"===n?(ht(),gt()):"ripple"===n?(vt(),await xt()):(vt(),ht()),pe&&Kt()===n&&("off"!==n&&Li(),ti(),Tt())}function wt(n=performance.now(),t=!0){if(pe&&K(e.active)&&"hidden"!==document.visibilityState){if(function(n){if(!pe||!Se)return!1;const t=K(e.transitionDuration??0),i=T(n-Ee,t);pe.uniforms.uTextureMix.value=i,i>=1&&pt()}(n),de&&t&&(pe.uniforms.uFlowTexture.value=de.step()),"scroll"===Nn){const{height:e}=nt(),n=Le/Math.max(e,1),t=Math.max(0,Math.floor((e-window.scrollY-window.innerHeight)*n)),i=Math.min(Le-t,Math.ceil(window.innerHeight*n)+2);pe.renderer.setScissorTest(!0),pe.renderer.setScissor(0,t,Ce,i),pe.renderer.clear()}else pe.renderer.setScissorTest(!1);pe.renderer.render(pe.scene,pe.camera),A.value+=1}}function St(e){Ae=null,wt(e)}function Tt(){null===Ae&&pe&&(Ae=requestAnimationFrame(St))}function Mt(n=performance.now()){if(!pe)return;zn&&n-Fn>=96&&(zn=null,Dn=Dn.filter((e=>"outgoing"!==e.role)).map((e=>({...e,role:e.key===Wn?"active":"stable"}))));const t=nt(),i=En.map((e=>E(e.rect,t.width,t.height))),a=pe.uniforms.uInteractionRects.value,r=pe.uniforms.uInteractionRadii.value;for(let e=0;e<8;e+=1){const n=i[e],t=n?.rect??[0,0,0,0],o=n?.radii??[0,0,0,0];a[e].set(t[0],t[1],t[2],t[3]),r[e].set(o[0],o[1],o[2],o[3])}pe.uniforms.uInteractionRectCount.value=i.length;const o=Dn.map((e=>E(e.rect,t.width,t.height))),l=pe.uniforms.uRects.value,u=pe.uniforms.uRadii.value,s=pe.uniforms.uSurfaceWeights.value,c=pe.uniforms.uSurfaceDynamics.value,p=new Set(En.map((e=>e.owner))),d=zn?b(n-Fn,96):{incoming:1,outgoing:0},f="scroll"===Nn&&"frosted"!==K(e.appearance)?Math.min(1,Math.max(0,K(e.pageMotion?.opacity??1))):1,m=Hn?f:0;for(let e=0;e<8;e+=1){const n=o[e],t=Dn[e],i=n?.rect??[0,0,0,0],a=n?.radii??[0,0,0,0];l[e].set(i[0],i[1],i[2],i[3]),u[e].set(a[0],a[1],a[2],a[3]);const r="outgoing"===t?.role?d.outgoing:"active"===t?.role?d.incoming:t?1:0;s[e]=r*m;const f=!t||!Pn.has(t.key)||p.has(t.key);c[e]="static-material"!==t?.mode&&f?1:0}pe.uniforms.uRectCount.value=o.length}function Rt(e){return e.width>=24&&e.height>=24}function Dt(){const e=new Set(Dn.map((e=>e.key))),n="scroll"===Nn?window.scrollX:0,t="scroll"===Nn?window.scrollY:0,i=tt(Qe,Ke),a=bn.filter((n=>e.has(n.owner))).map((e=>{const{rect:a}=e,r=Math.min(n+window.innerWidth,a.x+a.width)-Math.max(n,a.x),o=Math.min(t+window.innerHeight,a.y+a.height)-Math.max(t,a.y),l=a.x+a.width>=n-96&&a.x<=n+window.innerWidth+96&&a.y+a.height>=t-96&&a.y<=t+window.innerHeight+96;return{candidate:e,distance:Math.hypot(a.x+.5*a.width-i.x,a.y+.5*a.height-i.y),visible:r>=24&&o>=24,inOverscan:l}})).filter((e=>Rt(e.candidate.rect)&&(e.candidate.key===An||e.inOverscan))).sort(((e,n)=>{const t=e.candidate.key===An;return t!==(n.candidate.key===An)?t?-1:1:e.visible!==n.visible?e.visible?-1:1:e.distance-n.distance})).map((e=>e.candidate)),r=window.innerWidth<=600?P:k;En=a.slice(0,r)}function Et(e){const n=window.innerWidth;Rn=function(e,n,t,i){const a="scroll"===i?window.scrollX:0,r="scroll"===i?window.scrollY:0;return e.filter((({rect:e})=>{const i=Math.min(a+n,e.x+e.width)-Math.max(a,e.x),o=Math.min(r+t,e.y+e.height)-Math.max(r,e.y);return i>=24&&o>=24}))}(Mn,n,window.innerHeight,Nn);const t=new Set(Rn.map((e=>e.key)));Wn&&!t.has(Wn)&&(Wn=null,An=null),zn&&!t.has(zn)&&(zn=null);const i=new Set(bn.map((e=>e.key)));An&&!i.has(An)&&(An=null);Dn=D(Dn,Rn,n<=600?P:k,Wn??void 0,zn??void 0),Dt(),Mt(e)}function bt(n=performance.now(),t=!0){if(!pe)return;const i=window.innerWidth,a=[];Mn=function(e,n,t,i="all",a=!1,r){const o=[],l=new Set;for(const{rank:s,selector:c,space:p}of j){const u=te(c,p);if(!("all"!==i&&u!==i||e<=600&&"clear"===t&&".layout-navbar"===c))for(const t of document.querySelectorAll(c)){if(l.has(t))continue;if(l.add(t),!ne(t))continue;r?.push(t);const i=t.getBoundingClientRect();if(!ue(t,i))continue;const c=Math.max(0,i.left),p=Math.max(0,i.top),d=Math.min(e,i.right),f=Math.min(n,i.bottom),m=Math.max(0,f-p),v=Math.max(0,d-c);if(!a&&(v<24||m<24))continue;const h="scroll"===u?window.scrollX:0,g="scroll"===u?window.scrollY:0;o.push({key:t,mode:se(t),rect:{height:i.height,radii:[...le(t)],rank:s+.001*o.length,width:i.width,x:i.left+h,y:i.top+g},visibleArea:v*m})}}const u=[];for(const s of o.sort(((e,n)=>{if(e.key!==n.key){if(e.key.contains(n.key))return-1;if(n.key.contains(e.key))return 1}return e.rect.rank-n.rect.rank||e.visibleArea-n.visibleArea}))){const{rect:e}=s;u.some((n=>n.mode===s.mode&&e.x>=n.rect.x&&e.y>=n.rect.y&&e.x+e.width<=n.rect.x+n.rect.width&&e.y+e.height<=n.rect.y+n.rect.height))||u.push({key:s.key,mode:s.mode,rect:e})}return u}(i,window.innerHeight,K(e.appearance),Nn,!0,a),kn?function(){const e=new Set,n=[],t=new Set,i=(t,i,a,r)=>{if(e.has(t)||!t.isConnected||!ne(t)||se(t)!==a)return;const o=r??it(t);e.add(t),n.push({key:t,mode:a,owner:i,rect:o})};for(const a of Mn){const e=a.mode??"dynamic";if("static-material"===e)continue;if(a.key.matches("[data-glass-optical-boundary]")){i(a.key,a.key,e,a.rect);continue}const n=a.key.matches(Z);n&&i(a.key,a.key,e,a.rect);const r=[...a.key.querySelectorAll(Z)];r.length>0?(t.add(a.key),r.forEach((n=>i(n,a.key,e)))):n||i(a.key,a.key,e,a.rect)}bn=n,Pn=t,kn=!1}():function(){const e=new Map(Mn.map((e=>[e.key,e])));bn=bn.flatMap((n=>{if(!(n.key.isConnected&&n.owner.isConnected&&ne(n.key)&&ne(n.owner)&&se(n.key)===n.mode&&e.has(n.owner)))return[];const t=e.get(n.key)?.rect??it(n.key);return[{...n,rect:t}]}))}(),Et(n);(a.length!==Tn.length||a.some(((e,n)=>e!==Tn[n])))&&(Tn=a,at()),t&&Tt()}function Pt(e){if("scroll"!==Nn||null===rn||!pe)return!1;if(dn||=e,fn=0,!sn)return cn=!0,!0;if(pn)return!0;pn=!0,cn=!1;const n=performance.now();return bt(n,!1),wt(n,!1),!0}function kt(){Pt(!1)||null===Ue&&pe&&(Ue=requestAnimationFrame((e=>{Ue=null,bt(e,!1),wt(e,!1)})))}function Wt(n){if(void 0!==n&&(In=n),Pt(!0))return;if(Ie=0,Ve=0,Be="",null!==He||!pe)return;const t=n=>{if(He=null,!pe||!K(e.active)||"hidden"===document.visibilityState)return;bt(n,!1);const i=Dn.map((e=>{const{height:n,width:t,x:i,y:a}=e.rect;return`${i.toFixed(2)},${a.toFixed(2)},${t.toFixed(2)},${n.toFixed(2)}`})).join("|");if(Ve=i===Be?Ve+1:0,Be=i,Ie+=1,wt(n,!1),Ve<2&&Ie<6)He=requestAnimationFrame(t);else if(!Hn){Hn=!0,Mt(n),wt(n,!1);const t=In;In=null,null!==t&&e.pageMotion?.acknowledgeGeometryReady(t,n)}};He=requestAnimationFrame(t)}function At(){null!==an&&window.clearTimeout(an),nn="",tn=0;const e=()=>{if(an=null,!pe)return;const n=et(),t=`${window.innerWidth},${window.innerHeight},${n.width},${n.height}`;if(tn=t===nn?tn+1:1,nn=t,tn>=2)return ti(),nn="",void(tn=0);an=window.setTimeout(e,80)};an=window.setTimeout(e,80)}function zt(n=performance.now()){return!(!pe||"scroll"!==Nn||!K(e.pageMotion?.active??!1))&&(null!==an&&window.clearTimeout(an),an=null,nn="",tn=0,ti(),bt(n,!1),wt(n,!1),!0)}function Ft(n){if(!pe)return;const t="scroll"===Nn?e.canvas.value?.parentElement:null,i=t&&n.some((e=>e.target===t));if(i&&zt())return;if(i&&At(),!n.some((e=>e.target!==t)))return;if(Pt(!1))return;const a=performance.now();bt(a,!1),wt(a,!1)}function Lt(){Pt(!1)||null===Ln&&pe&&(Ln=requestAnimationFrame((n=>{Ln=null,pe&&K(e.active)&&"hidden"!==document.visibilityState?(bt(n,!1),wt(n,!1),Un.size>0&&n<Cn?Lt():(Un.clear(),Wt())):ut()})))}function Ct(e){if(!(e instanceof HTMLElement))return null;const n=e.matches(J)?e:e.closest(J);return n&&ne(n)&&j.some((({selector:e,space:t})=>n.matches(e)&&te(e,t)===Nn))?n:null}function Ut(e){if("transform"!==e.propertyName)return;const n=Ct(e.target);n&&(Un.add(n),Cn=performance.now()+1e3,Lt())}function Ht(e){if("transform"!==e.propertyName)return;const n=Ct(e.target);n&&(Un.delete(n),0===Un.size&&Wt())}function It(e=window.innerWidth,n=window.innerHeight){if(!pe)return;const t=S(e,n,xe,ge),i=S(e,n,Re,Me);pe.uniforms.uCoverScale.value.set(t.x,t.y),pe.uniforms.uPreviousCoverScale.value.set(i.x,i.y)}function Vt(n=K(e.routeKey)){return a(K(e.quality),n)}function Bt(n){return re(K(e.appearance),K(e.quality),K(e.routeKey),n)}function qt(){We&&ct(We.texture,We.frostedTarget),We=null,C.value="",U.value=0,H.value=""}function Ot(){I.value="",B.value=0,O.value=""}function Gt(){ke+=1,qt(),Ot()}function Nt(){const n=K(e.pendingWallpaperUrl??""),t=K(e.pendingWallpaperRevision??0);n&&t>0&&Oi(n,t)}function Qt(){return K(e.motionStrength??i)}function Kt(){return K(e.dynamicsActive??!0)?K(e.dynamicsMode??"fluid"):"off"}function _t(){return"off"!==Kt()}function $t(){return"fluid"===Kt()}function Yt(){return"ripple"===Kt()}function Xt(){const e=Kt();return"fluid"===e?0:"ripple"===e?1:2}function jt(){return $t()?c(K(e.translationStrength??Qt())):0}function Jt(){return $t()?v(K(e.deformationStrength??Qt())):0}function Zt(){return $t()?m(K(e.flowStrength??Qt())):0}function ei(){return $t()?f(K(e.flowStrength??Qt())):0}function ni(){if(!_t())return 0;if(Yt()){const n=Math.min(1,Math.max(0,K(e.deformationStrength??Qt())/100));return("high"===K(e.quality)?40:28)*n}return d(Vt().maxRefractionPixels,K(e.deformationStrength??Qt()))}function ti(){if(!pe)return;const e=window.innerWidth,n=window.innerHeight,t=et(),i=Vt(),a="scroll"===Nn?h(t.width,t.height,i.bufferQuality,window.devicePixelRatio):g(e,n,e<=600,i.bufferQuality,window.devicePixelRatio),r=Ce!==a.width||Le!==a.height,o=pe.uniforms.uPresentationSize.value.x!==t.width||pe.uniforms.uPresentationSize.value.y!==t.height;Le=a.height,Ce=a.width,r&&pe.renderer.setSize(a.width,a.height,!1),pe.uniforms.uVisibleViewportSize.value.set(e,n),pe.uniforms.uPresentationSize.value.set(t.width,t.height),pe.uniforms.uScrollOffset.value.set("scroll"===Nn?window.scrollX:0,"scroll"===Nn?window.scrollY:0),de?.resize(a.width,a.height,e,n),fe&&(fe.resize(e,n),pe.uniforms.uRippleTexture.value=fe.texture,pe.uniforms.uRippleTexelSize.value.copy(fe.texelSize),pe.uniforms.uHasRippleTexture.value=fe.texture?1:0),It(e,n),bt(performance.now(),!1),r||o?wt(performance.now(),!1):kt()}function ii(n,t){const i=K(e.wallpaperUrl),a=e=>"auto"===e.textureSource?r(i,window.location.href)?"wallpaper":"procedural":e.textureSource;return n.textureLimit!==t.textureLimit||a(n)!==a(t)}function ai(e,n,t){return n>=e.x&&n<=e.x+e.width&&t>=e.y&&t<=e.y+e.height}function ri(e,n){0===Rn.length&&bt();const t=Rn.find((t=>ne(t.key)&&ai(t.rect,e,n)));if(!t)return null;const i=bn.filter((i=>i.owner===t.key&&ne(i.key)&&Rt(i.rect)&&ai(i.rect,e,n))).sort(((e,n)=>e.rect.width*e.rect.height-n.rect.width*n.rect.height));return{clip:i[0]?.key??t.key,surface:t}}function oi(e,n,t){if(Wn===e)return!1;const i=Dn.some((n=>n.key===e));zn=t||i?null:Wn,Wn=e,Fn=n;const a=window.innerWidth<=600?P:k;return Dn=D(Dn,Rn,a,Wn,zn??void 0),Dt(),Mt(n),!0}function li(e,n){$e=e,Ye=n,Xe=e,je=n,pe?.uniforms.uPointer.value.set(e,n)}function ui(e,n,t,i,a){if(!pe)return;const r=nt(),o=e/Math.max(r.width,1),l=1-n/Math.max(r.height,1),u=Math.hypot(o-i,l-a);if(t-Ne<36&&u<.012)return;const s=pe.uniforms.uTrail.value,c=Math.min(Vt().trailCount,Math.max(1,Math.ceil(u/.045)));if(c>1){for(let e=0;e<s.length;e+=1){if(e>=c){s[e].z=0;continue}const n=e/(c-1);s[e].set(o+(i-o)*n,l+(a-l)*n,1-.28*n,0)}Ne=t}else{for(let e=s.length-1;e>0;e-=1)s[e].copy(s[e-1]),s[e].z*=.74;s[0].set(o,l,1,0),Ne=t}}function si(){if(Ze=0,Oe=0,Ne=Number.NEGATIVE_INFINITY,An=null,En=[],pe){li($e,Ye),pe.uniforms.uInteractionRectCount.value=0,pe.uniforms.uMotion.value=0,pe.uniforms.uPointerVelocity.value.set(0,0);for(const e of pe.uniforms.uTrail.value)e.z=0;de?.clearInput()}}function ci(n){if(!pe||!K(e.active)||"hidden"===document.visibilityState)return Ae=null,void(en=!1);if(Yt()){Mt(n);const e=pi(n);return wt(n,!1),e?void(Ae=requestAnimationFrame(ci)):(si(),void(en=!1))}if(!$t())return si(),wt(n,!1),void(en=!1);const t=Vt(),i=Math.max(0,n-qe),a=Zt(),r=Math.max(.35,.55+.45*a),o=t.motionDuration*r,l=t.motionHalfLife*r,u=M(i,o,l);if(Mt(n),u<=0)return si(),wt(),void(en=!1);const s=Oe>0?Math.min(64,Math.max(0,n-Oe)):16.67;Oe=n,pe.uniforms.uMotion.value=u,de?.setFrameParameters(R(t.flowHalfLife,s),Ze),Ze=0,wt(),de?.finishFrame(),Ae=requestAnimationFrame(ci)}function pi(e){if(!pe||!fe||!Yt())return!1;const n=fe.step(e);return pe.uniforms.uRippleTexture.value=fe.texture,pe.uniforms.uRippleTexelSize.value.copy(fe.texelSize),pe.uniforms.uHasRippleTexture.value=fe.texture?1:0,n}function di(){en||(rt(),en=!0,Oe=0,Ae=requestAnimationFrame(ci))}function fi(e,n,t,i,a){if(!_t()||Yt()&&"scroll"===Nn&&un)return;if(a instanceof Element&&ee(a))return;const r=Math.max(window.innerWidth,1),o=Math.max(window.innerHeight,1),l=nt(),u=tt(e,n),s=tt(Qe,Ke),c=Math.max(8,t-Ge),p=s.x/Math.max(l.width,1),d=1-s.y/Math.max(l.height,1),f=_e&&void 0===i,m=f?0:(e-Qe)/r*Math.min(2,16.67/c),v=f?0:-(n-Ke)/o*Math.min(2,16.67/c),h=Math.hypot(m,v),g=h>.09?.09/h:1,x=ri(u.x,u.y);if(Qe=e,Ke=n,Ge=t,_e=!1,!pe||!x||"static-material"===x.surface.mode)return;const y=matchMedia("(prefers-reduced-motion: reduce)").matches,w=An!==x.clip;An=x.clip;const S=oi(x.surface.key,t,y);w&&!S&&(Dt(),Mt(t));const T={x:m*g,y:v*g};if(Yt())return y||!fe?(si(),void Tt()):(fe.inject({direction:T,point:{x:e/r,y:1-n/o},speed:Math.min(1,h/.09),timestamp:t}),pe.uniforms.uMotion.value=0,pe.uniforms.uPointerVelocity.value.set(0,0),pe.uniforms.uTrailCount.value=0,qe=t,void di());const M=!en,R=Number.isFinite(Ne),D=u.x/Math.max(l.width,1),E=1-u.y/Math.max(l.height,1);if(M&&!R)li(D,E),ui(u.x,u.y,t,D,E);else{ui(u.x,u.y,t,p,d);const e=Vt();!function(e,n,t){if(!pe)return;$e=e,Ye=n;const i=Math.min(1,Math.max(0,t));Xe+=($e-Xe)*i,je+=(Ye-je)*i,pe.uniforms.uPointer.value.set(Xe,je)}(D,E,window.innerWidth<=600||matchMedia("(pointer: coarse)").matches||null!==Je?1:e.pointerImmediateResponse)}if(Vn=W(Vn,T,Math.hypot(T.x,T.y),M),pe.uniforms.uPointerVelocity.value.set(T.x,T.y),pe.uniforms.uWakeDirection.value.set(Vn.x,Vn.y),pe.uniforms.uTrailCount.value=Vt().trailCount,qe=t,y)return si(),void Tt();if(pe.uniforms.uMotion.value=1,Zt()<=0){en=!1,rt(),Ze=0;for(const e of pe.uniforms.uTrail.value)e.z=0;return de?.clearInput(),void Tt()}Ze=Math.max(Ze,Math.min(1,18*h)),di()}function mi(e){"touch"!==e.pointerType&&fi(e.clientX,e.clientY,e.timeStamp||performance.now(),void 0,e.target)}function vi(e,n){for(let t=0;t<e.length;t+=1){const i=e.item(t);if(i&&(null===n||i.identifier===n))return i}return null}function hi(e){if(null!==Je)return;if(e.target instanceof Element&&ee(e.target))return;const n=vi(e.changedTouches,null);if(!n)return;const t=e.timeStamp||performance.now();Je=n.identifier,Qe=n.clientX,Ke=n.clientY,Ge=t;const i=tt(n.clientX,n.clientY),a=nt(),r=ri(i.x,i.y);pe&&"dynamic"===r?.surface.mode&&(An=r.clip,oi(r.surface.key,t,matchMedia("(prefers-reduced-motion: reduce)").matches),li(i.x/Math.max(a.width,1),1-i.y/Math.max(a.height,1)),ui(i.x,i.y,t,i.x/Math.max(a.width,1),1-i.y/Math.max(a.height,1)),Tt())}function gi(e){const n=vi(e.touches,Je);if(!n)return;const t=e.timeStamp||performance.now();fi(n.clientX,n.clientY,t,void 0,e.target)}function xi(e){vi(e.changedTouches,Je)&&(Je=null)}function yi(e){_t()&&("pointermove"!==e.type?"touchstart"!==e.type?"touchmove"!==e.type?xi(e):gi(e):hi(e):mi(e))}function wi(n){if(rn=null,sn=!1,pn=!1,"scroll"!==Nn||!pe||!K(e.active)||"hidden"===document.visibilityState)return on=!1,void(fn=0);const t=on;on=!1;const i=window.scrollX,a=window.scrollY,r=i!==mn||a!==vn;mn=i,vn=a,pe.uniforms.uScrollOffset.value.set(i,a),cn?(cn=!1,bt(n,!1)):(t||r)&&Et(n),fn=t||r?0:fn+1,en||wt(n,!1),sn=!0,Un.size>0&&(n<Cn?(cn=!0,fn=0):(Un.clear(),dn=!0)),fn<2?rn=requestAnimationFrame(wi):(Yn(n),dn&&(dn=!1,Wt()))}function Si(){null===rn&&"scroll"===Nn&&pe&&(rn=requestAnimationFrame(wi))}function Ti(e){if("scroll"!==Nn||!pe)return;const n=e.target;if(!jn(n))return;Xn(),sn=!1,pn=!1;if(!(n instanceof Element)||n===document.documentElement||n===document.body)pe.uniforms.uScrollOffset.value.set(window.scrollX,window.scrollY);else{if(!(n instanceof Element&&Tn.some((e=>n.contains(e)))))return;cn=!0}on=!0,Si(),null!==Ue&&(cancelAnimationFrame(Ue),Ue=null,Pt(!1)),null!==He&&(cancelAnimationFrame(He),He=null,Pt(!0)),null!==Ln&&(cancelAnimationFrame(Ln),Ln=null,Pt(!1))}function Mi(e){if("scroll"!==Nn||!pe)return;const n=e.target;n instanceof Element&&n!==document.documentElement&&n!==document.body&&Tn.some((e=>n.contains(e)))&&(cn=!0),on=!1,fn=0,Si()}function Ri(){rt(),ot(),Yn(),lt(),ut(),en=!1}function Di(){if(qn)return qn;const n=On,t=()=>K(e.active)&&"hidden"!==document.visibilityState,i=(async()=>{if(st(),!t())return;if(await G(),n!==On||!t())return;if(!pe)return void(await Qi());ti(),bt();const e=performance.now(),i=!!Yt()&&pi(e);i||si(),wt(e,!Yt()),i&&(en=!0,Ae=requestAnimationFrame(ci)),ft()})();return qn=i,i.finally((()=>{qn===i&&(qn=null)})),i}function Ei(e){st(),Fe=window.setTimeout((()=>{Fe=null,e()&&Hi(!1)}),u)}function bi(){if("hidden"===document.visibilityState)return Ri(),void Ei((()=>"hidden"===document.visibilityState));Di()}function Pi(){"visible"===document.visibilityState&&(Ri(),Ei((()=>"visible"===document.visibilityState&&!document.hasFocus())))}function ki(){"visible"===document.visibilityState&&Di()}function Wi(n){n.preventDefault();const t=xn??e.canvas.value;Hi(!1),Bn=!0,yn=t,t?.addEventListener("webglcontextrestored",Ai,{once:!0}),Zn("fallback")}function Ai(){Bn&&(Bn=!1,yn?.removeEventListener("webglcontextrestored",Ai),yn=null,Qi(!1))}function zi(){"scroll"===Nn?At():ti()}function Fi(e){const n=e.flatMap((e=>"childList"===e.type&&0!==e.removedNodes.length&&e.target instanceof Element?[{removedElements:[...e.removedNodes].filter((e=>e instanceof Element)),target:e.target}]:[])),t=new Set,i=new Set;let a=n.length>0;for(;a;){a=!1;for(const e of n){if(t.has(e.target)||Mn.some((n=>n.key===e.target||n.key.contains(e.target)))||[...i].some((n=>n===e.target||n.contains(e.target)))){t.has(e.target)||(t.add(e.target),a=!0);for(const n of e.removedElements)i.has(n)||(i.add(n),a=!0)}}}return e.some((e=>{if("attributes"===e.type)return!0;if([...e.removedNodes].some((e=>e instanceof Element&&(Mn.some((n=>n.key===e||e.contains(n.key)))||bn.some((n=>n.key===e||e.contains(n.key)))))))return!0;const n=[...e.addedNodes,...e.removedNodes];if(e.target instanceof Element&&!ne(e.target)){const i=Mn.some((n=>n.key===e.target||n.key.contains(e.target))),a=t.has(e.target);return(i||a)&&n.some(ie)}return n.some((e=>function(e){return e instanceof Element&&(!(!e.matches(J)||!ne(e))||Array.from(e.querySelectorAll(J)).some(ne))}(e)||ie(e)))}))}function Li(){_t()&&!gn&&(gn=!0,e.interactionSource?hn=e.interactionSource.subscribe(Nn,yi):(window.addEventListener("pointermove",mi,{passive:!0}),window.addEventListener("touchstart",hi,{passive:!0}),window.addEventListener("touchmove",gi,{passive:!0}),window.addEventListener("touchend",xi,{passive:!0}),window.addEventListener("touchcancel",xi,{passive:!0})))}function Ci(){gn&&(gn=!1,hn?.(),hn=null,e.interactionSource||(window.removeEventListener("pointermove",mi),window.removeEventListener("touchstart",hi),window.removeEventListener("touchmove",gi),window.removeEventListener("touchend",xi),window.removeEventListener("touchcancel",xi)))}function Ui(){xn?.removeEventListener("webglcontextlost",Wi),xn?.removeEventListener("webglcontextrestored",Ai),xn=null,yn?.removeEventListener("webglcontextrestored",Ai),yn=null}function Hi(e=!0){On+=1,Pe+=1,ke+=1,Bn=!1,en=!1,rt(),ot(),lt(),ut(),st(),null!==Ue&&(cancelAnimationFrame(Ue),Ue=null),null!==He&&(cancelAnimationFrame(He),He=null),null!==an&&(window.clearTimeout(an),an=null),nn="",tn=0,Ci(),window.removeEventListener("resize",zi),window.removeEventListener("transitionrun",Ut,!0),window.removeEventListener("transitionend",Ht,!0),window.removeEventListener("transitioncancel",Ht,!0),"scroll"===Nn&&(window.removeEventListener("wheel",Jn,!0),window.removeEventListener("touchmove",Jn,!0),window.removeEventListener("keydown",Jn,!0),window.removeEventListener("scroll",Ti,!0),window.removeEventListener("scrollend",Mi)),Ui(),wn?.disconnect(),wn=null,Sn?.disconnect(),Sn=null,Tn=[],Mn=[],Rn=[],Dn=[],En=[],bn=[],Pn=new Set,kn=!0,Wn=null,An=null,zn=null,Fn=0,Vn={x:0,y:-1},document.documentElement.removeAttribute("data-glass-wallpaper-loading"),Je=null,"scroll"===Nn&&(un=!1,document.documentElement.removeAttribute("data-glass-scroll-presentation")),Qe=.5*window.innerWidth,Ke=.5*window.innerHeight,$e=.5,Ye=.5,Xe=.5,je=.5,Ze=0,Oe=0,Se&&Se!==ve&&ct(Se,Te),Se=null,Te=null,Me=1,Re=1,De=t.exposure,Ee=0,be=null,ct(ve,he),ve=null,he=null,ge=1,xe=1,ye=!1,we=t.exposure,z.value="",F.value=0,L.value="",qt(),Ot(),vt(),ht(),me&&(me.material.dispose(),me=null),pe&&(pe.geometry.dispose(),pe.material.dispose(),pe.renderer.dispose(),e&&pe.renderer.forceContextLoss(),pe=null),delete document.documentElement.dataset.glassRendererState}function Ii(e,n,t){e===Pe&&(Hi(),Zn("fallback"))}async function Vi(n,t){const i=++Pe,a=Boolean(pe&&ve);a||Zn("loading"),document.documentElement.setAttribute("data-glass-wallpaper-loading","true");try{await Gi(K(e.wallpaperUrl),i,t)}catch(r){if(i!==Pe)return;if(a&&pe&&ve)return Zn("ready"),void Tt();Ii(i)}finally{i===Pe&&document.documentElement.removeAttribute("data-glass-wallpaper-loading")}}function Bi(n,t,i,a,r,o,l=K(e.transitionStartedAt??0),u=!1){if(!pe)return void ct(n,t);const s=Boolean(ve)&&l>0&&(u||Boolean(K(e.previousWallpaperUrl??"")));lt(),s&&ve?(Se&&Se!==ve&&ct(Se,Te),Se=ve,Te=he,Me=ge,Re=xe,De=we,ve=n,he=t,ge=a,xe=i,we=o.exposure,pe.uniforms.uPreviousTexture.value=Se,pe.uniforms.uPreviousFrostedTexture.value=Te?.texture??Se,pe.uniforms.uTexture.value=ve,pe.uniforms.uFrostedTexture.value=he?.texture??ve,pe.uniforms.uPreviousWallpaperExposure.value=De,pe.uniforms.uWallpaperExposure.value=we,Ee=l,pe.uniforms.uTextureMix.value=u?0:T(performance.now()-Ee,K(e.transitionDuration??0)),It(),ft()):(Se&&Se!==ve&&ct(Se,Te),ct(ve,he),Se=null,Te=null,ve=n,he=t,ge=a,xe=i,we=o.exposure,Me=a,Re=i,De=o.exposure,pe.uniforms.uPreviousTexture.value=n,pe.uniforms.uPreviousFrostedTexture.value=t?.texture??n,pe.uniforms.uTexture.value=n,pe.uniforms.uFrostedTexture.value=t?.texture??n,pe.uniforms.uPreviousWallpaperExposure.value=o.exposure,pe.uniforms.uWallpaperExposure.value=o.exposure,pe.uniforms.uTextureMix.value=1,Ee=0,be=null,It()),ye=r,_n(),pe.uniforms.uHasFrostedTexture.value=r&&t?1:0}async function qi(n){if(!pe||!X||!n)return null;const i=K(e.appearance),o=K(e.quality),l=K(e.routeKey),u=a(o,l),s=re(i,o,l,n);if("procedural"===u.textureSource||"auto"===u.textureSource&&!r(n,window.location.href)){const e=document.createElement("canvas");e.width=1,e.height=1;const n=new X.CanvasTexture(e);return n.colorSpace=X.SRGBColorSpace,n.generateMipmaps=!1,n.minFilter=X.LinearFilter,n.magFilter=X.LinearFilter,{frostedTarget:null,hasWallpaperTexture:!1,height:1,preparationKey:s,texture:n,toneProfile:{...t},width:1}}const{textureLimit:c}=u,p="frosted"===i,d="high"===o?2048:1536,f=`${d}:${n}`,m=await Kn.get(f,(async()=>{const e=await x(n),t=e.corsReady?y(n):void 0;let i=null,a=t?.image;if(!a){const e=new X.TextureLoader;e.setCrossOrigin("anonymous"),i=await e.loadAsync(n),a=i.image}const r=a.naturalWidth||a.width,o=a.naturalHeight||a.height,l=Math.max(r,o),u=Math.min(l,c,d),s=Math.min(1,u/l),p=document.createElement("canvas");p.width=Math.max(1,Math.round(r*s)),p.height=Math.max(1,Math.round(o*s));const f=p.getContext("2d"),m=f?p:a;return f&&f.drawImage(a,0,0,p.width,p.height),i?.dispose(),{height:f?p.height:o,image:m,toneProfile:t?.profile??e.profile??w(a,r,o),width:f?p.width:r}})),v=new X.Texture(m.image);v.needsUpdate=!0;const h=m.width,g=m.height;v.colorSpace=X.SRGBColorSpace,v.generateMipmaps=!1,v.minFilter=X.LinearFilter,v.magFilter=X.LinearFilter;let S=null;try{p&&(S=await mt(v,h,g,.125*Math.max(h,g)))}catch(T){}return{frostedTarget:S,hasWallpaperTexture:!0,height:g,preparationKey:s,texture:v,toneProfile:m.toneProfile,width:h}}async function Oi(n,t){const i=++ke;if(qt(),Ot(),!n||!pe||Bn||n===K(e.wallpaperUrl))return;const a=Bt(n);try{const e=await qi(n);if(!e)return;if(i!==ke||!pe||Bn||a!==e.preparationKey||a!==Bt(n))return void ct(e.texture,e.frostedTarget);if(pe.renderer.initTexture(e.texture),await pe.renderer.compileAsync(pe.scene,pe.camera),i!==ke||!pe||Bn||a!==Bt(n))return void ct(e.texture,e.frostedTarget);We=e,C.value=n,U.value=t,H.value=a}catch(r){i===ke&&(I.value=n,B.value=t,O.value=a)}}async function Gi(e,n,t){if(!pe||!X||!e)return;const i=await qi(e);if(!i)return;if(n!==Pe||!pe||Bn||i.preparationKey!==Bt(e))return void ct(i.texture,i.frostedTarget);if(await pe.renderer.compileAsync(pe.scene,pe.camera),n!==Pe||!pe||Bn||i.preparationKey!==Bt(e))return void ct(i.texture,i.frostedTarget);const a=performance.now();t?.(),Bi(i.texture,i.frostedTarget,i.width,i.height,i.hasWallpaperTexture,i.toneProfile),bt(a,!1),si(),wt(a,!1),z.value=e,F.value=0,L.value=i.preparationKey,Zn("ready"),ft()}function Ni(e,t,i){return Boolean(pe&&!Bn&&"ready"===n.value&&We&&C.value===e&&U.value===t&&H.value===i&&i===Bt(e))}async function Qi(n=!0){if(Hi(n),!K(e.active)||!e.canvas.value)return;if(!window.WebGLRenderingContext||_i.matches||!K(e.wallpaperUrl))return void Zn("fallback");Zn("loading");const a=++Pe;try{if(X=await o((()=>import("./three.module-CA6zAcOF.js")),[],import.meta.url),a!==Pe||!e.canvas.value)return;const n=X.Vector4,r=e.canvas.value,u=function(e){if("undefined"==typeof WebGL2RenderingContext)return null;const n=e.getContext("webgl2",{alpha:!0,antialias:!1,depth:!0,failIfMajorPerformanceCaveat:!1,powerPreference:"high-performance",premultipliedAlpha:!0,preserveDrawingBuffer:!1,stencil:!1});return!n||n.isContextLost()?null:(n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n)}(r),c=new X.WebGLRenderer({alpha:!0,antialias:!1,canvas:r,...u?{context:u}:{},powerPreference:"high-performance",premultipliedAlpha:!0});c.setClearColor(0,0),c.setPixelRatio(1);const d=new X.BufferGeometry;d.setAttribute("position",new X.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const f=s(K(e.appearance),K(e.transparencyStrength??i)),m={uAppearance:{value:ce(K(e.appearance))},uBackgroundVisibility:{value:f.backgroundVisibility},uCoverScale:{value:new X.Vector2(1,1)},uDeformationStrength:{value:Jt()},uDynamicsOnly:{value:Qn()?1:0},uDynamicsMode:{value:Xt()},uFlowTexture:{value:null},uFlowStrength:{value:Zt()},uHasFlowTexture:{value:0},uHasFrostedTexture:{value:0},uHasRippleTexture:{value:0},uHasWallpaperTexture:{value:0},uInteractionRadii:{value:Array.from({length:8},(()=>new n))},uInteractionRectCount:{value:0},uInteractionRects:{value:Array.from({length:8},(()=>new n))},uMotion:{value:0},uMotionExpansion:{value:ei()},uMaxRefractionPixels:{value:ni()},uPointer:{value:new X.Vector2(.5,.5)},uPointerVelocity:{value:new X.Vector2(0,0)},uPresentationSize:{value:new X.Vector2(window.innerWidth,window.innerHeight)},uPreviousCoverScale:{value:new X.Vector2(1,1)},uPreviousWallpaperExposure:{value:t.exposure},uQuality:{value:"high"===K(e.quality)?1:0},uReflectionStrength:{value:p(K(e.reflectionStrength??i))},uRippleDeformationStrength:{value:Yt()?Math.min(1,Math.max(0,K(e.deformationStrength??Qt())/100)):0},uRippleTexelSize:{value:new X.Vector2(1,1)},uRippleTexture:{value:null},uRadii:{value:Array.from({length:8},(()=>new n))},uRectCount:{value:0},uRects:{value:Array.from({length:8},(()=>new n))},uSurfaceWeights:{value:Array.from({length:8},(()=>0))},uSurfaceDynamics:{value:Array.from({length:8},(()=>1))},uPreviousTexture:{value:null},uPreviousFrostedTexture:{value:null},uTexture:{value:null},uFrostedTexture:{value:null},uTextureMix:{value:1},uWallpaperExposure:{value:t.exposure},uTintColor:{value:new X.Color(K(e.tintColor))},uFrostDetailLevel:{value:f.frostDetailLevel},uSurfaceDensity:{value:f.surfaceDensity},uTintDensity:{value:f.tintDensity},uTransmissionStrength:{value:l(K(e.transmissionStrength??i))},uTranslationStrength:{value:jt()},uTrail:{value:Array.from({length:4},(()=>new n(.5,.5,0,0)))},uTrailCount:{value:$t()?Vt().trailCount:0},uVisibleViewportSize:{value:new X.Vector2(window.innerWidth,window.innerHeight)},uScrollOffset:{value:new X.Vector2(0,0)},uWakeDirection:{value:new X.Vector2(0,-1)}},v=new X.ShaderMaterial({depthTest:!1,depthWrite:!1,fragmentShader:oe,transparent:!0,uniforms:m,vertexShader:ae}),h=new X.Scene,g=new X.OrthographicCamera(-1,1,1,-1,0,1),x=new X.Mesh(d,v);x.frustumCulled=!1,h.add(x),pe={camera:g,geometry:d,material:v,mesh:x,renderer:c,scene:h,uniforms:m};const y=pe;if(function(e){xn!==e&&(Ui(),xn=e,e.addEventListener("webglcontextlost",Wi),e.addEventListener("webglcontextrestored",Ai))}(r),gt(),await xt(),a!==Pe||pe!==y||!K(e.active)||e.canvas.value!==r)return;!function(){wn=new ResizeObserver(Ft),at(!1);const e=new Set;function n(n,t){n&&!e.has(n)&&(e.add(n),Sn?.observe(n,{attributeFilter:["data-glass-optical-boundary","data-glass-optical-mode"],attributes:!0,childList:!0,subtree:t}))}Sn=new MutationObserver((e=>{n(document.querySelector(".v-overlay-container"),!0),Fi(e)&&(kn=!0,zt(),Wt())})),n(document.querySelector(".app-wrapper"),!0),n(document.querySelector(".v-overlay-container"),!0),n(document.body,!1),Sn.observe(document.documentElement,{attributeFilter:["data-theme-radius"],attributes:!0})}(),Li(),window.addEventListener("resize",zi,{passive:!0}),window.addEventListener("transitionrun",Ut,{capture:!0,passive:!0}),window.addEventListener("transitionend",Ht,{capture:!0,passive:!0}),window.addEventListener("transitioncancel",Ht,{capture:!0,passive:!0}),"scroll"===Nn&&(window.addEventListener("wheel",Jn,{capture:!0,passive:!0}),window.addEventListener("touchmove",Jn,{capture:!0,passive:!0}),window.addEventListener("keydown",Jn,{capture:!0}),window.addEventListener("scroll",Ti,{capture:!0,passive:!0}),window.addEventListener("scrollend",Mi,{passive:!0})),ti(),await Gi(K(e.wallpaperUrl),a),Nt()}catch(r){Ii(a)}}function Ki(n){if(K(e.active))return n.matches?(Hi(),void Zn("fallback")):void Qi()}const _i=matchMedia("(prefers-reduced-transparency: reduce)");return _i.addEventListener("change",Ki),document.addEventListener("visibilitychange",bi),window.addEventListener("blur",Pi),window.addEventListener("focus",ki),window.addEventListener("pageshow",ki),_((()=>[K(e.active),K(e.wallpaperUrl)]),(async([e,n],t)=>{if(e)return pe&&n!==t?.[1]?z.value===n&&L.value===Bt(n)?void ft():void(await Vi()):void(pe||(await G(),await Qi()));Hi()}),{immediate:!0}),_((()=>[K(e.pendingWallpaperUrl??""),K(e.pendingWallpaperRevision??0)]),(([e,n])=>{Oi(e,n)}),{immediate:!0}),_((()=>K(e.previousWallpaperUrl??"")),(e=>{!e&&pe&&ve&&(pt(),wt(performance.now(),!1))}),{flush:"sync"}),_((()=>K(e.appearance)),(async(n,t)=>{if(!pe)return;const a=()=>{if(!pe||K(e.appearance)!==n)return;const t=s(n,K(e.transparencyStrength??i));pe.uniforms.uAppearance.value=ce(n),pe.uniforms.uBackgroundVisibility.value=t.backgroundVisibility,pe.uniforms.uDynamicsOnly.value=Qn()?1:0,pe.uniforms.uFrostDetailLevel.value=t.frostDetailLevel,pe.uniforms.uSurfaceDensity.value=t.surfaceDensity,pe.uniforms.uTintDensity.value=t.tintDensity},r=K(e.wallpaperUrl),o=K(e.quality),l=K(e.routeKey);if(re(t??n,o,l,r)!==re(n,o,l,r))return Gt(),await Vi(0,a),void(K(e.appearance)===n&&Nt());a(),Wt()})),_((()=>[K(e.dynamicsActive??!0),K(e.dynamicsMode??"fluid")]),(async()=>{if(!pe)return;const e=Pe;try{await yt()}catch(n){Ii(e)}})),_((()=>K(e.quality)),(async(n,t)=>{if(!pe)return;const i=a(t,K(e.routeKey)),r=a(n,K(e.routeKey)),o=()=>{pe&&K(e.quality)===n&&(pe.uniforms.uMaxRefractionPixels.value=ni(),pe.uniforms.uQuality.value="high"===n?1:0,pe.uniforms.uTrailCount.value=$t()?r.trailCount:0,en=!1,rt(),si(),Yt()&&ht())},l=async()=>{pe&&K(e.quality)===n&&await yt()};if(ii(i,r)){if(Gt(),await Vi(0,o),K(e.quality)===n){try{await l()}catch(u){return void Ii(Pe)}Nt()}}else{o();try{await l()}catch(u){Ii(Pe)}}})),_((()=>K(e.tintColor)),(e=>{pe&&(pe.uniforms.uTintColor.value.set(e),Tt())})),_((()=>[K(e.translationStrength??Qt()),K(e.deformationStrength??Qt()),K(e.flowStrength??Qt()),K(e.reflectionStrength??i),K(e.transparencyStrength??i),K(e.transmissionStrength??i)]),(([n,t,i,a,r,o])=>{if(!pe)return;const u=$t();pe.uniforms.uTranslationStrength.value=u?c(n):0,pe.uniforms.uDeformationStrength.value=u?v(t):0,pe.uniforms.uFlowStrength.value=u?m(i):0,pe.uniforms.uMotionExpansion.value=u?f(i):0,pe.uniforms.uMaxRefractionPixels.value=ni(),pe.uniforms.uRippleDeformationStrength.value=Yt()?Math.min(1,Math.max(0,t/100)):0,fe?.setParameters(n,i),pe.uniforms.uReflectionStrength.value=p(a);const d=s(K(e.appearance),r);if(pe.uniforms.uBackgroundVisibility.value=d.backgroundVisibility,pe.uniforms.uFrostDetailLevel.value=d.frostDetailLevel,pe.uniforms.uSurfaceDensity.value=d.surfaceDensity,pe.uniforms.uTintDensity.value=d.tintDensity,pe.uniforms.uTransmissionStrength.value=l(o),u&&pe.uniforms.uFlowStrength.value<=0&&en){en=!1,rt(),Ze=0;for(const e of pe.uniforms.uTrail.value)e.z=0}Tt()})),_((()=>K(e.pageMotion?.revision??0)),(()=>{if(!pe||"scroll"!==Nn)return;const e=performance.now();ti(),bt(e,!1),wt(e,!1)}),{flush:"sync"}),_((()=>[K(e.pageMotion?.active??!1),K(e.pageMotion?.epoch??0)]),(([e,n])=>{pe&&"scroll"===Nn&&e&&(Hn=!1,Wt(n))}),{flush:"sync"}),_((()=>K(e.routeKey)),(async(n,t)=>{const i=Vt(t??""),a=K(e.wallpaperUrl),r=K(e.appearance),o=K(e.quality);if(re(r,o,t??"",a)!==re(r,o,n,a)&&Gt(),pe&&"scroll"===Nn&&e.pageMotion){Hn=!1,In=K(e.pageMotion.epoch);const n=performance.now();bt(n,!1),wt(n,!1)}if(await G(),pe){const t=Vt(n);if(ti(),ii(i,t))return await Vi(0,ti),void(K(e.routeKey)===n&&Nt())}"scroll"===Nn&&e.pageMotion?Wt(K(e.pageMotion.epoch)):kt()})),N((()=>{_i.removeEventListener("change",Ki),document.removeEventListener("visibilitychange",bi),window.removeEventListener("blur",Pi),window.removeEventListener("focus",ki),window.removeEventListener("pageshow",ki),Hi()})),{activatePreparedWallpaper:function(e,n,t,i){if(!Ni(e,n,t)||!We)return!1;const a={activatedRevision:n,activatedUrl:e,previousHasWallpaperTexture:ye,previousPreparationKey:L.value,previousRevision:F.value,previousUrl:z.value},r=We;return We=null,C.value="",U.value=0,H.value="",Pe+=1,Bi(r.texture,r.frostedTarget,r.width,r.height,r.hasWallpaperTexture,r.toneProfile,i,!0),be=Se?a:null,z.value=e,F.value=n,L.value=t,bt(i,!1),si(),wt(i,!1),Zn("ready"),ft(),!0},activeWallpaperPreparationKey:L,activeWallpaperRevision:F,activeWallpaperUrl:z,canActivatePreparedWallpaper:Ni,failedWallpaperPreparationKey:O,failedWallpaperRevision:B,failedWallpaperUrl:I,preparedWallpaperPreparationKey:H,preparedWallpaperUrl:C,preparedWallpaperRevision:U,renderedFrames:A,retryAfterFailure:function(){return Bn?Promise.resolve():Qi()},rollbackPreparedWallpaperActivation:function(e,n){const t=be;if(!(pe&&ve&&Se&&t&&t.activatedUrl===e&&t.activatedRevision===n&&z.value===e&&F.value===n))return!1;lt();const i=ve,a=he;return ve=Se,he=Te,ge=Me,xe=Re,we=De,Se=null,Te=null,Me=ge,Re=xe,De=we,Ee=0,be=null,z.value=t.previousUrl,F.value=t.previousRevision,L.value=t.previousPreparationKey,pe.uniforms.uTexture.value=ve,pe.uniforms.uFrostedTexture.value=he?.texture??ve,pe.uniforms.uPreviousTexture.value=ve,pe.uniforms.uPreviousFrostedTexture.value=he?.texture??ve,pe.uniforms.uWallpaperExposure.value=we,pe.uniforms.uPreviousWallpaperExposure.value=we,pe.uniforms.uTextureMix.value=1,ye=t.previousHasWallpaperTexture,_n(),pe.uniforms.uHasFrostedTexture.value=t.previousHasWallpaperTexture&&he?1:0,It(),si(),ct(i,a),wt(performance.now(),!1),!0},state:n}}let de,fe,me,ve,he,ge,xe,ye,we,Se,Te,Me,Re;({defineComponent:de}=await e("vue"));({unref:fe,createElementVNode:me,Fragment:ve,openBlock:he,createElementBlock:ge}=await e("vue"));xe=["data-state"];ye=["data-state"];({ref:we,computed:Se,watch:Te,watchEffect:Me,onScopeDispose:Re}=await e("vue"));De=de({__name:"GlassOpticalLayer",props:{appearance:{},deformationStrength:{},flowStrength:{},dynamicsMode:{},quality:{},reflectionStrength:{},transparencyStrength:{},transmissionStrength:{},translationStrength:{},routeKey:{},tintColor:{},transitionDuration:{},transitionStartedAt:{},wallpaperUrl:{},previousWallpaperUrl:{},pendingWallpaperUrl:{},pendingWallpaperRevision:{},activateWallpaperRevision:{}},emits:["wallpaperPrepared","wallpaperPreparationFailed","wallpaperActivated","wallpaperActivationFailed"],setup(e,{emit:t}){const i=e,a=t,r=we(null),o=we(null),l=function(){const{smAndDown:e}=L(),t=n("(hover: none), (pointer: coarse)");return F((()=>e.value||t.value))}(),u=A(),s=we(!1),c=we(!1),p=Se((()=>l.value||"reduce"===u.value?"off":i.dynamicsMode)),d=Se((()=>s.value?"off":p.value)),f=Se((()=>"off"!==d.value)),m=X(f),v=z(),h=$(),g=pe({active:!0,appearance:()=>i.appearance,canvas:r,deformationStrength:()=>i.deformationStrength,dynamicsActive:f,dynamicsMode:d,flowStrength:()=>i.flowStrength,interactionSource:m,quality:()=>i.quality,reflectionStrength:()=>i.reflectionStrength,transparencyStrength:()=>i.transparencyStrength,transmissionStrength:()=>i.transmissionStrength,translationStrength:()=>i.translationStrength,routeKey:()=>i.routeKey,tintColor:()=>i.tintColor,transitionDuration:()=>i.transitionDuration,transitionStartedAt:()=>i.transitionStartedAt,wallpaperUrl:()=>i.wallpaperUrl,wallpaperSourceCache:h,previousWallpaperUrl:()=>i.previousWallpaperUrl,pendingWallpaperUrl:()=>i.pendingWallpaperUrl??"",pendingWallpaperRevision:()=>i.pendingWallpaperRevision??0,surfaceSpace:"fixed",syncDocumentState:!1}),x=pe({active:!0,appearance:()=>i.appearance,canvas:o,deformationStrength:()=>i.deformationStrength,dynamicsActive:f,dynamicsMode:d,flowStrength:()=>i.flowStrength,interactionSource:m,pageMotion:v.reader,quality:()=>i.quality,reflectionStrength:()=>i.reflectionStrength,transparencyStrength:()=>i.transparencyStrength,transmissionStrength:()=>i.transmissionStrength,translationStrength:()=>i.translationStrength,routeKey:()=>i.routeKey,tintColor:()=>i.tintColor,transitionDuration:()=>i.transitionDuration,transitionStartedAt:()=>i.transitionStartedAt,wallpaperUrl:()=>i.wallpaperUrl,wallpaperSourceCache:h,previousWallpaperUrl:()=>i.previousWallpaperUrl,pendingWallpaperUrl:()=>i.pendingWallpaperUrl??"",pendingWallpaperRevision:()=>i.pendingWallpaperRevision??0,surfaceSpace:"scroll",syncDocumentState:!1});Te((()=>i.dynamicsMode),((e,n)=>{e!==n&&(s.value||c.value)&&(c.value=!0,s.value=!1,Promise.allSettled([g.retryAfterFailure(),x.retryAfterFailure()]))}));const y=we("loading");Me((()=>{const e=[g.state.value,x.state.value],n=e.every((e=>"ready"===e)),t=e.some((e=>"fallback"===e)),i=e.some((e=>"loading"===e));c.value?n?c.value=!1:t&&!i&&(c.value=!1,s.value=!0):t?s.value=!0:s.value&&n&&(s.value=!1);const a=c.value?"loading":s.value?"fallback":n?"ready":"loading";Y(y,a)})),Me((()=>{document.documentElement.dataset.glassDynamicsMode=i.dynamicsMode,document.documentElement.dataset.glassDynamicsEffectiveMode=d.value}));let w="";Me((()=>{const e=i.pendingWallpaperUrl,n=i.pendingWallpaperRevision??0,t=re(i.appearance,i.quality,i.routeKey,e??""),r=`${n}:${t}:${e}`;Boolean(e)&&n>0&&"ready"===g.state.value&&"ready"===x.state.value&&g.preparedWallpaperUrl.value===e&&g.preparedWallpaperRevision.value===n&&g.preparedWallpaperPreparationKey.value===t&&x.preparedWallpaperUrl.value===e&&x.preparedWallpaperRevision.value===n&&x.preparedWallpaperPreparationKey.value===t&&r!==w&&(w=r,a("wallpaperPrepared",e,n))}));let S="";Me((()=>{const e=i.pendingWallpaperUrl??"",n=i.pendingWallpaperRevision??0,t=re(i.appearance,i.quality,i.routeKey,e),r=`${n}:${t}:${e}`,o=[g,x].some((i=>i.failedWallpaperUrl.value===e&&i.failedWallpaperRevision.value===n&&i.failedWallpaperPreparationKey.value===t));e&&n>0&&o&&r!==S&&(S=r,a("wallpaperPreparationFailed",e,n))}));let T=null,M="",R="",D="";function E(e,n){for(const t of[g,x])try{t.rollbackPreparedWallpaperActivation(e,n)}catch{}}return Me((()=>{const e=i.pendingWallpaperUrl,n=i.pendingWallpaperRevision??0,t=i.activateWallpaperRevision??0,r=re(i.appearance,i.quality,i.routeKey,e??""),o=`${n}:${r}:${e}`;Boolean(e)&&n>0&&t===n&&"ready"===g.state.value&&"ready"===x.state.value&&g.preparedWallpaperUrl.value===e&&g.preparedWallpaperRevision.value===n&&g.preparedWallpaperPreparationKey.value===r&&x.preparedWallpaperUrl.value===e&&x.preparedWallpaperRevision.value===n&&x.preparedWallpaperPreparationKey.value===r&&o!==R&&o!==D&&o!==M&&(null!==T&&cancelAnimationFrame(T),M=o,T=requestAnimationFrame((e=>{T=null,M="";const n=i.pendingWallpaperUrl??"",t=i.pendingWallpaperRevision??0,r=re(i.appearance,i.quality,i.routeKey,n);if(`${t}:${r}:${n}`===o&&i.activateWallpaperRevision===t&&g.canActivatePreparedWallpaper(n,t,r)&&x.canActivatePreparedWallpaper(n,t,r)){try{const i=g.activatePreparedWallpaper(n,t,r,e),l=i&&x.activatePreparedWallpaper(n,t,r,e);if(!i||!l)return E(n,t),D=o,void a("wallpaperActivationFailed",n,t)}catch{return E(n,t),D=o,void a("wallpaperActivationFailed",n,t)}R=o,a("wallpaperActivated",n,t,e)}})))})),Re((()=>{null!==T&&cancelAnimationFrame(T),delete document.documentElement.dataset.glassDynamicsMode,delete document.documentElement.dataset.glassDynamicsEffectiveMode,Y(y,"fallback")})),(e,n)=>(he(),ge(ve,null,[me("canvas",{ref_key:"fixedCanvas",ref:r,class:"glass-optical-layer glass-optical-layer--fixed","aria-hidden":"true","data-presentation-space":"fixed","data-state":fe(g).state.value},null,8,xe),me("canvas",{ref_key:"scrollCanvas",ref:o,class:"glass-optical-layer glass-optical-layer--scroll","aria-hidden":"true","data-presentation-space":"scroll","data-state":fe(x).state.value},null,8,ye)],64))}})});export{De as default,__mp_tla};