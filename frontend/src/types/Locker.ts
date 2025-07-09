export interface Locker {
    _id: number;
    numero: number;
    taille: 'small' | 'medium' | 'large';
    status: 'available' | 'reserved' | 'occupied' | 'maintenance';
    prix: number;
}