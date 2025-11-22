//detectar se a pessoa ta usando computador ou celula pro css se adequar
(function() {
    'use strict';


    function detectarDispositivo() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;
        
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        
       
        const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent.toLowerCase()) || 
                        (width >= 600 && width <= 1024 && height > width);
        
        
        const isMobileBySize = width <= 768;
        const isTabletBySize = width > 768 && width <= 1024;
        const isDesktop = width > 1024;
        const isLandscape = width > height;
        const isPortrait = height > width;
        
    
        const isTouchDevice = 'ontouchstart' in window || 
                             navigator.maxTouchPoints > 0 || 
                             navigator.msMaxTouchPoints > 0;
        
        return {
            isMobile: isMobile || isMobileBySize,
            isTablet: isTablet || isTabletBySize,
            isDesktop: isDesktop,
            isTouchDevice: isTouchDevice,
            isLandscape: isLandscape,
            isPortrait: isPortrait,
            width: width,
            height: height,
            userAgent: userAgent
        };
    }


    function aplicarClassesDispositivo() {
        const dispositivo = detectarDispositivo();
        const body = document.body;
        
        body.classList.remove('mobile', 'tablet', 'desktop', 'touch', 'no-touch', 'landscape', 'portrait');
        
        if (dispositivo.isMobile) {
            body.classList.add('mobile');
        } else if (dispositivo.isTablet) {
            body.classList.add('tablet');
        } else {
            body.classList.add('desktop');
        }
        
        if (dispositivo.isTouchDevice) {
            body.classList.add('touch');
        } else {
            body.classList.add('no-touch');
        }
        
        if (dispositivo.isLandscape) {
            body.classList.add('landscape');
        } else {
            body.classList.add('portrait');
        }
        
        if (dispositivo.width <= 375) {
            body.classList.add('screen-xs');
        } else if (dispositivo.width <= 414) {
            body.classList.add('screen-sm');
        } else if (dispositivo.width <= 768) {
            body.classList.add('screen-md');
        } else if (dispositivo.width <= 1024) {
            body.classList.add('screen-lg');
        } else {
            body.classList.add('screen-xl');
        }
        
        window.deviceInfo = dispositivo;
        
        const event = new CustomEvent('deviceDetected', {
            detail: dispositivo
        });
        window.dispatchEvent(event);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarClassesDispositivo);
    } else {
        aplicarClassesDispositivo();
    }

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            aplicarClassesDispositivo();
        }, 100);
    });

    window.addEventListener('orientationchange', function() {
        setTimeout(aplicarClassesDispositivo, 100);
    });

    window.detectarDispositivo = detectarDispositivo;
    window.aplicarClassesDispositivo = aplicarClassesDispositivo;

})();

