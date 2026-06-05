    const getClaudeResponse = require("../services/claudeService").getClaudeResponse;

    const toolSelector = async (message) => {
        const response = await getClaudeResponse([
            {
                role: "user",
                content: message
            }
        ],
            `
            You are a tool selector.
            Available tools:

            1. getCart(userId)
            2. addToCart(userId, productName, category, quantity)

            Categories:
            - Smartphones
            - Laptops
            - Tablets
            - Electronics

            Rules:
            - Extract product name separately from category.
            - "xiaomi phone" → productName="Xiaomi", category="Phones"
            - "xiaomi laptop" → productName="Xiaomi", category="Laptops"
            - "iphone phone" → productName="iPhone", category="Phones"
            - If the category or product cannot be determined, use searchProducts instead.

            3. removeFromCart(userId, productName)
            4. searchProducts(userId, category, minPrice, maxPrice)
            Available categories:
            - Smartphones
            - Laptops
            - Tablets
            - Electronics

            Use only these categories.
            5. checkSubscriptionStatus(userId)
            6. addSubscription(userId)
            7. paymentProduct(userId)

                Analyze the user's message and determine if any of the tools can be used to answer the user's question or perform the user's request. 
                If a tool is needed, select the most appropriate one and provide the necessary arguments.
                If no tool is needed, return null for the tool and an empty object for the arguments.

            Return ONLY JSON:
            {
            "tool": string | null,
            "args": object
            }

            Rules:
            - If no tool needed → tool = null
            - Do NOT explain anything
            - ONLY JSON

        Examples:

        User: "What's in my cart?"
        Output:
        {
        "tool": "getCart",
        "args": {}
        }

        User: "Show my cart"
        Output:
        {
        "tool": "getCart",
        "args": {}
        }

        User: "Add iPhone 15 to cart"

        {
        "tool": "addToCart",
        "args": {
            "productName": "iPhone 15",
            "quantity": 1
        }}
    `

        );
        try {
            const cleanedResponse = response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            return JSON.parse(cleanedResponse);
        } catch (e) {
            return {
                tool: null,
                args: {},
            };
        }
    };

    module.exports = { toolSelector };