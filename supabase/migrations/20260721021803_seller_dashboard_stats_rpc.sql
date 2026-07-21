-- Migration: Add seller stats RPC function
CREATE OR REPLACE FUNCTION get_seller_dashboard_stats(p_seller_id UUID)
RETURNS json AS $$
DECLARE
    v_total_earnings DECIMAL(10,2) := 0;
    v_pending_escrow DECIMAL(10,2) := 0;
    v_active_listings INT := 0;
    v_total_orders INT := 0;
    v_total_withdrawn DECIMAL(10,2) := 0;
    v_available_balance DECIMAL(10,2) := 0;
BEGIN
    -- 1. Orders stats
    SELECT 
        COALESCE(SUM(seller_receivable) FILTER (WHERE status = 'COMPLETED'), 0),
        COALESCE(SUM(seller_receivable) FILTER (WHERE status IN ('PAYMENT_SUCCESS', 'HELD_IN_ESCROW', 'DELIVERED', 'PROCESSING_DELIVERY')), 0),
        COUNT(id)
    INTO 
        v_total_earnings,
        v_pending_escrow,
        v_total_orders
    FROM orders
    WHERE seller_id = p_seller_id;

    -- 2. Products stats
    SELECT COUNT(id)
    INTO v_active_listings
    FROM products
    WHERE seller_id = p_seller_id AND is_available = true;

    -- 3. Payouts stats
    SELECT COALESCE(SUM(amount), 0)
    INTO v_total_withdrawn
    FROM payouts
    WHERE seller_id = p_seller_id AND status IN ('COMPLETED', 'PROCESSING', 'PENDING');

    -- 4. Calculate available balance
    v_available_balance := GREATEST(0, v_total_earnings - v_total_withdrawn);

    RETURN json_build_object(
        'totalEarnings', v_total_earnings,
        'pendingEscrow', v_pending_escrow,
        'activeListings', v_active_listings,
        'totalOrders', v_total_orders,
        'availableBalance', v_available_balance,
        'totalWithdrawn', v_total_withdrawn
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
