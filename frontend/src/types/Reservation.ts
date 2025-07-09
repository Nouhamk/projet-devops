import { Locker } from "./Locker";

export interface Reservation {
    _id: string;
    casierId: Locker;
    userId: string;
    dateDebut: Date;
    dateExpiration: Date;
    statut: 'active' | 'expired';
    prixTotal: number;
}