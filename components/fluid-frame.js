AFRAME.registerComponent('fluid-frame', {
  schema: {
    minScale: {type: 'number', default: 0.5},
    maxScale: {type: 'number', default: 2},
    scaleThreshold: {type: 'number', default: 1000}
  },

  init: function() {
    this.updateScale = this.updateScale.bind(this);
    window.addEventListener('resize', this.updateScale);
    this.updateScale();
  },

  remove: function() {
    window.removeEventListener('resize', this.updateScale);
  },

updateScale: function() {
    var data = this.data;
    var el = this.el;
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    
    // Calculate scale based on both width and aspect ratio
    var widthScale = Math.max(data.minScale, Math.min(width / data.scaleThreshold, data.maxScale));
    var aspectScale = Math.max(data.minScale, Math.min(aspectRatio, data.maxScale));
    
    var finalScale = (widthScale + aspectScale) / 2;
    
    el.object3D.scale.set(finalScale, finalScale, finalScale);
    
    // Emit an event for other components to react to scale changes
    el.emit('scaleChanged', {scale: finalScale});
  }
});
