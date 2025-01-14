"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

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

  // Fetch data for the specific course ID
  useEffect(() => {
    if (id) {
      fetch(`/api/ecourse/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            author: data.author || "",
            link_course: data.link_course || "",
            jabatan: data.jabatan || "",
            description: data.description || "",
            picture: null,
          });
        })
        .catch(() => {
          toast.error("Failed to fetch course data.");
        });
    }
  }, [id]);

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
      const maxSize = 250 * 1024; // 250KB in bytes
      const validTypes = ["image/jpg", "image/jpeg", "image/webp", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image (JPG, JPEG, WEBP, or PNG).");
        inputFileRef.current!.value = "";
        return;
      }

      if (file.size > maxSize) {
        setError("File size exceeds 250KB. Please upload a smaller file.");
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
      if (value && key !== "picture") {
        formDataToSend.append(key, value as string);
      }
    });

    const file = inputFileRef.current?.files?.[0];
    if (file) {
      formDataToSend.append("picture", file);
    }

    try {
      await fetch(`/api/ecourse/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      toast.success("Form updated successfully!");
      router.push("/ecourse");
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <ModeToggle />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/ecourse">E-Course</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex-1 p-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Edit E-Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Label htmlFor="name">Nama e-Course</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Label htmlFor="picture">Foto e-Course</Label>
              <Input
                id="picture"
                type="file"
                ref={inputFileRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/jpg, image/webp, image/png"
              />
              {error && <p className="text-red-500">{error}</p>}
              <Label htmlFor="link_course">Link Course</Label>
              <Input
                id="link_course"
                value={formData.link_course}
                onChange={handleChange}
                required
              />
              <Label htmlFor="author">Penulis</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <Button type="submit">Update</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </>
  );
}
