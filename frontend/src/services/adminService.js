import { auth } from "../firebase/firebase";

// 🔥 Get all orders (ADMIN)
export const getAllOrders = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    const token = await user.getIdToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    return data;

  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    throw err;
  }
};

// 🔥 Update order (ADMIN)
export const updateOrder = async (id, updates) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    const token = await user.getIdToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, 
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Update failed");
    }

    return data;

  } catch (err) {
    console.error("❌ Update Order Error:", err);
    throw err;
  }
};