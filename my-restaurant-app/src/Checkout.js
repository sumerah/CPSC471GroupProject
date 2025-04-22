import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';

function CheckoutPage() {
    const hasOrdered = useRef(false);
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(true);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (hasOrdered.current) return; // prevent double order
    
        const inProgress = localStorage.getItem('checkoutInProgress');
        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        const userId = localStorage.getItem('userId');
    
        if (!inProgress || !userId || Object.keys(cart).length === 0) {
            navigate('/');
            return;
        }
    
        hasOrdered.current = true; // mark as already ordered
    
        const processOrder = async () => {
            try {
                const orderItems = Object.values(cart).map(item => ({
                    ItemID: item.ItemID,
                    Quantity: item.quantity,
                    Price: item.Price
                }));
    
                const response = await axios.post('http://localhost:5000/api/orders', {
                    userId: userId,
                    items: orderItems
                });
    
                setOrderId(response.data.orderId);
                localStorage.removeItem('cart');
                localStorage.removeItem('checkoutInProgress');
            } catch (error) {
                console.error('Order processing error:', error);
            } finally {
                setTimeout(() => {
                    setProcessing(false);
                }, 2000);
            }
        };
    
        processOrder();
    }, [navigate]);

    return (
        <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container py-5 text-center flex-grow-1">
            {processing ? (
            <>
                <div className="spinner-border spinner-pink text-primary mb-3" role="status">
                <span className="visually-hidden">Processing...</span>
                </div>
                <h4>Processing payment...</h4>
            </>
            ) : (
            <>
                <h3>Payment Successful!</h3>
                <p>Thank you for your order.</p>
                <Link to="/order-status" className="btn btn-outline-primary mt-3">Check Order Status</Link>
            </>
            )}
        </div>
        <Footer />
        </div>
    );
}

export default CheckoutPage;