<?php

namespace App\Imports;

use App\Models\RefFarmakesIf;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class FarmakesImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $collection
     */

    public function collection(Collection $collection)
    {
        foreach ($collection as $row) {
            $data = [
                'kode' => $row['kode'],
                'nama_obat' => $row['nama_obat'],
                'status' => 'active',
            ];
            RefFarmakesIf::updateOrCreate(['kode' => $row['kode']], $data);
        }
    }
}
