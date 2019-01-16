const hideWaterJar = function() {
  const waterJar = document.getElementById('water_jar');
  waterJar.style.visibility = 'hidden';
  setTimeout(() => {
    waterJar.style.visibility = 'visible';
  }, 1000);
};
