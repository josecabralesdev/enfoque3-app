// Probar específicamente la carga inicial de fotos existentes
const today = new Date().toISOString().split('T')[0];

// Simular localStorage con fotos existentes (como si ya estuvieran guardadas de antes)
const mockLocalStorage = {
  data: {
    'photos': JSON.stringify([
      { id: 1640000000000, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=', date: today },
      { id: 1640000000001, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=', date: today },
      { id: 1640000000002, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=', date: today }
    ])
  },
  getItem: function(key) { return this.data[key] || null; },
  setItem: function(key, value) { this.data[key] = value; }
};

// Función exacta de database.js
function getDailyPhotos(date) {
  const photos = JSON.parse(mockLocalStorage.getItem('photos') || '[]');
  return photos.filter(p => p.date === date).slice(0, 3);
}

// Función exacta de HomeScreen.js
function loadPhotos() {
  const data = getDailyPhotos(today);
  console.log('Datos obtenidos de getDailyPhotos:', data.length, 'fotos');
  
  // Esto es lo que hace setPhotos([...data])
  const photosState = [...data];
  console.log('Estado photos actualizado:', photosState.length, 'fotos');
  
  // Verificar si se mostrarían
  if (photosState.length === 3) {
    console.log('✓ Deberían mostrarse 3 fotos');
    console.log('✓ Debería aparecer el mensaje de tríptico completo');
    console.log('✓ Los botones deberían estar visibles');
  }
  
  return photosState;
}

console.log('=== CARGA INICIAL DE FOTOS EXISTENTES ===');
const result = loadPhotos();

console.log('\n=== VERIFICACIÓN FINAL ===');
if (result.length === 3) {
  console.log('✓ La carga inicial es CORRECTA');
  console.log('✓ Las fotos existentes deberían mostrarse');
  console.log('\nSi no se muestran, el problema es:');
  console.log('  1. Las URIs son inválidas y no se pueden renderizar');
  console.log('  2. El navegador no puede mostrar las imágenes base64');
  console.log('  3. Hay un problema con el almacenamiento real del navegador');
} else {
  console.log('✗ Problema en la carga inicial');
}
