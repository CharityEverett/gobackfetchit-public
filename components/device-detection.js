AFRAME.registerComponent('device-detector', {
  init: function () {
    this.detectDevice();
    this.el.addEventListener('enter-vr', this.detectDevice.bind(this));
    this.el.addEventListener('exit-vr', this.detectDevice.bind(this));
  },
  
  detectDevice: function () {
    var isVR = this.el.is('vr-mode');
    var isMobile = AFRAME.utils.device.isMobile();
    var isTablet = AFRAME.utils.device.isTablet();

    var deviceType = isVR ? 'vr' : (isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop'));

    this.el.setAttribute('device-type', deviceType);
    this.el.emit('deviceDetected', { deviceType: deviceType });
  }
});


  init: function () {
    this.deviceType = this.detectDeviceType();
    this.el.setAttribute('device-type', this.deviceType);
    
    // Emit an event with the detected device type
    this.el.emit('deviceDetected', { deviceType: this.deviceType });
  },

  detectDeviceType: function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    var isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isTablet) return 'tablet';
    if (isMobile) return 'mobile';
    return 'desktop';
  },

  // Utility methods to check device type
  isMobile: function () {
    return this.deviceType === 'mobile';
  },

  isTablet: function () {
    return this.deviceType === 'tablet';
  },

  isDesktop: function () {
    return this.deviceType === 'desktop';
  },

  // Method to adjust component behavior based on device type
  adjustComponentBehavior: function (component) {
    switch (this.deviceType) {
      case 'mobile':
        // Adjust for mobile
        component.el.setAttribute('scale', '0.5 0.5 0.5');
        break;
      case 'tablet':
        // Adjust for tablet
        component.el.setAttribute('scale', '0.75 0.75 0.75');
        break;
      case 'desktop':
        // Adjust for desktop
        component.el.setAttribute('scale', '1 1 1');
        break;
    }
  }
});

// Usage example:
// <a-scene device-detector>
//   <a-box device-adjustable position="0 1.5 -3" color="#4CC3D9"></a-box>
// </a-scene>

AFRAME.registerComponent('device-adjustable', {
  dependencies: ['device-detector'],

  init: function () {
    var deviceDetector = this.el.sceneEl.components['device-detector'];
    deviceDetector.adjustComponentBehavior(this);
  }
});

AFRAME.registerComponent('device-listener', {
  init: function () {
    var el = this.el;
    el.sceneEl.addEventListener('deviceDetected', function (event) {
      console.log('Detected device type:', event.detail.deviceType);
      // Perform custom actions based on device type
    });
  }
});

AFRAME.registerComponent('fluid-frame', {
  dependencies: ['device-detector'],

  schema: {
    minScale: {type: 'number', default: 0.5},
    maxScale: {type: 'number', default: 2},
    scaleThreshold: {type: 'number', default: 1000},
    mobileScale: {type: 'number', default: 0.7},
    tabletScale: {type: 'number', default: 0.85},
    vrScale: {type: 'number', default: 1}
  },

  init: function() {
    this.updateScale = this.updateScale.bind(this);
    window.addEventListener('resize', this.updateScale);
    this.el.sceneEl.addEventListener('deviceDetected', this.updateScale);
    this.updateScale();
  },

  remove: function() {
    window.removeEventListener('resize', this.updateScale);
    this.el.sceneEl.removeEventListener('deviceDetected', this.updateScale);
  },

  updateScale: function() {
    var data = this.data;
    var el = this.el;
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    
    var deviceType = this.el.sceneEl.getAttribute('device-type');
    var deviceScale = data[deviceType + 'Scale'] || 1;
    
    var widthScale = Math.max(data.minScale, Math.min(width / data.scaleThreshold, data.maxScale));
    var aspectScale = Math.max(data.minScale, Math.min(aspectRatio, data.maxScale));
    
    var finalScale = ((widthScale + aspectScale) / 2) * deviceScale;
    
    el.object3D.scale.set(finalScale, finalScale, finalScale);
    
    el.emit('scaleChanged', {scale: finalScale, deviceType: deviceType});
  }
});
