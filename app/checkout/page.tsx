'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Truck,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

// Sample cart items for checkout
const cartItems = [
  {
    id: 1,
    title: 'Study Desk with Ergonomic Chair',
    price: 8500,
    commission: 850,
    quantity: 1,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'John Kiprotich'
  },
  {
    id: 2,
    title: 'Gas Cylinder (13kg) with Burner',
    price: 4200,
    commission: 420,
    quantity: 1,
    image: 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: 'Mary Wanjiku'
  }
];

export default function Checkout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCommission = cartItems.reduce((sum, item) => sum + (item.commission * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 200 : 0;
  const total = subtotal + totalCommission + deliveryFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(4); // Success step
    }, 3000);
  };

  const steps = [
    { id: 1, title: 'Shipping Info', completed: currentStep > 1 },
    { id: 2, title: 'Delivery Method', completed: currentStep > 2 },
    { id: 3, title: 'Payment', completed: currentStep > 3 },
    { id: 4, title: 'Confirmation', completed: currentStep === 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/cart">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed || currentStep === step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.completed || currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    step.completed ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input id="address" placeholder="Enter full address" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" />
                    </div>
                    <div>
                      <Label htmlFor="county">County</Label>
                      <Input id="county" placeholder="Enter county" />
                    </div>
                  </div>
                  
                  <Button onClick={() => setCurrentStep(2)} className="w-full">
                    Continue to Delivery
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <div className="flex-1">
                          <Label htmlFor="delivery" className="font-medium">Home Delivery</Label>
                          <p className="text-sm text-gray-600">Delivered to your doorstep</p>
                          <p className="text-sm font-medium text-green-600">KSh 200</p>
                        </div>
                        <Truck className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <div className="flex-1">
                          <Label htmlFor="pickup" className="font-medium">Pickup Point</Label>
                          <p className="text-sm text-gray-600">Collect from designated location</p>
                          <p className="text-sm font-medium text-green-600">Free</p>
                        </div>
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </RadioGroup>
                  
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)} className="flex-1">
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <div className="flex-1">
                          <Label htmlFor="mpesa" className="font-medium">M-Pesa</Label>
                          <p className="text-sm text-gray-600">Pay with your M-Pesa account</p>
                        </div>
                        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">M</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="font-medium">Credit/Debit Card</Label>
                          <p className="text-sm text-gray-600">Pay with Visa, Mastercard</p>
                        </div>
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="bank" id="bank" />
                        <div className="flex-1">
                          <Label htmlFor="bank" className="font-medium">Bank Transfer</Label>
                          <p className="text-sm text-gray-600">Direct bank transfer</p>
                        </div>
                        <div className="w-5 h-5 bg-blue-600 rounded" />
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'mpesa' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <Label htmlFor="mpesaNumber">M-Pesa Phone Number</Label>
                      <Input id="mpesaNumber" placeholder="254XXXXXXXXX" className="mt-2" />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handlePayment} 
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Pay KSh ${total.toLocaleString()}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                  <p className="text-gray-600 mb-6">
                    Your order has been confirmed and will be processed shortly.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="text-lg font-bold text-gray-900">#ORD-2024-001</p>
                  </div>
                  <div className="flex gap-4">
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Orders
                      </Button>
                    </Link>
                    <Link href="/products" className="flex-1">
                      <Button className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        KSh {((item.price + item.commission) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>KSh {totalCommission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span>KSh {deliveryFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Secure Payment</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}