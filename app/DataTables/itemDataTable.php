<?php

namespace App\DataTables;

use App\Models\Item;
use Yajra\DataTables\Services\DataTable;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;

class ItemDataTable extends DataTable
{
    /**
     * Build the DataTable class.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->editColumn('price', fn($row) => number_format($row->price, 2))
            ->editColumn('tax', fn($row) => $row->tax . '%')
            ->editColumn('status', function ($row) {
                $color = $row->status ? 'green' : 'red';
                $text = $row->status ? 'Active' : 'Inactive';
                return "<span class='badge' style='background-color:{$color};'>{$text}</span>";
            })
            ->addColumn('action', function ($row) {
                return view('backend.items.datatable-actions', ['item' => $row]);
            })
            ->rawColumns(['status', 'action']);
    }

    /**
     * Get the query source of dataTable.
     */
    public function query(Item $model): QueryBuilder
    {
        return $model->newQuery();
    }

    /**
     * Optional HTML builder for front-end table.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('item-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(1)
            ->parameters([
                'language' => [
                    'emptyTable' => 'No items found',
                ],
            ]);
    }

    /**
     * Table columns.
     */
    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('item_no')->title('Item No'),
            Column::make('item_name')->title('Item Name'),
            Column::make('price')->title('Price'),
            Column::make('tax')->title('Tax %'),
            Column::make('status')->title('Status')->orderable(false),
            Column::computed('action')->title('Action')->exportable(false)->printable(false)->orderable(false),
        ];
    }

    protected function filename(): string
    {
        return 'Items_' . date('YmdHis');
    }
}
