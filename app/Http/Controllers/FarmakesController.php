<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadFarmakes;
use App\Imports\FarmakesImport;
use App\Models\RefFarmakesIf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class FarmakesController extends Controller
{
    public function index()
    {
        return Inertia::render('Farmasi/Index');
    }
    public function upload()
    {
        return Inertia::render('Farmasi/Upload');
    }
    public function uploadFarmakes(UploadFarmakes $request)
    {
        if ($request->header('X-Requested-With') == 'XMLHttpRequest') {
            if ($request->validated()) {
                if ($request->hasFile('file')) {
                    try {
                        $file = $request->file('file');
                        $nama_file = Carbon::now()->format('d-m-y') . '_' . rand() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
                        $file->move(public_path('/dokumen/'), $nama_file);
                        Excel::import(new FarmakesImport(), public_path('/dokumen/' . $nama_file));
                        return response()->json([
                            'status' => true,
                            'messages' => [
                                'Data Farmakes berhasil diimport!'
                            ]
                        ], 200);
                    } catch (\Throwable $th) {
                        return response()->json([
                            'status' => false,
                            'messages' => [
                                'Data Farmakes gagal diimport!. Error : ' . $th->getMessage()
                            ]
                        ], 422);
                    }
                }
            }
        }
    }
    public function getAllFarmakes(Request $request)
    {
        if ($request->header('X-Requested-With') == 'XMLHttpRequest') {
            try {
                $data = RefFarmakesIf::with(['dt_kfa'])->orderBy('kode', 'ASC')->get();
                return response()->json([
                    'status' => true,
                    'messages' => [
                        'Berhasil mendapatkan data'
                    ],
                    'data' => $data
                ], 200);
            } catch (\Throwable $th) {
                //throw $th;
                return response()->json([
                    'status' => true,
                    'messages' => [
                        'Gagal mendapatkan data. Error : ' . $th->getMessage()
                    ],
                    'data' => null
                ], 422);
            }
        }
    }
}
