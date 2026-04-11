<?php

namespace App\Repositories\API;

use App\Models\Customer;


class CustomerRepository
{
    protected $model;

    public function __construct(Customer $customer)
    {
        $this->model = $customer;
    }

    public function all(array $filters = [])
    {
        $query = Customer::with('creator');

        // 🔍 Search filter
       if (!empty($filters['search'])) {
    $query->where(function ($q) use ($filters) {
        $q->where('name', 'like', '%' . $filters['search'] . '%')
          ->orWhere('customer_no', 'like', '%' . $filters['search'] . '%')
          ->orWhere('mobile', 'like', '%' . $filters['search'] . '%')
          ->orWhere('phone', 'like', '%' . $filters['search'] . '%')
          ->orWhere('vat', 'like', '%' . $filters['search'] . '%')
          ->orWhere('brn', 'like', '%' . $filters['search'] . '%');
    });
}

if (!empty($filters['role'])) {
    $query->where('role', $filters['role']);
}
        // 📄 Pagination
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

    public function update(Customer $customer, array $data)
    {
        $customer->update($data);
        return $customer;
    }

    public function delete(Customer $customer)
    {
        return $customer->delete();
    }
}
