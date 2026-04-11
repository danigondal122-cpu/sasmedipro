<?php

namespace App\Repositories\API;

use App\Models\Inventory;

class InventoryRepository
{
    protected $model;

    public function __construct(Inventory $inventory)
    {
        $this->model = $inventory;
    }

    public function all(array $filters = [])
    {
       $query = Inventory::with(['item', 'creator']);

        // Search by item_name or item_no
        if (!empty($filters['search'])) {
            $query->whereHas('item', function ($q) use ($filters) {
                $q->where('item_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('item_no', 'like', '%' . $filters['search'] . '%');
            });
        }

        $perPage = $filters['per_page'] ?? 10;

        return $query->latest()->paginate($perPage);
    }

    public function find($id)
    {
        return $this->model->with('item')->findOrFail($id);
    }

    public function store(array $data)
    {
        return $this->model->create($data);
    }


    

    public function update(Inventory $inventory, array $data)
    {
        $inventory->update($data);
        return $inventory;
    }

    public function delete(Inventory $inventory)
    {
        return $inventory->delete();
    }


    public function bulkDelete(array $ids)
{
    return $this->model->whereIn('id', $ids)->delete();
}
}
