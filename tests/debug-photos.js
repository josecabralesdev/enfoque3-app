// Debug para ver qué está pasando con las fotos
const today = new Date().toISOString().split('T')[0];
console.log('Fecha actual:', today);

// Simular la función getDailyPhotos
function getDailyPhotosDebug() {
  // En web, esto viene de localStorage
  const mockPhotos = [
    { id: 1, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', date: today },
    { id: 2, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', date: today },
    { id: 3, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', date: today }
  ];
  
  console.log('Fotos en almacenamiento:', mockPhotos.length);
  
  // Filtrar por fecha y limitar a 3 (como hace la función real)
  const filtered = mockPhotos.filter(p => p.date === today).slice(0, 3);
  console.log('Fotos filtradas para hoy:', filtered.length);
  
  return filtered;
}

const result = getDailyPhotosDebug();
console.log('Resultado final:', result);
