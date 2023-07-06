import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertiDurata'
})
export class ConvertiDurataPipe implements PipeTransform {
  transform(millisecondi: number): string {
    const secondi = Math.floor(millisecondi / 1000);
    const minuti = Math.floor(secondi / 60);
    const ore = Math.floor(minuti / 60);
    const giorni = Math.floor(ore / 24);

    const rimanentiOre = ore % 24;
    const rimanentiMinuti = minuti % 60;

    return `${giorni} giorni, ${rimanentiOre} ore, ${rimanentiMinuti} minuti`;
  }
}
