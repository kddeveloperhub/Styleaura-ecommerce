import { auth } from "../firebase/firebase";

export const placeOrder = async (orderData) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
        error: "User not logged in",
      };
    }

    // 🔐 Get Firebase token
    const token = await user.getIdToken();

    // ❗ IMPORTANT: DO NOT send total from frontend
    const payload = {
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      state: orderData.state,
      zip: orderData.zip,
      items: orderData.items, // backend will calculate total
    };

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Order failed");
    }

    return {
      success: true,
      orderId: data.orderId,
    };

  } catch (err) {
    console.error("❌ Order Error:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};