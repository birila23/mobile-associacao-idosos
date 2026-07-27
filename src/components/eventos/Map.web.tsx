import { Platform, View } from 'react-native';

export default function Map({ region, onPress, latitude, longitude }: any) {
  if (Platform.OS === 'web') {
    // Coordenadas centrais (padrão ou a atual selecionada)
    const lat = latitude || region?.latitude || -23.550520;
    const lng = longitude || region?.longitude || -46.633309;

    // URL do OpenStreetMap incorporado
    const mapHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            html, body, #map { height: 100%; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map').setView([${lat}, ${lng}], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            var marker = L.marker([${lat}, ${lng}]).addTo(map);

            map.on('click', function(e) {
              var lat = e.latlng.lat;
              var lng = e.latlng.lng;
              marker.setLatLng([lat, lng]);
              // Envia a coordenada para a aplicação React Native Web
              window.parent.postMessage({ type: 'MAP_CLICK', latitude: lat, longitude: lng }, '*');
            });
          </script>
        </body>
      </html>
    `;

    return (
      <View style={{ flex: 1 }}>
        <iframe
          srcDoc={mapHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>
    );
  }

  return null;
}