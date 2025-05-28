import '@testing-library/jest-dom';

jest.mock('./src/firebase/config', () => ({
  firestore: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onClick }: any) => (
    <div data-testid="google-map" onClick={() => onClick({ latLng: { lat: () => -23.5, lng: () => -46.6 } })}>
      GoogleMapMock
      {children}
    </div>
  ),
  Marker: ({ position }: any) => <div data-testid="marker">{JSON.stringify(position)}</div>,
  InfoWindow: ({ children }: any) => <div data-testid="info-window">{children}</div>,
}));

