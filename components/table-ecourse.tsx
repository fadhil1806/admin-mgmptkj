"use client";

import axios from "axios";
import * as React from "react";
import { useEffect } from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Pastikan untuk mengimpor CSS

export type Payment = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  class_enum: string;
  subjects: string;
  link: string;
  description: string;
  status: "Late Status" | "Timely Status";
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Email <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("first_name")}</div>,
  },
  {
    accessorKey: "telephone",
    header: "Telephone",
    cell: ({ row }) => <div className="capitalize">{row.getValue("telephone")}</div>,
  },
  {
    accessorKey: "class_enum",
    header: "Class",
    cell: ({ row }) => <div className="capitalize">{row.getValue("class_enum")}</div>,
  },
];

export function TableJobs() {
   const [data, setData] = React.useState<Payment[]>([]);
   const [sorting, setSorting] = React.useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
   const [rowSelection, setRowSelection] = React.useState({});
   const [deleteId, setDeleteId] = React.useState<string | null>(null);
   const [isOpen, setIsOpen] = React.useState(false);

   // Fetch data from API on component mount
   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch("/api/submissions");
         const data = await response.json();
         setData(data);
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
     fetchData();
   }, []);

   const handleDelete = async () => {
     if (deleteId) {
       try {
         await axios.delete(`/api/submissions/${deleteId}`);
         toast.success("Form submitted successfully!");
         setTimeout(() => {
           window.location.reload();
         }, 2500);
       } catch {
         toast.error('An error occurred. Please try again.');
       }
     }
     setIsOpen(false);
   };

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
     state: { sorting, columnFilters, columnVisibility, rowSelection },
   });

   return (
     <>
       <ToastContainer />
       <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
         <AlertDialogTrigger asChild>
           <Button variant="outline" style={{ display: 'none' }}>Show Dialog</Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
             <AlertDialogDescription>
               This action cannot be undone. This will permanently delete your account and remove your data from our servers.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>

       <div className="w-full">
         <h1 className="text-xl font-bold">Submissions Task History</h1>
         <div className="flex items-center py-4">
           <Input
             placeholder="Filter emails..."
             value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
             onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
             className="max-w-sm"
           />
           <Button variant="outline" className="ml-auto" onClick={() => window.open('/form/task/create', '_self')}>Add Data</Button>

           {/* Dropdown for Column Visibility */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="outline" className="ml-auto">Columns <ChevronDown /></Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end">
               {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                 <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                   {column.id}
                 </DropdownMenuCheckboxItem>
               ))}
             </DropdownMenuContent>
           </DropdownMenu>
         </div>

         {/* Table Rendering */}
         <div className="rounded-md border">
           <Table>
             <TableHeader>
               {table.getHeaderGroups().map((headerGroup) => (
                 <TableRow key={headerGroup.id}>
                   {headerGroup.headers.map((header) => (
                     <TableHead key={header.id}>
                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                     </TableHead>
                   ))}
                 </TableRow>
               ))}
             </TableHeader>

             <TableBody>
               {table.getRowModel().rows.length ? (
                 table.getRowModel().rows.map((row) => (
                   <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                     {row.getVisibleCells().map((cell) => (
                       <TableCell key={cell.id}>
                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
                       </TableCell>
                     ))}
                     {/* Actions Column */}
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
                           <DropdownMenuItem onClick={() => window.open(`/form/edit/${row.original.id}`, '_self')}>Edit</DropdownMenuItem>
                           {/* Delete Action */}
                           <DropdownMenuSeparator />
                           {/* Set deleteId and open dialog */}
                           <DropdownMenuItem onClick={() => { 
                             setDeleteId(row.original.id); 
                             setIsOpen(true); 
                           }}>Delete</DropdownMenuItem> 
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))
               ) : (
                 // No results message
                 <TableRow>
                   <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </div>

         {/* Pagination Controls */}
         {/* Add pagination controls here if needed */}

       </div> 
     </>
   );
}