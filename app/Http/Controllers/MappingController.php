<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMappingRequest;
use App\Models\RefFarmakesIf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MappingController extends Controller
{
    public function index()
    {

        return Inertia::render('Mapping/Index');
    }
    public function store(StoreMappingRequest $request)
    {
        if ($request->header('X-Requested-With') == 'XMLHttpRequest') {
            if ($request->validated()) {
                try {
                    foreach ($request->kfa as $k => $value) {
                        $kode = explode(' ', $request->kode[$k]);

                        $hasil = [
                            'kfa_code' => $request->kfa[$k],
                            'kode' => $kode[0]
                        ];
                        RefFarmakesIf::updateOrCreate(['kode' => $kode[0]], $hasil);
                    }
                    return response()->json([
                        'status' => true,
                        'messages' => [
                            'Data Mapping berhasil disimpan!'
                        ]
                    ], 200);
                } catch (\Throwable $th) {
                    //throw $th;
                    return response()->json([
                        'status' => false,
                        'messages' => [
                            'Data Mapping gagal diimport!. Error : ' . $th->getMessage()
                        ]
                    ], 422);
                }
            }
        }
    }
}
