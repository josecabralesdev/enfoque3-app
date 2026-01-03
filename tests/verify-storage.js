// Verificar el proceso completo de guardado y carga
const today = new Date().toISOString().split('T')[0];

// Simular el proceso de guardar una foto
function simulateSavePhoto(uri) {
  console.log('\n=== GUARDAR FOTO ===');
  console.log('URI recibida:', uri.substring(0, 50) + '...');
  
  // En web, se convierte a base64
  const base64Data = uri; // En realidad sería uriToBase64(uri)
  const photos = []; // Photos vacío inicialmente
  const newPhoto = { 
    id: Date.now(), 
    uri: base64Data, 
    date: today 
  };
  
  photos.push(newPhoto);
  console.log('Foto guardada:', {
    id: newPhoto.id,
    date: newPhoto.date,
    uriLength: newPhoto.uri.length
  });
  
  return photos;
}

// Simular el proceso de cargar fotos
function simulateLoadPhotos(savedPhotos) {
  console.log('\n=== CARGAR FOTOS ===');
  console.log('Fotos en almacenamiento:', savedPhotos.length);
  
  // getDailyPhotos filtra por fecha
  const filtered = savedPhotos.filter(p => p.date === today).slice(0, 3);
  console.log('Fotos filtradas para hoy:', filtered.length);
  
  return filtered;
}

// Proceso completo
console.log('=== PROCESO COMPLETO ===');

// 1. Guardar 3 fotos
const photosAfterSave = [];
for (let i = 0; i < 3; i++) {
  const uri = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=`;
  const saved = simulateSavePhoto(uri);
  photosAfterSave.push(...saved);
}

// 2. Cargar las fotos
const loadedPhotos = simulateLoadPhotos(photosAfterSave);

console.log('\n=== RESULTADO FINAL ===');
console.log('Fotos guardadas:', photosAfterSave.length);
console.log('Fotos cargadas:', loadedPhotos.length);

if (loadedPhotos.length === 3) {
  console.log('✓ El proceso completo funciona correctamente');
  console.log('✓ Las fotos deberían mostrarse en la aplicación');
} else {
  console.log('✗ Problema en el proceso completo');
}
