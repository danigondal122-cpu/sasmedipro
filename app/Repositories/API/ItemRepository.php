<?php

namespace App\Repositories\API;

use App\Models\Item;
use App\Models\Inventory;
use Illuminate\Support\Facades\DB;
class ItemRepository
{
    protected $model;

    public function __construct(Item $item)
    {
        $this->model = $item;
    }

   public function all(array $filters = [])
{
    $query = Item::query();

    // 🔍 Search
    if (!empty($filters['search'])) {
        $query->where('item_name', 'like', '%' . $filters['search'] . '%')
              ->orWhere('item_no', 'like', '%' . $filters['search'] . '%');
    }

    // 🔄 Status filter
    if (isset($filters['status'])) {
        $query->where('status', $filters['status']);
    }

    // 📄 Pagination
    $perPage = $filters['per_page'] ?? 10;

    return $query
        ->latest()
        ->paginate($perPage);
}

    public function find($id)
    {
        return $this->model->findOrFail($id);
    }




     public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            // 1️⃣ Extract qty before creating item
            $qty = $data['qty'];
            unset($data['qty']);

            // 2️⃣ Create item
            $item = $this->model->create($data);

            // 3️⃣ Auto-create inventory entry
              Inventory::updateOrCreate(
            ['item_id' => $item->id],
            [
                'qty' => $qty,
                'created_by_id' => auth()->id() ?? 1,
            ]
        );


            return $item;
        });
    }

    public function update(Item $item, array $data)
    {
        $item->update($data);
        return $item;
    }

    public function delete(Item $item)
    {
        return $item->delete();
    }


    public function bulkDelete(array $ids)
{
    return $this->model->whereIn('id', $ids)->delete();
}
}
