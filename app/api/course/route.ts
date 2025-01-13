"use server";

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import { neon } from "@neondatabase/serverless";
import axios from 'axios';

const sql = neon(process.env.DATABASE_URL || "");

/** Fetch data from the `eCourse` table */
export async function GET() {
  try {
    const data = await sql`SELECT * FROM eCourse`;
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

/** Upload a file to TinyPNG and return the public URL */
async function uploadFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const response = await axios.post(
    'https://api.tinify.com/shrink',
    buffer,
    {
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: `Basic ${Buffer.from(`api:${process.env.TINYPNG_API_KEY}`).toString('base64')}`,
      },
    }
  );

  const { url: compressedUrl } = response.data?.output || {};
  if (!compressedUrl) throw new Error('Compression failed');

  const compressedData = await axios.get(compressedUrl, { responseType: 'arraybuffer' });
  const filename = `${uuidv4()}.${file.type.split('/')[1] || 'bin'}`;
  const { url } = await put(filename, Buffer.from(compressedData.data), { access: 'public' });

  return url;
}

/** Handle POST requests to upload a file and insert data into the database */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get('picture') as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: 'No valid file provided' }, { status: 400 });
    }

    const { name, author, link_course, description } = Object.fromEntries(formData.entries()) as Record<string, string>;
    const photo_link = await uploadFile(file);

    await sql`
      INSERT INTO eCourse (name, author, link_course, description, photo_link)
      VALUES (${name}, ${author}, ${link_course}, ${description}, ${photo_link});
    `;

    return NextResponse.json({ message: 'Data and file uploaded successfully' });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
