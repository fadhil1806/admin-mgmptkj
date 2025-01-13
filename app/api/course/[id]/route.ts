import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
// import axios from 'axios';
import { del } from '@vercel/blob';

const sql = neon(process.env.DATABASE_URL || "");

// Delete the course from the database and remove the associated file from Vercel Blob storage
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

  try {
    // Fetch the course to get the file path from the database
    const course = await sql`SELECT * FROM eCourse WHERE id = ${id}`;

    if (!course || course.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }


    const courseData = course[0]; // Assuming single result for id

    // Assuming the photo or file is stored in 'photo_link' field
    const filePath = courseData.photo_link;

    await del(filePath)
    // Delete file from Vercel Blob storage
    // try {
    //   await axios.delete(`https://api.vercel.com/v1/blob/${filePath}`, {
    //     headers: {
    //       Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    //     },
    //   });
    //   console.log(`File ${filePath} deleted successfully from Vercel Blob storage.`);
    // } catch (fileError) {
    //   console.error('Error deleting file from Vercel Blob:', fileError);
    // }

    // Delete course from the database
    await sql`DELETE FROM eCourse WHERE id = ${id}`;

    return NextResponse.json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
