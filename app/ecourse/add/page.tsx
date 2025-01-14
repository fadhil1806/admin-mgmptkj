"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ModeToggle } from "@/components/mode-toggle"
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
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<{
    name: string;
    author: string;
    link_course: string;
    jabatan: string;
    description: string;
    picture: File | null;
  }>({
    name: "",
    author: "",
    link_course: "",
    jabatan: "",
    description: "",
    picture: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0] || null;
      setFormData((prevData) => ({ ...prevData, picture: file }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file size (in bytes)
      const maxSize = 250 * 1024; // 300KB in bytes

      const validTypes = ["image/jpg", "image/jpeg", "image/webp", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image (JPG, JPEG, or WEBP).");
        inputFileRef.current!.value = "";
        return;
      }

      if (file.size > maxSize) {
        setError("File size exceeds 300KB. Please upload a smaller file.");
        inputFileRef.current!.value = "";
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData];
      if (value) {
        formDataToSend.append(key, value as string | Blob);
      }
    });

    const file = inputFileRef.current?.files?.[0];
    if (file) {
      formDataToSend.append('picture', file);
    }

    try {
      await fetch('/api/course', {
        method: 'POST',
        body: formDataToSend,
      });

      setFormData({
        name: "",
        author: "",
        link_course: "",
        jabatan: "",
        description: "",
        picture: null,
      });

      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }

      toast.success("Form submitted successfully!");
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <ModeToggle />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/ecourse">
                E-Course
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Add</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 rounded-xl border bg-card text-card-foreground shadow p-3" >
        <Card className="mx-auto max-w-2xl mt-8 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Tambah Data E-Course</CardTitle>
            <CardDescription>
              
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama e-Course</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Basic Teknik Jaringan dan Aplikasi "
                  required
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="picture">Foto e-Course</Label>
                <Input
                  name="file"
                  multiple={false}
                  id="picture"
                  type="file"
                  ref={inputFileRef}
                  required
                  accept="image/jpeg, image/jpg, image/webp, image/png"  // Accept only JPG, JPEG, and WEBP
                  onChange={handleFileChange}
                />
                {error && <p style={{ color: 'red' }} className="text-sm">{error}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link_course">Link Course</Label>
                <Input
                  id="link_course"
                  type="text"
                  required
                  placeholder="https://gptcentral.tradepub.com/"
                  value={formData.link_course}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Mgmp Tkj Jabar Comunity"
                  required
                  value={formData.author}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">description</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi terhadap e-course ini"
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </>
  );
}
