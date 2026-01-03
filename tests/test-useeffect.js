// Simular el useEffect y loadPhotos
const today = new Date().toISOString().split('T')[0];

// Simular localStorage con fotos existentes
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

// Simular initDB
function initDB() {
  if (!mockLocalStorage.getItem('photos')) {
    mockLocalStorage.setItem('photos', JSON.stringify([]));
  }
}

// Simular getDailyPhotos
function getDailyPhotos(date) {
  const photos = JSON.parse(mockLocalStorage.getItem('photos') || '[]');
  return photos.filter(p => p.date === date).slice(0, 3);
}

// Simular loadPhotos
function loadPhotos() {
  const data = getDailyPhotos(today);
  console.log('loadPhotos ejecutada, datos:', data.length, 'fotos');
  return data;
}

// Simular el useEffect completo
function simulateUseEffect() {
  console.log('\n=== SIMULACIÓN DE USEFFECT ===');
  
  // Paso 1: initDB
  console.log('1. Ejecutando initDB()...');
  initDB();
  console.log('   ✓ Base de datos inicializada');
  
  // Paso 2: loadPhotos
  console.log('2. Ejecutando loadPhotos()...');
  const photosData = loadPhotos();
  console.log('   ✓ Fotos cargadas:', photosData.length);
  
  // Paso 3: Verificar estado final
  console.log('3. Estado final:');
  console.log('   - photos.length:', photosData.length);
  console.log('   - Deberían mostrarse botones:', photosData.length < 3 ? 'NO' : 'SÍ');
  console.log('   - Debería mostrar mensaje completo:', photosData.length === 3 ? 'SÍ' : 'NO');
  
  return photosData;
}

const result = simulateUseEffect();
console.log('\n=== RESULTADO ===');
if (result.length === 3) {
  console.log('✓ Las fotos deberían estar visibles en la aplicación');
} else {
  console.log('✗ Problema: No se están cargando las fotos existentes');
}
