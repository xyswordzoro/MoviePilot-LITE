import{b as importShared,__mp_tla as __mp_tla_0}from"./date-DPWQ58yb.js";import{bc as DEFAULT_GLASS_WALLPAPER_TONE_PROFILE,bd as GLASS_OPTICAL_STRENGTH_DEFAULT,be as getGlassOpticalRenderProfile,bf as canUseGlassWallpaperTexture,X as __vitePreload,bg as getGlassOpticalTransmissionStrength,bh as APP_ACTIVITY_SUSPEND_DELAY_MS,bi as getGlassMaterialResponse,bj as getGlassOpticalTranslationStrengthScale,bk as getGlassOpticalReflectionStrengthScale,bl as getGlassOpticalMaxRefractionPixels,bm as getGlassOpticalMotionExpansion,bn as getGlassOpticalFlowStrengthScale,bo as getGlassOpticalDeformationStrengthScale,bp as getGlassScrollBufferSize,bq as getGlassOpticalBufferSize,br as loadGlassWallpaperTone,bs as takeGlassWallpaperDecodedSource,bt as analyzeGlassWallpaperTone,bu as getGlassCoverScale,bv as getGlassWallpaperTransitionProgress,bw as getGlassOpticalMotionEnergy,bx as getGlassOpticalDecay,by as reconcileGlassOpticalSurfaceSlots,bz as normalizeGlassOpticalRect,bA as getGlassOpticalSurfaceTransitionWeights,bB as GLASS_OPTICAL_MAX_SURFACES_MOBILE,bC as GLASS_OPTICAL_MAX_SURFACES_DESKTOP,bD as getGlassOpticalWakeDirection,bE as usePreferredReducedMotion,__mp_tla as __mp_tla_1}from"./index-BXeCam0X.js";import{u as useGlassMobilePresentation,__mp_tla as __mp_tla_2}from"./useGlassPresentationCapabilities-BYB86o_M.js";import{u as usePagePresentationMotion,__mp_tla as __mp_tla_3}from"./usePagePresentationMotion-uLED3EbX.js";let _sfc_main;let __mp_tla=Promise.all([(()=>{try{return __mp_tla_0}catch{}})(),(()=>{try{return __mp_tla_1}catch{}})(),(()=>{try{return __mp_tla_2}catch{}})(),(()=>{try{return __mp_tla_3}catch{}})()]).then(async()=>{const{inject}=await importShared("vue");const RIPPLE_VERTEX_SHADER=`
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;const RIPPLE_FRAGMENT_SHADER=`
precision highp float;

uniform sampler2D uPrevious;
uniform vec2 uTexelSize;
uniform vec2 uViewportSize;
uniform vec2 uImpulseCenter;
uniform vec2 uImpulseDirection;
uniform float uImpulse;
uniform float uImpulseOffset;
uniform float uImpulseSigma;
uniform float uImpulseSpeed;
uniform float uPropagation;
uniform float uRestoring;
uniform float uVelocityDecay;
uniform float uHeightDecay;
uniform float uEnergyDecay;
uniform float uStep;
uniform float uQuality;
uniform float uReset;
varying vec2 vUv;

vec3 decodeState(vec4 sampleValue) {
  if (sampleValue.b < (1.0 / 255.0)) return vec3(0.0);

  return vec3(sampleValue.rg * 2.0 - 1.0, sampleValue.b);
}

float sampleHeight(vec2 offset) {
  return decodeState(texture2D(uPrevious, clamp(vUv + offset, vec2(0.0), vec2(1.0)))).x;
}

void main() {
  if (uReset > 0.5) {
    gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);
    return;
  }

  vec3 previous = decodeState(texture2D(uPrevious, vUv));
  float h = previous.x;
  float velocity = previous.y;
  float energy = previous.z;
  float cardinal1 = (
    sampleHeight(vec2(uTexelSize.x, 0.0)) +
    sampleHeight(vec2(-uTexelSize.x, 0.0)) +
    sampleHeight(vec2(0.0, uTexelSize.y)) +
    sampleHeight(vec2(0.0, -uTexelSize.y))
  ) * 0.25;
  float cardinal2 = (
    sampleHeight(vec2(uTexelSize.x * 2.0, 0.0)) +
    sampleHeight(vec2(-uTexelSize.x * 2.0, 0.0)) +
    sampleHeight(vec2(0.0, uTexelSize.y * 2.0)) +
    sampleHeight(vec2(0.0, -uTexelSize.y * 2.0))
  ) * 0.25;
  float diagonal1 = (
    sampleHeight(vec2(uTexelSize.x, uTexelSize.y)) +
    sampleHeight(vec2(-uTexelSize.x, uTexelSize.y)) +
    sampleHeight(vec2(uTexelSize.x, -uTexelSize.y)) +
    sampleHeight(vec2(-uTexelSize.x, -uTexelSize.y))
  ) * 0.25;
  float diagonal2 = (
    sampleHeight(vec2(uTexelSize.x * 2.0, uTexelSize.y * 2.0)) +
    sampleHeight(vec2(-uTexelSize.x * 2.0, uTexelSize.y * 2.0)) +
    sampleHeight(vec2(uTexelSize.x * 2.0, -uTexelSize.y * 2.0)) +
    sampleHeight(vec2(-uTexelSize.x * 2.0, -uTexelSize.y * 2.0))
  ) * 0.25;
  float balancedMean = cardinal1 * 0.72 + cardinal2 * 0.28;
  float highMean = cardinal1 * 0.46 + diagonal1 * 0.22 + cardinal2 * 0.20 + diagonal2 * 0.12;
  float curvature = mix(balancedMean, highMean, uQuality) - h;

  float speedResponse = smoothstep(0.0, 1.0, uImpulseSpeed);
  vec2 shiftedCenter = uImpulseCenter +
    uImpulseDirection * uImpulseOffset * mix(0.35, 1.0, speedResponse) / max(uViewportSize, vec2(1.0));
  vec2 impulseDelta = (vUv - shiftedCenter) * uViewportSize;
  float directionLength = length(uImpulseDirection);
  vec2 flowDirection = directionLength > 0.0001 ? uImpulseDirection / directionLength : vec2(0.0, 1.0);
  vec2 flowPerpendicular = vec2(-flowDirection.y, flowDirection.x);
  float along = dot(impulseDelta, flowDirection);
  float across = dot(impulseDelta, flowPerpendicular);
  float directionalRadius = length(vec2(along * 0.72, across * 1.24));
  float directionality = step(0.0001, directionLength) * mix(0.32, 0.72, speedResponse);
  float radius = mix(length(impulseDelta), directionalRadius, directionality);
  float sigma = max(uImpulseSigma * mix(0.86, 1.05, speedResponse), 1.0);
  float normalizedRadius = radius / sigma;
  float core = exp(-0.5 * pow(normalizedRadius, 2.0));
  float ring = exp(-0.5 * pow((radius - 1.6 * sigma) / (0.55 * sigma), 2.0));
  float centerRelease = smoothstep(0.0, 0.55, normalizedRadius);
  float annularCore = normalizedRadius * core;
  float radialImpulse = (0.72 * annularCore - 0.3 * ring) * centerRelease * uImpulse;
  float wakeEnvelope = exp(-0.5 * (
    pow(along / (1.25 * sigma), 2.0) +
    pow(across / (0.72 * sigma), 2.0)
  ));
  float directionalImpulse = clamp((-along / sigma) * wakeEnvelope * uImpulse * 0.9, -0.62, 0.62);
  float impulse = clamp(
    mix(radialImpulse, directionalImpulse, directionality),
    -0.62,
    0.62
  );

  velocity = clamp(
    (
      velocity +
      curvature * uPropagation * uStep -
      h * uRestoring * uStep +
      impulse * mix(0.52, 0.82, speedResponse)
    ) * uVelocityDecay,
    -1.0,
    1.0
  );
  h = clamp((h + velocity * uStep) * uHeightDecay, -1.0, 1.0);
  energy = clamp(max(max(energy * uEnergyDecay, abs(h)), abs(impulse)), 0.0, 1.0);
  gl_FragColor = vec4(h * 0.5 + 0.5, velocity * 0.5 + 0.5, energy, 1.0);
}
`;const FRESHNESS_MS=40;const ENVELOPE_THRESHOLD=.006;const MAX_STEP_MS=16.667;const MIN_STEP_MS=4;function clamp01(value){return Math.min(1,Math.max(0,value))}function mix(start,end,progress){return start+(end-start)*progress}async function createGlassRippleDynamics(options){const{camera,geometry,renderer,three}=options;const quality=options.quality;let viewportWidth=Math.max(1,options.viewportWidth);let viewportHeight=Math.max(1,options.viewportHeight);let translation=.5;let flow=.5;let energyAtInput=0;let lastInputAt=Number.NEGATIVE_INFINITY;let deadlineAt=Number.NEGATIVE_INFINITY;let lastStepAt=0;let pendingImpulse=0;let pendingSpeed=0;let impulseCenter={x:.5,y:.5};let impulseDirection={x:0,y:1};let pendingDirection={x:0,y:0};let clearOnNextFrame=false;let fieldActive=false;let disposed=false;const targetType=renderer.extensions?.has?.("EXT_color_buffer_float")?three.HalfFloatType:three.UnsignedByteType;const createTarget=()=>{const target=new three.WebGLRenderTarget(1,1,{depthBuffer:false,format:three.RGBAFormat,magFilter:three.LinearFilter,minFilter:three.LinearFilter,stencilBuffer:false,type:targetType,wrapS:three.ClampToEdgeWrapping,wrapT:three.ClampToEdgeWrapping});target.texture.generateMipmaps=false;return target};let readTarget=createTarget();let writeTarget=createTarget();const uniforms={uEnergyDecay:{value:1},uHeightDecay:{value:1},uImpulse:{value:0},uImpulseCenter:{value:new three.Vector2(.5,.5)},uImpulseDirection:{value:new three.Vector2(0,1)},uImpulseOffset:{value:0},uImpulseSigma:{value:24},uImpulseSpeed:{value:0},uPrevious:{value:null},uPropagation:{value:.18},uQuality:{value:quality==="high"?1:0},uReset:{value:1},uRestoring:{value:quality==="high"?.028:.035},uStep:{value:1},uTexelSize:{value:new three.Vector2(1,1)},uVelocityDecay:{value:1},uViewportSize:{value:new three.Vector2(viewportWidth,viewportHeight)}};const material=new three.ShaderMaterial({depthTest:false,depthWrite:false,fragmentShader:RIPPLE_FRAGMENT_SHADER,uniforms,vertexShader:RIPPLE_VERTEX_SHADER});const scene=new three.Scene;const mesh=new three.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh);const renderTarget=target=>{const previousTarget=renderer.getRenderTarget();try{renderer.setScissorTest(false);renderer.setRenderTarget(target);renderer.render(scene,camera)}finally{renderer.setRenderTarget(previousTarget)}};const writeNeutralTargets=()=>{uniforms.uReset.value=1;uniforms.uPrevious.value=null;renderTarget(readTarget);renderTarget(writeTarget);uniforms.uReset.value=0};const getTargetSize=(width,height)=>{const scale=quality==="high"?Math.min(1,Math.max(.25,192/width,128/height)):Math.min(1,Math.max(.16,128/width,96/height));return{height:Math.max(1,Math.round(height*scale)),width:Math.max(1,Math.round(width*scale))}};const resize=(width,height)=>{if(disposed)return false;const nextViewportWidth=Math.max(1,width);const nextViewportHeight=Math.max(1,height);const target=getTargetSize(nextViewportWidth,nextViewportHeight);const viewportChanged=viewportWidth!==nextViewportWidth||viewportHeight!==nextViewportHeight;const targetChanged=readTarget.width!==target.width||readTarget.height!==target.height;if(!viewportChanged&&!targetChanged)return false;viewportWidth=nextViewportWidth;viewportHeight=nextViewportHeight;if(targetChanged){readTarget.setSize(target.width,target.height);writeTarget.setSize(target.width,target.height)}uniforms.uTexelSize.value.set(1/target.width,1/target.height);uniforms.uViewportSize.value.set(viewportWidth,viewportHeight);reset();return true};const getVelocityHalfLife=()=>quality==="high"?mix(90,280,flow):mix(70,220,flow);const getDeadlineDuration=()=>FRESHNESS_MS+(quality==="high"?mix(220,920,flow):mix(160,680,flow));const settleEnvelope=timestamp=>{if(!Number.isFinite(lastInputAt))return 0;const freshReleaseAge=Math.max(0,timestamp-lastInputAt-FRESHNESS_MS);const deadlineTaper=clamp01((deadlineAt-timestamp)/FRESHNESS_MS);return energyAtInput*2**(-freshReleaseAge/getVelocityHalfLife())*deadlineTaper};const reset=()=>{if(disposed)return;writeNeutralTargets();energyAtInput=0;lastInputAt=Number.NEGATIVE_INFINITY;deadlineAt=Number.NEGATIVE_INFINITY;lastStepAt=0;pendingImpulse=0;pendingSpeed=0;pendingDirection={x:0,y:0};impulseDirection={x:0,y:1};clearOnNextFrame=false;fieldActive=false};try{const initializedByResize=resize(viewportWidth,viewportHeight);await renderer.compileAsync(scene,camera);if(disposed)throw new Error("Ripple resources were disposed during compilation");if(!initializedByResize)reset()}catch(error){material.dispose();readTarget.dispose();writeTarget.dispose();throw error}return{dispose(){if(disposed)return;disposed=true;material.dispose();readTarget.dispose();writeTarget.dispose()},inject(interaction){if(disposed)return;const timestamp=interaction.timestamp;const previousEnvelope=settleEnvelope(timestamp);const inputAmplitude=Math.min(.8,Math.max(.22,.22+clamp01(interaction.speed)*.58));energyAtInput=Math.max(previousEnvelope,inputAmplitude);lastInputAt=timestamp;deadlineAt=timestamp+getDeadlineDuration();pendingImpulse=Math.max(pendingImpulse,inputAmplitude);pendingSpeed=Math.max(pendingSpeed,clamp01(interaction.speed));impulseCenter={x:clamp01(interaction.point.x),y:clamp01(interaction.point.y)};const directionLength=Math.hypot(interaction.direction.x,interaction.direction.y);if(directionLength>1e-4){pendingDirection.x+=interaction.direction.x/directionLength;pendingDirection.y+=interaction.direction.y/directionLength}fieldActive=true;clearOnNextFrame=false},get texture(){return fieldActive&&!disposed?readTarget.texture:null},get texelSize(){return uniforms.uTexelSize.value},setParameters(translationStrength,flowStrength){translation=clamp01(translationStrength/100);flow=clamp01(flowStrength/100)},resize,reset,step(timestamp){if(disposed||!fieldActive)return false;if(clearOnNextFrame||timestamp>=deadlineAt||settleEnvelope(timestamp)<ENVELOPE_THRESHOLD){reset();return false}const elapsed=lastStepAt>0?Math.max(0,timestamp-lastStepAt):MAX_STEP_MS;const simulatedElapsed=Math.min(MAX_STEP_MS*2,Math.max(MIN_STEP_MS,elapsed));const substeps=simulatedElapsed>MAX_STEP_MS?2:1;const stepMs=Math.min(MAX_STEP_MS,Math.max(MIN_STEP_MS,simulatedElapsed/substeps));const decayStepMs=elapsed/substeps;const velocityHalfLife=getVelocityHalfLife();const heightHalfLife=velocityHalfLife*.82;const energyHalfLife=velocityHalfLife*.72;const targetCssPerTexel=Math.sqrt(viewportWidth/Math.max(readTarget.width,1)*(viewportHeight/Math.max(readTarget.height,1)));const referenceCssPerTexel=quality==="high"?4:6.25;const basePropagation=quality==="high"?mix(.11,.16,translation):mix(.12,.18,translation);if(pendingImpulse>0){const directionLength=Math.hypot(pendingDirection.x,pendingDirection.y);impulseDirection=directionLength>1e-4?{x:pendingDirection.x/directionLength,y:pendingDirection.y/directionLength}:{x:0,y:0}}uniforms.uImpulseCenter.value.set(impulseCenter.x,impulseCenter.y);uniforms.uImpulseDirection.value.set(impulseDirection.x,impulseDirection.y);uniforms.uImpulseOffset.value=56*translation;uniforms.uImpulseSpeed.value=pendingSpeed;uniforms.uImpulseSigma.value=mix(54,97.2,translation);uniforms.uPropagation.value=Math.min(.18,Math.max(.08,basePropagation*(referenceCssPerTexel/targetCssPerTexel)**2));uniforms.uRestoring.value=quality==="high"?.028:.035;uniforms.uStep.value=stepMs/MAX_STEP_MS;uniforms.uVelocityDecay.value=2**(-decayStepMs/velocityHalfLife);uniforms.uHeightDecay.value=2**(-decayStepMs/heightHalfLife);uniforms.uEnergyDecay.value=2**(-decayStepMs/energyHalfLife);for(let index=0;index<substeps;index+=1){uniforms.uPrevious.value=readTarget.texture;uniforms.uImpulse.value=index===0?pendingImpulse:0;renderTarget(writeTarget);const previousReadTarget=readTarget;readTarget=writeTarget;writeTarget=previousReadTarget}pendingImpulse=0;pendingSpeed=0;pendingDirection={x:0,y:0};lastStepAt=timestamp;if(flow<=0)clearOnNextFrame=true;return true}}}const GLASS_FLUID_DYNAMIC_RANGE_SCALE=.52;const GLASS_FLUID_DYNAMIC_RANGE_DENSITY=1/GLASS_FLUID_DYNAMIC_RANGE_SCALE**2;const GLASS_FLUID_BUFFER_SCALE=.25;const GLASS_FLUID_VERTEX_SHADER=`
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;const GLASS_FLUID_FIELD_FRAGMENT_SHADER=`
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
  float injection = exp(-distanceSquared * ${(70*GLASS_FLUID_DYNAMIC_RANGE_DENSITY).toFixed(3)}) * uInjection;
  float speed = length(uVelocity);
  vec2 direction = speed > 0.0001 ? uVelocity / speed : vec2(0.0, -1.0);
  vec2 perpendicular = vec2(-direction.y, direction.x);
  float shear = dot(delta, perpendicular) * exp(-distanceSquared * ${(42*GLASS_FLUID_DYNAMIC_RANGE_DENSITY).toFixed(3)});

  flow += (direction * min(speed * 9.0, 0.9) - perpendicular * shear * 0.85) * injection * 0.44;
  energy = max(energy, injection);

  gl_FragColor = vec4(flow * 0.5 + 0.5, energy, 1.0);
}
`;const GLASS_FLUID_FRAGMENT_SETUP=`  vec2 wakeDirection = length(uWakeDirection) > 0.0001 ? normalize(uWakeDirection) : vec2(0.0, -1.0);
  vec2 wakePerpendicular = vec2(-wakeDirection.y, wakeDirection.x);
  vec2 trailRefraction = vec2(0.0);
  float trailEnergy = 0.0;
  float trailSpatialSpan = 0.0;
  float motionRangeCompression = mix(1.0, 1.34, uMotionExpansion);
  const float dynamicRangeScale = ${GLASS_FLUID_DYNAMIC_RANGE_SCALE.toFixed(2)};
  const float dynamicRangeDensity = ${GLASS_FLUID_DYNAMIC_RANGE_DENSITY.toFixed(3)};`;const GLASS_FLUID_FRAGMENT_TRAIL_AND_FIELD=`  for (int trailIndex = 0; trailIndex < 4; trailIndex++) {
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
  }`;const GLASS_FLUID_FRAGMENT_SURFACE_SHAPE=`    vec2 pointerDelta = uPointer - vUv;
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
    ), 0.0, 1.0);`;const GLASS_FLUID_FRAGMENT_SURFACE_OPTICS=`    float pointerStrength = mix(mix(0.0055, 0.008, uQuality), mix(0.0085, 0.012, uQuality), frosted);
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
    float localCaustic = singleSpecular * rectMask * surfaceDynamic * interactionMask;`;const GLASS_FLUID_FRAGMENT_SURFACE_REFRACTION=`    vec2 sampleTranslation =
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
    ) * rectMask * surfaceDynamic * interactionMask;`;function createGlassFluidDynamics(options){const{camera,geometry,pointer,renderer,three,velocity}=options;let disposed=false;const createTarget=()=>new three.WebGLRenderTarget(1,1,{depthBuffer:false,magFilter:three.LinearFilter,minFilter:three.LinearFilter,stencilBuffer:false});let readTarget=createTarget();let writeTarget=createTarget();const uniforms={uDecay:{value:1},uInjection:{value:0},uPointer:{value:pointer},uPrevious:{value:null},uTexelSize:{value:new three.Vector2(1,1)},uVelocity:{value:velocity},uViewportAspect:{value:window.innerWidth/Math.max(window.innerHeight,1)}};const material=new three.ShaderMaterial({depthTest:false,depthWrite:false,fragmentShader:GLASS_FLUID_FIELD_FRAGMENT_SHADER,uniforms,vertexShader:GLASS_FLUID_VERTEX_SHADER});const scene=new three.Scene;const mesh=new three.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh);return{clearInput(){uniforms.uDecay.value=0;uniforms.uInjection.value=0},dispose(){if(disposed)return;disposed=true;material.dispose();readTarget.dispose();writeTarget.dispose()},finishFrame(){uniforms.uInjection.value=0},resize(bufferWidth,bufferHeight,viewportWidth,viewportHeight){if(disposed)return;const width=Math.max(96,Math.round(bufferWidth*GLASS_FLUID_BUFFER_SCALE));const height=Math.max(96,Math.round(bufferHeight*GLASS_FLUID_BUFFER_SCALE));if(readTarget.width!==width||readTarget.height!==height){readTarget.setSize(width,height);writeTarget.setSize(width,height)}uniforms.uTexelSize.value.set(1/width,1/height);uniforms.uViewportAspect.value=viewportWidth/Math.max(viewportHeight,1)},setFrameParameters(decay,injection){uniforms.uDecay.value=decay;uniforms.uInjection.value=injection},step(){if(disposed)return readTarget.texture;renderer.setScissorTest(false);uniforms.uPrevious.value=readTarget.texture;renderer.setRenderTarget(writeTarget);renderer.render(scene,camera);renderer.setRenderTarget(null);const previousReadTarget=readTarget;readTarget=writeTarget;writeTarget=previousReadTarget;return readTarget.texture}}}const{nextTick,onScopeDispose:onScopeDispose$1,ref:ref$1,toValue,watch:watch$1}=await importShared("vue");function recordGlassRendererTiming(space,stage){return}function prepareGlassWebGLContext(canvas){if(typeof WebGL2RenderingContext==="undefined")return null;const context=canvas.getContext("webgl2",{alpha:true,antialias:false,depth:true,failIfMajorPerformanceCaveat:false,powerPreference:"high-performance",premultipliedAlpha:true,preserveDrawingBuffer:false,stencil:false});if(!context||context.isContextLost())return null;context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL,false);context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);return context}function createGlassWallpaperSourceCache(){const entries=new Map;return{get(key,prepare){const cached=entries.get(key);if(cached){entries.delete(key);entries.set(key,cached);return cached}const source=prepare();entries.set(key,source);while(entries.size>3){const oldestKey=entries.keys().next().value;if(oldestKey)entries.delete(oldestKey)}void source.catch(()=>{if(entries.get(key)===source)entries.delete(key)});return source}}}function setGlassRendererState(state,value){state.value=value;document.documentElement.dataset.glassRendererState=value}function useGlassOpticalInteractionSource(active=true){const listeners={fixed:new Set,scroll:new Set};const touchOwners=new Map;const resolvePointOwner=(clientX,clientY)=>{if(document.querySelector(".v-overlay--active"))return null;const loginCard=document.querySelector(".login-card");if(loginCard){const rect=loginCard.getBoundingClientRect();if(clientX>=rect.left&&clientX<=rect.right&&clientY>=rect.top&&clientY<=rect.bottom){return document.querySelector(".login-root")?"scroll":"fixed"}}const fixedSurface=document.querySelectorAll(".agent-assistant-panel, .layout-navbar, .layout-vertical-nav");for(const surface of fixedSurface){const rect=surface.getBoundingClientRect();if(clientX>=rect.left&&clientX<=rect.right&&clientY>=rect.top&&clientY<=rect.bottom)return"fixed"}return"scroll"};const resolveTouchOwner=event=>{const changedTouch=event.changedTouches.item(0);if(!changedTouch)return null;if(event.type==="touchstart"){const owner=resolvePointOwner(changedTouch.clientX,changedTouch.clientY);if(owner)touchOwners.set(changedTouch.identifier,owner);return owner}return touchOwners.get(changedTouch.identifier)??null};const isTouchInteractionEvent=event=>event.type.startsWith("touch");const dispatch=event=>{if(!toValue(active)){if(isTouchInteractionEvent(event)&&(event.type==="touchend"||event.type==="touchcancel")){for(const touch of Array.from(event.changedTouches))touchOwners.delete(touch.identifier)}return}const owner=isTouchInteractionEvent(event)?resolveTouchOwner(event):resolvePointOwner(event.clientX,event.clientY);if(!owner)return;for(const listener of listeners[owner])listener(event);if(isTouchInteractionEvent(event)&&(event.type==="touchend"||event.type==="touchcancel")){for(const touch of Array.from(event.changedTouches))touchOwners.delete(touch.identifier)}};let listening=false;function attachGlobalListeners(){if(listening)return;listening=true;window.addEventListener("pointermove",dispatch,{passive:true});window.addEventListener("touchstart",dispatch,{passive:true});window.addEventListener("touchmove",dispatch,{passive:true});window.addEventListener("touchend",dispatch,{passive:true});window.addEventListener("touchcancel",dispatch,{passive:true})}function detachGlobalListeners(){if(!listening)return;listening=false;touchOwners.clear();window.removeEventListener("pointermove",dispatch);window.removeEventListener("touchstart",dispatch);window.removeEventListener("touchmove",dispatch);window.removeEventListener("touchend",dispatch);window.removeEventListener("touchcancel",dispatch)}watch$1(()=>toValue(active),enabled=>{if(enabled)attachGlobalListeners();else detachGlobalListeners()},{flush:"sync",immediate:true});onScopeDispose$1(()=>{listeners.fixed.clear();listeners.scroll.clear();detachGlobalListeners()});return{subscribe(space,listener){listeners[space].add(listener);return()=>listeners[space].delete(listener)}}}const SURFACE_SELECTORS=[{rank:1,selector:".agent-assistant-panel",space:"fixed"},{rank:1,selector:".login-card",space:"fixed"},{rank:2,selector:".layout-vertical-nav",space:"fixed"},{rank:2,selector:".layout-navbar",space:"fixed"},{rank:3,selector:".dashboard-grid-item-content > .dashboard-grid-auto-size > .dashboard-grid-content-measure > .v-card",space:"scroll"},{rank:3,selector:".dashboard-grid-item-content > .dashboard-grid-auto-size > .dashboard-grid-content-measure > :first-child > .v-card",space:"scroll"},{rank:3,selector:"[data-glass-optical-surface]",space:"scroll"},{rank:4,selector:".app-hover-lift-card",space:"scroll"},{rank:5,selector:".layout-page-content .v-card",space:"scroll"}];const SURFACE_SELECTOR_QUERY=SURFACE_SELECTORS.map(({selector})=>selector).join(",");const INTERACTION_CLIP_SELECTOR=".app-hover-lift-card";const OPTICAL_BOUNDARY_SELECTOR="[data-glass-optical-boundary]";const OPTICAL_EXCLUSION_SELECTOR='[data-glass-optical-mode="excluded"]';const INTERACTION_CLIP_OVERSCAN_PX=96;function isGlassOpticalElementExcluded(element){return Boolean(element.closest(OPTICAL_EXCLUSION_SELECTOR))}function isGlassOpticalElementEligible(element){return!element.closest(".v-overlay")&&!isGlassOpticalElementExcluded(element)}function getSurfacePresentationSpace(selector,defaultSpace){return selector===".login-card"&&document.querySelector(".login-root")?"scroll":defaultSpace}function containsGlassOpticalSurface(node){if(!(node instanceof Element))return false;if(node.matches(SURFACE_SELECTOR_QUERY)&&isGlassOpticalElementEligible(node))return true;return Array.from(node.querySelectorAll(SURFACE_SELECTOR_QUERY)).some(isGlassOpticalElementEligible)}function containsGlassInteractionClip(node){if(!(node instanceof Element))return false;return node.matches(INTERACTION_CLIP_SELECTOR)||Boolean(node.querySelector(INTERACTION_CLIP_SELECTOR))}const VERTEX_SHADER=`
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;const FROST_PREFILTER_FRAGMENT_SHADER=`
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uDirection;
uniform vec2 uTextureSize;
varying vec2 vUv;

