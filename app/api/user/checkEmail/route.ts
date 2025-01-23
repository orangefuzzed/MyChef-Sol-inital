// app/api/user/checkEmail/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'No email provided' }, { status: 400 });
  }

  const db = await connectToDatabase();

  // 1. paidUsers
  const paid = await db.collection('paidUsers').findOne({ email });
  const hasActiveSubscription = paid?.hasActiveSubscription === true;

  // 2. users
  const userDoc = await db.collection('users').findOne({ email });
  const hasCreatedAccount = !!userDoc;

  return NextResponse.json({
    hasActiveSubscription,
    hasCreatedAccount,
  });
}
