// Verificar si hay fotos reales en el almacenamiento
const IS_WEB = true;

if (IS_WEB) {
  // En un navegador real, esto funcionaría
  try {
    const photosStr = localStorage.getItem('photos');
    if (photosStr) {
      const photos = JSON.parse(photosStr);
      console.log('Fotos encontradas en localStorage:', photos.length);
      photos.forEach((p, idx) => {
        console.log(`Foto ${idx + 1}:`, {
          id: p.id,
          date: p.date,
          uriLength: p.uri ? p.uri.length : 0,
          uriStart: p.uri ? p.uri.substring(0, 50) + '...' : 'null'
        });
      });
      
      // Verificar si son de hoy
      const today = new Date().toISOString().split('T')[0];
      const fotosDeHoy = photos.filter(p => p.date === today);
      console.log(`\nFotos de hoy (${today}): ${fotosDeHoy.length}`);
      
      if (fotosDeHoy.length === 3) {
        console.log('✓ Hay 3 fotos de hoy en el almacenamiento');
        console.log('✓ La aplicación debería mostrarlas');
      } else {
        console.log('✗ No hay 3 fotos de hoy');
        console.log('✗ Las fotos podrían ser de otro día');
      }
    } else {
      console.log('No hay fotos en localStorage');
    }
  } catch (e) {
    console.log('No se puede acceder a localStorage en este entorno');
  }
}
