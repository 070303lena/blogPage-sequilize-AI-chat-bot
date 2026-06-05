const Anthropic = require("@anthropic-ai/sdk");
const logger = require("../logger");

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const getClaudeResponse = async (messages, system) => {
    try {
        const res = await anthropic.messages.create({
            model: "claude-haiku-4-5",
            system,
            max_tokens: 1000,
            messages
        });

        const text = res.content
            ?.find(block => block.type === "text")
            ?.text;

        if (!text) {
            return "No response";
        }

        return text;

    } catch (error) {
        logger.error("Claude API error:", error);
        throw error;
    }
};

module.exports = { getClaudeResponse };
