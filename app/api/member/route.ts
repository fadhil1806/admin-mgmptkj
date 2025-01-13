"use server";

import {  NextResponse } from 'next/server';
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET() {
  try {
    const data = await sql`SELECT * FROM member`;
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}