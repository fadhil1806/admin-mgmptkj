"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "react-toastify" // Import react-toastify
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu" // Import missing component
import axios from "axios" // Import axios for HTTP requests
import Link from "next/link"

export type Course = {
  id: string
  name: string
  description: string
  author: string
  photo_link: string
  link_course: string
  created_at: string
  updated_at: string
}

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "photo_link",
    header: "Photo",
    cell: ({ row }) => (
      <img
        src={row.getValue("photo_link")}
        alt="Course"
        className="h-10 w-10 object-cover rounded"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama Course
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "author",
    header: "Penulis",
    cell: ({ row }) => <div>{row.getValue("author")}</div>,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button variant="ghost" className="h-8 w-8 p-0">
  //           <span className="sr-only">Open menu</span>
  //           <MoreHorizontal />
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end">
  //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //         <DropdownMenuItem
  //           onClick={() => navigator.clipboard.writeText(row.original.id)}
  //         >
  //           Copy Course ID
  //         </DropdownMenuItem>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
  //           Delete Course
  //         </DropdownMenuItem>
  //         <DropdownMenuItem onClick={() => handleUpdate(row.original)}>
  //           Update Course
  //         </DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   ),
  // },
]

export function DataCourse() {
  const [data, setData] = React.useState<Course[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const notify = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/course")
      const courses = await response.json()
      setData(courses)
    }
    fetchData()
  }, [])

  // Handle delete action
  const handleDelete = async (id: string) => {
    if (!id) return
    try {
      const response = await axios.delete(`/api/course/${id}`)
      if (response.status === 200) {
        setData((prevData) => prevData.filter((course) => course.id !== id))
        notify("Course deleted successfully", "success")
      } else {
        notify("Failed to delete course", "error")
      }
    } catch {
      notify("An error occurred while deleting the course", "error")
    }
  }



  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button asChild variant="outline" className="ml-2">
          <Link href="/ecourse/add">Tambah Data</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(checked)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* Edit Action */}
                        <DropdownMenuItem onClick={() => window.open(`/ecourse/edit/${row.original.id}`, '_self')}>
                          Edit
                        </DropdownMenuItem>
                        {/* Delete Action */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                          Delete Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  )
}
