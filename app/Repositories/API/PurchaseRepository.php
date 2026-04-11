<?php

namespace App\Repositories\API;

use App\Models\Purchase;

class PurchaseRepository
{
    protected $model;

    public function __construct(Purchase $purchase)
    {
        $this->model = $purchase;
    }

    public function all(array $filters = [])
    {
        $query = Purchase::query();

        // 🔍 Search by product name
        if (!empty($filters['search'])) {
            $query->where('product_name', 'like', '%' . $filters['search'] . '%');
        }

        $perPage = $filters['per_page'] ?? 10;

        return $query->latest()->paginate($perPage);
    }

    public function find($id)
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data)
    {
        return $this->model->create($data);
    }

    public function update(Purchase $purchase, array $data)
    {
        $purchase->update($data);
        return $purchase;
    }

    public function delete(Purchase $purchase)
    {
        return $purchase->delete();
    }

    public function bulkDelete(array $ids)
    {
        return $this->model->whereIn('id', $ids)->delete();
    }
}