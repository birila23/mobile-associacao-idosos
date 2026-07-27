import MapView, { Marker } from 'react-native-maps';

export default function Map({ region, onRegionChangeComplete, latitude, longitude, onPress }: any) {
  return (
    <MapView
      style={{ flex: 1 }}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
      onPress={(e) => onPress(e.nativeEvent.coordinate)}
    >
      {latitude && longitude ? (
        <Marker coordinate={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }} />
      ) : null}
    </MapView>
  );
}