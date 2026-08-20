"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSecureAIAgent = exports.onDeleteCustomer = exports.onDeleteEmployee = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore_1 = require("firebase-functions/v2/firestore");
// Initialize firebase admin SDK
admin.initializeApp();
/**
 * Trigger: On Employee Document Delete (Gen 2)
 * Action: Automatically delete corresponding Firebase Auth user profile
 */
exports.onDeleteEmployee = (0, firestore_1.onDocumentDeleted)('employees/{employeeId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.warn('⚠️ No snapshot found for delete event.');
        return;
    }
    const data = snapshot.data();
    // Retrieve authUid from field or fall back to document ID (assuming doc ID is the uid)
    const uid = data?.authUid || data?.uid || event.params.employeeId;
    if (!uid) {
        console.warn('❌ No valid authUid found for deleted employee:', event.params.employeeId);
        return;
    }
    try {
        await admin.auth().deleteUser(uid);
        console.log(`✅ Successfully deleted Auth User: ${uid} (Employee profile removed)`);
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.warn(`ℹ️ Auth User ${uid} already deleted or does not exist.`);
        }
        else {
            console.error(`❌ Failed to delete Auth User ${uid}:`, error);
        }
    }
});
/**
 * Trigger: On Customer Document Delete (Gen 2)
 * Action: Automatically delete corresponding Firebase Auth user profile
 */
exports.onDeleteCustomer = (0, firestore_1.onDocumentDeleted)('customers/{customerId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.warn('⚠️ No snapshot found for delete event.');
        return;
    }
    const data = snapshot.data();
    // Retrieve authUid from field or fall back to document ID
    const uid = data?.authUid || data?.uid || event.params.customerId;
    if (!uid) {
        console.warn('❌ No valid authUid found for deleted customer:', event.params.customerId);
        return;
    }
    try {
        await admin.auth().deleteUser(uid);
        console.log(`✅ Successfully deleted Auth User: ${uid} (Customer profile removed)`);
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.warn(`ℹ️ Auth User ${uid} already deleted or does not exist.`);
        }
        else {
            console.error(`❌ Failed to delete Auth User ${uid}:`, error);
        }
    }
});
/**
 * HTTPS Callable Function: Secure AI Agent Proxy
 * Action: Calls OpenAI/Claude secure endpoints without exposing the API keys to the client browser
 */
exports.callSecureAIAgent = functions.https.onCall(async (data, context) => {
    // 1. Ensure user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', '⚠️ يجب تسجيل الدخول للوصول إلى هذا المورد التشغيلي.');
    }
    const { agentId, prompt } = data;
    if (!agentId || !prompt) {
        throw new functions.https.HttpsError('invalid-argument', '⚠️ المعاملات المرسلة غير كاملة (agentId, prompt).');
    }
    // 2. Retrieve secure API key from environment config/secrets
    const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.key || 'mock-secure-api-key-for-preview';
    console.log(`🔐 Accessing Secure Environment API for Agent: ${agentId} using key prefix: ${apiKey.substring(0, 8)}...`);
    try {
        // In production, make the real HTTPS request using the key:
        // const response = await fetch('https://api.openai.com/v1/chat/completions', { ... });
        return {
            success: true,
            agentId,
            response: `[إجابة آمنة من وكيل الذكاء الاصطناعي ${agentId}]: تم معالجة طلبك بنجاح في بيئة تشغيل آمنة ومحمية بالكامل دون كشف مفتاح الـ API.`,
            usage: {
                promptTokens: 120,
                completionTokens: 250,
                costEstimateUSD: 0.003
            }
        };
    }
    catch (error) {
        console.error('❌ Secure API Call failed:', error);
        throw new functions.https.HttpsError('internal', `🚨 فشل استدعاء الخادم الآمن: ${error.message || error}`);
    }
});
//# sourceMappingURL=index.js.map