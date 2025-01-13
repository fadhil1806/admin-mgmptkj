import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DataCourse } from "./table-ecourse"


export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Data
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>E-Course</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 p-3 border bg-card shadow h-[100px] w-full" >
                <h3 className="tracking-tight text-sm font-medium">Total Task</h3>
                <h1 className="text-2xl font-bold">89 Task</h1>
                <p className="text-xs text-muted-foreground">21.2% from last month</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-3 border bg-card shadow h-[100px] w-full" >
                <h3 className="tracking-tight text-sm font-medium">Late Status</h3>
                <h1 className="text-2xl font-bold">20 Children</h1>
                <p className="text-xs text-muted-foreground">+20.1% from last week</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-3 border bg-card shadow h-[100px] w-full" >
                <h3 className="tracking-tight text-sm font-medium">Timely Status</h3>
                <h1 className="text-2xl font-bold">0 Children</h1>
                <p className="text-xs text-muted-foreground">-50.1% from last week</p>
            </div>
          </div> */}
          <div className="flex-1 rounded-xl rounded-xl border bg-card text-card-foreground shadow p-3" >
            <DataCourse/>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}