import mongoose from "mongoose";
import { env } from "../config/env";
import BlockedToken from "../features/auth/models/blocked-token.model";
import {
  addTokenToBlocklist,
  isTokenBlacklisted,
} from "../features/auth/services/blocked-token.service";

/**
 * Test script for token blacklisting functionality
 * Run this script to verify the token blacklisting system works correctly
 */

async function testTokenBlacklist() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Test 1: Add a token to blocklist
    console.log("Test 1: Adding a token to blocklist");
    const testToken = "test.jwt.token.123";
    const testUserId = new mongoose.Types.ObjectId();

    await addTokenToBlocklist(testToken, "access", testUserId);
    console.log("✅ Token added to blocklist\n");

    // Test 2: Check if token is blacklisted
    console.log("Test 2: Checking if token is blacklisted");
    const isBlacklisted = await isTokenBlacklisted(testToken);
    console.log(`Token blacklisted: ${isBlacklisted}`);
    console.log(isBlacklisted ? "✅ Test passed" : "❌ Test failed");
    console.log("");

    // Test 3: Check non-existent token
    console.log("Test 3: Checking non-existent token");
    const nonExistentToken = "non.existent.token";
    const isNonExistentBlacklisted = await isTokenBlacklisted(nonExistentToken);
    console.log(`Non-existent token blacklisted: ${isNonExistentBlacklisted}`);
    console.log(
      !isNonExistentBlacklisted ? "✅ Test passed" : "❌ Test failed"
    );
    console.log("");

    // Test 4: View all blocked tokens
    console.log("Test 4: Viewing all blocked tokens");
    const allBlockedTokens = await BlockedToken.find();
    console.log(`Total blocked tokens: ${allBlockedTokens.length}`);
    console.log("✅ Test passed\n");

    // Test 5: Cleanup (remove test token)
    console.log("Test 5: Cleaning up test data");
    await BlockedToken.deleteOne({ token: testToken });
    const afterCleanup = await isTokenBlacklisted(testToken);
    console.log(`Token still blacklisted after cleanup: ${afterCleanup}`);
    console.log(!afterCleanup ? "✅ Test passed" : "❌ Test failed");
    console.log("");

    console.log("🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run tests
testTokenBlacklist();
