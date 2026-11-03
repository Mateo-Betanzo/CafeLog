<?php

namespace Database\Seeders;

use App\Models\Cafe;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class DatabaseSeeder extends Seeder
{
    /**
     * Cafés de ejemplo repartidos en los últimos 14 días, con fechas relativas a hoy.
     *
     * @var list<array{tipo: string, cucharaditas: int, nota: string|null, dias: int, hora: int}>
     */
    private const CAFES = [
        ['tipo' => 'espresso', 'cucharaditas' => 0, 'nota' => 'Para arrancar el día', 'dias' => 0, 'hora' => 8],
        ['tipo' => 'latte', 'cucharaditas' => 2, 'nota' => null, 'dias' => 0, 'hora' => 16],
        ['tipo' => 'capuchino', 'cucharaditas' => 1, 'nota' => 'Con canela', 'dias' => 1, 'hora' => 9],
        ['tipo' => 'americano', 'cucharaditas' => 0, 'nota' => null, 'dias' => 2, 'hora' => 10],
        ['tipo' => 'cortado', 'cucharaditas' => 1, 'nota' => 'Después del almuerzo', 'dias' => 3, 'hora' => 14],
        ['tipo' => 'latte', 'cucharaditas' => 3, 'nota' => 'Muy dulce', 'dias' => 5, 'hora' => 17],
        ['tipo' => 'espresso', 'cucharaditas' => 1, 'nota' => null, 'dias' => 7, 'hora' => 8],
        ['tipo' => 'capuchino', 'cucharaditas' => 2, 'nota' => 'En la escuela', 'dias' => 9, 'hora' => 11],
        ['tipo' => 'cortado', 'cucharaditas' => 0, 'nota' => null, 'dias' => 11, 'hora' => 15],
        ['tipo' => 'americano', 'cucharaditas' => 2, 'nota' => 'Para estudiar', 'dias' => 13, 'hora' => 19],
    ];

    /**
     * Carga los cafés de ejemplo.
     */
    public function run(): void
    {
        foreach (self::CAFES as $cafe) {
            $fecha = today()->subDays($cafe['dias'])->setHour($cafe['hora']);

            Cafe::registrar(Arr::except($cafe, ['dias', 'hora']))->forceFill(['created_at' => $fecha, 'updated_at' => $fecha])->save();
        }
    }
}
