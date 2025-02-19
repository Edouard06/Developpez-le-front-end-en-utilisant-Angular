
import { Participation } from './participation';
export interface OlympicCountry {
    id: number;
    country: string;
    participations: Participation[];
}
