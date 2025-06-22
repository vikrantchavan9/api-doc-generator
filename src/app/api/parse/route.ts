import { NextRequest, NextResponse } from 'next/server';
import { flattenJSON } from '@/utils/flatten'; // Assuming flattenJSON is correctly typed to return ResultItem[]

export async function POST(req: NextRequest) {
     try {
          const body = await req.json();
          const result = flattenJSON(body); // flattenJSON should return ResultItem[]
          return NextResponse.json(result);
     } catch (error: unknown) { // Type the error as 'unknown' for safety
          console.error('Error parsing or flattening JSON:', error); // <-- Use the 'error' variable here
          return NextResponse.json({ error: 'Invalid JSON input', details: String(error) }, { status: 400 }); // Optionally include error details
     }
}