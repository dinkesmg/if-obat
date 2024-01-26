<?php

namespace App\Http\Controllers;

use App\Models\KfaIngredientsRef;
use App\Models\KfaProductTempRef;
use App\Models\KfaRef;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FarmasiController extends Controller
{
    public function apiFarmasi(Request $request)
    {
        $validator =  Validator::make($request->all(), [
            // 'tipe' => 'required|in:alkes,farmasi',
            'q' => 'required|string',
            // 'page' => 'required|numeric',
            // 'tanggal_ukur' => 'required|date|date_format:d-m-Y',
            // 'kode_anak' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            $error = $validator->errors();
            $response['status']   = false;
            $response['message']  = $error;
            return response()->json($response, 400);
        } else {

            try {
                // dd($request->all());
                $finalResult = [];

                // Ambil data dari paginasi
                $data = KfaRef::query()
                    // ->where('jenis', '=', ucwords($request->tipe))
                    ->select('jenis', 'kfa_code', 'nie', 'name', 'active_ingredients_kfa_code', 'product_template_kfa_code')
                    ->where('active', '=', 'true')
                    ->where('state', '=', 'valid')
                    ->where('name', 'like', '%' . $request->q . '%')
                    ->get();

                // Loop pada setiap item dalam data
                foreach ($data as $item) {
                    $activeIngredients = json_decode($item->active_ingredients_kfa_code, true);

                    $ingredientDetails = null;
                    $productTemplateDetails = null;

                    // Loop untuk query detail ingredients
                    if (!empty($activeIngredients) && is_array($activeIngredients)) {
                        foreach ($activeIngredients as $ingredient) {
                            $ingredientDetail = KfaIngredientsRef::where('kfa_code', '=', $ingredient)->select('kfa_code', 'kekuatan_zat_aktif', 'zat_aktif')->first();

                            // Jika detail ditemukan, tambahkan ke array $ingredientDetails
                            if ($ingredientDetail) {
                                $ingredientDetails[] = $ingredientDetail;
                            }
                        }
                    }

                    // Query detail dari product_template_kfa_code
                    $productTemplate = KfaProductTempRef::where('kfa_code', '=', $item->product_template_kfa_code)->select('kfa_code', 'name', 'display_name')->first();

                    // Jika detail ditemukan, tambahkan ke array $productTemplateDetails
                    if ($productTemplate) {
                        $productTemplateDetails = $productTemplate;
                    }

                    // Tambahkan detail ingredients dan product template ke dalam array hasil akhir
                    $item->ingredient_details = $ingredientDetails;
                    $item->product_template_details = $productTemplateDetails;

                    // Tambahkan data ke dalam array hasil akhir
                    $finalResult[] = $item;
                }
                // Ubah array menjadi JSON
                // $jsonResult = json_encode($finalResult);
                return response()->json([
                    'message' => 'Berhasil mendapatkan data',
                    'status' => true,
                    'hasil' => array(
                        'data' => $finalResult,
                        // 'last' => $data->lastPage(),
                        'total' => count($finalResult)
                    ),

                ], 200);
            } catch (\Throwable $th) {
                //throw $th;
                return response()->json([
                    'message' => 'Gagal mendapatkan data. Error : ' . $th->getMessage(),
                    'status' => false,
                    'data' => null
                ], 500);
            }
        }
    }
}
