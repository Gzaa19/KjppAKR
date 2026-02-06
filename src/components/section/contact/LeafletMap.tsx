"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet implementation
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const headOfficeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const branchOfficeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to control map from outside
function MapController({
    selectedOffice,
    offices,
    markerRefs
}: {
    selectedOffice: number | null,
    offices: any[],
    markerRefs: React.MutableRefObject<(L.Marker | null)[]>
}) {
    const map = useMap();

    useEffect(() => {
        if (selectedOffice !== null && offices[selectedOffice]) {
            const office = offices[selectedOffice];
            map.flyTo(office.position, 12, {
                animate: true,
                duration: 1.5
            });

            // Open popup when selected
            const marker = markerRefs.current[selectedOffice];
            if (marker) {
                marker.openPopup();
            }
        } else if (selectedOffice === null) {
            // Reset to initial view when detail is closed
            map.flyTo([-2.5, 118], 5, {
                animate: true,
                duration: 1.5
            });
        }
    }, [selectedOffice, offices, map, markerRefs]);

    return null;
}

interface LeafletMapProps {
    offices: any[];
    selectedOffice: number | null;
    setSelectedOffice: (index: number | null) => void;
}

export default function LeafletMap({ offices, selectedOffice, setSelectedOffice }: LeafletMapProps) {
    const markerRefs = useRef<(L.Marker | null)[]>([]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="h-[600px] rounded-xl overflow-hidden">
                <MapContainer
                    center={[-2.5, 118]}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController
                        selectedOffice={selectedOffice}
                        offices={offices}
                        markerRefs={markerRefs}
                    />

                    {offices.map((office, index) => (
                        <Marker
                            key={index}
                            position={office.position}
                            icon={office.isHeadOffice ? headOfficeIcon : branchOfficeIcon}
                            ref={(ref) => {
                                markerRefs.current[index] = ref;
                            }}
                            eventHandlers={{
                                click: () => setSelectedOffice(index)
                            }}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-kjpp-dark mb-2">{office.name}</h3>
                                    <p className="text-sm text-slate-600 mb-2">{office.address}</p>
                                    <p className="text-xs text-slate-500">
                                        <strong>Phone:</strong> {office.phone}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        <strong>Email:</strong> {office.email}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