void main() {
  vec2 texel = uDirection / max(uTextureSize, vec2(1.0));
  vec3 color =
    texture2D(uTexture, vUv).rgb * 0.227027 +
    texture2D(uTexture, vUv + texel * 1.384615).rgb * 0.316216 +
    texture2D(uTexture, vUv - texel * 1.384615).rgb * 0.316216 +
    texture2D(uTexture, vUv + texel * 3.230769).rgb * 0.070270 +
    texture2D(uTexture, vUv - texel * 3.230769).rgb * 0.070270;
  gl_FragColor = vec4(color, 1.0);
}
`;const FROST_PREFILTER_SCALE=.125;const WALLPAPER_SOURCE_LIMIT_BALANCED=1536;const WALLPAPER_SOURCE_LIMIT_HIGH=2048;function getGlassWallpaperPreparationKey(appearance,quality,routeKey,url,locationHref=window.location.href){const profile=getGlassOpticalRenderProfile(quality,routeKey);const textureSource=profile.textureSource==="auto"?canUseGlassWallpaperTexture(url,locationHref)?"wallpaper":"procedural":profile.textureSource;const materialTexture=appearance==="frosted"?"frosted":"plain";return`${materialTexture}:${quality}:${profile.textureLimit}:${textureSource}`}const FRAGMENT_SHADER=`
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
${GLASS_FLUID_FRAGMENT_SETUP}
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

${GLASS_FLUID_FRAGMENT_TRAIL_AND_FIELD}
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
${GLASS_FLUID_FRAGMENT_SURFACE_SHAPE}
    float staticLens = 0.00008 + edgeResponse * mix(0.00045, 0.00072, uQuality);
${GLASS_FLUID_FRAGMENT_SURFACE_OPTICS}
    staticRefraction += lens * staticLens * mix(1.0, 0.72, frosted) * rectMask * surfaceDynamic;
