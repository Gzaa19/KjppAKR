export interface Client {
    id: number;
    name: string;
    logo: string;
}

export const trustedClients: Client[] = [
    {
        id: 1,
        name: "Bank Mandiri",
        logo: "/image/clients/bank-mandiri.png",
    },
    {
        id: 2,
        name: "Pertamina",
        logo: "/image/clients/pertamina.png",
    },
    {
        id: 3,
        name: "Telkom Indonesia",
        logo: "/image/clients/telkom.png",
    },
    {
        id: 4,
        name: "Wika Group",
        logo: "/image/clients/wika.png",
    },
    {
        id: 5,
        name: "Astra",
        logo: "/image/clients/astra.png",
    },
];
