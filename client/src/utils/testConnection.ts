import axios from "axios";
import { BASE_URL } from "@/service/config";

export const testServerConnection = async () => {
  console.log("=== Testing Server Connection ===");
  console.log("BASE_URL:", BASE_URL);
  
  try {
    // Test 1: Health check
    console.log("Test 1: Checking health endpoint...");
    const healthResponse = await axios.get(`${BASE_URL}/health`, {
      timeout: 5000,
    });
    console.log("✅ Health check successful:", healthResponse.data);
    
    // Test 2: Sign in test
    console.log("Test 2: Testing sign-in endpoint...");
    const signInResponse = await axios.post(`${BASE_URL}/auth/signin`, {
      phone: "999999999",
      role: "customer",
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("✅ Sign-in test successful:", signInResponse.data);
    
    return {
      success: true,
      message: "All tests passed! Server is reachable.",
    };
  } catch (error: any) {
    console.error("❌ Connection test failed:");
    console.error("Error code:", error?.code);
    console.error("Error message:", error?.message);
    console.error("BASE_URL used:", BASE_URL);
    
    return {
      success: false,
      message: `Connection failed: ${error?.message || "Unknown error"}`,
      details: {
        code: error?.code,
        message: error?.message,
        baseUrl: BASE_URL,
      },
    };
  }
};

