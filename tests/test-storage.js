// Script de prueba para verificar el almacenamiento
const IS_WEB = true;

if (IS_WEB) {
  // Simular localStorage
  const mockLocalStorage = {
    getItem: (key) => {
      // En un entorno real, esto sería localStorage.getItem(key)
      // Pero para prueba, vamos a simular que hay 3 fotos de hoy
      const today = new Date().toISOString().split('T')[0];
      const photos = [
        { id: 1, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', date: today },
        { id: 2, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', date: today },
        { id: 3, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', date: today }
      ];
      return JSON.stringify(photos);
    },
    setItem: (key, value) => console.log('Guardando:', key, value)
  };

  const photos = JSON.parse(mockLocalStorage.getItem('photos') || '[]');
  console.log('=== PRUEBA DE ALMACENAMIENTO ===');
  console.log('Total fotos:', photos.length);
  console.log('Fecha de hoy:', new Date().toISOString().split('T')[0]);
  
  photos.forEach((p, idx) => {
    console.log(`Foto ${idx + 1}: ID=${p.id}, Fecha=${p.date}, URI length=${p.uri.length}`);
  });
  
  // Verificar si las fotos son de hoy
  const today = new Date().toISOString().split('T')[0];
  const fotosDeHoy = photos.filter(p => p.date === today);
  console.log('Fotos de hoy:', fotosDeHoy.length);
}
