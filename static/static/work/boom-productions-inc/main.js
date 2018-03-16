var PageFeature = function () {
  var boomLogo = document.body.querySelector('.boom-logo');
  var boomGrid = document.body.querySelectorAll('.grid__x line, .grid__y line');
  var boomColor = document.body.querySelector('.boom-color');
  var boomDevices = document.body.querySelector('.boom-devices');
  var waypoints = [{
    node: boomLogo,
    delay: 1000,
    activeClass: 'boom-logo--active'
  }, {
    node: boomColor,
    delay: 1000,
    activeClass: 'boom-color--active'
  }, {
    node: boomDevices,
    delay: 1000,
    activeClass: 'boom-devices--active'
  }];

  function handleScroll() {
    if (waypoints.length > 0) {
      for (var i = 0; waypoints.length > i; i++) {
        if (scrolledIntoView(waypoints[i].node)) {
          waypoints[i].node.classList.add(waypoints[i].activeClass);
          waypoints.splice(i, 1);
        }
      }
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function scrolledIntoView(el, offset) {
    offset = typeof offset !== 'undefined' ? offset : 0;
    return el.getBoundingClientRect().top - (window.innerHeight + offset) <= 0;
  }

  function setDurationAndDelay(elements) {
    for (var i = 0; i < elements.length; i++) {
      var randomIntGrid = getRandomInt(1500, 2500) + 'ms';
      var randomIntDelay = getRandomInt(250, 500) + 'ms';
      elements[i].style.WebkitTransitionDuration = randomIntGrid;
      elements[i].style.transitionDuration = randomIntGrid;
      elements[i].style.WebkitTransitionDelay = randomIntDelay;
      elements[i].style.transitionDelay = randomIntDelay;
    }
  }

  setDurationAndDelay(boomGrid);

  function restartLogoAnimation() {
    boomLogo.classList.remove('boom-logo--active');
    setTimeout(function () {
      boomLogo.classList.add('boom-logo--active');
    }, 250);
  }

  boomLogo.addEventListener('click', restartLogoAnimation, false);
  window.addEventListener('scroll', handleScroll);
  handleScroll();
}();