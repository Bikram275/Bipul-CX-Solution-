
export const CATEGORIES = [
  'Ordered',
  'Shipped',
  'Delivered',
  'Return',
  'Exchange',
  'Cancelled',
  'Refund',
  'Non Order'
];

export const ALL_QUERIES_LIST = [
    "Account_Blocked_Fraud_detected", "Account_takeover_Fraud", "Address_Mobile_Number_Update", "Amount_Collected_Via_UPI_Before_Deliveryboy_Reach_Premises", "Amount_debited_but_order_not_placed_Online", "App_not_working", "Arrange_POD_called_after_TAT", "AWB_Generated_After_Reinitiation", "AWB_Not_Generated_After_TAT_Escalated", "AWB_Not_Generated_After_TAT_Tech", "AWB_Not_Generated_Within_24_hrs", "Cant_place_order", "Cant_share_catalogs", "Change_Failed_to_update_Bank_Details", "Change_in_Delivery_date", "Change_in_Dispatch_date", "COD_option_not_available", "Complaint_on_discount_offer_Contest", "Complaint_On_Meesho_Balance", "Complaint_On_Meesho_Community", "Complaint_On_Meesho_Website", "Complaint_Raised_With_Order_ID", "Convenience_charges_Query", "Counterfeit_Fake_Duplicate_Product_Received", "Customer_contacted", "Damaged_Non_returnable_product", "DD_OneTimeException", 
    "Delay_delivery_After_TAT", 
    "Delay_dispatch_after_TAT", "Delivery_date_Confirmation_Assurance", "Delivery_Timelines_Query", "Delivery_Wants_Open_or_Express_delivery", "Dispatch_date_Confirmation_Assurance", "Dispatch_Wants_Open_or_Express_delivery", "Eligibility_Related_Query_Pay_Later", "Enquired_about_Bank_Penny_Process", "Enquiry_on_Farmiso_or_Superstore", "Enquiry_On_Google_Ads", "Enquiry_on_Large_Appliances_Phones", "Enquiry_on_Reselling", "Enquiry_on_Smart_Coins", "Enquiry_On_Travel_Category", "Exception_Non_QC_Pickup", "Exchange_cancellation_time_exceeded", "Exchange_Confirmation_Pending_After_24_hrs", "Exchange_Confirmation_Pending_Tech", "Exchange_Confirmation_Pending_Within_24_hrs", "Exchange_Delay_delivery_after_TAT", "Exchange_delay_dispatch", "Exchange_Delivery_Unsuccessful_Reseller_requests_reattempt", "Exchange_Enquiry_on_Pickup_status_called_before_TAT", "Exchange_fake_and_wrong_update_by_courier", "Exchange_Order_status", "Exchange_Order_Tracking_Issues", "Exchange_POD", "Exchange_POD_After_TAT", "Exchange_POD_FE_Collected_OTP_wrong_Commitment", "Exchange_POD_Multiple_OTP_Order_Delivery", "Exchange_POD_OTP_Cancellation_Requested_but_Delivered", "Exchange_POD_User_Unavailable_OTP_Provided", "Exchange_Request_denial", "Exchange_To_Return", "Exchange_Unavailable_or_criteria_not_met", "Exchange_Wants_Open_or_Express_delivery", "Extra_amount_collected", "Extra_Amount_Processed_Due_To_New_Invoice_Structure", "Extra_product_handed_over_Different_Supplier", "Extra_product_handed_over_Same_Supplier", "Fake_fraud_orders", "First_time_order_discount", 
    "Forward_fake_and_wrong_update_by_courier", 
    "Forward_POD_FE_Collected_OTP_wrong_Commitment", "Forward_POD_Multiple_OTP_Order_Delivery", "Forward_POD_OTP_Cancellation_Requested_but_Delivered", "Forward_POD_User_Unavailable_OTP_Provided", "Forward_User_requests_reattempt", "Garbage_or_Empty_Box", "Gave_wrong_item_to_courier", "General_Inquiry_Pay_Later", "Guided_User_to_Reinitiate_Exchange_Request_Within_3days", "Guided_User_to_Reinitiate_Pickup_Address_Number_Change", "Guided_User_to_Reinitiate_Return_Request_Within_3days", "Guided_User_to_Reinitiate_Return_Unbundling", "H2H_Old_Product_Picked_Exchange_Product_Not_Delivered", "H2H_Product_Not_Picked_Nor_Exchange_Product_Delivered", "How_to_place_an_order", "How_to_search_Shared_Catalog", "How_To_Update_Address_While_Placing_an_Order", "How_to_update_Bank_Details", "How_To_Update_UPI_Details", "Images_not_loading_Opening", "Incomplete_product_description", "Insurance_Post_purchase_query", "Insurance_Pre_purchase_query", "Invalid_POD", "Issue_Resolved_Multiple_Calls_Received", "Language_barrier", "Manual_reverse_pickup", "Margin_Initiated_Called_Before_TAT", "Margin_initiated_not_reflecting_in_account", "Margin_Not_Initiated_Called_after_TAT", "Margin_Not_Initiated_Called_before_TAT", "Meesho_Wallet_Related_Query", "Misbehavior_of_Delivery_boy", "Misroute_Lost_in_transit_COD", "Misroute_Lost_in_transit_Prepaid", "Missing_Combo_Missing_Set", "Missing_Order_Same_AWB_Escalated", "Missing_Quantity_Request_Escalated", "Non_OTP_Delivery", "Non_OTP_Delivery_Meesho_Balance", "Non_Serviceable_Zone_Self_Ship_the_product", "Non_User_Getting_Meesho_Emails", "Not_Received_Credits", "ODA_Hub_Address", "Online_Cancellation_Self_help", "Order_Already_Cancelled", "Order_not_shipped_AWB_Cant_cancel", "Order_shipped_cant_cancel_COD", "Order_shipped_cant_cancel_Prepaid", "Orders_Visible_In_APP_But_Not_Visible_In_Admin_Panel", "Other_Query_Related_To_Meesho", "OTP_QRScan_UPILink_Not_Received", "Out_for_Delivery_Msg_Not_Received", "Pay_Later_Payment_Related_concern", "Payment_options_query", "Payment_Pending_Status", "Pickup_Not_Done_After_TAT", "Pickup_Not_Done_Heavy_Product", "Pincode_COD_serviceability", "POD_OTP_Based_Delivery", "Pre_order_query", "Prices_Related", "Product_delivered_Status_not_Updated_API", "Product_delivered_Status_not_Updated_Within_24hrs", "Product_delivered_tracking_Not_Updated", "Product_delivered_tracking_Updated_RTO", "Product_description_provided", "Product_not_Picked_Ordertimeline_picked", "Product_out_of_Stock", "Product_Picked_Ordertimeline_Cancelled", "Product_picked_Tracking_Cancelled_Proof_available", "Product_picked_Tracking_Cancelled_Proof_not_available", "Product_picked_up_pickup_slip_not_available", "Product_Pickedup_Status_not_Updated_within_24hrs", "Product_Quality", "Product_reached_Nearest_Hub", "Product_received_with_Price_Tag", "Product_RTO'ed", "Profile_Related_Query", "Query_not_related_to_Meesho", "Query_on_discount_Offer_Contest", "Query_On_Meesho_Balance", "Query_On_Meesho_Influencer_Program", "Query_On_Meesho_Website", "Raise_Exchange_Explained_self_help", "Raise_return_Explained_self_help", "Raise_return_Unbundling_Explained_self_help", "Referral_Program_Discontinued", "Refund_amount_dispute_Bank", "Refund_amount_dispute_Manual", "Refund_amount_dispute_Meesho_Balance", "Refund_amount_dispute_Prepaid", "Refund_amount_dispute_UPI", "Refund_initiated_called_before_TAT", "Refund_initiated_called_before_TAT_Meesho_Balance", "Refund_initiated_Not_reflecting_in_account", "Refund_initiated_Not_reflecting_in_account_Manual", "Refund_Not_initiated_after_TAT_Manual", "Refund_Not_Initiated_Called_after_TAT_Bank", "Refund_Not_Initiated_Called_after_TAT_Meesho_Balance", "Refund_Not_Initiated_Called_after_TAT_Prepaid", "Refund_Not_Initiated_Called_after_TAT_UPI", "Refund_not_Initiated_Called_Before_TAT_Bank", "Refund_not_initiated_called_before_TAT_Manual", "Refund_not_initiated_called_before_TAT_Meesho_Balance", "Refund_not_Initiated_Called_Before_TAT_Prepaid", "Refund_not_initiated_called_before_TAT_UPI", "Reinitiate_Exchange_Request_Multiple_Times_Ops", "Reinitiate_Return_Request_morethan_3times", "Reinitiate_Return_Request_Multiple_Times_Ops", "Reinitiated_Exchange_request", "Reinitiated_return_request", "Rejected_Parcel_Want_To_Give_Feedback", "Removal_Of_Google_Ads", "Return_cancellation_time_exceeded", "Return_Confirmation_Pending_After_24_hrs", "Return_Confirmation_Pending_Tech", "Return_Confirmation_Pending_Within_24_hrs", "Return_Enquiry_on_Pickup_status_called_before_TAT", "Return_Request_denial", "Return_to_Exchange", "Return_Unavailable", "Return_Unbundling_Exchange_Out_Of_Stock", "Return_Unbundling_Request_denial", "Reverse_fake_and_wrong_update_by_courier", "Shipping_charges_Query", "Smart_Coins_Got_Expired", "Smart_Coins_Not_Credited_to_account",
    "Supplier_cancelled_Delay_Dispatch_Delivery", 
    "Supplier_Cancelled_Delay_Dispatch_Delivery", 
    "Supplier_cancelled_Product_out_of_Stock", "Suppliers_Contacting_Customers_Directly", "Time_exceeded_Cant_exchange", "Time_exceeded_Cant_return", "Tracking_Issues", "UC_Reject_DuplicateClaim", "UC_Reject_TAT_Breach", "Unable_to_add_shipping_and_billing_address", "Unable_to_login_Register", "Unable_to_Raise_Return_exchange_request", "Unable_To_Redeem_Smart_Coins", "Unable_to_track_Self_shipment", "Unable_to_Update_Bank_Details", "Unable_to_Update_Bank_Details_Limit_Breached", "Unable_to_Update_Bank_Details_Verification_Error", "Unable_To_Update_UPI_Details", "Unable_to_Use_Meesho_Credits", "Unable_To_Use_Pay_Later", "Unconsented_Order", "Unsubscribe_Notification_Meesho_app", "Updated_Bank_Details_After_Payment_Initiation", "User_query_on_different_account", "User_requesting_for_future_date_delivery", "User_Requesting_POD_for_COD_Order", "User_Wants_to_Deactivate_Meesho_Account", "Valmo_Franchise", "Want_to_cancel_exchange_request", "Want_to_cancel_return_request", "Want_to_exchange_second_time", "Warranty_Guarantee_info", "What_is_Margin_How_To_Add", "Wrong_Order_Status_RTO_Notified", "Wrong_Update_QC_Failed_Ops", "Wrong_Update_QC_Failed_Tech", "Zero_Margin_or_amount_dispute"
];

