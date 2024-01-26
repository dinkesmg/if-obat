<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RefFarmakesIf extends Model
{
    use HasFactory, SoftDeletes, HasUuids;


    protected $guarded = ['id'];

    public function dt_kfa()
    {
        return $this->hasOne(KfaRef::class, 'kfa_code', 'kfa_code');
    }
}
