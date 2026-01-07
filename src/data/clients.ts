export interface Client {
    id: number;
    name: string;
    logo: string;
    category: 'Bank BUMN/Swasta' | 'Non Bank';
}

// Bank BUMN/Swasta Clients
export const bankClients: Client[] = [
    {
        id: 1,
        name: "Bank Mandiri",
        logo: "/image/client/bumn/mandiri.png",
        category: "Bank BUMN/Swasta"
    },
    {
        id: 2,
        name: "Bank BRI",
        logo: "/image/client/bumn/bri.png",
        category: "Bank BUMN/Swasta"
    },
    {
        id: 3,
        name: "Bank BCA",
        logo: "/image/client/bumn/bca.png",
        category: "Bank BUMN/Swasta"
    },
    {
        id: 4,
        name: "Bank BTN",
        logo: "/image/client/bumn/btn.png",
        category: "Bank BUMN/Swasta"
    },
    {
        id: 5,
        name: "Bank BSI",
        logo: "/image/client/bumn/bsi.png",
        category: "Bank BUMN/Swasta"
    },
];

// Non Bank Clients
export const nonBankClients: Client[] = [
    {
        id: 6,
        name: "Pertamina",
        logo: "/image/client/nonBank/pertamina.png",
        category: "Non Bank"
    },
    {
        id: 7,
        name: "DP Pertamina",
        logo: "/image/client/nonBank/dppertamina.png",
        category: "Non Bank"
    },
    {
        id: 8,
        name: "Pertamina Hulu Energi",
        logo: "/image/client/nonBank/pertaminahe.png",
        category: "Non Bank"
    },
    {
        id: 9,
        name: "Pertamina IEP",
        logo: "/image/client/nonBank/pertaminaiep.png",
        category: "Non Bank"
    },
    {
        id: 10,
        name: "Telkom Metra",
        logo: "/image/client/nonBank/telkommetra.png",
        category: "Non Bank"
    },
];

// All clients combined
export const allClients: Client[] = [...bankClients, ...nonBankClients];