const determineCategory = (title) => {
    const lowerTitle = title.toLowerCase();
    // Strictly following PDF mappings
    if (lowerTitle.includes('refund')) return 'Refund';
    if (lowerTitle.includes('exchange')) return 'Exchange';
    if (lowerTitle.includes('return') || lowerTitle.includes('reverse') || lowerTitle.includes('manual_reverse')) return 'Return';
    if (lowerTitle.includes('cancel') || lowerTitle.includes('fake_fraud')) return 'Cancelled';
    if (lowerTitle.includes('deliver') || lowerTitle.includes('pod') || lowerTitle.includes('collected')) return 'Delivered';
    if (lowerTitle.includes('dispatch') || lowerTitle.includes('ship') || lowerTitle.includes('awb') || lowerTitle.includes('track') || lowerTitle.includes('transit') || lowerTitle.includes('rto')) return 'Shipped';
    if (lowerTitle.includes('order') || lowerTitle.includes('place_order') || lowerTitle.includes('checkout')) return 'Ordered';
    return 'Non Order';
};

export const INITIAL_SOPS = ALL_QUERIES_LIST.map((query) => {
    let flowSteps = undefined;
    if (query === "Forward_fake_and_wrong_update_by_courier") {
        flowSteps = [
            {
                id: "START",
                message: "Is there a previously raised complaint regarding this issue? (Complaint Exists?)",
                options: [
                    { label: "Complaint Exists", nextStepId: "EXISTS_SOLUTION" },
                    { label: "Complaint Does Not Exist", nextStepId: "CHECK_OFD" }
                ]
            },
            {
                id: "EXISTS_SOLUTION",
                message: "আপনার অভিযোগটি চেক করা হয়েছে। বর্তমান স্ট্যাটাস পেন্ডিং। অনুগ্রহ করে অপেক্ষা করুন। আমাদের সাপোর্ট টিম শীঘ্রই আপডেট জানাবে। <br><br> <span class='bold'>Unique ID: {{UNIQUE_ID}}</span>",
                options: [],
                isFinal: true
            },
            {
                id: "CHECK_OFD",
                message: "Is the order status 'Out for Delivery'?",
                options: [
                    { label: "Order Out for Delivery", nextStepId: "OFD_YES_SOLUTION" },
                    { label: "Not Out for Delivery", nextStepId: "OFD_NO_SOLUTION" }
                ]
            },
            {
                id: "OFD_YES_SOLUTION",
                message: "অর্ডারটি আজ ডেলিভারির জন্য বের হয়েছে। গ্রাহককে সন্ধ্যা পর্যন্ত অপেক্ষা করতে বলুন। ড্রাইভারের সাথে যোগাযোগ করা হচ্ছে। <br><br> <span class='bold'>Unique ID: {{UNIQUE_ID}}</span>",
                options: [],
                isFinal: true
            },
            {
                id: "OFD_NO_SOLUTION",
                message: "আমরা ডেলিভারি পার্টনারের বিরুদ্ধে অভিযোগ নিয়েছি। ফেক আপডেটের বিষয়টি গুরুত্বসহকারে দেখা হচ্ছে এবং রি-এটেম্পট এর ব্যবস্থা করা হবে। <br><br> <span class='bold'>Unique ID: {{UNIQUE_ID}}</span>",
                options: [],
                isFinal: true
            }
        ];
    }
    return {
        id: query,
        title: query,
        category: determineCategory(query),
        content: `Standard procedure for ${query.replace(/_/g, ' ')}.`,
        flowSteps: flowSteps,
        tags: [],
        lastUpdated: new Date().toISOString(),
        views: 0
    };
});
