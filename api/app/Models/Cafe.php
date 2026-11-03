<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * Registro de un café tomado.
 *
 * Guarda las cantidades ya convertidas a ml (café y leche) y gramos (azúcar).
 *
 * @property int $id
 * @property string $tipo
 * @property int $cafe_ml
 * @property int $leche_ml
 * @property int $cucharaditas
 * @property int $azucar_g
 * @property string|null $nota
 */
#[Fillable(['tipo', 'cafe_ml', 'leche_ml', 'cucharaditas', 'azucar_g', 'nota'])]
class Cafe extends Model
{
    /** @var int Gramos de azúcar que lleva una cucharadita. */
    public const GRAMOS_POR_CUCHARADITA = 4;

    /** @var int Máximo de cucharaditas de azúcar por café. */
    public const MAX_CUCHARADITAS = 10;

    /**
     * Equivalencia de cada tipo de café a mililitros.
     *
     * @var array<string, array{int, int}> tipo => [café ml, leche ml]
     */
    public const TIPOS = [
        'espresso' => [30, 0],
        'americano' => [30, 0],
        'cortado' => [30, 30],
        'latte' => [30, 150],
        'capuchino' => [30, 120],
    ];

    /**
     * Guarda un café calculando sus ml (según el tipo) y sus gramos de azúcar.
     *
     * @param  array{tipo: string, cucharaditas: int, nota?: string|null}  $datos  Ya validados.
     */
    public static function registrar(array $datos): static
    {
        [$cafeMl, $lecheMl] = static::TIPOS[$datos['tipo']];

        return static::create($datos + [
            'cafe_ml' => $cafeMl,
            'leche_ml' => $lecheMl,
            'azucar_g' => $datos['cucharaditas'] * static::GRAMOS_POR_CUCHARADITA,
        ]);
    }

    /**
     * Suma el café, la leche y el azúcar de una colección de cafés.
     *
     * @param  Collection<int, Cafe>  $cafes
     * @return array{cafe_ml: int, leche_ml: int, azucar_g: int}
     */
    public static function totales(Collection $cafes): array
    {
        return [
            'cafe_ml' => (int) $cafes->sum('cafe_ml'),
            'leche_ml' => (int) $cafes->sum('leche_ml'),
            'azucar_g' => (int) $cafes->sum('azucar_g'),
        ];
    }

    /**
     * Cantidad de cafés de hoy y sus totales.
     *
     * @return array{total: int, cafe_ml: int, leche_ml: int, azucar_g: int}
     */
    public static function deHoy(): array
    {
        $cafes = static::whereDate('created_at', today())->get();

        return ['total' => $cafes->count()] + static::totales($cafes);
    }

    /**
     * Totales por barra del periodo calendario actual.
     *
     * - `semana`: de lunes a domingo, una barra por día.
     * - `mes`: del 1 al último día del mes, una barra por día.
     * - `anio`: de enero a diciembre, una barra por mes (fecha `Y-m`).
     *
     * Las barras sin cafés (incluidos los días futuros) vienen en cero.
     *
     * @param  string  $periodo  `semana`, `mes` o `anio`.
     * @return Collection<int, array{fecha: string, cafe_ml: int, leche_ml: int, azucar_g: int}>
     */
    public static function porPeriodo(string $periodo): Collection
    {
        [$inicio, $fin, $paso, $formato] = match ($periodo) {
            'semana' => [today()->startOfWeek(), today()->endOfWeek(), '1 day', 'Y-m-d'],
            'mes' => [today()->startOfMonth(), today()->endOfMonth(), '1 day', 'Y-m-d'],
            'anio' => [today()->startOfYear(), today()->endOfYear(), '1 month', 'Y-m'],
        };

        $porBarra = static::whereBetween('created_at', [$inicio, $fin])
            ->get()
            ->groupBy(fn (Cafe $cafe) => $cafe->created_at->format($formato));

        return collect(CarbonPeriod::create($inicio, $paso, $fin))->map(
            fn (Carbon $dia) => ['fecha' => $dia->format($formato)]
                + static::totales($porBarra->get($dia->format($formato), collect()))
        );
    }

    /**
     * Cantidad de cafés por día de los últimos 365 días (incluido hoy), del más viejo al más nuevo.
     *
     * @return Collection<int, array{fecha: string, total: int}> Los días sin cafés vienen con total 0.
     */
    public static function calor(): Collection
    {
        $inicio = today()->subDays(364);

        $porDia = static::where('created_at', '>=', $inicio)
            ->get()
            ->countBy(fn (Cafe $cafe) => $cafe->created_at->format('Y-m-d'));

        return collect(CarbonPeriod::create($inicio, today()))->map(fn (Carbon $dia) => [
            'fecha' => $dia->format('Y-m-d'),
            'total' => $porDia->get($dia->format('Y-m-d'), 0),
        ]);
    }
}
