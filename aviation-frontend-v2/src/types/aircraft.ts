export interface Aircraft {
    id: string;
    model: string;
    manufacturer: string;
    category: 'commercial' | 'executive' | 'defense' | 'agriculture';
    type: string;
    capacity?: {
        passengers?: number;
        cargo?: string;
    };
    performance: {
        maxSpeed: string;
        range: string;
        ceiling?: string;
        cruiseSpeed?: string;
    };
    dimensions: {
        wingspan: string;
        length: string;
        height: string;
    };
    engines: {
        type: string;
        count: number;
        manufacturer?: string;
    };
    weights: {
        maxTakeoff: string;
        empty?: string;
        maxLanding?: string;
    };
    images: {
        primary: string;
        gallery?: string[];
    };
    specifications?: {
        fuelCapacity?: string;
        maxPayload?: string;
        takeoffDistance?: string;
        landingDistance?: string;
    };
    description: string;
    features?: string[];
    certifications?: string[];
    yearIntroduced?: number;
    status: 'active' | 'production' | 'development' | 'retired';
}

export interface AircraftCategory {
    id: string;
    name: string;
    count: number;
    icon: string;
}

export interface AircraftStats {
    total: number;
    commercial: number;
    executive: number;
    defense: number;
    agriculture: number;
    availability: number;
    totalFlightHours: number;
}
