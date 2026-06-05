const logger = require("../logger");
const db = require("../database/models");
const { BotMessage } = db;
const { getClaudeResponse } = require("../services/claudeService");

const { toolSelector } = require("../ai/toolSelector");

const { getCart } = require("../ai/tools/getCartTool");
const { removeFromCart } = require("../ai/tools/removeFromCartTool");
const { checkSubscriptionStatus } = require("../ai/tools/checkSubscriptionStatusTool");
const { addSubscription } = require("../ai/tools/addSubscriptionTool");
const { searchProducts } = require("../ai/tools/searchProductsTool");
const { addToCart } = require("../ai/tools/addToCartTool");
const { paymentProduct } = require("../ai/tools/paymentProductTool");

const tools = {
    getCart,
    addToCart,
    removeFromCart,
    checkSubscriptionStatus,
    addSubscription,
    searchProducts,
    paymentProduct
};

const SYSTEM_PROMPT = `
You are a helpful shopping assistant.

Use the tool result to answer the user naturally and clearly.

Rules:
- Do not output JSON.
- Do not mention tools or internal operations.
- Use a friendly and professional tone.
- Format lists with bullet points when showing multiple items.
- When showing products, include product name, price, and quantity if available.
- When showing a cart, summarize the total number of items.
- When a task succeeds, clearly confirm the action.
- When a task fails, explain the reason in a user-friendly way.
- If no items are found, politely inform the user.
- Keep responses concise but informative.
`;

const addNewMessage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { message } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        await BotMessage.create({
            role: "user",
            content: message,
            userId
        });

        const { tool, args } = await toolSelector(message);

        let aiAnswer;

        if (tool && tools[tool]) {

            const toolResult = await tools[tool]({
                userId,
                ...args
            });

            if (toolResult.url) {
                return res.status(200).json({
                    success: true,
                    answer: {
                        type: "redirect",
                        url: toolResult.url
                    }
                });
            } else {
                const text = await getClaudeResponse(
                    [
                        {
                            role: "user",
                            content: message
                        },
                        {
                            role: "assistant",
                            content: `Tool result: ${JSON.stringify(toolResult)}`
                        }
                    ],
                    SYSTEM_PROMPT
                );

                aiAnswer = {
                    type: "text",
                    text
                };
            }
        }

        else {
            const history = await BotMessage.findAll({
                where: { userId },
                attributes: ["role", "content"],
                order: [["createdAt", "DESC"]],
                limit: 5
            });

            const orderedHistory = history.reverse();

            const messages = orderedHistory.map(m => {
                let content = m.content;

                try {
                    const parsed = JSON.parse(content);

                    if (parsed.text) {
                        content = parsed.text;
                    }
                } catch { }

                return {
                    role: m.role,
                    content
                };
            });

            const text = await getClaudeResponse(messages, SYSTEM_PROMPT);

            aiAnswer = {
                type: "text",
                text
            };
        }

        await BotMessage.create({
            role: "assistant",
            content: aiAnswer.text,
            userId
        });

        return res.status(200).json({
            success: true,
            answer: aiAnswer
        });

    } catch (error) {
        logger.error(error, "addNewMessage failed");

        return res.status(400).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getBotMessages = async (req, res) => {
    try {
        const userId = req.user.userId;

        const messages = await BotMessage.findAll({
            where: { userId }
        });

        res.status(200).json(messages);

    } catch (error) {
        logger.error(error, "error in getBotMessages");

        res.status(400).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const clearBotChatStory = async (req, res) => {
    try {
        const userId = req.user.userId;

        await BotMessage.destroy({
            where: { userId },
            truncate: false
        });

        res.status(200).json({
            success: true,
            message: "Chat history cleared"
        });

    } catch (error) {
        logger.error(error, "error in clearBotChatStory");

        return res.status(400).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    addNewMessage,
    getBotMessages,
    clearBotChatStory
};
