// Fragment Shader for GPU Particle System
// Renders soft circular particles with dark/light mode color support

uniform float uProgress;  // 0.0 = dispersed, 1.0 = formed
uniform float uDarkMode;  // 1.0 = dark mode, 0.0 = light mode

void main() {
  // Compute distance from center of point sprite
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Soft circle with anti-aliased edge
  float alpha = 1.0 - smoothstep(0.35, 0.5, dist);

  if (alpha < 0.01) discard;

  // Color: [dark mode] white → cyan-blue when formed
  //        [light mode] dark-gray → blue-purple when formed
  vec3 dispersedColorDark  = vec3(0.7, 0.7, 0.8);
  vec3 formedColorDark     = vec3(0.3, 0.8, 1.0);  // cyan-blue

  vec3 dispersedColorLight = vec3(0.3, 0.3, 0.4);
  vec3 formedColorLight    = vec3(0.1, 0.3, 0.9);  // deep blue

  vec3 dispersedColor = mix(dispersedColorLight, dispersedColorDark, uDarkMode);
  vec3 formedColor    = mix(formedColorLight, formedColorDark, uDarkMode);

  vec3 color = mix(dispersedColor, formedColor, uProgress);

  // Final alpha modulated by progress (more opaque when formed)
  float finalAlpha = alpha * mix(0.5, 1.0, uProgress);

  gl_FragColor = vec4(color, finalAlpha);
}
