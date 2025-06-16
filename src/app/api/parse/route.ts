import { NextRequest, NextResponse } from 'next/server';
import { flattenJSON } from '@/utils/flatten';

export async function POST(req: NextRequest) {
     try {
          const body = await req.json();
          const result = flattenJSON(body);
          return NextResponse.json(result);
     } catch (err) {
          return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 });
     }
}
