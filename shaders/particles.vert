// Vertex Shader for GPU Particle System
// Handles particle interpolation between dispersed state and image contour

attribute vec3 aTarget;   // target position on image contour
attribute float aSize;    // per-particle size variation

uniform float uProgress;  // 0.0 = dispersed, 1.0 = formed as image
uniform float uTime;      // elapsed time for organic noise motion
uniform vec2 uResolution; // canvas resolution for point size correction

void main() {
  // Interpolate between random position and image contour target
  vec3 pos = mix(position, aTarget, uProgress);

  // Organic noise displacement when dispersed (decays as uProgress approaches 1)
  float noise = sin(uTime * 0.5 + position.x * 3.0) *
                cos(uTime * 0.3 + position.y * 2.0);
  pos.x += noise * (1.0 - uProgress) * 0.02;
  pos.y += noise * (1.0 - uProgress) * 0.015;

  // Additional drift when dispersed
  float drift = sin(uTime * 0.2 + position.z * 5.0) * (1.0 - uProgress) * 0.01;
  pos.y += drift;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  // Size: base + slight grow when formed
  gl_PointSize = aSize * (1.0 + uProgress * 0.5);

  // Distance attenuation for perspective-like feel
  gl_PointSize *= (1.0 / -gl_Position.z);
}
