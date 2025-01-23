import { NextResponse } from 'next/server';
import { stripe } from '../../../utils/stripeClient'; // or wherever your Stripe instance is exported
import { connectToDatabase } from '@/app/utils/dbConnect';

/**
 * GET /api/stripe/verify-session?session_id=cs_test_abc123
 * 
 * 1. We get session_id from query params.
 * 2. Retrieve the checkout session from Stripe, then the customer, subscription, etc.
 * 3. Upsert a record in your DB linking that email to an active sub.
 * 4. Return a JSON response with details.
 */
export async function GET(request: Request) {
  try {
    // 1. Parse session_id from the query string
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'No session_id provided' }, { status: 400 });
    }

    // 2. Retrieve the checkout session from Stripe
    // Make sure you have your Stripe secret key in your stripeClient.ts or somewhere safe.
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession) {
      return NextResponse.json({ error: 'Invalid session or session not found' }, { status: 404 });
    }

    // customer can be either a string (cus_ABC) or a full object
    const customerId =
      typeof checkoutSession.customer === 'string'
        ? checkoutSession.customer
        : checkoutSession.customer?.id;

    const subscriptionId =
      typeof checkoutSession.subscription === 'string'
        ? checkoutSession.subscription
        : checkoutSession.subscription?.id;

    if (!customerId) {
      return NextResponse.json({ error: 'No customer found on checkout session' }, { status: 400 });
    }

    // 3. Retrieve the customer object from Stripe to get the email
    const customer = await stripe.customers.retrieve(customerId);
    const email = (customer as Record<string, any>)?.email || '';

    // Optionally retrieve subscription if you need status
    let subscriptionStatus = null;
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      subscriptionStatus = subscription.status; // e.g. 'active'
    }

    // 4. Connect to Mongo and upsert a record 
    const db = await connectToDatabase();
    const paidUsersCollection = db.collection('paidUsers'); 
    // or 'subscriptions', or 'users', whichever you prefer

    // We'll store userEmail + subscription status
    // E.g. if you want to track hasActiveSubscription = (subscriptionStatus === 'active')
    const hasActiveSubscription = subscriptionStatus === 'active';

    const result = await paidUsersCollection.updateOne(
      { email }, // filter by email
      {
        $set: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId || null,
          subscriptionStatus: subscriptionStatus,
          hasActiveSubscription,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Return success
    return NextResponse.json({
      success: true,
      email,
      subscriptionId,
      subscriptionStatus,
      hasActiveSubscription,
    });
  } catch (error) {
    console.error('Error verifying Stripe session:', error);
    return NextResponse.json({ error: 'Failed to verify session', details: String(error) }, { status: 500 });
  }
}