${GLASS_FLUID_FRAGMENT_SURFACE_REFRACTION}
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
`;const SCROLL_STABLE_TAIL_FRAMES=2;const PRESENTATION_RESIZE_SAMPLE_MS=80;const PRESENTATION_RESIZE_REQUIRED_SAMPLES=2;const SURFACE_STABILITY_MAX_FRAMES=6;const SURFACE_STABILITY_REQUIRED_FRAMES=2;const SURFACE_TRANSITION_DURATION_MS=96;const SURFACE_TRANSFORM_TRACKING_MAX_MS=1e3;function readBorderRadii(element){const style=getComputedStyle(element);const parseRadius=value=>{const radius=Number.parseFloat(value);return Number.isFinite(radius)?radius:0};return[parseRadius(style.borderTopLeftRadius),parseRadius(style.borderTopRightRadius),parseRadius(style.borderBottomRightRadius),parseRadius(style.borderBottomLeftRadius)]}function isVisibleSurface(element,bounds){const style=getComputedStyle(element);return style.display!=="none"&&style.visibility!=="hidden"&&Number.parseFloat(style.opacity||"1")>0&&bounds.width>=24&&bounds.height>=24}function resolveGlassOpticalSurfaceMode(element){const value=element.closest("[data-glass-optical-mode]")?.dataset.glassOpticalMode;return value==="static-material"?"static-material":"dynamic"}function collectGlassOpticalSurfaceDescriptors(viewportWidth,viewportHeight,appearance,surfaceSpace="all",includeOutsideViewport=false,collectedElements){const candidates=[];const seen=new Set;for(const{rank,selector,space}of SURFACE_SELECTORS){const resolvedSpace=getSurfacePresentationSpace(selector,space);if(surfaceSpace!=="all"&&resolvedSpace!==surfaceSpace)continue;if(viewportWidth<=600&&appearance==="clear"&&selector===".layout-navbar")continue;for(const element of document.querySelectorAll(selector)){if(seen.has(element))continue;seen.add(element);if(!isGlassOpticalElementEligible(element))continue;collectedElements?.push(element);const bounds=element.getBoundingClientRect();if(!isVisibleSurface(element,bounds))continue;const left=Math.max(0,bounds.left);const top=Math.max(0,bounds.top);const right=Math.min(viewportWidth,bounds.right);const bottom=Math.min(viewportHeight,bounds.bottom);const visibleHeight=Math.max(0,bottom-top);const visibleWidth=Math.max(0,right-left);if(!includeOutsideViewport&&(visibleWidth<24||visibleHeight<24))continue;const coordinateOffsetX=resolvedSpace==="scroll"?window.scrollX:0;const coordinateOffsetY=resolvedSpace==="scroll"?window.scrollY:0;candidates.push({key:element,mode:resolveGlassOpticalSurfaceMode(element),rect:{height:bounds.height,radii:[...readBorderRadii(element)],rank:rank+candidates.length*.001,width:bounds.width,x:bounds.left+coordinateOffsetX,y:bounds.top+coordinateOffsetY},visibleArea:visibleWidth*visibleHeight})}}const selected=[];for(const candidate of candidates.sort((left,right)=>{if(left.key!==right.key){if(left.key.contains(right.key))return-1;if(right.key.contains(left.key))return 1}return left.rect.rank-right.rect.rank||left.visibleArea-right.visibleArea})){const{rect}=candidate;const nested=selected.some(parent=>parent.mode===candidate.mode&&rect.x>=parent.rect.x&&rect.y>=parent.rect.y&&rect.x+rect.width<=parent.rect.x+parent.rect.width&&rect.y+rect.height<=parent.rect.y+parent.rect.height);if(!nested)selected.push({key:candidate.key,mode:candidate.mode,rect})}return selected}function selectVisibleGlassOpticalSurfaceDescriptors(surfaces,viewportWidth,viewportHeight,surfaceSpace){const viewportX=surfaceSpace==="scroll"?window.scrollX:0;const viewportY=surfaceSpace==="scroll"?window.scrollY:0;return surfaces.filter(({rect})=>{const visibleWidth=Math.min(viewportX+viewportWidth,rect.x+rect.width)-Math.max(viewportX,rect.x);const visibleHeight=Math.min(viewportY+viewportHeight,rect.y+rect.height)-Math.max(viewportY,rect.y);return visibleWidth>=24&&visibleHeight>=24})}function getGlassAppearanceUniformValue(appearance){if(appearance==="tinted")return 1;if(appearance==="frosted")return 2;return 0}function useGlassOpticalRenderer(options){const state=ref$1("loading");const renderedFrames=ref$1(0);const activeWallpaperUrl=ref$1("");const activeWallpaperRevision=ref$1(0);const activeWallpaperPreparationKey=ref$1("");const preparedWallpaperUrl=ref$1("");const preparedWallpaperRevision=ref$1(0);const preparedWallpaperPreparationKey=ref$1("");const failedWallpaperUrl=ref$1("");const failedWallpaperRevision=ref$1(0);const failedWallpaperPreparationKey=ref$1("");let three=null;let resources=null;let fluidDynamics=null;let rippleResources=null;let frostPrefilterResources=null;let activeTexture=null;let activeFrostedTarget=null;let activeTextureHeight=1;let activeTextureWidth=1;let activeHasWallpaperTexture=false;let activeWallpaperExposure=DEFAULT_GLASS_WALLPAPER_TONE_PROFILE.exposure;let previousTexture=null;let previousFrostedTarget=null;let previousTextureHeight=1;let previousTextureWidth=1;let previousWallpaperExposure=DEFAULT_GLASS_WALLPAPER_TONE_PROFILE.exposure;let wallpaperTransitionStartedAt=0;let wallpaperActivationRollback=null;let loadVersion=0;let prepareVersion=0;let preparedWallpaper=null;let animationFrame=null;let wallpaperTransitionFrame=null;let backgroundDisposeTimer=null;let presentationBufferHeight=1;let presentationBufferWidth=1;let surfaceUpdateFrame=null;let surfaceStabilityFrame=null;let surfaceStabilityPass=0;let surfaceStableFrameCount=0;let lastSurfaceGeometrySignature="";let lastInteractionAt=0;let lastInteractionFrameAt=0;let lastPointerAt=0;let lastTrailAt=Number.NEGATIVE_INFINITY;let lastPointerX=window.innerWidth*.5;let lastPointerY=window.innerHeight*.5;let suppressNextPointerVelocity=false;let pointerTargetX=.5;let pointerTargetY=.5;let pointerPositionX=.5;let pointerPositionY=.5;let activeTouchIdentifier=null;let pendingFlowInjection=0;let interactionAnimating=false;let presentationResizeCandidate="";let presentationResizeStableSamples=0;let presentationResizeTimer=null;let scrollAnimationFrame=null;let scrollDirty=false;let scrollPresentationRestoreTimer=null;let scrollWallpaperSamplingSuppressed=false;let scrollFrameCommitted=false;let scrollGeometryRefreshPending=false;let scrollLateGeometryCommitted=false;let scrollSurfaceStabilityPending=false;let scrollStableFrameCount=0;let lastRenderedScrollX=window.scrollX;let lastRenderedScrollY=window.scrollY;let unsubscribeInteractionSource=null;let interactionEventsAttached=false;let contextEventCanvas=null;let contextRecoveryCanvas=null;let resizeObserver=null;let surfaceMutationObserver=null;let observedSurfaces=[];let surfaceRegistry=[];let availableSurfaces=[];let surfaceSlots=[];let interactionClips=[];let interactionClipRegistry=[];let interactionClipConstrainedOwners=new Set;let interactionClipMembershipDirty=true;let activeSurface=null;let activeInteractionClip=null;let outgoingSurface=null;let surfaceTransitionStartedAt=0;let surfaceTransformFrame=null;let surfaceTransformTrackingDeadline=0;const transformingSurfaces=new Set;let pagePresentationGeometryReady=true;let pagePresentationMotionEpoch=null;let wakeDirection={x:0,y:-1};let contextRecoveryPending=false;let resumePromise=null;let resumeVersion=0;let dynamicsGeneration=0;const presentationSpace=options.surfaceSpace??"fixed";const usesDynamicsOnly=()=>presentationSpace==="scroll"||presentationSpace==="fixed"&&toValue(options.appearance)==="frosted";const wallpaperSourceCache=options.wallpaperSourceCache??createGlassWallpaperSourceCache();function syncWallpaperSamplingMode(){if(!resources)return;resources.uniforms.uHasWallpaperTexture.value=activeHasWallpaperTexture&&!(presentationSpace==="scroll"&&scrollWallpaperSamplingSuppressed)?1:0}function clearScrollPresentationRestoreTimer(){if(scrollPresentationRestoreTimer===null)return;window.clearTimeout(scrollPresentationRestoreTimer);scrollPresentationRestoreTimer=null}function finishNativeScrollPresentation(timestamp=performance.now()){clearScrollPresentationRestoreTimer();if(presentationSpace!=="scroll"||!scrollWallpaperSamplingSuppressed)return;scrollWallpaperSamplingSuppressed=false;syncWallpaperSamplingMode();renderFrame(timestamp,false);document.documentElement.removeAttribute("data-glass-scroll-presentation")}function beginNativeScrollPresentation(){if(presentationSpace!=="scroll"||!resources)return;clearScrollPresentationRestoreTimer();scrollPresentationRestoreTimer=window.setTimeout(()=>finishNativeScrollPresentation(),180);if(scrollWallpaperSamplingSuppressed)return;if(hasRippleCapability()&&rippleResources){interactionAnimating=false;cancelScheduledFrame();rippleResources.reset();resources.uniforms.uRippleTexture.value=rippleResources.texture;resources.uniforms.uHasRippleTexture.value=0;resetInteractionState()}scrollWallpaperSamplingSuppressed=true;syncWallpaperSamplingMode();document.documentElement.dataset.glassScrollPresentation="native";renderFrame(performance.now(),false)}function resolveScrollIntentTarget(event){const documentScroller=document.scrollingElement??document.documentElement;const eventTarget=event.target;if(!(eventTarget instanceof Element))return documentScroller;if(eventTarget.closest(".v-overlay"))return null;const wheel=event instanceof WheelEvent?event:null;for(let candidate=eventTarget;candidate&&candidate!==document.body;candidate=candidate.parentElement){const style=getComputedStyle(candidate);const canScrollY=/(auto|overlay|scroll)/.test(style.overflowY)&&candidate.scrollHeight>candidate.clientHeight&&(!wheel||wheel.deltaY<0&&candidate.scrollTop>0||wheel.deltaY>0&&candidate.scrollTop+candidate.clientHeight<candidate.scrollHeight);const canScrollX=/(auto|overlay|scroll)/.test(style.overflowX)&&candidate.scrollWidth>candidate.clientWidth&&(!wheel||wheel.deltaX<0&&candidate.scrollLeft>0||wheel.deltaX>0&&candidate.scrollLeft+candidate.clientWidth<candidate.scrollWidth);if(canScrollX||canScrollY)return candidate}return documentScroller}function isRelevantScrollTarget(target){if(!(target instanceof Element)||target===document.documentElement||target===document.body)return true;return observedSurfaces.some(surface=>target.contains(surface))}function handleScrollIntent(event){if(event instanceof WheelEvent&&event.deltaX===0&&event.deltaY===0)return;if(event instanceof KeyboardEvent){const target=event.target;if(target instanceof HTMLElement&&(target.isContentEditable||["INPUT","SELECT","TEXTAREA"].includes(target.tagName))){return}if(!["ArrowDown","ArrowUp","End","Home","PageDown","PageUp"," "].includes(event.key))return}const scrollTarget=resolveScrollIntentTarget(event);if(!scrollTarget||!isRelevantScrollTarget(scrollTarget))return;beginNativeScrollPresentation()}function updateRendererState(value){if(options.syncDocumentState===false){state.value=value;return}setGlassRendererState(state,value)}function measurePresentationSize(){if(presentationSpace==="fixed"){return{height:window.innerHeight,width:window.innerWidth}}const root=options.canvas.value?.parentElement;return{height:Math.max(window.innerHeight,root?.scrollHeight??0,document.documentElement.scrollHeight),width:Math.max(window.innerWidth,root?.scrollWidth??0,document.documentElement.scrollWidth)}}function getCommittedPresentationSize(){const committed=resources?.uniforms.uPresentationSize.value;return committed?{height:committed.y,width:committed.x}:{height:window.innerHeight,width:window.innerWidth}}function getPresentationPoint(clientX,clientY){if(presentationSpace==="fixed")return{x:clientX,y:clientY};return{x:clientX+window.scrollX,y:clientY+window.scrollY}}function getElementPresentationRect(element){const bounds=element.getBoundingClientRect();const coordinateOffsetX=presentationSpace==="scroll"?window.scrollX:0;const coordinateOffsetY=presentationSpace==="scroll"?window.scrollY:0;return{height:bounds.height,radii:[...readBorderRadii(element)],rank:0,width:bounds.width,x:bounds.left+coordinateOffsetX,y:bounds.top+coordinateOffsetY}}function observeResizeTargets(reset=true){if(reset)resizeObserver?.disconnect();if(presentationSpace==="scroll"){const presentationRoot=options.canvas.value?.parentElement;if(presentationRoot)resizeObserver?.observe(presentationRoot)}for(const element of observedSurfaces)resizeObserver?.observe(element)}function cancelScheduledFrame(){if(animationFrame===null)return;cancelAnimationFrame(animationFrame);animationFrame=null}function cancelScrollFrame(){if(scrollAnimationFrame!==null)cancelAnimationFrame(scrollAnimationFrame);scrollAnimationFrame=null;scrollDirty=false;scrollFrameCommitted=false;scrollGeometryRefreshPending=false;scrollLateGeometryCommitted=false;scrollSurfaceStabilityPending=false;scrollStableFrameCount=0;clearScrollPresentationRestoreTimer()}function cancelWallpaperTransitionFrame(){if(wallpaperTransitionFrame===null)return;cancelAnimationFrame(wallpaperTransitionFrame);wallpaperTransitionFrame=null}function cancelSurfaceTransformFrame(){if(surfaceTransformFrame!==null)cancelAnimationFrame(surfaceTransformFrame);surfaceTransformFrame=null;surfaceTransformTrackingDeadline=0;transformingSurfaces.clear()}function clearBackgroundDisposeTimer(){if(backgroundDisposeTimer===null)return;window.clearTimeout(backgroundDisposeTimer);backgroundDisposeTimer=null}function disposeWallpaperResources(texture,frostedTarget){texture?.dispose();frostedTarget?.dispose()}function finishWallpaperTransition(){if(!resources||!activeTexture)return;if(previousTexture&&previousTexture!==activeTexture){disposeWallpaperResources(previousTexture,previousFrostedTarget)}previousTexture=null;previousFrostedTarget=null;previousTextureHeight=activeTextureHeight;previousTextureWidth=activeTextureWidth;previousWallpaperExposure=activeWallpaperExposure;resources.uniforms.uPreviousTexture.value=activeTexture;resources.uniforms.uPreviousFrostedTexture.value=activeFrostedTarget?.texture??activeTexture;resources.uniforms.uPreviousCoverScale.value.copy(resources.uniforms.uCoverScale.value);resources.uniforms.uPreviousWallpaperExposure.value=activeWallpaperExposure;resources.uniforms.uTextureMix.value=1;wallpaperTransitionStartedAt=0;wallpaperActivationRollback=null;cancelWallpaperTransitionFrame()}function updateWallpaperTransition(timestamp){if(!resources||!previousTexture)return false;const duration=toValue(options.transitionDuration??0);const progress=getGlassWallpaperTransitionProgress(timestamp-wallpaperTransitionStartedAt,duration);resources.uniforms.uTextureMix.value=progress;if(progress>=1){finishWallpaperTransition();return false}return true}function renderWallpaperTransitionFrame(timestamp){wallpaperTransitionFrame=null;if(document.visibilityState==="hidden")return;renderFrame(timestamp);if(previousTexture&&wallpaperTransitionFrame===null){wallpaperTransitionFrame=requestAnimationFrame(renderWallpaperTransitionFrame)}}function scheduleWallpaperTransition(){if(wallpaperTransitionFrame!==null||!previousTexture||document.visibilityState==="hidden")return;wallpaperTransitionFrame=requestAnimationFrame(renderWallpaperTransitionFrame)}function disposeFrostPrefilterResources(){if(!frostPrefilterResources)return;frostPrefilterResources.material.dispose();frostPrefilterResources=null}function getFrostPrefilterResources(){if(frostPrefilterResources)return frostPrefilterResources;if(!resources||!three)return null;const uniforms={uDirection:{value:new three.Vector2(1,0)},uTexture:{value:null},uTextureSize:{value:new three.Vector2(1,1)}};const material=new three.ShaderMaterial({depthTest:false,depthWrite:false,fragmentShader:FROST_PREFILTER_FRAGMENT_SHADER,uniforms,vertexShader:VERTEX_SHADER});const scene=new three.Scene;const mesh=new three.Mesh(resources.geometry,material);mesh.frustumCulled=false;scene.add(mesh);frostPrefilterResources={material,mesh,scene,uniforms};return frostPrefilterResources}async function createFrostedWallpaperTarget(texture,width,height,targetLongEdge){if(!resources||!three)return null;const ownerResources=resources;const prefilter=getFrostPrefilterResources();if(!prefilter)return null;const targetScale=Math.min(1,targetLongEdge/Math.max(width,height));const targetWidth=Math.max(1,Math.round(width*targetScale));const targetHeight=Math.max(1,Math.round(height*targetScale));const createTarget=(generateMipmaps=false)=>new three.WebGLRenderTarget(targetWidth,targetHeight,{depthBuffer:false,generateMipmaps,magFilter:three.LinearFilter,minFilter:generateMipmaps?three.LinearMipmapLinearFilter:three.LinearFilter,stencilBuffer:false});const intermediateTarget=createTarget();const outputTarget=createTarget(true);const previousTarget=ownerResources.renderer.getRenderTarget();try{ownerResources.renderer.initTexture(texture);await ownerResources.renderer.compileAsync(prefilter.scene,ownerResources.camera);if(resources!==ownerResources){outputTarget.dispose();return null}prefilter.uniforms.uDirection.value.set(1,0);prefilter.uniforms.uTexture.value=texture;prefilter.uniforms.uTextureSize.value.set(width,height);ownerResources.renderer.setRenderTarget(intermediateTarget);ownerResources.renderer.render(prefilter.scene,ownerResources.camera);prefilter.uniforms.uDirection.value.set(0,1);prefilter.uniforms.uTexture.value=intermediateTarget.texture;prefilter.uniforms.uTextureSize.value.set(width,height);ownerResources.renderer.setRenderTarget(outputTarget);ownerResources.renderer.render(prefilter.scene,ownerResources.camera);return outputTarget}catch(error){outputTarget.dispose();throw error}finally{if(resources===ownerResources)ownerResources.renderer.setRenderTarget(previousTarget);intermediateTarget.dispose()}}function disposeFluidDynamics(){if(!fluidDynamics)return;fluidDynamics.dispose();fluidDynamics=null;if(resources){resources.uniforms.uFlowTexture.value=null;resources.uniforms.uHasFlowTexture.value=0}}function disposeRippleResources(){dynamicsGeneration+=1;rippleResources?.dispose();rippleResources=null;if(!resources)return;resources.uniforms.uRippleTexture.value=null;resources.uniforms.uHasRippleTexture.value=0;resources.uniforms.uRippleTexelSize.value.set(1,1)}function syncFluidDynamics(){if(!resources||!three)return;const profile=getRenderProfile();if(!hasFluidCapability()||!profile.flowField){disposeFluidDynamics();return}if(fluidDynamics)return;fluidDynamics=createGlassFluidDynamics({camera:resources.camera,geometry:resources.geometry,pointer:resources.uniforms.uPointer.value,renderer:resources.renderer,three,velocity:resources.uniforms.uPointerVelocity.value});resources.uniforms.uHasFlowTexture.value=1}async function syncRippleResources(){if(!resources||!three)return;if(!hasRippleCapability()){disposeRippleResources();return}if(rippleResources)return;const ownerResources=resources;const generation=++dynamicsGeneration;const quality=toValue(options.quality)==="high"?"high":"balanced";let ripple;try{ripple=await createGlassRippleDynamics({camera:ownerResources.camera,geometry:ownerResources.geometry,quality,renderer:ownerResources.renderer,three,viewportHeight:window.innerHeight,viewportWidth:window.innerWidth})}catch(error){if(generation!==dynamicsGeneration||resources!==ownerResources||!hasRippleCapability())return;throw error}if(generation!==dynamicsGeneration||resources!==ownerResources||!hasRippleCapability()){ripple.dispose();return}rippleResources=ripple;ripple.setParameters(toValue(options.translationStrength??getLegacyDynamicStrength()),toValue(options.flowStrength??getLegacyDynamicStrength()));ownerResources.uniforms.uRippleTexture.value=ripple.texture;ownerResources.uniforms.uRippleTexelSize.value.copy(ripple.texelSize);ownerResources.uniforms.uHasRippleTexture.value=ripple.texture?1:0}async function syncDynamicsMode(){if(!resources)return;interactionAnimating=false;activeTouchIdentifier=null;cancelScheduledFrame();removeInteractionEvents();resetInteractionState();lastPointerAt=0;lastPointerX=window.innerWidth*.5;lastPointerY=window.innerHeight*.5;suppressNextPointerVelocity=true;wakeDirection={x:0,y:-1};const mode=getDynamicsMode();resources.uniforms.uDynamicsMode.value=getDynamicsModeUniformValue();resources.uniforms.uTranslationStrength.value=mode==="fluid"?getTranslationStrengthScale():0;resources.uniforms.uDeformationStrength.value=mode==="fluid"?getDeformationStrengthScale():0;resources.uniforms.uFlowStrength.value=mode==="fluid"?getFlowStrengthScale():0;resources.uniforms.uMotionExpansion.value=mode==="fluid"?getMotionExpansion():0;resources.uniforms.uMaxRefractionPixels.value=getMaxRefractionPixels();resources.uniforms.uRippleDeformationStrength.value=mode==="ripple"?Math.min(1,Math.max(0,toValue(options.deformationStrength??getLegacyDynamicStrength())/100)):0;resources.uniforms.uTrailCount.value=mode==="fluid"?getRenderProfile().trailCount:0;if(mode==="fluid"){disposeRippleResources();syncFluidDynamics()}else if(mode==="ripple"){disposeFluidDynamics();await syncRippleResources()}else{disposeFluidDynamics();disposeRippleResources()}if(!resources||getDynamicsMode()!==mode)return;if(mode!=="off")setupInteractionEvents();resizeRenderer();scheduleFrame()}function renderFrame(timestamp=performance.now(),advanceFlow=true){if(!resources||!toValue(options.active)||document.visibilityState==="hidden")return;updateWallpaperTransition(timestamp);if(fluidDynamics&&advanceFlow){resources.uniforms.uFlowTexture.value=fluidDynamics.step()}if(presentationSpace==="scroll"){const{height:presentationHeight}=getCommittedPresentationSize();const scaleY=presentationBufferHeight/Math.max(presentationHeight,1);const scissorY=Math.max(0,Math.floor((presentationHeight-window.scrollY-window.innerHeight)*scaleY));const scissorHeight=Math.min(presentationBufferHeight-scissorY,Math.ceil(window.innerHeight*scaleY)+2);resources.renderer.setScissorTest(true);resources.renderer.setScissor(0,scissorY,presentationBufferWidth,scissorHeight);resources.renderer.clear()}else{resources.renderer.setScissorTest(false)}resources.renderer.render(resources.scene,resources.camera);renderedFrames.value+=1}function renderScheduledFrame(timestamp){animationFrame=null;renderFrame(timestamp)}function scheduleFrame(){if(animationFrame!==null||!resources)return;animationFrame=requestAnimationFrame(renderScheduledFrame)}function writeSurfaceUniforms(timestamp=performance.now()){if(!resources)return;if(outgoingSurface&&timestamp-surfaceTransitionStartedAt>=SURFACE_TRANSITION_DURATION_MS){outgoingSurface=null;surfaceSlots=surfaceSlots.filter(slot=>slot.role!=="outgoing").map(slot=>({...slot,role:slot.key===activeSurface?"active":"stable"}))}const presentation=getCommittedPresentationSize();const normalizedInteractionClips=interactionClips.map(clip=>normalizeGlassOpticalRect(clip.rect,presentation.width,presentation.height));const uniformInteractionRects=resources.uniforms.uInteractionRects.value;const uniformInteractionRadii=resources.uniforms.uInteractionRadii.value;for(let index=0;index<8;index+=1){const clip=normalizedInteractionClips[index];const rect=clip?.rect??[0,0,0,0];const radii=clip?.radii??[0,0,0,0];uniformInteractionRects[index].set(rect[0],rect[1],rect[2],rect[3]);uniformInteractionRadii[index].set(radii[0],radii[1],radii[2],radii[3])}resources.uniforms.uInteractionRectCount.value=normalizedInteractionClips.length;const normalized=surfaceSlots.map(slot=>normalizeGlassOpticalRect(slot.rect,presentation.width,presentation.height));const uniformRects=resources.uniforms.uRects.value;const uniformRadii=resources.uniforms.uRadii.value;const uniformWeights=resources.uniforms.uSurfaceWeights.value;const uniformDynamics=resources.uniforms.uSurfaceDynamics.value;const ownersWithVisibleInteractionClips=new Set(interactionClips.map(clip=>clip.owner));const transitionWeights=outgoingSurface?getGlassOpticalSurfaceTransitionWeights(timestamp-surfaceTransitionStartedAt,SURFACE_TRANSITION_DURATION_MS):{incoming:1,outgoing:0};const pageMotionOpacity=presentationSpace==="scroll"&&toValue(options.appearance)!=="frosted"?Math.min(1,Math.max(0,toValue(options.pageMotion?.opacity??1))):1;const pagePresentationWeight=pagePresentationGeometryReady?pageMotionOpacity:0;for(let index=0;index<8;index+=1){const surface=normalized[index];const slot=surfaceSlots[index];const rect=surface?.rect??[0,0,0,0];const radii=surface?.radii??[0,0,0,0];uniformRects[index].set(rect[0],rect[1],rect[2],rect[3]);uniformRadii[index].set(radii[0],radii[1],radii[2],radii[3]);const surfaceWeight=slot?.role==="outgoing"?transitionWeights.outgoing:slot?.role==="active"?transitionWeights.incoming:slot?1:0;uniformWeights[index]=surfaceWeight*pagePresentationWeight;const nestedInteractionAvailable=!slot||!interactionClipConstrainedOwners.has(slot.key)||ownersWithVisibleInteractionClips.has(slot.key);uniformDynamics[index]=slot?.mode==="static-material"||!nestedInteractionAvailable?0:1}resources.uniforms.uRectCount.value=normalized.length}function refreshInteractionClipRegistry(){const seen=new Set;const candidates=[];const constrainedOwners=new Set;const append=(element,owner,mode,committedRect)=>{if(seen.has(element)||!element.isConnected||!isGlassOpticalElementEligible(element)||resolveGlassOpticalSurfaceMode(element)!==mode){return}const rect=committedRect??getElementPresentationRect(element);seen.add(element);candidates.push({key:element,mode,owner,rect})};for(const surface of surfaceRegistry){const mode=surface.mode??"dynamic";if(mode==="static-material")continue;if(surface.key.matches(OPTICAL_BOUNDARY_SELECTOR)){append(surface.key,surface.key,mode,surface.rect);continue}const surfaceIsClip=surface.key.matches(INTERACTION_CLIP_SELECTOR);if(surfaceIsClip)append(surface.key,surface.key,mode,surface.rect);const nestedClips=[...surface.key.querySelectorAll(INTERACTION_CLIP_SELECTOR)];if(nestedClips.length>0){constrainedOwners.add(surface.key);nestedClips.forEach(clip=>append(clip,surface.key,mode))}else if(!surfaceIsClip){append(surface.key,surface.key,mode,surface.rect)}}interactionClipRegistry=candidates;interactionClipConstrainedOwners=constrainedOwners;interactionClipMembershipDirty=false}function refreshInteractionClipGeometry(){const committedSurfaces=new Map(surfaceRegistry.map(surface=>[surface.key,surface]));interactionClipRegistry=interactionClipRegistry.flatMap(clip=>{if(!clip.key.isConnected||!clip.owner.isConnected||!isGlassOpticalElementEligible(clip.key)||!isGlassOpticalElementEligible(clip.owner)||resolveGlassOpticalSurfaceMode(clip.key)!==clip.mode||!committedSurfaces.has(clip.owner)){return[]}const rect=committedSurfaces.get(clip.key)?.rect??getElementPresentationRect(clip.key);return[{...clip,rect}]})}function isInteractionClipRenderable(rect){return rect.width>=24&&rect.height>=24}function updateInteractionClips(){const slotKeys=new Set(surfaceSlots.map(slot=>slot.key));const viewportX=presentationSpace==="scroll"?window.scrollX:0;const viewportY=presentationSpace==="scroll"?window.scrollY:0;const interactionPoint=getPresentationPoint(lastPointerX,lastPointerY);const candidates=interactionClipRegistry.filter(candidate=>slotKeys.has(candidate.owner)).map(candidate=>{const{rect}=candidate;const visibleWidth=Math.min(viewportX+window.innerWidth,rect.x+rect.width)-Math.max(viewportX,rect.x);const visibleHeight=Math.min(viewportY+window.innerHeight,rect.y+rect.height)-Math.max(viewportY,rect.y);const inOverscan=rect.x+rect.width>=viewportX-INTERACTION_CLIP_OVERSCAN_PX&&rect.x<=viewportX+window.innerWidth+INTERACTION_CLIP_OVERSCAN_PX&&rect.y+rect.height>=viewportY-INTERACTION_CLIP_OVERSCAN_PX&&rect.y<=viewportY+window.innerHeight+INTERACTION_CLIP_OVERSCAN_PX;const distance=Math.hypot(rect.x+rect.width*.5-interactionPoint.x,rect.y+rect.height*.5-interactionPoint.y);return{candidate,distance,visible:visibleWidth>=24&&visibleHeight>=24,inOverscan}}).filter(entry=>isInteractionClipRenderable(entry.candidate.rect)&&(entry.candidate.key===activeInteractionClip||entry.inOverscan)).sort((left,right)=>{const leftActive=left.candidate.key===activeInteractionClip;const rightActive=right.candidate.key===activeInteractionClip;if(leftActive!==rightActive)return leftActive?-1:1;if(left.visible!==right.visible)return left.visible?-1:1;return left.distance-right.distance}).map(entry=>entry.candidate);const maxCount=window.innerWidth<=600?GLASS_OPTICAL_MAX_SURFACES_MOBILE:GLASS_OPTICAL_MAX_SURFACES_DESKTOP;interactionClips=candidates.slice(0,maxCount)}function updateVisibleSurfaceUniforms(timestamp){const viewportWidth=window.innerWidth;availableSurfaces=selectVisibleGlassOpticalSurfaceDescriptors(surfaceRegistry,viewportWidth,window.innerHeight,presentationSpace);const availableKeys=new Set(availableSurfaces.map(surface=>surface.key));if(activeSurface&&!availableKeys.has(activeSurface)){activeSurface=null;activeInteractionClip=null}if(outgoingSurface&&!availableKeys.has(outgoingSurface))outgoingSurface=null;const interactionClipKeys=new Set(interactionClipRegistry.map(clip=>clip.key));if(activeInteractionClip&&!interactionClipKeys.has(activeInteractionClip))activeInteractionClip=null;const maxCount=viewportWidth<=600?GLASS_OPTICAL_MAX_SURFACES_MOBILE:GLASS_OPTICAL_MAX_SURFACES_DESKTOP;surfaceSlots=reconcileGlassOpticalSurfaceSlots(surfaceSlots,availableSurfaces,maxCount,activeSurface??void 0,outgoingSurface??void 0);updateInteractionClips();writeSurfaceUniforms(timestamp)}function updateSurfaceUniforms(timestamp=performance.now(),scheduleRender=true){if(!resources)return;const viewportWidth=window.innerWidth;const nextObservedSurfaces=[];surfaceRegistry=collectGlassOpticalSurfaceDescriptors(viewportWidth,window.innerHeight,toValue(options.appearance),presentationSpace,true,nextObservedSurfaces);if(interactionClipMembershipDirty)refreshInteractionClipRegistry();else refreshInteractionClipGeometry();updateVisibleSurfaceUniforms(timestamp);const observedSurfacesChanged=nextObservedSurfaces.length!==observedSurfaces.length||nextObservedSurfaces.some((element,index)=>element!==observedSurfaces[index]);if(observedSurfacesChanged){observedSurfaces=nextObservedSurfaces;observeResizeTargets()}if(scheduleRender)scheduleFrame()}function queueScrollGeometryRefresh(stabilize){if(presentationSpace!=="scroll"||scrollAnimationFrame===null||!resources)return false;scrollSurfaceStabilityPending||=stabilize;scrollStableFrameCount=0;if(!scrollFrameCommitted){scrollGeometryRefreshPending=true;return true}if(scrollLateGeometryCommitted)return true;scrollLateGeometryCommitted=true;scrollGeometryRefreshPending=false;const timestamp=performance.now();updateSurfaceUniforms(timestamp,false);renderFrame(timestamp,false);return true}function scheduleSurfaceUpdate(){if(queueScrollGeometryRefresh(false))return;if(surfaceUpdateFrame!==null||!resources)return;surfaceUpdateFrame=requestAnimationFrame(timestamp=>{surfaceUpdateFrame=null;updateSurfaceUniforms(timestamp,false);renderFrame(timestamp,false)})}function scheduleSurfaceStabilityUpdate(motionEpoch){if(motionEpoch!==void 0)pagePresentationMotionEpoch=motionEpoch;if(queueScrollGeometryRefresh(true))return;surfaceStabilityPass=0;surfaceStableFrameCount=0;lastSurfaceGeometrySignature="";if(surfaceStabilityFrame!==null||!resources)return;const sample=timestamp=>{surfaceStabilityFrame=null;if(!resources||!toValue(options.active)||document.visibilityState==="hidden")return;updateSurfaceUniforms(timestamp,false);const signature=surfaceSlots.map(slot=>{const{height,width,x,y}=slot.rect;return`${x.toFixed(2)},${y.toFixed(2)},${width.toFixed(2)},${height.toFixed(2)}`}).join("|");surfaceStableFrameCount=signature===lastSurfaceGeometrySignature?surfaceStableFrameCount+1:0;lastSurfaceGeometrySignature=signature;surfaceStabilityPass+=1;renderFrame(timestamp,false);if(surfaceStableFrameCount<SURFACE_STABILITY_REQUIRED_FRAMES&&surfaceStabilityPass<SURFACE_STABILITY_MAX_FRAMES){surfaceStabilityFrame=requestAnimationFrame(sample)}else if(!pagePresentationGeometryReady){pagePresentationGeometryReady=true;writeSurfaceUniforms(timestamp);renderFrame(timestamp,false);const acknowledgedEpoch=pagePresentationMotionEpoch;pagePresentationMotionEpoch=null;if(acknowledgedEpoch!==null){options.pageMotion?.acknowledgeGeometryReady(acknowledgedEpoch,timestamp)}}};surfaceStabilityFrame=requestAnimationFrame(sample)}function schedulePresentationResizeUpdate(){if(presentationResizeTimer!==null)window.clearTimeout(presentationResizeTimer);presentationResizeCandidate="";presentationResizeStableSamples=0;const sample=()=>{presentationResizeTimer=null;if(!resources)return;const presentation=measurePresentationSize();const candidate=`${window.innerWidth},${window.innerHeight},${presentation.width},${presentation.height}`;presentationResizeStableSamples=candidate===presentationResizeCandidate?presentationResizeStableSamples+1:1;presentationResizeCandidate=candidate;if(presentationResizeStableSamples>=PRESENTATION_RESIZE_REQUIRED_SAMPLES){resizeRenderer();presentationResizeCandidate="";presentationResizeStableSamples=0;return}presentationResizeTimer=window.setTimeout(sample,PRESENTATION_RESIZE_SAMPLE_MS)};presentationResizeTimer=window.setTimeout(sample,PRESENTATION_RESIZE_SAMPLE_MS)}function commitActivePagePresentation(timestamp=performance.now()){if(!resources||presentationSpace!=="scroll"||!toValue(options.pageMotion?.active??false))return false;if(presentationResizeTimer!==null)window.clearTimeout(presentationResizeTimer);presentationResizeTimer=null;presentationResizeCandidate="";presentationResizeStableSamples=0;resizeRenderer();updateSurfaceUniforms(timestamp,false);renderFrame(timestamp,false);return true}function handleSurfaceResize(entries){if(!resources)return;const presentationRoot=presentationSpace==="scroll"?options.canvas.value?.parentElement:null;const presentationChanged=presentationRoot&&entries.some(entry=>entry.target===presentationRoot);if(presentationChanged&&commitActivePagePresentation())return;if(presentationChanged)schedulePresentationResizeUpdate();if(!entries.some(entry=>entry.target!==presentationRoot))return;if(queueScrollGeometryRefresh(false))return;const timestamp=performance.now();updateSurfaceUniforms(timestamp,false);renderFrame(timestamp,false)}function scheduleSurfaceTransformFrame(){if(queueScrollGeometryRefresh(false))return;if(surfaceTransformFrame!==null||!resources)return;surfaceTransformFrame=requestAnimationFrame(timestamp=>{surfaceTransformFrame=null;if(!resources||!toValue(options.active)||document.visibilityState==="hidden"){cancelSurfaceTransformFrame();return}updateSurfaceUniforms(timestamp,false);renderFrame(timestamp,false);if(transformingSurfaces.size>0&&timestamp<surfaceTransformTrackingDeadline){scheduleSurfaceTransformFrame()}else{transformingSurfaces.clear();scheduleSurfaceStabilityUpdate()}})}function resolveTransitionSurface(target){if(!(target instanceof HTMLElement))return null;const surface=target.matches(SURFACE_SELECTOR_QUERY)?target:target.closest(SURFACE_SELECTOR_QUERY);if(!surface||!isGlassOpticalElementEligible(surface))return null;return SURFACE_SELECTORS.some(({selector,space})=>surface.matches(selector)&&getSurfacePresentationSpace(selector,space)===presentationSpace)?surface:null}function handleSurfaceTransitionRun(event){if(event.propertyName!=="transform")return;const surface=resolveTransitionSurface(event.target);if(!surface)return;transformingSurfaces.add(surface);surfaceTransformTrackingDeadline=performance.now()+SURFACE_TRANSFORM_TRACKING_MAX_MS;scheduleSurfaceTransformFrame()}function handleSurfaceTransitionEnd(event){if(event.propertyName!=="transform")return;const surface=resolveTransitionSurface(event.target);if(!surface)return;transformingSurfaces.delete(surface);if(transformingSurfaces.size===0)scheduleSurfaceStabilityUpdate()}function syncCoverScale(viewportWidth=window.innerWidth,viewportHeight=window.innerHeight){if(!resources)return;const cover=getGlassCoverScale(viewportWidth,viewportHeight,activeTextureWidth,activeTextureHeight);const previousCover=getGlassCoverScale(viewportWidth,viewportHeight,previousTextureWidth,previousTextureHeight);resources.uniforms.uCoverScale.value.set(cover.x,cover.y);resources.uniforms.uPreviousCoverScale.value.set(previousCover.x,previousCover.y)}function getRenderProfile(routeKey=toValue(options.routeKey)){return getGlassOpticalRenderProfile(toValue(options.quality),routeKey)}function getWallpaperPreparationKey(url){return getGlassWallpaperPreparationKey(toValue(options.appearance),toValue(options.quality),toValue(options.routeKey),url)}function releasePreparedWallpaper(){if(preparedWallpaper){disposeWallpaperResources(preparedWallpaper.texture,preparedWallpaper.frostedTarget)}preparedWallpaper=null;preparedWallpaperUrl.value="";preparedWallpaperRevision.value=0;preparedWallpaperPreparationKey.value=""}function clearPreparedWallpaperFailure(){failedWallpaperUrl.value="";failedWallpaperRevision.value=0;failedWallpaperPreparationKey.value=""}function invalidatePreparedWallpaper(){prepareVersion+=1;releasePreparedWallpaper();clearPreparedWallpaperFailure()}function preparePendingWallpaper(){const url=toValue(options.pendingWallpaperUrl??"");const revision=toValue(options.pendingWallpaperRevision??0);if(url&&revision>0)void prepareWallpaper(url,revision)}function getLegacyDynamicStrength(){return toValue(options.motionStrength??GLASS_OPTICAL_STRENGTH_DEFAULT)}function getDynamicsMode(){if(!toValue(options.dynamicsActive??true))return"off";return toValue(options.dynamicsMode??"fluid")}function hasDynamicCapability(){return getDynamicsMode()!=="off"}function hasFluidCapability(){return getDynamicsMode()==="fluid"}function hasRippleCapability(){return getDynamicsMode()==="ripple"}function getDynamicsModeUniformValue(){const mode=getDynamicsMode();return mode==="fluid"?0:mode==="ripple"?1:2}function getTranslationStrengthScale(){if(!hasFluidCapability())return 0;return getGlassOpticalTranslationStrengthScale(toValue(options.translationStrength??getLegacyDynamicStrength()))}function getDeformationStrengthScale(){if(!hasFluidCapability())return 0;return getGlassOpticalDeformationStrengthScale(toValue(options.deformationStrength??getLegacyDynamicStrength()))}function getFlowStrengthScale(){if(!hasFluidCapability())return 0;return getGlassOpticalFlowStrengthScale(toValue(options.flowStrength??getLegacyDynamicStrength()))}function getMotionExpansion(){if(!hasFluidCapability())return 0;return getGlassOpticalMotionExpansion(toValue(options.flowStrength??getLegacyDynamicStrength()))}function getMaxRefractionPixels(){if(!hasDynamicCapability())return 0;if(hasRippleCapability()){const deformation=Math.min(1,Math.max(0,toValue(options.deformationStrength??getLegacyDynamicStrength())/100));return(toValue(options.quality)==="high"?40:28)*deformation}return getGlassOpticalMaxRefractionPixels(getRenderProfile().maxRefractionPixels,toValue(options.deformationStrength??getLegacyDynamicStrength()))}function getReflectionStrengthScale(){return getGlassOpticalReflectionStrengthScale(toValue(options.reflectionStrength??GLASS_OPTICAL_STRENGTH_DEFAULT))}function getMaterialResponse(){return getGlassMaterialResponse(toValue(options.appearance),toValue(options.transparencyStrength??GLASS_OPTICAL_STRENGTH_DEFAULT))}function resizeRenderer(){if(!resources)return;const viewportWidth=window.innerWidth;const viewportHeight=window.innerHeight;const presentation=measurePresentationSize();const profile=getRenderProfile();const buffer=presentationSpace==="scroll"?getGlassScrollBufferSize(presentation.width,presentation.height,profile.bufferQuality,window.devicePixelRatio):getGlassOpticalBufferSize(viewportWidth,viewportHeight,viewportWidth<=600,profile.bufferQuality,window.devicePixelRatio);const bufferChanged=presentationBufferWidth!==buffer.width||presentationBufferHeight!==buffer.height;const presentationChanged=resources.uniforms.uPresentationSize.value.x!==presentation.width||resources.uniforms.uPresentationSize.value.y!==presentation.height;presentationBufferHeight=buffer.height;presentationBufferWidth=buffer.width;if(bufferChanged)resources.renderer.setSize(buffer.width,buffer.height,false);resources.uniforms.uVisibleViewportSize.value.set(viewportWidth,viewportHeight);resources.uniforms.uPresentationSize.value.set(presentation.width,presentation.height);resources.uniforms.uScrollOffset.value.set(presentationSpace==="scroll"?window.scrollX:0,presentationSpace==="scroll"?window.scrollY:0);fluidDynamics?.resize(buffer.width,buffer.height,viewportWidth,viewportHeight);if(rippleResources){rippleResources.resize(viewportWidth,viewportHeight);resources.uniforms.uRippleTexture.value=rippleResources.texture;resources.uniforms.uRippleTexelSize.value.copy(rippleResources.texelSize);resources.uniforms.uHasRippleTexture.value=rippleResources.texture?1:0}syncCoverScale(viewportWidth,viewportHeight);updateSurfaceUniforms(performance.now(),false);if(bufferChanged||presentationChanged)renderFrame(performance.now(),false);else scheduleSurfaceUpdate()}function profileRequiresTextureReload(previousProfile,nextProfile){const wallpaperUrl=toValue(options.wallpaperUrl);const resolveTextureSource=profile=>profile.textureSource==="auto"?canUseGlassWallpaperTexture(wallpaperUrl,window.location.href)?"wallpaper":"procedural":profile.textureSource;return previousProfile.textureLimit!==nextProfile.textureLimit||resolveTextureSource(previousProfile)!==resolveTextureSource(nextProfile)}function rectContainsPoint(rect,x,y){return x>=rect.x&&x<=rect.x+rect.width&&y>=rect.y&&y<=rect.y+rect.height}function findInteractionTarget(x,y){if(availableSurfaces.length===0)updateSurfaceUniforms();const surface=availableSurfaces.find(candidate=>isGlassOpticalElementEligible(candidate.key)&&rectContainsPoint(candidate.rect,x,y));if(!surface)return null;const matchingClips=interactionClipRegistry.filter(candidate=>candidate.owner===surface.key&&isGlassOpticalElementEligible(candidate.key)&&isInteractionClipRenderable(candidate.rect)&&rectContainsPoint(candidate.rect,x,y)).sort((left,right)=>left.rect.width*left.rect.height-right.rect.width*right.rect.height);return{clip:matchingClips[0]?.key??surface.key,surface}}function activateInteractionSurface(surface,timestamp,reducedMotion){if(activeSurface===surface){return false}const surfaceAlreadyHasSlot=surfaceSlots.some(slot=>slot.key===surface);outgoingSurface=reducedMotion||surfaceAlreadyHasSlot?null:activeSurface;activeSurface=surface;surfaceTransitionStartedAt=timestamp;const maxCount=window.innerWidth<=600?GLASS_OPTICAL_MAX_SURFACES_MOBILE:GLASS_OPTICAL_MAX_SURFACES_DESKTOP;surfaceSlots=reconcileGlassOpticalSurfaceSlots(surfaceSlots,availableSurfaces,maxCount,activeSurface,outgoingSurface??void 0);updateInteractionClips();writeSurfaceUniforms(timestamp);return true}function updatePointerTarget(x,y,response){if(!resources)return;pointerTargetX=x;pointerTargetY=y;const clampedResponse=Math.min(1,Math.max(0,response));pointerPositionX+=(pointerTargetX-pointerPositionX)*clampedResponse;pointerPositionY+=(pointerTargetY-pointerPositionY)*clampedResponse;resources.uniforms.uPointer.value.set(pointerPositionX,pointerPositionY)}function snapPointer(x,y){pointerTargetX=x;pointerTargetY=y;pointerPositionX=x;pointerPositionY=y;resources?.uniforms.uPointer.value.set(x,y)}function updateTrail(x,y,timestamp,previousNormalizedX,previousNormalizedY){if(!resources)return;const presentation=getCommittedPresentationSize();const normalizedX=x/Math.max(presentation.width,1);const normalizedY=1-y/Math.max(presentation.height,1);const distance=Math.hypot(normalizedX-previousNormalizedX,normalizedY-previousNormalizedY);if(timestamp-lastTrailAt<36&&distance<.012)return;const trail=resources.uniforms.uTrail.value;const interpolatedSamples=Math.min(getRenderProfile().trailCount,Math.max(1,Math.ceil(distance/.045)));if(interpolatedSamples>1){for(let index=0;index<trail.length;index+=1){if(index>=interpolatedSamples){trail[index].z=0;continue}const progress=index/(interpolatedSamples-1);trail[index].set(normalizedX+(previousNormalizedX-normalizedX)*progress,normalizedY+(previousNormalizedY-normalizedY)*progress,1-progress*.28,0)}lastTrailAt=timestamp;return}for(let index=trail.length-1;index>0;index-=1){trail[index].copy(trail[index-1]);trail[index].z*=.74}trail[0].set(normalizedX,normalizedY,1,0);lastTrailAt=timestamp}function resetInteractionState(){pendingFlowInjection=0;lastInteractionFrameAt=0;lastTrailAt=Number.NEGATIVE_INFINITY;activeInteractionClip=null;interactionClips=[];if(!resources)return;snapPointer(pointerTargetX,pointerTargetY);resources.uniforms.uInteractionRectCount.value=0;resources.uniforms.uMotion.value=0;resources.uniforms.uPointerVelocity.value.set(0,0);for(const trail of resources.uniforms.uTrail.value)trail.z=0;fluidDynamics?.clearInput()}function renderInteractionFrame(timestamp){if(!resources||!toValue(options.active)||document.visibilityState==="hidden"){animationFrame=null;interactionAnimating=false;return}if(hasRippleCapability()){writeSurfaceUniforms(timestamp);const keepAnimating=advanceRipple(timestamp);renderFrame(timestamp,false);if(!keepAnimating){resetInteractionState();interactionAnimating=false;return}animationFrame=requestAnimationFrame(renderInteractionFrame);return}if(!hasFluidCapability()){resetInteractionState();renderFrame(timestamp,false);interactionAnimating=false;return}const profile=getRenderProfile();const elapsed=Math.max(0,timestamp-lastInteractionAt);const flowScale=getFlowStrengthScale();const durationScale=Math.max(.35,.55+flowScale*.45);const motionDuration=profile.motionDuration*durationScale;const motionHalfLife=profile.motionHalfLife*durationScale;const motion=getGlassOpticalMotionEnergy(elapsed,motionDuration,motionHalfLife);writeSurfaceUniforms(timestamp);if(motion<=0){resetInteractionState();renderFrame();interactionAnimating=false;return}const delta=lastInteractionFrameAt>0?Math.min(64,Math.max(0,timestamp-lastInteractionFrameAt)):16.67;lastInteractionFrameAt=timestamp;resources.uniforms.uMotion.value=motion;fluidDynamics?.setFrameParameters(getGlassOpticalDecay(profile.flowHalfLife,delta),pendingFlowInjection);pendingFlowInjection=0;renderFrame();fluidDynamics?.finishFrame();animationFrame=requestAnimationFrame(renderInteractionFrame)}function advanceRipple(timestamp){if(!resources||!rippleResources||!hasRippleCapability())return false;const keepAnimating=rippleResources.step(timestamp);resources.uniforms.uRippleTexture.value=rippleResources.texture;resources.uniforms.uRippleTexelSize.value.copy(rippleResources.texelSize);resources.uniforms.uHasRippleTexture.value=rippleResources.texture?1:0;return keepAnimating}function startInteractionAnimation(){if(interactionAnimating)return;cancelScheduledFrame();interactionAnimating=true;lastInteractionFrameAt=0;animationFrame=requestAnimationFrame(renderInteractionFrame)}function applyInteraction(clientX,clientY,timestamp,velocityOverride,target){if(!hasDynamicCapability()||hasRippleCapability()&&presentationSpace==="scroll"&&scrollWallpaperSamplingSuppressed){return}if(target instanceof Element&&isGlassOpticalElementExcluded(target))return;const viewportWidth=Math.max(window.innerWidth,1);const viewportHeight=Math.max(window.innerHeight,1);const presentation=getCommittedPresentationSize();const point=getPresentationPoint(clientX,clientY);const previousPoint=getPresentationPoint(lastPointerX,lastPointerY);const elapsed=Math.max(8,timestamp-lastPointerAt);const previousNormalizedX=previousPoint.x/Math.max(presentation.width,1);const previousNormalizedY=1-previousPoint.y/Math.max(presentation.height,1);const suppressVelocity=suppressNextPointerVelocity&&velocityOverride===void 0;const velocityX=(suppressVelocity?0:(clientX-lastPointerX)/viewportWidth*Math.min(2,16.67/elapsed));const velocityY=(suppressVelocity?0:-(clientY-lastPointerY)/viewportHeight*Math.min(2,16.67/elapsed));const velocityLength=Math.hypot(velocityX,velocityY);const velocityScale=velocityLength>.09?.09/velocityLength:1;const interactionTarget=findInteractionTarget(point.x,point.y);lastPointerX=clientX;lastPointerY=clientY;lastPointerAt=timestamp;suppressNextPointerVelocity=false;if(!resources||!interactionTarget||interactionTarget.surface.mode==="static-material")return;const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;const interactionClipChanged=activeInteractionClip!==interactionTarget.clip;activeInteractionClip=interactionTarget.clip;const surfaceChanged=activateInteractionSurface(interactionTarget.surface.key,timestamp,reducedMotion);if(interactionClipChanged&&!surfaceChanged){updateInteractionClips();writeSurfaceUniforms(timestamp)}const scaledVelocity={x:velocityX*velocityScale,y:velocityY*velocityScale};if(hasRippleCapability()){if(reducedMotion||!rippleResources){resetInteractionState();scheduleFrame();return}rippleResources.inject({direction:scaledVelocity,point:{x:clientX/viewportWidth,y:1-clientY/viewportHeight},speed:Math.min(1,velocityLength/.09),timestamp});resources.uniforms.uMotion.value=0;resources.uniforms.uPointerVelocity.value.set(0,0);resources.uniforms.uTrailCount.value=0;lastInteractionAt=timestamp;startInteractionAnimation();return}const startsInteraction=!interactionAnimating;const hasTrailAnchor=Number.isFinite(lastTrailAt);const normalizedX=point.x/Math.max(presentation.width,1);const normalizedY=1-point.y/Math.max(presentation.height,1);if(startsInteraction&&!hasTrailAnchor){snapPointer(normalizedX,normalizedY);updateTrail(point.x,point.y,timestamp,normalizedX,normalizedY)}else{updateTrail(point.x,point.y,timestamp,previousNormalizedX,previousNormalizedY);const profile=getRenderProfile();const directTouchResponse=window.innerWidth<=600||matchMedia("(pointer: coarse)").matches||activeTouchIdentifier!==null;updatePointerTarget(normalizedX,normalizedY,directTouchResponse?1:profile.pointerImmediateResponse)}wakeDirection=getGlassOpticalWakeDirection(wakeDirection,scaledVelocity,Math.hypot(scaledVelocity.x,scaledVelocity.y),startsInteraction);resources.uniforms.uPointerVelocity.value.set(scaledVelocity.x,scaledVelocity.y);resources.uniforms.uWakeDirection.value.set(wakeDirection.x,wakeDirection.y);resources.uniforms.uTrailCount.value=getRenderProfile().trailCount;lastInteractionAt=timestamp;if(reducedMotion){resetInteractionState();scheduleFrame();return}resources.uniforms.uMotion.value=1;if(getFlowStrengthScale()<=0){interactionAnimating=false;cancelScheduledFrame();pendingFlowInjection=0;for(const trail of resources.uniforms.uTrail.value)trail.z=0;fluidDynamics?.clearInput();scheduleFrame();return}pendingFlowInjection=Math.max(pendingFlowInjection,Math.min(1,velocityLength*18));startInteractionAnimation()}function handlePointerMove(event){if(event.pointerType==="touch")return;applyInteraction(event.clientX,event.clientY,event.timeStamp||performance.now(),void 0,event.target)}function findTouch(touches,identifier){for(let index=0;index<touches.length;index+=1){const touch=touches.item(index);if(touch&&(identifier===null||touch.identifier===identifier))return touch}return null}function handleTouchStart(event){if(activeTouchIdentifier!==null)return;if(event.target instanceof Element&&isGlassOpticalElementExcluded(event.target))return;const touch=findTouch(event.changedTouches,null);if(!touch)return;const timestamp=event.timeStamp||performance.now();activeTouchIdentifier=touch.identifier;lastPointerX=touch.clientX;lastPointerY=touch.clientY;lastPointerAt=timestamp;const point=getPresentationPoint(touch.clientX,touch.clientY);const presentation=getCommittedPresentationSize();const interactionTarget=findInteractionTarget(point.x,point.y);if(resources&&interactionTarget?.surface.mode==="dynamic"){activeInteractionClip=interactionTarget.clip;activateInteractionSurface(interactionTarget.surface.key,timestamp,matchMedia("(prefers-reduced-motion: reduce)").matches);snapPointer(point.x/Math.max(presentation.width,1),1-point.y/Math.max(presentation.height,1));updateTrail(point.x,point.y,timestamp,point.x/Math.max(presentation.width,1),1-point.y/Math.max(presentation.height,1));scheduleFrame()}}function handleTouchMove(event){const touch=findTouch(event.touches,activeTouchIdentifier);if(!touch)return;const timestamp=event.timeStamp||performance.now();applyInteraction(touch.clientX,touch.clientY,timestamp,void 0,event.target)}function handleTouchEnd(event){if(!findTouch(event.changedTouches,activeTouchIdentifier))return;activeTouchIdentifier=null}function handleInteractionEvent(event){if(!hasDynamicCapability())return;if(event.type==="pointermove"){handlePointerMove(event);return}if(event.type==="touchstart"){handleTouchStart(event);return}if(event.type==="touchmove"){handleTouchMove(event);return}handleTouchEnd(event)}function renderScrollFrame(timestamp){scrollAnimationFrame=null;scrollFrameCommitted=false;scrollLateGeometryCommitted=false;if(presentationSpace!=="scroll"||!resources||!toValue(options.active)||document.visibilityState==="hidden"){scrollDirty=false;scrollStableFrameCount=0;return}const receivedScrollEvent=scrollDirty;scrollDirty=false;const scrollX=window.scrollX;const scrollY=window.scrollY;const coordinatesChanged=scrollX!==lastRenderedScrollX||scrollY!==lastRenderedScrollY;lastRenderedScrollX=scrollX;lastRenderedScrollY=scrollY;resources.uniforms.uScrollOffset.value.set(scrollX,scrollY);if(scrollGeometryRefreshPending){scrollGeometryRefreshPending=false;updateSurfaceUniforms(timestamp,false)}else if(receivedScrollEvent||coordinatesChanged){updateVisibleSurfaceUniforms(timestamp)}scrollStableFrameCount=receivedScrollEvent||coordinatesChanged?0:scrollStableFrameCount+1;if(!interactionAnimating)renderFrame(timestamp,false);scrollFrameCommitted=true;if(transformingSurfaces.size>0){if(timestamp<surfaceTransformTrackingDeadline){scrollGeometryRefreshPending=true;scrollStableFrameCount=0}else{transformingSurfaces.clear();scrollSurfaceStabilityPending=true}}if(scrollStableFrameCount<SCROLL_STABLE_TAIL_FRAMES){scrollAnimationFrame=requestAnimationFrame(renderScrollFrame)}else{finishNativeScrollPresentation(timestamp);if(scrollSurfaceStabilityPending){scrollSurfaceStabilityPending=false;scheduleSurfaceStabilityUpdate()}}}function scheduleScrollFrame(){if(scrollAnimationFrame!==null||presentationSpace!=="scroll"||!resources)return;scrollAnimationFrame=requestAnimationFrame(renderScrollFrame)}function handleScroll(event){if(presentationSpace!=="scroll"||!resources)return;const target=event.target;if(!isRelevantScrollTarget(target))return;beginNativeScrollPresentation();scrollFrameCommitted=false;scrollLateGeometryCommitted=false;const isDocumentScroll=!(target instanceof Element)||target===document.documentElement||target===document.body;if(!isDocumentScroll){if(!(target instanceof Element)||!observedSurfaces.some(surface=>target.contains(surface)))return;scrollGeometryRefreshPending=true}else{resources.uniforms.uScrollOffset.value.set(window.scrollX,window.scrollY)}scrollDirty=true;scheduleScrollFrame();if(surfaceUpdateFrame!==null){cancelAnimationFrame(surfaceUpdateFrame);surfaceUpdateFrame=null;queueScrollGeometryRefresh(false)}if(surfaceStabilityFrame!==null){cancelAnimationFrame(surfaceStabilityFrame);surfaceStabilityFrame=null;queueScrollGeometryRefresh(true)}if(surfaceTransformFrame!==null){cancelAnimationFrame(surfaceTransformFrame);surfaceTransformFrame=null;queueScrollGeometryRefresh(false)}}function handleScrollEnd(event){if(presentationSpace!=="scroll"||!resources)return;const target=event.target;if(target instanceof Element&&target!==document.documentElement&&target!==document.body&&observedSurfaces.some(surface=>target.contains(surface))){scrollGeometryRefreshPending=true}scrollDirty=false;scrollStableFrameCount=0;scheduleScrollFrame()}function pauseRenderer(){cancelScheduledFrame();cancelScrollFrame();finishNativeScrollPresentation();cancelWallpaperTransitionFrame();cancelSurfaceTransformFrame();interactionAnimating=false}function resumeRenderer(){if(resumePromise)return resumePromise;const version=resumeVersion;const canResume=()=>toValue(options.active)&&document.visibilityState!=="hidden";const task=(async()=>{clearBackgroundDisposeTimer();if(!canResume())return;await nextTick();if(version!==resumeVersion||!canResume())return;if(!resources){await initializeRenderer();return}resizeRenderer();updateSurfaceUniforms();const timestamp=performance.now();const keepRippleAnimating=hasRippleCapability()?advanceRipple(timestamp):false;if(!keepRippleAnimating)resetInteractionState();renderFrame(timestamp,!hasRippleCapability());if(keepRippleAnimating){interactionAnimating=true;animationFrame=requestAnimationFrame(renderInteractionFrame)}scheduleWallpaperTransition()})();resumePromise=task;void task.finally(()=>{if(resumePromise===task)resumePromise=null});return task}function scheduleInactiveRendererDisposal(isStillInactive){clearBackgroundDisposeTimer();backgroundDisposeTimer=window.setTimeout(()=>{backgroundDisposeTimer=null;if(!isStillInactive())return;disposeRenderer(false)},APP_ACTIVITY_SUSPEND_DELAY_MS)}function handleVisibilityChange(){if(document.visibilityState==="hidden"){pauseRenderer();scheduleInactiveRendererDisposal(()=>document.visibilityState==="hidden");return}void resumeRenderer()}function handleWindowBlur(){if(document.visibilityState!=="visible")return;pauseRenderer();scheduleInactiveRendererDisposal(()=>document.visibilityState==="visible"&&!document.hasFocus())}function handleWindowResume(){if(document.visibilityState==="visible")void resumeRenderer()}function handleContextLost(event){event.preventDefault();const canvas=contextEventCanvas??options.canvas.value;disposeRenderer(false);contextRecoveryPending=true;contextRecoveryCanvas=canvas;canvas?.addEventListener("webglcontextrestored",handleContextRestored,{once:true});updateRendererState("fallback")}function handleContextRestored(){if(!contextRecoveryPending)return;contextRecoveryPending=false;contextRecoveryCanvas?.removeEventListener("webglcontextrestored",handleContextRestored);contextRecoveryCanvas=null;void initializeRenderer(false)}function handleWindowResize(){if(presentationSpace==="scroll")schedulePresentationResizeUpdate();else resizeRenderer()}function mutationTouchesOpticalSurface(mutations){const removalRecords=mutations.flatMap(mutation=>{if(mutation.type!=="childList"||mutation.removedNodes.length===0||!(mutation.target instanceof Element))return[];return[{removedElements:[...mutation.removedNodes].filter(node=>node instanceof Element),target:mutation.target}]});const managedRemovalTargets=new Set;const removedElementsFromManagedSurfaces=new Set;let removalGraphExpanded=removalRecords.length>0;while(removalGraphExpanded){removalGraphExpanded=false;for(const record of removalRecords){const belongsToManagedSurface=managedRemovalTargets.has(record.target)||surfaceRegistry.some(surface=>surface.key===record.target||surface.key.contains(record.target))||[...removedElementsFromManagedSurfaces].some(element=>element===record.target||element.contains(record.target));if(!belongsToManagedSurface)continue;if(!managedRemovalTargets.has(record.target)){managedRemovalTargets.add(record.target);removalGraphExpanded=true}for(const element of record.removedElements){if(removedElementsFromManagedSurfaces.has(element))continue;removedElementsFromManagedSurfaces.add(element);removalGraphExpanded=true}}}return mutations.some(mutation=>{if(mutation.type==="attributes")return true;const removedManagedSurface=[...mutation.removedNodes].some(node=>node instanceof Element&&(surfaceRegistry.some(surface=>surface.key===node||node.contains(surface.key))||interactionClipRegistry.some(clip=>clip.key===node||node.contains(clip.key))));if(removedManagedSurface)return true;const changedNodes=[...mutation.addedNodes,...mutation.removedNodes];if(mutation.target instanceof Element&&!isGlassOpticalElementEligible(mutation.target)){const belongsToManagedSurface=surfaceRegistry.some(surface=>surface.key===mutation.target||surface.key.contains(mutation.target));const removedFromManagedSurface=managedRemovalTargets.has(mutation.target);return(belongsToManagedSurface||removedFromManagedSurface)&&changedNodes.some(containsGlassInteractionClip)}return changedNodes.some(node=>containsGlassOpticalSurface(node)||containsGlassInteractionClip(node))})}function setupObservers(){resizeObserver=new ResizeObserver(handleSurfaceResize);observeResizeTargets(false);const observedMutationRoots=new Set;function observeMutationRoot(root,subtree){if(!root||observedMutationRoots.has(root))return;observedMutationRoots.add(root);surfaceMutationObserver?.observe(root,{attributeFilter:["data-glass-optical-boundary","data-glass-optical-mode"],attributes:true,childList:true,subtree})}surfaceMutationObserver=new MutationObserver(mutations=>{observeMutationRoot(document.querySelector(".v-overlay-container"),true);if(!mutationTouchesOpticalSurface(mutations))return;interactionClipMembershipDirty=true;commitActivePagePresentation();scheduleSurfaceStabilityUpdate()});observeMutationRoot(document.querySelector(".app-wrapper"),true);observeMutationRoot(document.querySelector(".v-overlay-container"),true);observeMutationRoot(document.body,false);surfaceMutationObserver.observe(document.documentElement,{attributeFilter:["data-theme-radius"],attributes:true})}function setupInteractionEvents(){if(!hasDynamicCapability()||interactionEventsAttached)return;interactionEventsAttached=true;if(options.interactionSource){unsubscribeInteractionSource=options.interactionSource.subscribe(presentationSpace,handleInteractionEvent)}else{window.addEventListener("pointermove",handlePointerMove,{passive:true});window.addEventListener("touchstart",handleTouchStart,{passive:true});window.addEventListener("touchmove",handleTouchMove,{passive:true});window.addEventListener("touchend",handleTouchEnd,{passive:true});window.addEventListener("touchcancel",handleTouchEnd,{passive:true})}}function removeInteractionEvents(){if(!interactionEventsAttached)return;interactionEventsAttached=false;unsubscribeInteractionSource?.();unsubscribeInteractionSource=null;if(options.interactionSource)return;window.removeEventListener("pointermove",handlePointerMove);window.removeEventListener("touchstart",handleTouchStart);window.removeEventListener("touchmove",handleTouchMove);window.removeEventListener("touchend",handleTouchEnd);window.removeEventListener("touchcancel",handleTouchEnd)}function setupContextEvents(canvas){if(contextEventCanvas===canvas)return;removeContextEvents();contextEventCanvas=canvas;canvas.addEventListener("webglcontextlost",handleContextLost);canvas.addEventListener("webglcontextrestored",handleContextRestored)}function removeContextEvents(){contextEventCanvas?.removeEventListener("webglcontextlost",handleContextLost);contextEventCanvas?.removeEventListener("webglcontextrestored",handleContextRestored);contextEventCanvas=null;contextRecoveryCanvas?.removeEventListener("webglcontextrestored",handleContextRestored);contextRecoveryCanvas=null}function setupEvents(){setupInteractionEvents();window.addEventListener("resize",handleWindowResize,{passive:true});window.addEventListener("transitionrun",handleSurfaceTransitionRun,{capture:true,passive:true});window.addEventListener("transitionend",handleSurfaceTransitionEnd,{capture:true,passive:true});window.addEventListener("transitioncancel",handleSurfaceTransitionEnd,{capture:true,passive:true});if(presentationSpace==="scroll"){window.addEventListener("wheel",handleScrollIntent,{capture:true,passive:true});window.addEventListener("touchmove",handleScrollIntent,{capture:true,passive:true});window.addEventListener("keydown",handleScrollIntent,{capture:true});window.addEventListener("scroll",handleScroll,{capture:true,passive:true});window.addEventListener("scrollend",handleScrollEnd,{passive:true})}}function removeEvents(){removeInteractionEvents();window.removeEventListener("resize",handleWindowResize);window.removeEventListener("transitionrun",handleSurfaceTransitionRun,true);window.removeEventListener("transitionend",handleSurfaceTransitionEnd,true);window.removeEventListener("transitioncancel",handleSurfaceTransitionEnd,true);if(presentationSpace==="scroll"){window.removeEventListener("wheel",handleScrollIntent,true);window.removeEventListener("touchmove",handleScrollIntent,true);window.removeEventListener("keydown",handleScrollIntent,true);window.removeEventListener("scroll",handleScroll,true);window.removeEventListener("scrollend",handleScrollEnd)}removeContextEvents()}function disposeRenderer(releaseContext=true){resumeVersion+=1;loadVersion+=1;prepareVersion+=1;contextRecoveryPending=false;interactionAnimating=false;cancelScheduledFrame();cancelScrollFrame();cancelWallpaperTransitionFrame();cancelSurfaceTransformFrame();clearBackgroundDisposeTimer();if(surfaceUpdateFrame!==null){cancelAnimationFrame(surfaceUpdateFrame);surfaceUpdateFrame=null}if(surfaceStabilityFrame!==null){cancelAnimationFrame(surfaceStabilityFrame);surfaceStabilityFrame=null}if(presentationResizeTimer!==null){window.clearTimeout(presentationResizeTimer);presentationResizeTimer=null}presentationResizeCandidate="";presentationResizeStableSamples=0;removeEvents();resizeObserver?.disconnect();resizeObserver=null;surfaceMutationObserver?.disconnect();surfaceMutationObserver=null;observedSurfaces=[];surfaceRegistry=[];availableSurfaces=[];surfaceSlots=[];interactionClips=[];interactionClipRegistry=[];interactionClipConstrainedOwners=new Set;interactionClipMembershipDirty=true;activeSurface=null;activeInteractionClip=null;outgoingSurface=null;surfaceTransitionStartedAt=0;wakeDirection={x:0,y:-1};document.documentElement.removeAttribute("data-glass-wallpaper-loading");activeTouchIdentifier=null;if(presentationSpace==="scroll"){scrollWallpaperSamplingSuppressed=false;document.documentElement.removeAttribute("data-glass-scroll-presentation")}lastPointerX=window.innerWidth*.5;lastPointerY=window.innerHeight*.5;pointerTargetX=.5;pointerTargetY=.5;pointerPositionX=.5;pointerPositionY=.5;pendingFlowInjection=0;lastInteractionFrameAt=0;if(previousTexture&&previousTexture!==activeTexture){disposeWallpaperResources(previousTexture,previousFrostedTarget)}previousTexture=null;previousFrostedTarget=null;previousTextureHeight=1;previousTextureWidth=1;previousWallpaperExposure=DEFAULT_GLASS_WALLPAPER_TONE_PROFILE.exposure;wallpaperTransitionStartedAt=0;wallpaperActivationRollback=null;disposeWallpaperResources(activeTexture,activeFrostedTarget);activeTexture=null;activeFrostedTarget=null;activeTextureHeight=1;activeTextureWidth=1;activeHasWallpaperTexture=false;activeWallpaperExposure=DEFAULT_GLASS_WALLPAPER_TONE_PROFILE.exposure;activeWallpaperUrl.value="";activeWallpaperRevision.value=0;activeWallpaperPreparationKey.value="";releasePreparedWallpaper();clearPreparedWallpaperFailure();disposeFluidDynamics();disposeRippleResources();disposeFrostPrefilterResources();if(resources){resources.geometry.dispose();resources.material.dispose();resources.renderer.dispose();if(releaseContext)resources.renderer.forceContextLoss();resources=null}delete document.documentElement.dataset.glassRendererState}function fallbackFromCurrentLoad(version,message,error){if(version!==loadVersion)return;console.warn(message,error);disposeRenderer();updateRendererState("fallback")}async function refreshWallpaper(message,beforeActivate){const version=++loadVersion;const retainsActiveTexture=Boolean(resources&&activeTexture);if(!retainsActiveTexture)updateRendererState("loading");document.documentElement.setAttribute("data-glass-wallpaper-loading","true");try{await loadWallpaper(toValue(options.wallpaperUrl),version,beforeActivate)}catch(error){if(version!==loadVersion)return;if(retainsActiveTexture&&resources&&activeTexture){console.warn(message,error);updateRendererState("ready");scheduleFrame();return}fallbackFromCurrentLoad(version,message,error)}finally{if(version===loadVersion)document.documentElement.removeAttribute("data-glass-wallpaper-loading")}}function activateLoadedTexture(texture,frostedTarget,width,height,hasWallpaperTexture,toneProfile,transitionStartedAt=toValue(options.transitionStartedAt??0),forceTransition=false){if(!resources){disposeWallpaperResources(texture,frostedTarget);return}const hasActiveTransition=Boolean(activeTexture)&&transitionStartedAt>0&&(forceTransition||Boolean(toValue(options.previousWallpaperUrl??"")));cancelWallpaperTransitionFrame();if(hasActiveTransition&&activeTexture){if(previousTexture&&previousTexture!==activeTexture){disposeWallpaperResources(previousTexture,previousFrostedTarget)}previousTexture=activeTexture;previousFrostedTarget=activeFrostedTarget;previousTextureHeight=activeTextureHeight;previousTextureWidth=activeTextureWidth;previousWallpaperExposure=activeWallpaperExposure;activeTexture=texture;activeFrostedTarget=frostedTarget;activeTextureHeight=height;activeTextureWidth=width;activeWallpaperExposure=toneProfile.exposure;resources.uniforms.uPreviousTexture.value=previousTexture;resources.uniforms.uPreviousFrostedTexture.value=previousFrostedTarget?.texture??previousTexture;resources.uniforms.uTexture.value=activeTexture;resources.uniforms.uFrostedTexture.value=activeFrostedTarget?.texture??activeTexture;resources.uniforms.uPreviousWallpaperExposure.value=previousWallpaperExposure;resources.uniforms.uWallpaperExposure.value=activeWallpaperExposure;wallpaperTransitionStartedAt=transitionStartedAt;resources.uniforms.uTextureMix.value=forceTransition?0:getGlassWallpaperTransitionProgress(performance.now()-wallpaperTransitionStartedAt,toValue(options.transitionDuration??0));syncCoverScale();scheduleWallpaperTransition()}else{if(previousTexture&&previousTexture!==activeTexture){disposeWallpaperResources(previousTexture,previousFrostedTarget)}disposeWallpaperResources(activeTexture,activeFrostedTarget);previousTexture=null;previousFrostedTarget=null;activeTexture=texture;activeFrostedTarget=frostedTarget;activeTextureHeight=height;activeTextureWidth=width;activeWallpaperExposure=toneProfile.exposure;previousTextureHeight=height;previousTextureWidth=width;previousWallpaperExposure=toneProfile.exposure;resources.uniforms.uPreviousTexture.value=texture;resources.uniforms.uPreviousFrostedTexture.value=frostedTarget?.texture??texture;resources.uniforms.uTexture.value=texture;resources.uniforms.uFrostedTexture.value=frostedTarget?.texture??texture;resources.uniforms.uPreviousWallpaperExposure.value=toneProfile.exposure;resources.uniforms.uWallpaperExposure.value=toneProfile.exposure;resources.uniforms.uTextureMix.value=1;wallpaperTransitionStartedAt=0;wallpaperActivationRollback=null;syncCoverScale()}activeHasWallpaperTexture=hasWallpaperTexture;syncWallpaperSamplingMode();resources.uniforms.uHasFrostedTexture.value=hasWallpaperTexture&&frostedTarget?1:0}async function createWallpaperTexture(url){if(!resources||!three||!url)return null;const appearance=toValue(options.appearance);const quality=toValue(options.quality);const routeKey=toValue(options.routeKey);const profile=getGlassOpticalRenderProfile(quality,routeKey);const preparationKey=getGlassWallpaperPreparationKey(appearance,quality,routeKey,url);const shouldUseProceduralTexture=profile.textureSource==="procedural"||profile.textureSource==="auto"&&!canUseGlassWallpaperTexture(url,window.location.href);if(shouldUseProceduralTexture){const textureCanvas=document.createElement("canvas");textureCanvas.width=1;textureCanvas.height=1;const texture2=new three.CanvasTexture(textureCanvas);texture2.colorSpace=three.SRGBColorSpace;texture2.generateMipmaps=false;texture2.minFilter=three.LinearFilter;texture2.magFilter=three.LinearFilter;return{frostedTarget:null,hasWallpaperTexture:false,height:1,preparationKey,texture:texture2,toneProfile:{...DEFAULT_GLASS_WALLPAPER_TONE_PROFILE},width:1}}const{textureLimit}=profile;const preparesFrostedTexture=appearance==="frosted";const sourceLimit=quality==="high"?WALLPAPER_SOURCE_LIMIT_HIGH:WALLPAPER_SOURCE_LIMIT_BALANCED;const cacheKey=`${sourceLimit}:${url}`;const source=await wallpaperSourceCache.get(cacheKey,async()=>{const tone=await loadGlassWallpaperTone(url);const decodedSource=tone.corsReady?takeGlassWallpaperDecodedSource(url):void 0;let sourceTexture=null;let image=decodedSource?.image;if(!image){const loader=new three.TextureLoader;loader.setCrossOrigin("anonymous");sourceTexture=await loader.loadAsync(url);image=sourceTexture.image}const sourceWidth=image.naturalWidth||image.width;const sourceHeight=image.naturalHeight||image.height;const sourceLongEdge=Math.max(sourceWidth,sourceHeight);const uploadLongEdge=Math.min(sourceLongEdge,textureLimit,sourceLimit);const scale=Math.min(1,uploadLongEdge/sourceLongEdge);const textureCanvas=document.createElement("canvas");textureCanvas.width=Math.max(1,Math.round(sourceWidth*scale));textureCanvas.height=Math.max(1,Math.round(sourceHeight*scale));const textureContext=textureCanvas.getContext("2d");const preparedImage=textureContext?textureCanvas:image;if(textureContext)textureContext.drawImage(image,0,0,textureCanvas.width,textureCanvas.height);sourceTexture?.dispose();return{height:textureContext?textureCanvas.height:sourceHeight,image:preparedImage,toneProfile:decodedSource?.profile??tone.profile??analyzeGlassWallpaperTone(image,sourceWidth,sourceHeight),width:textureContext?textureCanvas.width:sourceWidth}});const texture=new three.Texture(source.image);texture.needsUpdate=true;const textureWidth=source.width;const textureHeight=source.height;texture.colorSpace=three.SRGBColorSpace;texture.generateMipmaps=false;texture.minFilter=three.LinearFilter;texture.magFilter=three.LinearFilter;let frostedTarget=null;try{if(preparesFrostedTexture){recordGlassRendererTiming(presentationSpace,"prefilter-start");frostedTarget=await createFrostedWallpaperTarget(texture,textureWidth,textureHeight,Math.max(textureWidth,textureHeight)*FROST_PREFILTER_SCALE);recordGlassRendererTiming(presentationSpace,"prefilter-ready")}}catch(error){console.warn("玻璃磨砂壁纸预滤失败，继续使用实时扩散采样:",error)}return{frostedTarget,hasWallpaperTexture:true,height:textureHeight,preparationKey,texture,toneProfile:source.toneProfile,width:textureWidth}}async function prepareWallpaper(url,revision){const version=++prepareVersion;releasePreparedWallpaper();clearPreparedWallpaperFailure();if(!url||!resources||contextRecoveryPending||url===toValue(options.wallpaperUrl))return;const preparationKey=getWallpaperPreparationKey(url);try{const prepared=await createWallpaperTexture(url);if(!prepared)return;if(version!==prepareVersion||!resources||contextRecoveryPending||preparationKey!==prepared.preparationKey||preparationKey!==getWallpaperPreparationKey(url)){disposeWallpaperResources(prepared.texture,prepared.frostedTarget);return}resources.renderer.initTexture(prepared.texture);recordGlassRendererTiming(presentationSpace,"prepare-compile-start");await resources.renderer.compileAsync(resources.scene,resources.camera);recordGlassRendererTiming(presentationSpace,"prepare-compile-ready");if(version!==prepareVersion||!resources||contextRecoveryPending||preparationKey!==getWallpaperPreparationKey(url)){disposeWallpaperResources(prepared.texture,prepared.frostedTarget);return}preparedWallpaper=prepared;preparedWallpaperUrl.value=url;preparedWallpaperRevision.value=revision;preparedWallpaperPreparationKey.value=preparationKey}catch(error){if(version===prepareVersion){failedWallpaperUrl.value=url;failedWallpaperRevision.value=revision;failedWallpaperPreparationKey.value=preparationKey;console.warn("玻璃光学壁纸预备失败，继续使用当前纹理:",error)}}}async function loadWallpaper(url,version,beforeActivate){if(!resources||!three||!url)return;const prepared=await createWallpaperTexture(url);if(!prepared)return;if(version!==loadVersion||!resources||contextRecoveryPending||prepared.preparationKey!==getWallpaperPreparationKey(url)){disposeWallpaperResources(prepared.texture,prepared.frostedTarget);return}await resources.renderer.compileAsync(resources.scene,resources.camera);if(version!==loadVersion||!resources||contextRecoveryPending||prepared.preparationKey!==getWallpaperPreparationKey(url)){disposeWallpaperResources(prepared.texture,prepared.frostedTarget);return}const timestamp=performance.now();beforeActivate?.();activateLoadedTexture(prepared.texture,prepared.frostedTarget,prepared.width,prepared.height,prepared.hasWallpaperTexture,prepared.toneProfile);updateSurfaceUniforms(timestamp,false);resetInteractionState();renderFrame(timestamp,false);activeWallpaperUrl.value=url;activeWallpaperRevision.value=0;activeWallpaperPreparationKey.value=prepared.preparationKey;updateRendererState("ready");scheduleWallpaperTransition()}function canActivatePreparedWallpaper(url,revision,preparationKey){return Boolean(resources&&!contextRecoveryPending&&state.value==="ready"&&preparedWallpaper&&preparedWallpaperUrl.value===url&&preparedWallpaperRevision.value===revision&&preparedWallpaperPreparationKey.value===preparationKey&&preparationKey===getWallpaperPreparationKey(url))}function activatePreparedWallpaper(url,revision,preparationKey,startedAt){if(!canActivatePreparedWallpaper(url,revision,preparationKey)||!preparedWallpaper)return false;const rollback={activatedRevision:revision,activatedUrl:url,previousHasWallpaperTexture:activeHasWallpaperTexture,previousPreparationKey:activeWallpaperPreparationKey.value,previousRevision:activeWallpaperRevision.value,previousUrl:activeWallpaperUrl.value};const prepared=preparedWallpaper;preparedWallpaper=null;preparedWallpaperUrl.value="";preparedWallpaperRevision.value=0;preparedWallpaperPreparationKey.value="";loadVersion+=1;activateLoadedTexture(prepared.texture,prepared.frostedTarget,prepared.width,prepared.height,prepared.hasWallpaperTexture,prepared.toneProfile,startedAt,true);wallpaperActivationRollback=previousTexture?rollback:null;activeWallpaperUrl.value=url;activeWallpaperRevision.value=revision;activeWallpaperPreparationKey.value=preparationKey;updateSurfaceUniforms(startedAt,false);resetInteractionState();renderFrame(startedAt,false);updateRendererState("ready");scheduleWallpaperTransition();return true}function rollbackPreparedWallpaperActivation(url,revision){const rollback=wallpaperActivationRollback;if(!resources||!activeTexture||!previousTexture||!rollback||rollback.activatedUrl!==url||rollback.activatedRevision!==revision||activeWallpaperUrl.value!==url||activeWallpaperRevision.value!==revision){return false}cancelWallpaperTransitionFrame();const rejectedTexture=activeTexture;const rejectedFrostedTarget=activeFrostedTarget;activeTexture=previousTexture;activeFrostedTarget=previousFrostedTarget;activeTextureHeight=previousTextureHeight;activeTextureWidth=previousTextureWidth;activeWallpaperExposure=previousWallpaperExposure;previousTexture=null;previousFrostedTarget=null;previousTextureHeight=activeTextureHeight;previousTextureWidth=activeTextureWidth;previousWallpaperExposure=activeWallpaperExposure;wallpaperTransitionStartedAt=0;wallpaperActivationRollback=null;activeWallpaperUrl.value=rollback.previousUrl;activeWallpaperRevision.value=rollback.previousRevision;activeWallpaperPreparationKey.value=rollback.previousPreparationKey;resources.uniforms.uTexture.value=activeTexture;resources.uniforms.uFrostedTexture.value=activeFrostedTarget?.texture??activeTexture;resources.uniforms.uPreviousTexture.value=activeTexture;resources.uniforms.uPreviousFrostedTexture.value=activeFrostedTarget?.texture??activeTexture;resources.uniforms.uWallpaperExposure.value=activeWallpaperExposure;resources.uniforms.uPreviousWallpaperExposure.value=activeWallpaperExposure;resources.uniforms.uTextureMix.value=1;activeHasWallpaperTexture=rollback.previousHasWallpaperTexture;syncWallpaperSamplingMode();resources.uniforms.uHasFrostedTexture.value=rollback.previousHasWallpaperTexture&&activeFrostedTarget?1:0;syncCoverScale();resetInteractionState();disposeWallpaperResources(rejectedTexture,rejectedFrostedTarget);renderFrame(performance.now(),false);return true}async function initializeRenderer(releaseContext=true){disposeRenderer(releaseContext);if(!toValue(options.active)||!options.canvas.value)return;if(!window.WebGLRenderingContext||reducedTransparencyQuery.matches||!toValue(options.wallpaperUrl)){updateRendererState("fallback");return}updateRendererState("loading");const version=++loadVersion;try{three=await __vitePreload(()=>import("./three.module-CMVV10BP.js"),true?[]:void 0,import.meta.url);recordGlassRendererTiming(presentationSpace,"three-ready");if(version!==loadVersion||!options.canvas.value)return;const Vector4Class=three.Vector4;const canvas=options.canvas.value;const context=prepareGlassWebGLContext(canvas);const renderer=new three.WebGLRenderer({alpha:true,antialias:false,canvas,...context?{context}:{},powerPreference:"high-performance",premultipliedAlpha:true});recordGlassRendererTiming(presentationSpace,"context-ready");renderer.setClearColor(0,0);renderer.setPixelRatio(1);const geometry=new three.BufferGeometry;geometry.setAttribute("position",new three.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const materialResponse=getMaterialResponse();const uniforms={uAppearance:{value:getGlassAppearanceUniformValue(toValue(options.appearance))},uBackgroundVisibility:{value:materialResponse.backgroundVisibility},uCoverScale:{value:new three.Vector2(1,1)},uDeformationStrength:{value:getDeformationStrengthScale()},uDynamicsOnly:{value:usesDynamicsOnly()?1:0},uDynamicsMode:{value:getDynamicsModeUniformValue()},uFlowTexture:{value:null},uFlowStrength:{value:getFlowStrengthScale()},uHasFlowTexture:{value:0},uHasFrostedTexture:{value:0},uHasRippleTexture:{value:0},uHasWallpaperTexture:{value:0},uInteractionRadii:{value:Array.from({length:8},()=>new Vector4Class)},uInteractionRectCount:{value:0},uInteractionRects:{value:Array.from({length:8},()=>new Vector4Class)},uMotion:{value:0},uMotionExpansion:{value:getMotionExpansion()},uMaxRefractionPixels:{value:getMaxRefractionPixels()},uPointer:{value:new three.Vector2(.5,.5)},uPointerVelocity:{value:new three.Vector2(0,0)},uPresentationSize:{value:new three.Vector2(window.innerWidth,window.innerHeight)},uPreviousCoverScale:{value:new three.Vector2(1,1)},uPreviousWallpaperExposure:{value:DEFAULT_GLASS_WALLPAPER_TONE_PROFILE.exposure},uQuality:{value:toValue(options.quality)==="high"?1:0},uReflectionStrength:{value:getReflectionStrengthScale()},uRippleDeformationStrength:{value:hasRippleCapability()?Math.min(1,Math.max(0,toValue(options.deformationStrength??getLegacyDynamicStrength())/100)):0},uRippleTexelSize:{value:new three.Vector2(1,1)},uRippleTexture:{value:null},uRadii:{value:Array.from({length:8},()=>new Vector4Class)},uRectCount:{value:0},uRects:{value:Array.from({length:8},()=>new Vector4Class)},uSurfaceWeights:{value:Array.from({length:8},()=>0)},uSurfaceDynamics:{value:Array.from({length:8},()=>1)},uPreviousTexture:{value:null},uPreviousFrostedTexture:{value:null},uTexture:{value:null},uFrostedTexture:{value:null},uTextureMix:{value:1},uWallpaperExposure:{value:DEFAULT_GLASS_WALLPAPER_TONE_PROFILE.exposure},uTintColor:{value:new three.Color(toValue(options.tintColor))},uFrostDetailLevel:{value:materialResponse.frostDetailLevel},uSurfaceDensity:{value:materialResponse.surfaceDensity},uTintDensity:{value:materialResponse.tintDensity},uTransmissionStrength:{value:getGlassOpticalTransmissionStrength(toValue(options.transmissionStrength??GLASS_OPTICAL_STRENGTH_DEFAULT))},uTranslationStrength:{value:getTranslationStrengthScale()},uTrail:{value:Array.from({length:4},()=>new Vector4Class(.5,.5,0,0))},uTrailCount:{value:hasFluidCapability()?getRenderProfile().trailCount:0},uVisibleViewportSize:{value:new three.Vector2(window.innerWidth,window.innerHeight)},uScrollOffset:{value:new three.Vector2(0,0)},uWakeDirection:{value:new three.Vector2(0,-1)}};const material=new three.ShaderMaterial({depthTest:false,depthWrite:false,fragmentShader:FRAGMENT_SHADER,transparent:true,uniforms,vertexShader:VERTEX_SHADER});const scene=new three.Scene;const camera=new three.OrthographicCamera(-1,1,1,-1,0,1);const mesh=new three.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh);resources={camera,geometry,material,mesh,renderer,scene,uniforms};const ownerResources=resources;setupContextEvents(canvas);syncFluidDynamics();await syncRippleResources();if(version!==loadVersion||resources!==ownerResources||!toValue(options.active)||options.canvas.value!==canvas){return}setupObservers();setupEvents();resizeRenderer();await loadWallpaper(toValue(options.wallpaperUrl),version);preparePendingWallpaper()}catch(error){fallbackFromCurrentLoad(version,"玻璃光学渲染器初始化失败，已回退标准材质:",error)}}function retryAfterFailure(){if(contextRecoveryPending)return Promise.resolve();return initializeRenderer()}function handleReducedTransparencyChange(event){if(!toValue(options.active))return;if(event.matches){disposeRenderer();updateRendererState("fallback");return}void initializeRenderer()}const reducedTransparencyQuery=matchMedia("(prefers-reduced-transparency: reduce)");reducedTransparencyQuery.addEventListener("change",handleReducedTransparencyChange);document.addEventListener("visibilitychange",handleVisibilityChange);window.addEventListener("blur",handleWindowBlur);window.addEventListener("focus",handleWindowResume);window.addEventListener("pageshow",handleWindowResume);watch$1(()=>[toValue(options.active),toValue(options.wallpaperUrl)],async([active,wallpaperUrl],previous)=>{if(!active){disposeRenderer();return}if(resources&&wallpaperUrl!==previous?.[1]){if(activeWallpaperUrl.value===wallpaperUrl&&activeWallpaperPreparationKey.value===getWallpaperPreparationKey(wallpaperUrl)){scheduleWallpaperTransition();return}await refreshWallpaper("玻璃光学壁纸纹理加载失败，已保留当前材质:");return}if(!resources){await nextTick();await initializeRenderer()}},{immediate:true});watch$1(()=>[toValue(options.pendingWallpaperUrl??""),toValue(options.pendingWallpaperRevision??0)],([pendingWallpaperUrl,pendingWallpaperRevision])=>{void prepareWallpaper(pendingWallpaperUrl,pendingWallpaperRevision)},{immediate:true});watch$1(()=>toValue(options.previousWallpaperUrl??""),previousWallpaperUrl=>{if(previousWallpaperUrl||!resources||!activeTexture)return;finishWallpaperTransition();renderFrame(performance.now(),false)},{flush:"sync"});watch$1(()=>toValue(options.appearance),async(appearance,previousAppearance)=>{if(!resources)return;const applyAppearance=()=>{if(!resources||toValue(options.appearance)!==appearance)return;const materialResponse=getGlassMaterialResponse(appearance,toValue(options.transparencyStrength??GLASS_OPTICAL_STRENGTH_DEFAULT));resources.uniforms.uAppearance.value=getGlassAppearanceUniformValue(appearance);resources.uniforms.uBackgroundVisibility.value=materialResponse.backgroundVisibility;resources.uniforms.uDynamicsOnly.value=usesDynamicsOnly()?1:0;resources.uniforms.uFrostDetailLevel.value=materialResponse.frostDetailLevel;resources.uniforms.uSurfaceDensity.value=materialResponse.surfaceDensity;resources.uniforms.uTintDensity.value=materialResponse.tintDensity};const wallpaperUrl=toValue(options.wallpaperUrl);const quality=toValue(options.quality);const routeKey=toValue(options.routeKey);const previousKey=getGlassWallpaperPreparationKey(previousAppearance??appearance,quality,routeKey,wallpaperUrl);const nextKey=getGlassWallpaperPreparationKey(appearance,quality,routeKey,wallpaperUrl);if(previousKey!==nextKey){invalidatePreparedWallpaper();await refreshWallpaper("玻璃材质纹理切换失败，已保留当前材质:",applyAppearance);if(toValue(options.appearance)===appearance)preparePendingWallpaper();return}applyAppearance();scheduleSurfaceStabilityUpdate()});watch$1(()=>[toValue(options.dynamicsActive??true),toValue(options.dynamicsMode??"fluid")],async()=>{if(!resources)return;const version=loadVersion;try{await syncDynamicsMode()}catch(error){fallbackFromCurrentLoad(version,"玻璃动态策略切换失败，已回退标准材质:",error)}});watch$1(()=>toValue(options.quality),async(quality,previousQuality)=>{if(!resources)return;const previousProfile=getGlassOpticalRenderProfile(previousQuality,toValue(options.routeKey));const nextProfile=getGlassOpticalRenderProfile(quality,toValue(options.routeKey));const applyQuality=()=>{if(!resources||toValue(options.quality)!==quality)return;resources.uniforms.uMaxRefractionPixels.value=getMaxRefractionPixels();resources.uniforms.uQuality.value=quality==="high"?1:0;resources.uniforms.uTrailCount.value=hasFluidCapability()?nextProfile.trailCount:0;interactionAnimating=false;cancelScheduledFrame();resetInteractionState();if(hasRippleCapability())disposeRippleResources()};const finishQualityChange=async()=>{if(!resources||toValue(options.quality)!==quality)return;await syncDynamicsMode()};if(!profileRequiresTextureReload(previousProfile,nextProfile)){applyQuality();try{await finishQualityChange()}catch(error){fallbackFromCurrentLoad(loadVersion,"玻璃动态质量切换失败，已回退标准材质:",error)}return}invalidatePreparedWallpaper();await refreshWallpaper("玻璃光学质量切换失败，已保留当前材质:",applyQuality);if(toValue(options.quality)===quality){try{await finishQualityChange()}catch(error){fallbackFromCurrentLoad(loadVersion,"玻璃动态质量切换失败，已回退标准材质:",error);return}preparePendingWallpaper()}});watch$1(()=>toValue(options.tintColor),tintColor=>{if(!resources)return;resources.uniforms.uTintColor.value.set(tintColor);scheduleFrame()});watch$1(()=>[toValue(options.translationStrength??getLegacyDynamicStrength()),toValue(options.deformationStrength??getLegacyDynamicStrength()),toValue(options.flowStrength??getLegacyDynamicStrength()),toValue(options.reflectionStrength??GLASS_OPTICAL_STRENGTH_DEFAULT),toValue(options.transparencyStrength??GLASS_OPTICAL_STRENGTH_DEFAULT),toValue(options.transmissionStrength??GLASS_OPTICAL_STRENGTH_DEFAULT)],([translationStrength,deformationStrength,flowStrength,reflectionStrength,transparencyStrength,transmissionStrength])=>{if(!resources)return;const fluidActive=hasFluidCapability();resources.uniforms.uTranslationStrength.value=fluidActive?getGlassOpticalTranslationStrengthScale(translationStrength):0;resources.uniforms.uDeformationStrength.value=fluidActive?getGlassOpticalDeformationStrengthScale(deformationStrength):0;resources.uniforms.uFlowStrength.value=fluidActive?getGlassOpticalFlowStrengthScale(flowStrength):0;resources.uniforms.uMotionExpansion.value=fluidActive?getGlassOpticalMotionExpansion(flowStrength):0;resources.uniforms.uMaxRefractionPixels.value=getMaxRefractionPixels();resources.uniforms.uRippleDeformationStrength.value=hasRippleCapability()?Math.min(1,Math.max(0,deformationStrength/100)):0;rippleResources?.setParameters(translationStrength,flowStrength);resources.uniforms.uReflectionStrength.value=getGlassOpticalReflectionStrengthScale(reflectionStrength);const materialResponse=getGlassMaterialResponse(toValue(options.appearance),transparencyStrength);resources.uniforms.uBackgroundVisibility.value=materialResponse.backgroundVisibility;resources.uniforms.uFrostDetailLevel.value=materialResponse.frostDetailLevel;resources.uniforms.uSurfaceDensity.value=materialResponse.surfaceDensity;resources.uniforms.uTintDensity.value=materialResponse.tintDensity;resources.uniforms.uTransmissionStrength.value=getGlassOpticalTransmissionStrength(transmissionStrength);if(fluidActive&&resources.uniforms.uFlowStrength.value<=0&&interactionAnimating){interactionAnimating=false;cancelScheduledFrame();pendingFlowInjection=0;for(const trail of resources.uniforms.uTrail.value)trail.z=0}scheduleFrame()});watch$1(()=>toValue(options.pageMotion?.revision??0),()=>{if(!resources||presentationSpace!=="scroll")return;const timestamp=performance.now();resizeRenderer();updateSurfaceUniforms(timestamp,false);renderFrame(timestamp,false)},{flush:"sync"});watch$1(()=>[toValue(options.pageMotion?.active??false),toValue(options.pageMotion?.epoch??0)],([motionActive,motionEpoch])=>{if(!resources||presentationSpace!=="scroll"||!motionActive)return;pagePresentationGeometryReady=false;scheduleSurfaceStabilityUpdate(motionEpoch)},{flush:"sync"});watch$1(()=>toValue(options.routeKey),async(routeKey,previousRouteKey)=>{const previousProfile=getRenderProfile(previousRouteKey??"");const wallpaperUrl=toValue(options.wallpaperUrl);const appearance=toValue(options.appearance);const quality=toValue(options.quality);const previousKey=getGlassWallpaperPreparationKey(appearance,quality,previousRouteKey??"",wallpaperUrl);const nextKey=getGlassWallpaperPreparationKey(appearance,quality,routeKey,wallpaperUrl);if(previousKey!==nextKey)invalidatePreparedWallpaper();if(resources&&presentationSpace==="scroll"&&options.pageMotion){pagePresentationGeometryReady=false;pagePresentationMotionEpoch=toValue(options.pageMotion.epoch);const timestamp=performance.now();updateSurfaceUniforms(timestamp,false);renderFrame(timestamp,false)}await nextTick();if(resources){const nextProfile=getRenderProfile(routeKey);resizeRenderer();if(profileRequiresTextureReload(previousProfile,nextProfile)){await refreshWallpaper("玻璃场景纹理切换失败，已保留当前材质:",resizeRenderer);if(toValue(options.routeKey)===routeKey)preparePendingWallpaper();return}}if(presentationSpace==="scroll"&&options.pageMotion){scheduleSurfaceStabilityUpdate(toValue(options.pageMotion.epoch))}else scheduleSurfaceUpdate()});onScopeDispose$1(()=>{reducedTransparencyQuery.removeEventListener("change",handleReducedTransparencyChange);document.removeEventListener("visibilitychange",handleVisibilityChange);window.removeEventListener("blur",handleWindowBlur);window.removeEventListener("focus",handleWindowResume);window.removeEventListener("pageshow",handleWindowResume);disposeRenderer()});return{activatePreparedWallpaper,activeWallpaperPreparationKey,activeWallpaperRevision,activeWallpaperUrl,canActivatePreparedWallpaper,failedWallpaperPreparationKey,failedWallpaperRevision,failedWallpaperUrl,preparedWallpaperPreparationKey,preparedWallpaperUrl,preparedWallpaperRevision,renderedFrames,retryAfterFailure,rollbackPreparedWallpaperActivation,state}}const{defineComponent:_defineComponent}=await importShared("vue");const{unref:_unref,createElementVNode:_createElementVNode,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock}=await importShared("vue");const _hoisted_1=["data-state"];const _hoisted_2=["data-state"];const{ref,computed,watch,watchEffect,onScopeDispose}=await importShared("vue");_sfc_main=_defineComponent({__name:"GlassOpticalLayer",props:{appearance:{},deformationStrength:{},flowStrength:{},dynamicsMode:{},quality:{},reflectionStrength:{},transparencyStrength:{},transmissionStrength:{},translationStrength:{},routeKey:{},tintColor:{},transitionDuration:{},transitionStartedAt:{},wallpaperUrl:{},previousWallpaperUrl:{},pendingWallpaperUrl:{},pendingWallpaperRevision:{},activateWallpaperRevision:{}},emits:["wallpaperPrepared","wallpaperPreparationFailed","wallpaperActivated","wallpaperActivationFailed"],setup(__props,{emit:__emit}){const props=__props;const emit=__emit;const fixedCanvas=ref(null);const scrollCanvas=ref(null);const usesMobilePresentation=useGlassMobilePresentation();const preferredMotion=usePreferredReducedMotion();const compositeFailureLatched=ref(false);const compositeRecoveryPending=ref(false);const presentationMode=computed(()=>usesMobilePresentation.value||preferredMotion.value==="reduce"?"off":props.dynamicsMode);const effectiveDynamicsMode=computed(()=>compositeFailureLatched.value?"off":presentationMode.value);const dynamicsActive=computed(()=>effectiveDynamicsMode.value!=="off");const interactionSource=useGlassOpticalInteractionSource(dynamicsActive);const pagePresentationMotion=usePagePresentationMotion();const wallpaperSourceCache=createGlassWallpaperSourceCache();const fixedRenderer=useGlassOpticalRenderer({active:true,appearance:()=>props.appearance,canvas:fixedCanvas,deformationStrength:()=>props.deformationStrength,dynamicsActive,dynamicsMode:effectiveDynamicsMode,flowStrength:()=>props.flowStrength,interactionSource,quality:()=>props.quality,reflectionStrength:()=>props.reflectionStrength,transparencyStrength:()=>props.transparencyStrength,transmissionStrength:()=>props.transmissionStrength,translationStrength:()=>props.translationStrength,routeKey:()=>props.routeKey,tintColor:()=>props.tintColor,transitionDuration:()=>props.transitionDuration,transitionStartedAt:()=>props.transitionStartedAt,wallpaperUrl:()=>props.wallpaperUrl,wallpaperSourceCache,previousWallpaperUrl:()=>props.previousWallpaperUrl,pendingWallpaperUrl:()=>props.pendingWallpaperUrl??"",pendingWallpaperRevision:()=>props.pendingWallpaperRevision??0,surfaceSpace:"fixed",syncDocumentState:false});const scrollRenderer=useGlassOpticalRenderer({active:true,appearance:()=>props.appearance,canvas:scrollCanvas,deformationStrength:()=>props.deformationStrength,dynamicsActive,dynamicsMode:effectiveDynamicsMode,flowStrength:()=>props.flowStrength,interactionSource,pageMotion:pagePresentationMotion.reader,quality:()=>props.quality,reflectionStrength:()=>props.reflectionStrength,transparencyStrength:()=>props.transparencyStrength,transmissionStrength:()=>props.transmissionStrength,translationStrength:()=>props.translationStrength,routeKey:()=>props.routeKey,tintColor:()=>props.tintColor,transitionDuration:()=>props.transitionDuration,transitionStartedAt:()=>props.transitionStartedAt,wallpaperUrl:()=>props.wallpaperUrl,wallpaperSourceCache,previousWallpaperUrl:()=>props.previousWallpaperUrl,pendingWallpaperUrl:()=>props.pendingWallpaperUrl??"",pendingWallpaperRevision:()=>props.pendingWallpaperRevision??0,surfaceSpace:"scroll",syncDocumentState:false});function retryCompositeRenderers(){compositeRecoveryPending.value=true;compositeFailureLatched.value=false;void Promise.allSettled([fixedRenderer.retryAfterFailure(),scrollRenderer.retryAfterFailure()])}watch(()=>props.dynamicsMode,(mode,previousMode)=>{if(mode===previousMode||!compositeFailureLatched.value&&!compositeRecoveryPending.value)return;retryCompositeRenderers()});const rendererState=ref("loading");watchEffect(()=>{const states=[fixedRenderer.state.value,scrollRenderer.state.value];const allReady=states.every(value=>value==="ready");const anyFallback=states.some(value=>value==="fallback");const anyLoading=states.some(value=>value==="loading");if(compositeRecoveryPending.value){if(allReady)compositeRecoveryPending.value=false;else if(anyFallback&&!anyLoading){compositeRecoveryPending.value=false;compositeFailureLatched.value=true}}else if(anyFallback)compositeFailureLatched.value=true;else if(compositeFailureLatched.value&&allReady)compositeFailureLatched.value=false;const state=compositeRecoveryPending.value?"loading":compositeFailureLatched.value?"fallback":allReady?"ready":"loading";setGlassRendererState(rendererState,state)});watchEffect(()=>{document.documentElement.dataset.glassDynamicsMode=props.dynamicsMode;document.documentElement.dataset.glassDynamicsEffectiveMode=effectiveDynamicsMode.value});let lastPreparedAcknowledgement="";watchEffect(()=>{const url=props.pendingWallpaperUrl;const revision=props.pendingWallpaperRevision??0;const preparationKey=getGlassWallpaperPreparationKey(props.appearance,props.quality,props.routeKey,url??"");const acknowledgement=`${revision}:${preparationKey}:${url}`;const prepared=Boolean(url)&&revision>0&&fixedRenderer.state.value==="ready"&&scrollRenderer.state.value==="ready"&&fixedRenderer.preparedWallpaperUrl.value===url&&fixedRenderer.preparedWallpaperRevision.value===revision&&fixedRenderer.preparedWallpaperPreparationKey.value===preparationKey&&scrollRenderer.preparedWallpaperUrl.value===url&&scrollRenderer.preparedWallpaperRevision.value===revision&&scrollRenderer.preparedWallpaperPreparationKey.value===preparationKey;if(prepared&&acknowledgement!==lastPreparedAcknowledgement){lastPreparedAcknowledgement=acknowledgement;emit("wallpaperPrepared",url,revision)}});let lastPreparationFailedAcknowledgement="";watchEffect(()=>{const url=props.pendingWallpaperUrl??"";const revision=props.pendingWallpaperRevision??0;const preparationKey=getGlassWallpaperPreparationKey(props.appearance,props.quality,props.routeKey,url);const acknowledgement=`${revision}:${preparationKey}:${url}`;const failed=[fixedRenderer,scrollRenderer].some(renderer=>renderer.failedWallpaperUrl.value===url&&renderer.failedWallpaperRevision.value===revision&&renderer.failedWallpaperPreparationKey.value===preparationKey);if(url&&revision>0&&failed&&acknowledgement!==lastPreparationFailedAcknowledgement){lastPreparationFailedAcknowledgement=acknowledgement;emit("wallpaperPreparationFailed",url,revision)}});let activationFrame=null;let scheduledActivation="";let lastActivatedAcknowledgement="";let lastFailedAcknowledgement="";function rollbackWallpaperActivation(url,revision){for(const renderer of[fixedRenderer,scrollRenderer]){try{renderer.rollbackPreparedWallpaperActivation(url,revision)}catch{}}}watchEffect(()=>{const url=props.pendingWallpaperUrl;const revision=props.pendingWallpaperRevision??0;const activationRevision=props.activateWallpaperRevision??0;const preparationKey=getGlassWallpaperPreparationKey(props.appearance,props.quality,props.routeKey,url??"");const acknowledgement=`${revision}:${preparationKey}:${url}`;const canActivate=Boolean(url)&&revision>0&&activationRevision===revision&&fixedRenderer.state.value==="ready"&&scrollRenderer.state.value==="ready"&&fixedRenderer.preparedWallpaperUrl.value===url&&fixedRenderer.preparedWallpaperRevision.value===revision&&fixedRenderer.preparedWallpaperPreparationKey.value===preparationKey&&scrollRenderer.preparedWallpaperUrl.value===url&&scrollRenderer.preparedWallpaperRevision.value===revision&&scrollRenderer.preparedWallpaperPreparationKey.value===preparationKey;if(!canActivate||acknowledgement===lastActivatedAcknowledgement||acknowledgement===lastFailedAcknowledgement||acknowledgement===scheduledActivation){return}if(activationFrame!==null)cancelAnimationFrame(activationFrame);scheduledActivation=acknowledgement;activationFrame=requestAnimationFrame(startedAt=>{activationFrame=null;scheduledActivation="";const currentUrl=props.pendingWallpaperUrl??"";const currentRevision=props.pendingWallpaperRevision??0;const currentPreparationKey=getGlassWallpaperPreparationKey(props.appearance,props.quality,props.routeKey,currentUrl);const currentAcknowledgement=`${currentRevision}:${currentPreparationKey}:${currentUrl}`;if(currentAcknowledgement!==acknowledgement||props.activateWallpaperRevision!==currentRevision||!fixedRenderer.canActivatePreparedWallpaper(currentUrl,currentRevision,currentPreparationKey)||!scrollRenderer.canActivatePreparedWallpaper(currentUrl,currentRevision,currentPreparationKey)){return}try{const fixedActivated=fixedRenderer.activatePreparedWallpaper(currentUrl,currentRevision,currentPreparationKey,startedAt);const scrollActivated=fixedActivated&&scrollRenderer.activatePreparedWallpaper(currentUrl,currentRevision,currentPreparationKey,startedAt);if(!fixedActivated||!scrollActivated){rollbackWallpaperActivation(currentUrl,currentRevision);lastFailedAcknowledgement=acknowledgement;emit("wallpaperActivationFailed",currentUrl,currentRevision);return}}catch{rollbackWallpaperActivation(currentUrl,currentRevision);lastFailedAcknowledgement=acknowledgement;emit("wallpaperActivationFailed",currentUrl,currentRevision);return}lastActivatedAcknowledgement=acknowledgement;emit("wallpaperActivated",currentUrl,currentRevision,startedAt)})});onScopeDispose(()=>{if(activationFrame!==null)cancelAnimationFrame(activationFrame);delete document.documentElement.dataset.glassDynamicsMode;delete document.documentElement.dataset.glassDynamicsEffectiveMode;setGlassRendererState(rendererState,"fallback")});return(_ctx,_cache)=>{return _openBlock(),_createElementBlock(_Fragment,null,[_createElementVNode("canvas",{ref_key:"fixedCanvas",ref:fixedCanvas,class:"glass-optical-layer glass-optical-layer--fixed","aria-hidden":"true","data-presentation-space":"fixed","data-state":_unref(fixedRenderer).state.value},null,8,_hoisted_1),_createElementVNode("canvas",{ref_key:"scrollCanvas",ref:scrollCanvas,class:"glass-optical-layer glass-optical-layer--scroll","aria-hidden":"true","data-presentation-space":"scroll","data-state":_unref(scrollRenderer).state.value},null,8,_hoisted_2)],64)}}})});export{_sfc_main as default,__mp_tla};